-- Fresh start: wipe all test/seed data, create real team members
-- Preserves: workflow_templates, template_stages, template_tasks, template_subtasks
-- Preserves: onboarding templates (partner_onboarding_items templates)

-- Disable immutable triggers on activity_log
ALTER TABLE activity_log DISABLE TRIGGER trg_activity_log_no_update;
ALTER TABLE activity_log DISABLE TRIGGER trg_activity_log_no_delete;

-- ═══════════════════════════════════════════════════════════
-- WIPE ALL USER DATA (order respects FK constraints)
-- ═══════════════════════════════════════════════════════════

-- Child records first
DELETE FROM reminders;
DELETE FROM kyc_records;
DELETE FROM asset_owners;
DELETE FROM ownership_links;
DELETE FROM communication_log;
DELETE FROM partner_credentials;
DELETE FROM partner_onboarding_items WHERE partner_id IS NOT NULL;
DELETE FROM gate_checks;
DELETE FROM meeting_notes;
DELETE FROM notifications;
DELETE FROM activity_log;
DELETE FROM comments;
DELETE FROM documents;
DELETE FROM approvals;
DELETE FROM subtasks;
DELETE FROM tasks;
DELETE FROM asset_stages;
DELETE FROM asset_partners;
DELETE FROM sops;

-- Parent records
DELETE FROM assets;
DELETE FROM contacts;
DELETE FROM partners;

-- Null out FK references to team_members in preserved tables
UPDATE workflow_templates SET created_by = NULL;

-- Wipe team_members to re-create with correct data
DELETE FROM team_members;

-- ═══════════════════════════════════════════════════════════
-- CREATE REAL TEAM MEMBERS
-- ═══════════════════════════════════════════════════════════

INSERT INTO team_members (id, full_name, email, role, title, is_active, permissions, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'Shane Pierson',
    'shane@pleochrome.com',
    'CEO',
    'Chief Executive Officer & Chief Compliance Officer',
    true,
    '{"admin": true, "can_manage_governance": true, "can_manage_templates": true, "can_manage_team": true}'::jsonb,
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'David Whiting',
    'david@pleochrome.com',
    'CTO',
    'Chief Technology Officer & Chief Operating Officer',
    true,
    '{"admin": true, "can_manage_governance": true, "can_manage_templates": true, "can_manage_team": true}'::jsonb,
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'Chris Ramsey',
    'chris@pleochrome.com',
    'CRO',
    'Chief Revenue Officer',
    true,
    '{"admin": true, "can_manage_governance": true, "can_manage_templates": true, "can_manage_team": false}'::jsonb,
    now(),
    now()
  );

-- Re-enable immutable triggers
ALTER TABLE activity_log ENABLE TRIGGER trg_activity_log_no_update;
ALTER TABLE activity_log ENABLE TRIGGER trg_activity_log_no_delete;
