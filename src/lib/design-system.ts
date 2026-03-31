// PleoChrome V2 Design System Constants
// All colors reference CSS custom properties from neumorphic.css
// NEVER hardcode hex values in components — use these or import from constants.ts

export const BRAND_COLORS = {
  emerald:    { var: 'var(--emerald)',    hex: '#1B6B4A', label: 'Fractional Securities / Success' },
  teal:       { var: 'var(--teal)',       hex: '#1A8B7A', label: 'Tokenization / Primary accent' },
  sapphire:   { var: 'var(--sapphire)',   hex: '#1E3A6E', label: 'Debt Instruments / Security' },
  amethyst:   { var: 'var(--amethyst)',   hex: '#5B2D8E', label: 'Barter / Partner indicators' },
  ruby:       { var: 'var(--ruby)',       hex: '#A61D3A', label: 'Risk / Error / Blocked' },
  amber:      { var: 'var(--amber)',      hex: '#C47A1A', label: 'Broker Sale / Distribution / Warning' },
  chartreuse: { var: 'var(--chartreuse)', hex: '#7BA31E', label: 'Complete / Positive trend' },
  gold:       { var: 'var(--gold)',       hex: '#D4AF37', label: 'Premium accent' },
  gray:       { var: 'var(--gray)',       hex: '#6B7280', label: 'Lead / Neutral' },
} as const

export const PHASE_COLORS: Record<string, string> = {
  lead:            'var(--phase-lead)',
  intake:          'var(--phase-intake)',
  asset_maturity:  'var(--phase-asset-maturity)',
  security:        'var(--phase-security)',
  value_creation:  'var(--phase-value-creation)',
  distribution:    'var(--phase-distribution)',
}

export const MODEL_COLORS: Record<string, string> = {
  tokenization:          'var(--model-tokenization)',
  fractional_securities: 'var(--model-fractional)',
  debt_instrument:       'var(--model-debt)',
  broker_sale:           'var(--model-broker)',
  barter:                'var(--model-barter)',
}

export const STATUS_COLORS: Record<string, string> = {
  active:     'var(--teal)',
  paused:     'var(--amber)',
  completed:  'var(--chartreuse)',
  terminated: 'var(--ruby)',
  archived:   'var(--text-muted)',
}

export const STAGE_STATUS_COLORS: Record<string, string> = {
  not_started: 'var(--text-muted)',
  in_progress: 'var(--teal)',
  completed:   'var(--chartreuse)',
  skipped:     'var(--text-placeholder)',
}

export const APPROVAL_COLORS: Record<string, string> = {
  pending:   'var(--approval-pending)',
  approved:  'var(--approval-approved)',
  rejected:  'var(--approval-rejected)',
  escalated: 'var(--approval-escalated)',
}
