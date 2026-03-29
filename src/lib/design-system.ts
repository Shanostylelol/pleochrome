export const BRAND_COLORS = {
  emerald:    { hex: '#1B6B4A', label: 'Fractional / Phase 1 / Success' },
  teal:       { hex: '#1A8B7A', label: 'Tokenization / Phase 2 / Primary' },
  sapphire:   { hex: '#1E3A6E', label: 'Debt Instruments' },
  amethyst:   { hex: '#5B2D8E', label: 'Partner indicators' },
  ruby:       { hex: '#A61D3A', label: 'Risk / Error / Blocked' },
  amber:      { hex: '#C47A1A', label: 'Distribution / Warning' },
  chartreuse: { hex: '#7BA31E', label: 'Complete / Positive trend' },
  gold:       { hex: '#D4AF37', label: 'Premium accent' },
} as const

export const PATH_COLORS = {
  fractional_securities: BRAND_COLORS.emerald.hex,
  tokenization: BRAND_COLORS.teal.hex,
  debt_instruments: BRAND_COLORS.sapphire.hex,
  evaluating: BRAND_COLORS.amber.hex,
} as const

export const PHASE_COLORS: Record<string, string> = {
  phase_0_foundation: '#64748B',
  phase_1_intake: BRAND_COLORS.emerald.hex,
  phase_2_certification: BRAND_COLORS.teal.hex,
  phase_3_custody: BRAND_COLORS.teal.hex,
  phase_4_legal: BRAND_COLORS.amethyst.hex,
  phase_5_tokenization: BRAND_COLORS.teal.hex,
  phase_6_regulatory: BRAND_COLORS.amber.hex,
  phase_7_distribution: BRAND_COLORS.amber.hex,
  phase_8_ongoing: BRAND_COLORS.chartreuse.hex,
}

export const STATUS_COLORS: Record<string, string> = {
  prospect: '#64748B',
  screening: BRAND_COLORS.emerald.hex,
  active: BRAND_COLORS.teal.hex,
  paused: BRAND_COLORS.amber.hex,
  completed: BRAND_COLORS.chartreuse.hex,
  terminated: BRAND_COLORS.ruby.hex,
  archived: '#475569',
}

export const STEP_STATUS_COLORS: Record<string, string> = {
  not_started: '#64748B',
  in_progress: BRAND_COLORS.teal.hex,
  blocked: BRAND_COLORS.ruby.hex,
  completed: BRAND_COLORS.chartreuse.hex,
  skipped: '#475569',
}

export const PRIORITY_COLORS: Record<string, string> = {
  low: '#64748B',
  medium: BRAND_COLORS.teal.hex,
  high: BRAND_COLORS.amber.hex,
  urgent: BRAND_COLORS.ruby.hex,
  blocker: BRAND_COLORS.ruby.hex,
}
