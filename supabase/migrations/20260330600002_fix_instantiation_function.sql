-- Fix: Remove gate_criteria reference from instantiate_from_template
-- The asset_stages table has gate_id but NOT gate_criteria
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
      is_gate, sort_order
    ) VALUES (
      p_asset_id, v_stage.id,
      v_stage.phase, v_stage.name, v_stage.description,
      v_stage.is_gate, v_stage.sort_order
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
