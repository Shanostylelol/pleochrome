// PleoChrome V2 — Single Source of Truth
// Every component that needs phase colors, task type icons, status labels
// MUST import from here. NEVER hardcode these values in components.

// ── Phase display config ─────────────────────────────────────────
export const PHASES = {
  lead:           { label: 'Lead',           color: 'var(--phase-lead)',           order: 0 },
  intake:         { label: 'Intake',         color: 'var(--phase-intake)',         order: 1 },
  asset_maturity: { label: 'Asset Maturity', color: 'var(--phase-asset-maturity)', order: 2 },
  security:       { label: 'Security',       color: 'var(--phase-security)',       order: 3 },
  value_creation: { label: 'Value Creation', color: 'var(--phase-value-creation)', order: 4 },
  distribution:   { label: 'Distribution',   color: 'var(--phase-distribution)',   order: 5 },
} as const

export type PhaseKey = keyof typeof PHASES

// ── Value model display config ───────────────────────────────────
export const VALUE_MODELS = {
  tokenization:          { label: 'Tokenization',          color: 'var(--model-tokenization)' },
  fractional_securities: { label: 'Fractional Securities', color: 'var(--model-fractional)' },
  debt_instrument:       { label: 'Debt Instrument',       color: 'var(--model-debt)' },
  broker_sale:           { label: 'Broker Sale',           color: 'var(--model-broker)' },
  barter:                { label: 'Barter / Exchange',     color: 'var(--model-barter)' },
} as const

export type ValueModelKey = keyof typeof VALUE_MODELS

// ── Task type display config (icon names from lucide-react) ──────
export const TASK_TYPES = {
  document_upload:  { label: 'Document Upload',  icon: 'Upload'        as const, color: 'var(--teal)' },
  meeting:          { label: 'Meeting',           icon: 'Calendar'      as const, color: 'var(--amethyst)' },
  physical_action:  { label: 'Physical Action',   icon: 'Truck'         as const, color: 'var(--amber)' },
  payment_outgoing: { label: 'Payment Out',       icon: 'ArrowUpRight'  as const, color: 'var(--ruby)' },
  payment_incoming: { label: 'Payment In',        icon: 'ArrowDownLeft' as const, color: 'var(--chartreuse)' },
  approval:         { label: 'Approval',          icon: 'ShieldCheck'   as const, color: 'var(--sapphire)' },
  review:           { label: 'Review',            icon: 'Eye'           as const, color: 'var(--teal)' },
  due_diligence:    { label: 'Due Diligence',     icon: 'Search'        as const, color: 'var(--emerald)' },
  filing:           { label: 'Filing',            icon: 'FileText'      as const, color: 'var(--sapphire)' },
  communication:    { label: 'Communication',     icon: 'Mail'          as const, color: 'var(--amethyst)' },
  automated:        { label: 'Automated',         icon: 'Zap'           as const, color: 'var(--amber)' },
} as const

export type TaskTypeKey = keyof typeof TASK_TYPES

// ── Asset status config ──────────────────────────────────────────
export const ASSET_STATUSES = {
  active:     { label: 'Active',     color: 'var(--teal)' },
  paused:     { label: 'Paused',     color: 'var(--amber)' },
  completed:  { label: 'Completed',  color: 'var(--chartreuse)' },
  terminated: { label: 'Terminated', color: 'var(--ruby)' },
  archived:   { label: 'Archived',   color: 'var(--text-muted)' },
} as const

export type AssetStatusKey = keyof typeof ASSET_STATUSES

// ── Stage status config ──────────────────────────────────────────
export const STAGE_STATUSES = {
  not_started: { label: 'Not Started', color: 'var(--text-muted)' },
  in_progress: { label: 'In Progress', color: 'var(--teal)' },
  completed:   { label: 'Completed',   color: 'var(--chartreuse)' },
  skipped:     { label: 'Skipped',     color: 'var(--text-placeholder)' },
} as const

export type StageStatusKey = keyof typeof STAGE_STATUSES

// ── Task status config (matches v2_task_status DB enum) ──────────
export const TASK_STATUSES = {
  todo:             { label: 'To Do',             color: 'var(--text-muted)' },
  in_progress:      { label: 'In Progress',       color: 'var(--teal)' },
  blocked:          { label: 'Blocked',            color: 'var(--ruby)' },
  pending_approval: { label: 'Pending Approval',   color: 'var(--amber)' },
  approved:         { label: 'Approved',           color: 'var(--chartreuse)' },
  rejected:         { label: 'Rejected',           color: 'var(--ruby)' },
  done:             { label: 'Done',               color: 'var(--chartreuse)' },
  cancelled:        { label: 'Cancelled',          color: 'var(--text-placeholder)' },
} as const

export type TaskStatusKey = keyof typeof TASK_STATUSES

// ── Subtask status config (matches v2_subtask_status DB enum) ────
export const SUBTASK_STATUSES = {
  todo:             { label: 'To Do',             color: 'var(--text-muted)' },
  in_progress:      { label: 'In Progress',       color: 'var(--teal)' },
  pending_approval: { label: 'Pending Approval',   color: 'var(--amber)' },
  approved:         { label: 'Approved',           color: 'var(--chartreuse)' },
  rejected:         { label: 'Rejected',           color: 'var(--ruby)' },
  done:             { label: 'Done',               color: 'var(--chartreuse)' },
  cancelled:        { label: 'Cancelled',          color: 'var(--text-placeholder)' },
} as const

export type SubtaskStatusKey = keyof typeof SUBTASK_STATUSES

// ── Subtask type config (action-level types for subtasks) ─────────
export const SUBTASK_TYPES = {
  // Reuse applicable task types
  document_upload: { label: 'Document',      icon: 'Upload'      as const, color: 'var(--teal)' },
  meeting:         { label: 'Meeting',        icon: 'Calendar'    as const, color: 'var(--amethyst)' },
  approval:        { label: 'Approval',       icon: 'ShieldCheck' as const, color: 'var(--sapphire)' },
  communication:   { label: 'Communication',  icon: 'Mail'        as const, color: 'var(--amethyst)' },
  review:          { label: 'Review',         icon: 'Eye'         as const, color: 'var(--teal)' },
  filing:          { label: 'Filing',         icon: 'FileText'    as const, color: 'var(--sapphire)' },
  // Subtask-specific types
  call:            { label: 'Call',           icon: 'Phone'       as const, color: 'var(--emerald)' },
  email:           { label: 'Email',          icon: 'Mail'        as const, color: 'var(--teal)' },
  note:            { label: 'Note',           icon: 'StickyNote'  as const, color: 'var(--amber)' },
  research:        { label: 'Research',       icon: 'Search'      as const, color: 'var(--emerald)' },
  verification:    { label: 'Verification',   icon: 'CheckCircle' as const, color: 'var(--chartreuse)' },
  follow_up:       { label: 'Follow Up',      icon: 'ArrowRight'  as const, color: 'var(--amber)' },
  signature:       { label: 'Signature',      icon: 'PenTool'     as const, color: 'var(--sapphire)' },
} as const

export type SubtaskTypeKey = keyof typeof SUBTASK_TYPES

// ── Approval status config ───────────────────────────────────────
export const APPROVAL_STATUSES = {
  pending:   { label: 'Pending',   color: 'var(--approval-pending)' },
  approved:  { label: 'Approved',  color: 'var(--approval-approved)' },
  rejected:  { label: 'Rejected',  color: 'var(--approval-rejected)' },
  escalated: { label: 'Escalated', color: 'var(--approval-escalated)' },
} as const

// ── Priority config ──────────────────────────────────────────────
export const PRIORITIES = {
  low:    { label: 'Low',    color: 'var(--text-muted)' },
  medium: { label: 'Medium', color: 'var(--teal)' },
  high:   { label: 'High',   color: 'var(--amber)' },
  urgent: { label: 'Urgent', color: 'var(--ruby)' },
} as const

export type PriorityKey = keyof typeof PRIORITIES

// ── Phase order helper ───────────────────────────────────────────
export const PHASE_ORDER: PhaseKey[] = [
  'lead', 'intake', 'asset_maturity', 'security', 'value_creation', 'distribution',
]

// ── Document type config ────────────────────────────────────────
export const DOCUMENT_TYPES = [
  { value: 'appraisal', label: 'Appraisal' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'legal', label: 'Legal' },
  { value: 'financial', label: 'Financial' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'custody', label: 'Custody' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'general', label: 'General' },
  { value: 'other', label: 'Other' },
] as const
