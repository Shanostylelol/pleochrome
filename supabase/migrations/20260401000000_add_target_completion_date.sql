-- Add target_completion_date to assets for SLA tracking
ALTER TABLE assets
  ADD COLUMN IF NOT EXISTS target_completion_date TIMESTAMPTZ;

COMMENT ON COLUMN assets.target_completion_date IS
  'Optional SLA/target date for completing this asset lifecycle. Used for on-track/at-risk/overdue indicators.';
