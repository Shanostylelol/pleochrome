-- ============================================================================
-- PLEOCHROME POWERHOUSE CRM — Migration 003: Fix views + add module_id
-- ============================================================================
-- Fixes found in pre-build audit:
-- 1. v_unified_tasks references non-existent columns
-- 2. asset_partners needs module_id for three-layer governance
-- 3. tasks table needs completed_by for audit trail completeness
-- ============================================================================

-- Fix 1: Add completed_by to tasks table (needed by v_unified_tasks)
alter table tasks add column if not exists completed_by uuid references team_members(id);

-- Fix 2: Add module_id to asset_partners for Layer 2/3 governance linkage
alter table asset_partners add column if not exists module_id uuid references partner_modules(id) on delete set null;
create index if not exists idx_asset_partners_module on asset_partners(module_id);

-- Fix 3: Recreate v_unified_tasks with correct column names
drop view if exists v_unified_tasks;

create or replace view v_unified_tasks as
select
  ati.id,
  ati.asset_id,
  ati.asset_step_id,
  ati.title,
  ati.description,
  ati.task_type::text as task_type,
  ati.assigned_to,
  ati.status::text as status,
  ati.completed_at,
  ati.completed_by,
  ati.evidence_url,
  ati.notes,
  ati.created_at,
  'governance' as task_source,
  ast.step_number,
  ast.phase::text as phase,
  a.name as asset_name,
  a.reference_code as asset_reference
from asset_task_instances ati
join asset_steps ast on ast.id = ati.asset_step_id
join assets a on a.id = ati.asset_id

union all

select
  t.id,
  t.asset_id,
  t.step_id as asset_step_id,
  t.title,
  t.description,
  t.priority::text as task_type,
  t.assigned_to,
  t.status::text as status,
  t.completed_at,
  t.completed_by,
  null as evidence_url,
  t.notes,
  t.created_at,
  'adhoc' as task_source,
  null as step_number,
  null as phase,
  a.name as asset_name,
  a.reference_code as asset_reference
from tasks t
left join assets a on a.id = t.asset_id;

comment on view v_unified_tasks is
  'Merges governance tasks (asset_task_instances) and adhoc tasks into a single queryable view.';
