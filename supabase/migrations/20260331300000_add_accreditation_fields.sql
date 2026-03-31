-- Add accreditation and compliance tracking fields to contacts
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS accreditation_status TEXT DEFAULT 'not_verified';
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS accreditation_type TEXT;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS accreditation_verified_at TIMESTAMPTZ;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS accreditation_expires_at TIMESTAMPTZ;
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS compliance_score INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_contacts_accreditation ON contacts(accreditation_status);
CREATE INDEX IF NOT EXISTS idx_contacts_compliance ON contacts(compliance_score);
