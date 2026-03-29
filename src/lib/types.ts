import type { Database } from './database.types'

// Table row types
export type Asset = Database['public']['Tables']['assets']['Row']
export type AssetInsert = Database['public']['Tables']['assets']['Insert']
export type AssetUpdate = Database['public']['Tables']['assets']['Update']

export type AssetStep = Database['public']['Tables']['asset_steps']['Row']
export type AssetStepInsert = Database['public']['Tables']['asset_steps']['Insert']
export type AssetStepUpdate = Database['public']['Tables']['asset_steps']['Update']

export type Partner = Database['public']['Tables']['partners']['Row']
export type PartnerInsert = Database['public']['Tables']['partners']['Insert']

export type Contact = Database['public']['Tables']['contacts']['Row']

export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']

export type ActivityLog = Database['public']['Tables']['activity_log']['Row']

export type MeetingNote = Database['public']['Tables']['meeting_notes']['Row']

export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']

export type GateCheck = Database['public']['Tables']['gate_checks']['Row']
export type GateCheckInsert = Database['public']['Tables']['gate_checks']['Insert']

export type AssetPartner = Database['public']['Tables']['asset_partners']['Row']

export type Notification = Database['public']['Tables']['notifications']['Row']

export type Comment = Database['public']['Tables']['comments']['Row']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']

export type TeamMember = Database['public']['Tables']['team_members']['Row']

export type GovernanceRequirement = Database['public']['Tables']['governance_requirements']['Row']
export type GovernanceDocument = Database['public']['Tables']['governance_documents']['Row']

export type PartnerModule = Database['public']['Tables']['partner_modules']['Row']
export type ModuleTask = Database['public']['Tables']['module_tasks']['Row']
export type DefaultTask = Database['public']['Tables']['default_tasks']['Row']

export type AssetTaskInstance = Database['public']['Tables']['asset_task_instances']['Row']
export type AssetTaskInstanceInsert = Database['public']['Tables']['asset_task_instances']['Insert']
export type AssetTaskInstanceUpdate = Database['public']['Tables']['asset_task_instances']['Update']

// View types
export type PipelineBoard = Database['public']['Views']['v_pipeline_board']['Row']
export type TaskDashboard = Database['public']['Views']['v_task_dashboard']['Row']
export type ComplianceDashboard = Database['public']['Views']['v_compliance_dashboard']['Row']
export type UnifiedTask = Database['public']['Views']['v_unified_tasks']['Row']

// Enum types
export type ValuePath = Database['public']['Enums']['value_path']
export type WorkflowPhase = Database['public']['Enums']['workflow_phase']
export type StepStatus = Database['public']['Enums']['step_status']
export type AssetStatus = Database['public']['Enums']['asset_status']
export type PartnerType = Database['public']['Enums']['partner_type']
export type DdStatus = Database['public']['Enums']['dd_status']
export type RiskLevel = Database['public']['Enums']['risk_level']
export type DocumentType = Database['public']['Enums']['document_type']
export type TaskPriority = Database['public']['Enums']['task_priority']
export type TaskStatus = Database['public']['Enums']['task_status']
export type KycStatus = Database['public']['Enums']['kyc_status']
export type ContactRole = Database['public']['Enums']['contact_role']
export type TaskType = Database['public']['Enums']['task_type']
