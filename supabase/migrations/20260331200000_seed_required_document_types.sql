-- Populate required_document_types on template_stages
-- Maps governance requirements to document types needed per stage

-- Lead phase
UPDATE template_stages SET required_document_types = '{legal}'
WHERE name ILIKE '%NDA%' OR name ILIKE '%engagement agreement%';

UPDATE template_stages SET required_document_types = '{compliance}'
WHERE name ILIKE '%KYC%' OR name ILIKE '%KYB%' OR name ILIKE '%OFAC%' OR name ILIKE '%screening%';

UPDATE template_stages SET required_document_types = '{compliance}'
WHERE name ILIKE '%sophistication%' OR name ILIKE '%ownership verification%';

-- Intake phase
UPDATE template_stages SET required_document_types = '{compliance}'
WHERE name ILIKE '%intake questionnaire%';

UPDATE template_stages SET required_document_types = '{compliance,legal}'
WHERE name ILIKE '%provenance%' OR name ILIKE '%chain of custody%';

UPDATE template_stages SET required_document_types = '{legal}'
WHERE name ILIKE '%documentation review%';

-- Asset Maturity phase
UPDATE template_stages SET required_document_types = '{appraisal,certificate}'
WHERE name ILIKE '%appraisal%' OR name ILIKE '%valuation%' OR name ILIKE '%certification%';

UPDATE template_stages SET required_document_types = '{custody}'
WHERE name ILIKE '%custody%' OR name ILIKE '%vault%' OR name ILIKE '%physical%transfer%';

UPDATE template_stages SET required_document_types = '{insurance}'
WHERE name ILIKE '%insurance%';

-- Security phase
UPDATE template_stages SET required_document_types = '{legal}'
WHERE name ILIKE '%legal structure%' OR name ILIKE '%SPV%' OR name ILIKE '%LLC%';

UPDATE template_stages SET required_document_types = '{compliance,legal}'
WHERE name ILIKE '%regulatory%' OR name ILIKE '%SEC%' OR name ILIKE '%blue sky%';

-- Value Creation phase
UPDATE template_stages SET required_document_types = '{financial}'
WHERE name ILIKE '%pricing%' OR name ILIKE '%financial model%' OR name ILIKE '%token%design%';

-- Distribution phase
UPDATE template_stages SET required_document_types = '{legal,financial}'
WHERE name ILIKE '%subscription%' OR name ILIKE '%investor%onboard%';

UPDATE template_stages SET required_document_types = '{compliance}'
WHERE name ILIKE '%AML%' OR name ILIKE '%accreditation%';

-- Backfill existing asset_stages from their source template stage
UPDATE asset_stages AS a
SET required_document_types = t.required_document_types
FROM template_stages AS t
WHERE a.source_template_stage_id = t.id
  AND t.required_document_types != '{}';
