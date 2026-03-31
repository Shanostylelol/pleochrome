-- ============================================================================
-- Migration 2 of 2: Fix instantiation function + backfill subtask types
-- Runs AFTER enum values are committed in previous migration
-- ============================================================================

-- ── 1. Fix instantiate_from_template to copy subtask_type ───────────────────
CREATE OR REPLACE FUNCTION instantiate_from_template(
  p_asset_id UUID,
  p_template_id UUID
) RETURNS void AS $$
DECLARE
  v_stage RECORD;
  v_task RECORD;
  v_subtask RECORD;
  v_new_stage_id UUID;
  v_new_task_id UUID;
BEGIN
  FOR v_stage IN
    SELECT * FROM template_stages
    WHERE template_id = p_template_id AND NOT is_hidden
    ORDER BY phase, sort_order
  LOOP
    INSERT INTO asset_stages (
      asset_id, source_template_stage_id,
      phase, name, description,
      is_gate, gate_criteria,
      sort_order
    ) VALUES (
      p_asset_id, v_stage.id,
      v_stage.phase, v_stage.name, v_stage.description,
      v_stage.is_gate, v_stage.gate_criteria,
      v_stage.sort_order
    ) RETURNING id INTO v_new_stage_id;

    FOR v_task IN
      SELECT * FROM template_tasks
      WHERE template_stage_id = v_stage.id AND NOT is_hidden
      ORDER BY sort_order
    LOOP
      INSERT INTO tasks (
        asset_id, stage_id, source_template_task_id,
        title, description, task_type,
        estimated_duration_days, estimated_amount,
        payment_recipient, payment_description, sort_order
      ) VALUES (
        p_asset_id, v_new_stage_id, v_task.id,
        v_task.title, v_task.description, v_task.task_type,
        v_task.estimated_duration_days, v_task.estimated_amount,
        v_task.payment_recipient, v_task.payment_description, v_task.sort_order
      ) RETURNING id INTO v_new_task_id;

      FOR v_subtask IN
        SELECT * FROM template_subtasks
        WHERE template_task_id = v_task.id AND NOT is_hidden
        ORDER BY sort_order
      LOOP
        INSERT INTO subtasks (
          task_id, source_template_subtask_id,
          title, description, requires_approval, sort_order,
          subtask_type
        ) VALUES (
          v_new_task_id, v_subtask.id,
          v_subtask.title, v_subtask.description,
          v_subtask.requires_approval, v_subtask.sort_order,
          v_subtask.subtask_type
        );
      END LOOP;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ── 2. Backfill template_subtasks with appropriate subtask_types ─────────────

-- Phase 1.1: Initial Outreach & Source ID
UPDATE template_subtasks SET subtask_type = 'research'
  WHERE title ILIKE '%search dealer pipeline%';
UPDATE template_subtasks SET subtask_type = 'verification'
  WHERE title ILIKE '%screen source/referrer%';
UPDATE template_subtasks SET subtask_type = 'note'
  WHERE title ILIKE '%tag source channel%';

-- Phase 1.1: Confirm asset class eligibility
UPDATE template_subtasks SET subtask_type = 'verification'
  WHERE title ILIKE '%verify asset is in supported class%';
UPDATE template_subtasks SET subtask_type = 'verification'
  WHERE title ILIKE '%confirm minimum value threshold%';
UPDATE template_subtasks SET subtask_type = 'review'
  WHERE title ILIKE '%check asset type against lending%';

-- Phase 1.2: Execute mutual NDA
UPDATE template_subtasks SET subtask_type = 'email'
  WHERE title ILIKE '%send NDA template%';
UPDATE template_subtasks SET subtask_type = 'signature'
  WHERE title ILIKE '%negotiate any modifications%';
UPDATE template_subtasks SET subtask_type = 'document_upload'
  WHERE title ILIKE '%file executed NDA%';

-- Phase 1.2: Preliminary KYC/KYB
UPDATE template_subtasks SET subtask_type = 'document_upload'
  WHERE title ILIKE '%collect government-issued ID%';
UPDATE template_subtasks SET subtask_type = 'verification'
  WHERE title ILIKE '%run OFAC/SDN%';
UPDATE template_subtasks SET subtask_type = 'verification'
  WHERE title ILIKE '%run PEP check%';

-- Catch-all for remaining template subtasks
UPDATE template_subtasks SET subtask_type = 'note' WHERE subtask_type IS NULL;

-- ── 3. Backfill existing subtasks on live assets ────────────────────────────
UPDATE subtasks SET subtask_type = 'document_upload'
  WHERE subtask_type IS NULL
  AND (title ILIKE '%file %' OR title ILIKE '%upload%' OR title ILIKE '%document%' OR title ILIKE '%collect%');

UPDATE subtasks SET subtask_type = 'verification'
  WHERE subtask_type IS NULL
  AND (title ILIKE '%verify%' OR title ILIKE '%check%' OR title ILIKE '%confirm%' OR title ILIKE '%screen%' OR title ILIKE '%run %');

UPDATE subtasks SET subtask_type = 'call'
  WHERE subtask_type IS NULL
  AND (title ILIKE '%call%' OR title ILIKE '%phone%');

UPDATE subtasks SET subtask_type = 'email'
  WHERE subtask_type IS NULL
  AND (title ILIKE '%email%' OR title ILIKE '%send %' OR title ILIKE '%template%');

UPDATE subtasks SET subtask_type = 'research'
  WHERE subtask_type IS NULL
  AND (title ILIKE '%search%' OR title ILIKE '%research%');

UPDATE subtasks SET subtask_type = 'note'
  WHERE subtask_type IS NULL
  AND (title ILIKE '%tag%' OR title ILIKE '%note%' OR title ILIKE '%log%');

UPDATE subtasks SET subtask_type = 'signature'
  WHERE subtask_type IS NULL
  AND (title ILIKE '%sign%' OR title ILIKE '%signature%');

-- Inherit from parent task's task_type
UPDATE subtasks s SET subtask_type = t.task_type
  FROM tasks t
  WHERE s.task_id = t.id AND s.subtask_type IS NULL;

-- Final catch-all
UPDATE subtasks SET subtask_type = 'note' WHERE subtask_type IS NULL;
