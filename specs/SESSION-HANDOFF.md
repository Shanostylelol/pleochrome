# Session Handoff — PleoChrome Powerhouse CRM V2

**Last Updated:** 2026-04-02 (Multi-RWA flexibility build)
**Latest commit: `bbf9813`** — Build clean, zero TS errors.

---

## QUICK START

```bash
cd ~/Projects/pleochrome
git pull && npm install
npx supabase start
npx supabase db push   # Apply ALL pending migrations
npm run dev            # :3000
```

**Pending migrations:**
- `20260401000000_add_target_completion_date.sql`
- `20260402000000_template_asset_type.sql` — adds asset_type to workflow_templates
- `20260402000001_instantiate_workflow_with_asset_type.sql` — updated function with asset-type-specific template priority

---

## CURRENT STATE — MULTI-RWA READY

### Multi-RWA Build (Latest Session)

**Infrastructure:**
- `workflow_templates.asset_type` column + index (new migration)
- `instantiate_workflow()` updated: prefers asset-type-specific templates, falls back to universal
- `assets.create` + `assets.instantiateWorkflow` pass `asset_type` through to RPC
- `templates.list` supports `assetType` filter; `templates.create` accepts `assetType`

**Asset-type-specific metadata (OverviewTab):**
- **Gemstone:** Carat Weight, GIA Report, Color/Clarity/Cut grades
- **Real Estate:** Address, Type, Zoning, Sq Footage, Lot Size, Year Built, Title Company
- **Precious Metal:** Metal Type, Purity, Weight (Troy oz), Assay Cert, Mint/Refiner, Serial
- **Mineral Rights:** Net Acres, Royalty Rate, Lease Type, County/State, Wells, Formation, API#
- **Other:** Generic Origin, Certificate, Condition
- All stored in `metadata` JSONB — zero schema changes needed

**New Asset Wizard (Step 3):**
- Asset-type-specific fields based on Step 1 selection
- Gemstone: Origin, Carat Weight, GIA Report
- Real Estate: Address, Property Type, Sq Footage
- Precious Metal: Metal Type, Weight, Purity
- Mineral Rights: Net Acres, Royalty Rate, County/State

**Workflow application:**
- "Apply Full Workflow" button: calls `assets.instantiateWorkflow` (merges Shared + model-specific templates in one click)
- Falls back to "Pick Template" for manual individual template selection
- ApplyTemplateModal: shows value_model + asset_type badges per template

**Templates page:**
- TemplateCard shows asset_type badge (teal)
- CreateTemplateModal: asset type dropdown
- Template system fully supports creating/filtering by asset type

### How Multi-RWA Works Now

1. Create a real estate asset → select "Real Estate" type + value model
2. Workflow auto-applies (Shared Pipeline + value-model template)
3. Overview tab shows Property Address, Zoning, Sq Footage (not Carat Weight)
4. To create a RE-specific shared template: Templates page → Create → set asset_type = "Real Estate"
5. `instantiate_workflow()` will prefer RE-specific templates when they exist

### What's Genuinely Remaining

| Feature | Notes |
|---------|-------|
| RE/mineral-specific template CONTENT | Team creates via Template Editor (infrastructure ready) |
| Email digests | Requires Resend setup |
| Push notifications | Requires service worker push API |
| Investor portal | FEATURE-PIPELINE.md |
| Governance layer activation | Schema exists, needs seeding + UI |

---

## ARCHITECTURE NOTES

- **Template priority**: asset-type-specific → universal (both for shared and model-specific)
- **Metadata fields**: stored in `asset.metadata` JSONB, no schema changes per asset type
- **`instantiate_workflow(p_asset_id, p_value_model, p_asset_type)`**: 3-param version
- **6 phases, 5 value models, 5 asset types** — all hardcoded in constants
- **`workflow_templates.asset_type`**: nullable TEXT field, NULL = universal
