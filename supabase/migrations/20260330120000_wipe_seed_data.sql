-- Wipe all seed data for V2 architecture pivot
-- Keep team_members (Shane/CEO, David/CTO, Chris/CRO)

-- Disable immutable triggers on activity_log
ALTER TABLE activity_log DISABLE TRIGGER trg_activity_log_no_update;
ALTER TABLE activity_log DISABLE TRIGGER trg_activity_log_no_delete;

-- Disable RLS on all tables for testing (meetings table does not exist)
ALTER TABLE assets DISABLE ROW LEVEL SECURITY;
ALTER TABLE asset_steps DISABLE ROW LEVEL SECURITY;
ALTER TABLE asset_task_instances DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE partners DISABLE ROW LEVEL SECURITY;
ALTER TABLE asset_partners DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE governance_requirements DISABLE ROW LEVEL SECURITY;
ALTER TABLE partner_modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE module_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE default_tasks DISABLE ROW LEVEL SECURITY;

-- Truncate all tables (cascade handles FKs)
TRUNCATE
  activity_log,
  asset_task_instances,
  asset_steps,
  comments,
  documents,
  tasks,
  asset_partners,
  module_tasks,
  default_tasks,
  partner_modules,
  governance_requirements,
  partners,
  assets
CASCADE;

-- Re-enable immutable triggers
ALTER TABLE activity_log ENABLE TRIGGER trg_activity_log_no_update;
ALTER TABLE activity_log ENABLE TRIGGER trg_activity_log_no_delete;
