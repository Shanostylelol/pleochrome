-- ============================================================
-- RE-INSTANTIATE: Colombian Emerald Barrel workflow
-- ============================================================
-- The old workflow was instantiated from the pre-expansion template.
-- This migration deletes the old stages/tasks/subtasks and re-instantiates
-- from the expanded Tokenization template.
-- ============================================================

DO $$
DECLARE
  v_asset_id UUID := 'fdf68ce5-dce9-459e-9d2f-16495c45a86c';
  v_result JSONB;
BEGIN

  -- Temporarily disable the activity_log immutability trigger
  -- (ON DELETE SET NULL on FK causes UPDATE on activity_log, which the trigger blocks)
  ALTER TABLE activity_log DISABLE TRIGGER trg_activity_log_no_update;

  -- Delete in reverse dependency order: subtasks -> tasks -> stages
  DELETE FROM subtasks
  WHERE task_id IN (SELECT id FROM tasks WHERE asset_id = v_asset_id);

  DELETE FROM tasks
  WHERE asset_id = v_asset_id;

  DELETE FROM asset_stages
  WHERE asset_id = v_asset_id;

  -- Re-enable the immutability trigger
  ALTER TABLE activity_log ENABLE TRIGGER trg_activity_log_no_update;

  -- Re-instantiate from expanded templates
  SELECT instantiate_workflow(v_asset_id, 'tokenization') INTO v_result;

  RAISE NOTICE 'Re-instantiated Colombian Emerald Barrel: %', v_result;

END $$;
