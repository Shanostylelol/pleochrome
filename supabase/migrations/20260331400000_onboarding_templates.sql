-- Partner onboarding templates (reusable per partner type)
CREATE TABLE partner_onboarding_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  partner_type TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  is_system BOOLEAN DEFAULT false,
  created_by UUID REFERENCES team_members(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Template items (stages + items within each stage)
CREATE TABLE partner_onboarding_template_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES partner_onboarding_templates(id) ON DELETE CASCADE,
  stage TEXT NOT NULL DEFAULT 'general',
  item_name TEXT NOT NULL,
  item_type TEXT NOT NULL DEFAULT 'verification',
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enhance existing partner_onboarding_items with stage + sort_order
ALTER TABLE partner_onboarding_items ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE partner_onboarding_items ADD COLUMN IF NOT EXISTS stage TEXT DEFAULT 'general';
ALTER TABLE partner_onboarding_items ADD COLUMN IF NOT EXISTS source_template_item_id UUID;

-- Owner/Contact onboarding templates
CREATE TABLE owner_onboarding_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_type TEXT NOT NULL DEFAULT 'individual',
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE owner_onboarding_template_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES owner_onboarding_templates(id) ON DELETE CASCADE,
  stage TEXT NOT NULL DEFAULT 'general',
  item_name TEXT NOT NULL,
  item_type TEXT NOT NULL DEFAULT 'verification',
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contact onboarding items (instance table for owners)
CREATE TABLE contact_onboarding_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  stage TEXT NOT NULL DEFAULT 'general',
  item_name TEXT NOT NULL,
  item_type TEXT NOT NULL DEFAULT 'verification',
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  sort_order INTEGER NOT NULL DEFAULT 0,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES team_members(id),
  expires_at TIMESTAMPTZ,
  source_template_item_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_onboarding_contact ON contact_onboarding_items(contact_id);
CREATE INDEX idx_partner_onboarding_template ON partner_onboarding_templates(partner_type);

-- Instantiation function for partners
CREATE OR REPLACE FUNCTION instantiate_partner_onboarding(p_partner_id UUID, p_template_id UUID)
RETURNS VOID AS $$
DECLARE v_item RECORD;
BEGIN
  FOR v_item IN SELECT * FROM partner_onboarding_template_items WHERE template_id = p_template_id ORDER BY sort_order
  LOOP
    INSERT INTO partner_onboarding_items (partner_id, item_name, item_type, description, stage, sort_order, source_template_item_id, status)
    VALUES (p_partner_id, v_item.item_name, v_item.item_type, v_item.description, v_item.stage, v_item.sort_order, v_item.id, 'pending');
  END LOOP;
END; $$ LANGUAGE plpgsql;

-- Instantiation function for contacts/owners
CREATE OR REPLACE FUNCTION instantiate_owner_onboarding(p_contact_id UUID, p_template_id UUID)
RETURNS VOID AS $$
DECLARE v_item RECORD;
BEGIN
  FOR v_item IN SELECT * FROM owner_onboarding_template_items WHERE template_id = p_template_id ORDER BY sort_order
  LOOP
    INSERT INTO contact_onboarding_items (contact_id, item_name, item_type, description, stage, sort_order, source_template_item_id, status)
    VALUES (p_contact_id, v_item.item_name, v_item.item_type, v_item.description, v_item.stage, v_item.sort_order, v_item.id, 'pending');
  END LOOP;
END; $$ LANGUAGE plpgsql;
