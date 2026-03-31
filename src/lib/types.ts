import type { Database } from './database.types'

// ─── Table row types (V2) ──────────────────────────────
export type Asset = Database['public']['Tables']['assets']['Row']
export type AssetInsert = Database['public']['Tables']['assets']['Insert']
export type AssetUpdate = Database['public']['Tables']['assets']['Update']

export type AssetStage = Database['public']['Tables']['asset_stages']['Row']
export type AssetStageInsert = Database['public']['Tables']['asset_stages']['Insert']
export type AssetStageUpdate = Database['public']['Tables']['asset_stages']['Update']

export type Partner = Database['public']['Tables']['partners']['Row']
export type PartnerInsert = Database['public']['Tables']['partners']['Insert']

export type Contact = Database['public']['Tables']['contacts']['Row']

export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']

export type ActivityLog = Database['public']['Tables']['activity_log']['Row']

export type MeetingNote = Database['public']['Tables']['meeting_notes']['Row']

export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']

export type Subtask = Database['public']['Tables']['subtasks']['Row']
export type SubtaskInsert = Database['public']['Tables']['subtasks']['Insert']

export type GateCheck = Database['public']['Tables']['gate_checks']['Row']
export type GateCheckInsert = Database['public']['Tables']['gate_checks']['Insert']

export type AssetPartner = Database['public']['Tables']['asset_partners']['Row']

export type Notification = Database['public']['Tables']['notifications']['Row']

export type Comment = Database['public']['Tables']['comments']['Row']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']

export type TeamMember = Database['public']['Tables']['team_members']['Row']

export type Approval = Database['public']['Tables']['approvals']['Row']

export type WorkflowTemplate = Database['public']['Tables']['workflow_templates']['Row']
export type TemplateStage = Database['public']['Tables']['template_stages']['Row']
export type TemplateTask = Database['public']['Tables']['template_tasks']['Row']
export type TemplateSubtask = Database['public']['Tables']['template_subtasks']['Row']

// ─── V2 Enum types ────────────────────────────────────
export type ValueModel = Database['public']['Enums']['v2_value_model']
export type V2Phase = Database['public']['Enums']['v2_phase']
export type StageStatus = Database['public']['Enums']['v2_stage_status']
export type AssetStatus = Database['public']['Enums']['v2_asset_status']
export type PartnerType = Database['public']['Enums']['v2_partner_type']
export type DdStatus = Database['public']['Enums']['v2_dd_status']
export type RiskLevel = Database['public']['Enums']['v2_risk_level']
export type TaskStatus = Database['public']['Enums']['v2_task_status']
export type SubtaskStatus = Database['public']['Enums']['v2_subtask_status']
export type TaskType = Database['public']['Enums']['v2_task_type']
export type ContactRole = Database['public']['Enums']['v2_contact_role']
export type KycStatus = Database['public']['Enums']['v2_kyc_status']
export type AuditAction = Database['public']['Enums']['v2_audit_action']

