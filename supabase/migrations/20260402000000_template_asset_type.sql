-- Add asset_type to workflow_templates for multi-RWA support
ALTER TABLE workflow_templates
  ADD COLUMN IF NOT EXISTS asset_type TEXT;

COMMENT ON COLUMN workflow_templates.asset_type IS
  'Optional asset type this template is designed for (gemstone, real_estate, precious_metal, mineral_rights, etc). NULL means universal.';

-- Index for filtering by asset type in the UI
CREATE INDEX IF NOT EXISTS idx_workflow_templates_asset_type
  ON workflow_templates(asset_type)
  WHERE asset_type IS NOT NULL;

-- System templates are universal (no asset_type restriction)
-- User-created templates can be tagged with a specific asset_type
