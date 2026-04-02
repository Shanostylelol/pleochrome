-- Update instantiate_workflow to support asset_type-specific templates
-- When an asset-type-specific default template exists, it takes precedence over
-- the generic shared template for that value_model.
CREATE OR REPLACE FUNCTION instantiate_workflow(
  p_asset_id UUID,
  p_value_model v2_value_model DEFAULT NULL,
  p_asset_type TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_shared_template_id UUID;
  v_model_template_id  UUID;
  v_stages_created     INT := 0;
  v_tasks_created      INT := 0;
BEGIN
  -- Find the best shared template:
  -- 1. Asset-type-specific shared template (value_model IS NULL, asset_type matches)
  -- 2. Generic shared template (value_model IS NULL, asset_type IS NULL)
  IF p_asset_type IS NOT NULL THEN
    SELECT id INTO v_shared_template_id
    FROM workflow_templates
    WHERE value_model IS NULL
      AND is_default = true AND is_system = true
      AND asset_type = p_asset_type
    LIMIT 1;
  END IF;

  -- Fall back to generic shared template if no asset-type-specific one exists
  IF v_shared_template_id IS NULL THEN
    SELECT id INTO v_shared_template_id
    FROM workflow_templates
    WHERE value_model IS NULL
      AND is_default = true AND is_system = true
      AND asset_type IS NULL
    LIMIT 1;
  END IF;

  -- Find model-specific template (same logic: prefer asset-type-specific)
  IF p_value_model IS NOT NULL THEN
    IF p_asset_type IS NOT NULL THEN
      SELECT id INTO v_model_template_id
      FROM workflow_templates
      WHERE value_model = p_value_model
        AND is_default = true AND is_system = true
        AND asset_type = p_asset_type
      LIMIT 1;
    END IF;

    IF v_model_template_id IS NULL THEN
      SELECT id INTO v_model_template_id
      FROM workflow_templates
      WHERE value_model = p_value_model
        AND is_default = true AND is_system = true
        AND asset_type IS NULL
      LIMIT 1;
    END IF;
  END IF;

  -- Apply shared template (phases 1-3)
  IF v_shared_template_id IS NOT NULL THEN
    PERFORM instantiate_from_template(p_asset_id, v_shared_template_id);
  END IF;

  -- Apply model-specific template (phases 4-6)
  IF v_model_template_id IS NOT NULL THEN
    PERFORM instantiate_from_template(p_asset_id, v_model_template_id);
  END IF;

  SELECT count(*) INTO v_stages_created FROM asset_stages WHERE asset_id = p_asset_id;
  SELECT count(*) INTO v_tasks_created  FROM tasks WHERE stage_id IN (
    SELECT id FROM asset_stages WHERE asset_id = p_asset_id
  );

  UPDATE assets SET
    source_template_id = COALESCE(v_model_template_id, v_shared_template_id),
    value_model = COALESCE(p_value_model, value_model)
  WHERE id = p_asset_id;

  INSERT INTO activity_log (asset_id, entity_type, action, detail, performed_at)
  VALUES (p_asset_id, 'asset', 'template_instantiated',
    format('Workflow instantiated: %s stages, %s tasks (asset_type=%s, value_model=%s)',
      v_stages_created, v_tasks_created,
      COALESCE(p_asset_type, 'universal'),
      COALESCE(p_value_model::text, 'undecided')),
    now());

  RETURN jsonb_build_object(
    'stages_created',     v_stages_created,
    'tasks_created',      v_tasks_created,
    'shared_template_id', v_shared_template_id,
    'model_template_id',  v_model_template_id
  );
END;
$$ LANGUAGE plpgsql;
