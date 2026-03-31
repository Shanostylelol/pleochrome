export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: Database["public"]["Enums"]["v2_audit_action"]
          asset_id: string | null
          category: string | null
          changes: Json | null
          comment_id: string | null
          contact_id: string | null
          detail: string | null
          document_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          partner_id: string | null
          performed_at: string
          performed_by: string | null
          performed_by_name: string | null
          request_id: string | null
          severity: string | null
          stage_id: string | null
          subtask_id: string | null
          task_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["v2_audit_action"]
          asset_id?: string | null
          category?: string | null
          changes?: Json | null
          comment_id?: string | null
          contact_id?: string | null
          detail?: string | null
          document_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          partner_id?: string | null
          performed_at?: string
          performed_by?: string | null
          performed_by_name?: string | null
          request_id?: string | null
          severity?: string | null
          stage_id?: string | null
          subtask_id?: string | null
          task_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["v2_audit_action"]
          asset_id?: string | null
          category?: string | null
          changes?: Json | null
          comment_id?: string | null
          contact_id?: string | null
          detail?: string | null
          document_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          partner_id?: string | null
          performed_at?: string
          performed_by?: string | null
          performed_by_name?: string | null
          request_id?: string | null
          severity?: string | null
          stage_id?: string | null
          subtask_id?: string | null
          task_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "asset_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_subtask_id_fkey"
            columns: ["subtask_id"]
            isOneToOne: false
            referencedRelation: "subtasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      approvals: {
        Row: {
          approval_order: number
          approver_id: string
          approver_role: string | null
          created_at: string
          decided_at: string | null
          decision: Database["public"]["Enums"]["v2_approval_decision"]
          id: string
          reason: string | null
          requested_at: string
          requested_by: string
          subtask_id: string | null
          task_id: string | null
          updated_at: string
        }
        Insert: {
          approval_order?: number
          approver_id: string
          approver_role?: string | null
          created_at?: string
          decided_at?: string | null
          decision?: Database["public"]["Enums"]["v2_approval_decision"]
          id?: string
          reason?: string | null
          requested_at?: string
          requested_by: string
          subtask_id?: string | null
          task_id?: string | null
          updated_at?: string
        }
        Update: {
          approval_order?: number
          approver_id?: string
          approver_role?: string | null
          created_at?: string
          decided_at?: string | null
          decision?: Database["public"]["Enums"]["v2_approval_decision"]
          id?: string
          reason?: string | null
          requested_at?: string
          requested_by?: string
          subtask_id?: string | null
          task_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approvals_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_subtask_id_fkey"
            columns: ["subtask_id"]
            isOneToOne: false
            referencedRelation: "subtasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_owners: {
        Row: {
          agreement_document_id: string | null
          asset_id: string
          contact_id: string
          created_at: string
          engagement_date: string | null
          engagement_status: string
          id: string
          is_primary: boolean
          notes: string | null
          ownership_percentage: number | null
          role: string
          updated_at: string
        }
        Insert: {
          agreement_document_id?: string | null
          asset_id: string
          contact_id: string
          created_at?: string
          engagement_date?: string | null
          engagement_status?: string
          id?: string
          is_primary?: boolean
          notes?: string | null
          ownership_percentage?: number | null
          role?: string
          updated_at?: string
        }
        Update: {
          agreement_document_id?: string | null
          asset_id?: string
          contact_id?: string
          created_at?: string
          engagement_date?: string | null
          engagement_status?: string
          id?: string
          is_primary?: boolean
          notes?: string | null
          ownership_percentage?: number | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_owners_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_owners_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_partners: {
        Row: {
          asset_id: string
          created_at: string
          engagement_date: string | null
          id: string
          notes: string | null
          partner_id: string
          role_on_asset: string | null
        }
        Insert: {
          asset_id: string
          created_at?: string
          engagement_date?: string | null
          id?: string
          notes?: string | null
          partner_id: string
          role_on_asset?: string | null
        }
        Update: {
          asset_id?: string
          created_at?: string
          engagement_date?: string | null
          id?: string
          notes?: string | null
          partner_id?: string
          role_on_asset?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_partners_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_partners_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_stages: {
        Row: {
          asset_id: string
          completed_at: string | null
          completed_by: string | null
          created_at: string
          description: string | null
          gate_id: string | null
          gate_passed_at: string | null
          gate_passed_by: string | null
          id: string
          is_gate: boolean
          is_hidden: boolean
          name: string
          phase: Database["public"]["Enums"]["v2_phase"]
          regulatory_basis: string | null
          regulatory_citation: string | null
          required_approvals: Json | null
          required_document_types: string[] | null
          sort_order: number
          source_template_stage_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["v2_stage_status"]
          updated_at: string
        }
        Insert: {
          asset_id: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          description?: string | null
          gate_id?: string | null
          gate_passed_at?: string | null
          gate_passed_by?: string | null
          id?: string
          is_gate?: boolean
          is_hidden?: boolean
          name: string
          phase: Database["public"]["Enums"]["v2_phase"]
          regulatory_basis?: string | null
          regulatory_citation?: string | null
          required_approvals?: Json | null
          required_document_types?: string[] | null
          sort_order?: number
          source_template_stage_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["v2_stage_status"]
          updated_at?: string
        }
        Update: {
          asset_id?: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          description?: string | null
          gate_id?: string | null
          gate_passed_at?: string | null
          gate_passed_by?: string | null
          id?: string
          is_gate?: boolean
          is_hidden?: boolean
          name?: string
          phase?: Database["public"]["Enums"]["v2_phase"]
          regulatory_basis?: string | null
          regulatory_citation?: string | null
          required_approvals?: Json | null
          required_document_types?: string[] | null
          sort_order?: number
          source_template_stage_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["v2_stage_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_stages_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_stages_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_stages_gate_passed_by_fkey"
            columns: ["gate_passed_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_stages_source_template_stage_id_fkey"
            columns: ["source_template_stage_id"]
            isOneToOne: false
            referencedRelation: "template_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          appraised_value: number | null
          asset_count: number | null
          asset_holder_contact_id: string | null
          asset_holder_entity: string | null
          asset_type: string
          assigned_team_ids: string[] | null
          carat_weight: number | null
          claimed_value: number | null
          completed_at: string | null
          created_at: string
          currency: string
          current_location: string | null
          current_phase: Database["public"]["Enums"]["v2_phase"]
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          id: string
          is_deleted: boolean
          lead_team_member_id: string | null
          metadata: Json
          name: string
          origin: string | null
          reference_code: string
          source_template_id: string | null
          spv_ein: string | null
          spv_name: string | null
          status: Database["public"]["Enums"]["v2_asset_status"]
          terminated_at: string | null
          termination_reason: string | null
          updated_at: string
          value_model: Database["public"]["Enums"]["v2_value_model"] | null
        }
        Insert: {
          appraised_value?: number | null
          asset_count?: number | null
          asset_holder_contact_id?: string | null
          asset_holder_entity?: string | null
          asset_type: string
          assigned_team_ids?: string[] | null
          carat_weight?: number | null
          claimed_value?: number | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          current_location?: string | null
          current_phase?: Database["public"]["Enums"]["v2_phase"]
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          is_deleted?: boolean
          lead_team_member_id?: string | null
          metadata?: Json
          name: string
          origin?: string | null
          reference_code: string
          source_template_id?: string | null
          spv_ein?: string | null
          spv_name?: string | null
          status?: Database["public"]["Enums"]["v2_asset_status"]
          terminated_at?: string | null
          termination_reason?: string | null
          updated_at?: string
          value_model?: Database["public"]["Enums"]["v2_value_model"] | null
        }
        Update: {
          appraised_value?: number | null
          asset_count?: number | null
          asset_holder_contact_id?: string | null
          asset_holder_entity?: string | null
          asset_type?: string
          assigned_team_ids?: string[] | null
          carat_weight?: number | null
          claimed_value?: number | null
          completed_at?: string | null
          created_at?: string
          currency?: string
          current_location?: string | null
          current_phase?: Database["public"]["Enums"]["v2_phase"]
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          is_deleted?: boolean
          lead_team_member_id?: string | null
          metadata?: Json
          name?: string
          origin?: string | null
          reference_code?: string
          source_template_id?: string | null
          spv_ein?: string | null
          spv_name?: string | null
          status?: Database["public"]["Enums"]["v2_asset_status"]
          terminated_at?: string | null
          termination_reason?: string | null
          updated_at?: string
          value_model?: Database["public"]["Enums"]["v2_value_model"] | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_lead_team_member_id_fkey"
            columns: ["lead_team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_assets_holder_contact"
            columns: ["asset_holder_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_assets_template"
            columns: ["source_template_id"]
            isOneToOne: false
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          asset_id: string | null
          author_id: string
          body: string
          created_at: string
          edited_at: string | null
          id: string
          is_deleted: boolean
          is_edited: boolean
          mentioned_team_ids: string[] | null
          parent_comment_id: string | null
          stage_id: string | null
          subtask_id: string | null
          task_id: string | null
          updated_at: string
        }
        Insert: {
          asset_id?: string | null
          author_id: string
          body: string
          created_at?: string
          edited_at?: string | null
          id?: string
          is_deleted?: boolean
          is_edited?: boolean
          mentioned_team_ids?: string[] | null
          parent_comment_id?: string | null
          stage_id?: string | null
          subtask_id?: string | null
          task_id?: string | null
          updated_at?: string
        }
        Update: {
          asset_id?: string | null
          author_id?: string
          body?: string
          created_at?: string
          edited_at?: string | null
          id?: string
          is_deleted?: boolean
          is_edited?: boolean
          mentioned_team_ids?: string[] | null
          parent_comment_id?: string | null
          stage_id?: string | null
          subtask_id?: string | null
          task_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "asset_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_subtask_id_fkey"
            columns: ["subtask_id"]
            isOneToOne: false
            referencedRelation: "subtasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_log: {
        Row: {
          action_items: string[] | null
          asset_id: string | null
          attendees: string[] | null
          comm_type: string
          contact_id: string | null
          created_at: string
          direction: string
          document_id: string | null
          duration_minutes: number | null
          id: string
          partner_id: string | null
          performed_at: string
          performed_by: string
          subject: string | null
          summary: string
          task_id: string | null
        }
        Insert: {
          action_items?: string[] | null
          asset_id?: string | null
          attendees?: string[] | null
          comm_type: string
          contact_id?: string | null
          created_at?: string
          direction?: string
          document_id?: string | null
          duration_minutes?: number | null
          id?: string
          partner_id?: string | null
          performed_at?: string
          performed_by: string
          subject?: string | null
          summary: string
          task_id?: string | null
        }
        Update: {
          action_items?: string[] | null
          asset_id?: string | null
          attendees?: string[] | null
          comm_type?: string
          contact_id?: string | null
          created_at?: string
          direction?: string
          document_id?: string | null
          duration_minutes?: number | null
          id?: string
          partner_id?: string | null
          performed_at?: string
          performed_by?: string
          subject?: string | null
          summary?: string
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_log_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_log_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_log_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_log_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          accreditation_expires_at: string | null
          accreditation_status: string | null
          accreditation_type: string | null
          accreditation_verified_at: string | null
          address: string | null
          citizenship: string | null
          compliance_score: number | null
          contact_type: string
          created_at: string
          date_of_birth: string | null
          date_of_formation: string | null
          ein: string | null
          email: string | null
          entity: string | null
          entity_name: string | null
          entity_type: string | null
          full_name: string
          id: string
          id_expiry: string | null
          id_issuing_authority: string | null
          id_number_last_four: string | null
          id_type: string | null
          is_deleted: boolean
          kyc_expires_at: string | null
          kyc_status: Database["public"]["Enums"]["v2_kyc_status"]
          kyc_verified_at: string | null
          metadata: Json
          notes: string | null
          ofac_screened_at: string | null
          ofac_status: string | null
          partner_id: string | null
          pep_screened_at: string | null
          pep_status: string | null
          phone: string | null
          preferred_contact_method: string | null
          principal_address: string | null
          referral_source: string | null
          registered_agent: string | null
          relationship_status: string | null
          role: Database["public"]["Enums"]["v2_contact_role"]
          source: string | null
          ssn_last_four: string | null
          state_of_formation: string | null
          tags: string[] | null
          timezone: string | null
          title: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          accreditation_expires_at?: string | null
          accreditation_status?: string | null
          accreditation_type?: string | null
          accreditation_verified_at?: string | null
          address?: string | null
          citizenship?: string | null
          compliance_score?: number | null
          contact_type?: string
          created_at?: string
          date_of_birth?: string | null
          date_of_formation?: string | null
          ein?: string | null
          email?: string | null
          entity?: string | null
          entity_name?: string | null
          entity_type?: string | null
          full_name: string
          id?: string
          id_expiry?: string | null
          id_issuing_authority?: string | null
          id_number_last_four?: string | null
          id_type?: string | null
          is_deleted?: boolean
          kyc_expires_at?: string | null
          kyc_status?: Database["public"]["Enums"]["v2_kyc_status"]
          kyc_verified_at?: string | null
          metadata?: Json
          notes?: string | null
          ofac_screened_at?: string | null
          ofac_status?: string | null
          partner_id?: string | null
          pep_screened_at?: string | null
          pep_status?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          principal_address?: string | null
          referral_source?: string | null
          registered_agent?: string | null
          relationship_status?: string | null
          role?: Database["public"]["Enums"]["v2_contact_role"]
          source?: string | null
          ssn_last_four?: string | null
          state_of_formation?: string | null
          tags?: string[] | null
          timezone?: string | null
          title?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          accreditation_expires_at?: string | null
          accreditation_status?: string | null
          accreditation_type?: string | null
          accreditation_verified_at?: string | null
          address?: string | null
          citizenship?: string | null
          compliance_score?: number | null
          contact_type?: string
          created_at?: string
          date_of_birth?: string | null
          date_of_formation?: string | null
          ein?: string | null
          email?: string | null
          entity?: string | null
          entity_name?: string | null
          entity_type?: string | null
          full_name?: string
          id?: string
          id_expiry?: string | null
          id_issuing_authority?: string | null
          id_number_last_four?: string | null
          id_type?: string | null
          is_deleted?: boolean
          kyc_expires_at?: string | null
          kyc_status?: Database["public"]["Enums"]["v2_kyc_status"]
          kyc_verified_at?: string | null
          metadata?: Json
          notes?: string | null
          ofac_screened_at?: string | null
          ofac_status?: string | null
          partner_id?: string | null
          pep_screened_at?: string | null
          pep_status?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          principal_address?: string | null
          referral_source?: string | null
          registered_agent?: string | null
          relationship_status?: string | null
          role?: Database["public"]["Enums"]["v2_contact_role"]
          source?: string | null
          ssn_last_four?: string | null
          state_of_formation?: string | null
          tags?: string[] | null
          timezone?: string | null
          title?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_contacts_partner"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          asset_id: string | null
          contact_id: string | null
          created_at: string
          description: string | null
          document_type: string
          expires_at: string | null
          file_size_bytes: number | null
          filename: string
          id: string
          is_current: boolean
          is_locked: boolean
          lock_reason: string | null
          locked_at: string | null
          locked_by: string | null
          mime_type: string | null
          notes: string | null
          parent_document_id: string | null
          partner_id: string | null
          stage_id: string | null
          storage_bucket: string
          storage_path: string
          subtask_id: string | null
          tags: string[] | null
          task_id: string | null
          title: string
          updated_at: string
          uploaded_at: string
          uploaded_by: string | null
          verified_at: string | null
          verified_by: string | null
          version: number
        }
        Insert: {
          asset_id?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          document_type: string
          expires_at?: string | null
          file_size_bytes?: number | null
          filename: string
          id?: string
          is_current?: boolean
          is_locked?: boolean
          lock_reason?: string | null
          locked_at?: string | null
          locked_by?: string | null
          mime_type?: string | null
          notes?: string | null
          parent_document_id?: string | null
          partner_id?: string | null
          stage_id?: string | null
          storage_bucket: string
          storage_path: string
          subtask_id?: string | null
          tags?: string[] | null
          task_id?: string | null
          title: string
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string | null
          verified_at?: string | null
          verified_by?: string | null
          version?: number
        }
        Update: {
          asset_id?: string | null
          contact_id?: string | null
          created_at?: string
          description?: string | null
          document_type?: string
          expires_at?: string | null
          file_size_bytes?: number | null
          filename?: string
          id?: string
          is_current?: boolean
          is_locked?: boolean
          lock_reason?: string | null
          locked_at?: string | null
          locked_by?: string | null
          mime_type?: string | null
          notes?: string | null
          parent_document_id?: string | null
          partner_id?: string | null
          stage_id?: string | null
          storage_bucket?: string
          storage_path?: string
          subtask_id?: string | null
          tags?: string[] | null
          task_id?: string | null
          title?: string
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string | null
          verified_at?: string | null
          verified_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "documents_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_locked_by_fkey"
            columns: ["locked_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_parent_document_id_fkey"
            columns: ["parent_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "asset_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_subtask_id_fkey"
            columns: ["subtask_id"]
            isOneToOne: false
            referencedRelation: "subtasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      gate_checks: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          asset_id: string
          blockers: Json | null
          checked_at: string
          checked_by: string
          conditions: Json
          created_at: string
          id: string
          notes: string | null
          passed: boolean
          stage_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          asset_id: string
          blockers?: Json | null
          checked_at?: string
          checked_by: string
          conditions?: Json
          created_at?: string
          id?: string
          notes?: string | null
          passed: boolean
          stage_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          asset_id?: string
          blockers?: Json | null
          checked_at?: string
          checked_by?: string
          conditions?: Json
          created_at?: string
          id?: string
          notes?: string | null
          passed?: boolean
          stage_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gate_checks_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_checks_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_checks_checked_by_fkey"
            columns: ["checked_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_checks_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "asset_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_records: {
        Row: {
          check_type: string
          contact_id: string
          created_at: string
          document_id: string | null
          expires_at: string | null
          flags: string[] | null
          id: string
          next_review_at: string | null
          notes: string | null
          performed_at: string
          performed_by: string | null
          provider: string | null
          provider_reference: string | null
          result_details: Json | null
          risk_level: string | null
          status: string
        }
        Insert: {
          check_type: string
          contact_id: string
          created_at?: string
          document_id?: string | null
          expires_at?: string | null
          flags?: string[] | null
          id?: string
          next_review_at?: string | null
          notes?: string | null
          performed_at?: string
          performed_by?: string | null
          provider?: string | null
          provider_reference?: string | null
          result_details?: Json | null
          risk_level?: string | null
          status?: string
        }
        Update: {
          check_type?: string
          contact_id?: string
          created_at?: string
          document_id?: string | null
          expires_at?: string | null
          flags?: string[] | null
          id?: string
          next_review_at?: string | null
          notes?: string | null
          performed_at?: string
          performed_by?: string | null
          provider?: string | null
          provider_reference?: string | null
          result_details?: Json | null
          risk_level?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_records_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kyc_records_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_notes: {
        Row: {
          action_items: Json | null
          agenda: string | null
          ai_summary: string | null
          asset_id: string | null
          attendees: Json
          created_at: string
          created_by: string | null
          duration_minutes: number | null
          follow_up_date: string | null
          follow_up_notes: string | null
          id: string
          key_decisions: string | null
          location: string | null
          meeting_date: string
          meeting_type: string | null
          partner_id: string | null
          summary: string | null
          tags: string[] | null
          task_id: string | null
          title: string
          transcript: string | null
          updated_at: string
        }
        Insert: {
          action_items?: Json | null
          agenda?: string | null
          ai_summary?: string | null
          asset_id?: string | null
          attendees?: Json
          created_at?: string
          created_by?: string | null
          duration_minutes?: number | null
          follow_up_date?: string | null
          follow_up_notes?: string | null
          id?: string
          key_decisions?: string | null
          location?: string | null
          meeting_date: string
          meeting_type?: string | null
          partner_id?: string | null
          summary?: string | null
          tags?: string[] | null
          task_id?: string | null
          title: string
          transcript?: string | null
          updated_at?: string
        }
        Update: {
          action_items?: Json | null
          agenda?: string | null
          ai_summary?: string | null
          asset_id?: string | null
          attendees?: Json
          created_at?: string
          created_by?: string | null
          duration_minutes?: number | null
          follow_up_date?: string | null
          follow_up_notes?: string | null
          id?: string
          key_decisions?: string | null
          location?: string | null
          meeting_date?: string
          meeting_type?: string | null
          partner_id?: string | null
          summary?: string | null
          tags?: string[] | null
          task_id?: string | null
          title?: string
          transcript?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_notes_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_notes_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_notes_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          approval_id: string | null
          asset_id: string | null
          comment_id: string | null
          created_at: string
          id: string
          is_dismissed: boolean
          is_read: boolean
          message: string
          read_at: string | null
          recipient_id: string
          stage_id: string | null
          subtask_id: string | null
          task_id: string | null
          title: string
          type: Database["public"]["Enums"]["v2_notification_type"]
        }
        Insert: {
          action_url?: string | null
          approval_id?: string | null
          asset_id?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          is_dismissed?: boolean
          is_read?: boolean
          message: string
          read_at?: string | null
          recipient_id: string
          stage_id?: string | null
          subtask_id?: string | null
          task_id?: string | null
          title: string
          type: Database["public"]["Enums"]["v2_notification_type"]
        }
        Update: {
          action_url?: string | null
          approval_id?: string | null
          asset_id?: string | null
          comment_id?: string | null
          created_at?: string
          id?: string
          is_dismissed?: boolean
          is_read?: boolean
          message?: string
          read_at?: string | null
          recipient_id?: string
          stage_id?: string | null
          subtask_id?: string | null
          task_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["v2_notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "notifications_approval_id_fkey"
            columns: ["approval_id"]
            isOneToOne: false
            referencedRelation: "approvals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "asset_stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_subtask_id_fkey"
            columns: ["subtask_id"]
            isOneToOne: false
            referencedRelation: "subtasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      ownership_links: {
        Row: {
          child_contact_id: string
          created_at: string
          effective_date: string | null
          id: string
          is_active: boolean
          is_control_person: boolean
          notes: string | null
          ownership_percentage: number | null
          parent_contact_id: string
          relationship_type: string
          role_title: string | null
          termination_date: string | null
          updated_at: string
          verification_document_id: string | null
          verification_method: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          child_contact_id: string
          created_at?: string
          effective_date?: string | null
          id?: string
          is_active?: boolean
          is_control_person?: boolean
          notes?: string | null
          ownership_percentage?: number | null
          parent_contact_id: string
          relationship_type?: string
          role_title?: string | null
          termination_date?: string | null
          updated_at?: string
          verification_document_id?: string | null
          verification_method?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          child_contact_id?: string
          created_at?: string
          effective_date?: string | null
          id?: string
          is_active?: boolean
          is_control_person?: boolean
          notes?: string | null
          ownership_percentage?: number | null
          parent_contact_id?: string
          relationship_type?: string
          role_title?: string | null
          termination_date?: string | null
          updated_at?: string
          verification_document_id?: string | null
          verification_method?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ownership_links_child_contact_id_fkey"
            columns: ["child_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ownership_links_parent_contact_id_fkey"
            columns: ["parent_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ownership_links_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_credentials: {
        Row: {
          created_at: string
          credential_name: string
          credential_number: string | null
          credential_type: string
          document_id: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          issued_at: string | null
          issuing_body: string | null
          notes: string | null
          partner_id: string
          updated_at: string
          verification_url: string | null
        }
        Insert: {
          created_at?: string
          credential_name: string
          credential_number?: string | null
          credential_type: string
          document_id?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          issued_at?: string | null
          issuing_body?: string | null
          notes?: string | null
          partner_id: string
          updated_at?: string
          verification_url?: string | null
        }
        Update: {
          created_at?: string
          credential_name?: string
          credential_number?: string | null
          credential_type?: string
          document_id?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          issued_at?: string | null
          issuing_body?: string | null
          notes?: string | null
          partner_id?: string
          updated_at?: string
          verification_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_credentials_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_onboarding_items: {
        Row: {
          created_at: string
          description: string | null
          document_id: string | null
          expires_at: string | null
          id: string
          item_name: string
          item_type: string
          notes: string | null
          partner_id: string
          status: string
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_id?: string | null
          expires_at?: string | null
          id?: string
          item_name: string
          item_type: string
          notes?: string | null
          partner_id: string
          status?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          document_id?: string | null
          expires_at?: string | null
          id?: string
          item_name?: string
          item_type?: string
          notes?: string | null
          partner_id?: string
          status?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_onboarding_items_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_onboarding_items_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_title: string | null
          contract_end: string | null
          contract_start: string | null
          created_at: string
          dd_completed_at: string | null
          dd_expires_at: string | null
          dd_report_url: string | null
          dd_status: Database["public"]["Enums"]["v2_dd_status"]
          description: string | null
          engagement_status: string | null
          fee_structure: Json | null
          id: string
          is_deleted: boolean
          metadata: Json
          name: string
          notes: string | null
          risk_level: Database["public"]["Enums"]["v2_risk_level"] | null
          tags: string[] | null
          type: Database["public"]["Enums"]["v2_partner_type"]
          updated_at: string
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_title?: string | null
          contract_end?: string | null
          contract_start?: string | null
          created_at?: string
          dd_completed_at?: string | null
          dd_expires_at?: string | null
          dd_report_url?: string | null
          dd_status?: Database["public"]["Enums"]["v2_dd_status"]
          description?: string | null
          engagement_status?: string | null
          fee_structure?: Json | null
          id?: string
          is_deleted?: boolean
          metadata?: Json
          name: string
          notes?: string | null
          risk_level?: Database["public"]["Enums"]["v2_risk_level"] | null
          tags?: string[] | null
          type: Database["public"]["Enums"]["v2_partner_type"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_title?: string | null
          contract_end?: string | null
          contract_start?: string | null
          created_at?: string
          dd_completed_at?: string | null
          dd_expires_at?: string | null
          dd_report_url?: string | null
          dd_status?: Database["public"]["Enums"]["v2_dd_status"]
          description?: string | null
          engagement_status?: string | null
          fee_structure?: Json | null
          id?: string
          is_deleted?: boolean
          metadata?: Json
          name?: string
          notes?: string | null
          risk_level?: Database["public"]["Enums"]["v2_risk_level"] | null
          tags?: string[] | null
          type?: Database["public"]["Enums"]["v2_partner_type"]
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          asset_id: string | null
          contact_id: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_recurring: boolean
          meeting_id: string | null
          partner_id: string | null
          recurrence_rule: string | null
          remind_at: string
          remind_user_id: string
          snoozed_until: string | null
          status: string
          task_id: string | null
          title: string
        }
        Insert: {
          asset_id?: string | null
          contact_id?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_recurring?: boolean
          meeting_id?: string | null
          partner_id?: string | null
          recurrence_rule?: string | null
          remind_at: string
          remind_user_id: string
          snoozed_until?: string | null
          status?: string
          task_id?: string | null
          title: string
        }
        Update: {
          asset_id?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_recurring?: boolean
          meeting_id?: string | null
          partner_id?: string | null
          recurrence_rule?: string | null
          remind_at?: string
          remind_user_id?: string
          snoozed_until?: string | null
          status?: string
          task_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_remind_user_id_fkey"
            columns: ["remind_user_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      sops: {
        Row: {
          compliance_notes: string | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          purpose: string
          regulatory_citation: string | null
          stage_context: string | null
          steps: Json
          task_type: Database["public"]["Enums"]["v2_task_type"] | null
          template_document_ids: string[] | null
          tips: string | null
          title: string
          updated_at: string
          value_model: Database["public"]["Enums"]["v2_value_model"] | null
          version: number
        }
        Insert: {
          compliance_notes?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          purpose: string
          regulatory_citation?: string | null
          stage_context?: string | null
          steps: Json
          task_type?: Database["public"]["Enums"]["v2_task_type"] | null
          template_document_ids?: string[] | null
          tips?: string | null
          title: string
          updated_at?: string
          value_model?: Database["public"]["Enums"]["v2_value_model"] | null
          version?: number
        }
        Update: {
          compliance_notes?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          purpose?: string
          regulatory_citation?: string | null
          stage_context?: string | null
          steps?: Json
          task_type?: Database["public"]["Enums"]["v2_task_type"] | null
          template_document_ids?: string[] | null
          tips?: string | null
          title?: string
          updated_at?: string
          value_model?: Database["public"]["Enums"]["v2_value_model"] | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "sops_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      subtasks: {
        Row: {
          assigned_by: string | null
          assigned_to: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string
          description: string | null
          id: string
          is_hidden: boolean
          notes: string | null
          requires_approval: boolean
          sort_order: number
          source_template_subtask_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["v2_subtask_status"]
          subtask_type: Database["public"]["Enums"]["v2_task_type"] | null
          task_id: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_hidden?: boolean
          notes?: string | null
          requires_approval?: boolean
          sort_order?: number
          source_template_subtask_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["v2_subtask_status"]
          subtask_type?: Database["public"]["Enums"]["v2_task_type"] | null
          task_id: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_hidden?: boolean
          notes?: string | null
          requires_approval?: boolean
          sort_order?: number
          source_template_subtask_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["v2_subtask_status"]
          subtask_type?: Database["public"]["Enums"]["v2_task_type"] | null
          task_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subtasks_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subtasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subtasks_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subtasks_source_template_subtask_id_fkey"
            columns: ["source_template_subtask_id"]
            isOneToOne: false
            referencedRelation: "template_subtasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subtasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          actual_amount: number | null
          asset_id: string
          assigned_at: string | null
          assigned_by: string | null
          assigned_to: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string
          description: string | null
          due_date: string | null
          estimated_amount: number | null
          estimated_duration_days: number | null
          evidence_urls: string[] | null
          id: string
          is_deleted: boolean
          is_hidden: boolean
          notes: string | null
          partner_id: string | null
          payment_description: string | null
          payment_recipient: string | null
          payment_reference: string | null
          sort_order: number
          source_template_task_id: string | null
          stage_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["v2_task_status"]
          task_type: Database["public"]["Enums"]["v2_task_type"]
          title: string
          updated_at: string
        }
        Insert: {
          actual_amount?: number | null
          asset_id: string
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_amount?: number | null
          estimated_duration_days?: number | null
          evidence_urls?: string[] | null
          id?: string
          is_deleted?: boolean
          is_hidden?: boolean
          notes?: string | null
          partner_id?: string | null
          payment_description?: string | null
          payment_recipient?: string | null
          payment_reference?: string | null
          sort_order?: number
          source_template_task_id?: string | null
          stage_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["v2_task_status"]
          task_type?: Database["public"]["Enums"]["v2_task_type"]
          title: string
          updated_at?: string
        }
        Update: {
          actual_amount?: number | null
          asset_id?: string
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          estimated_amount?: number | null
          estimated_duration_days?: number | null
          evidence_urls?: string[] | null
          id?: string
          is_deleted?: boolean
          is_hidden?: boolean
          notes?: string | null
          partner_id?: string | null
          payment_description?: string | null
          payment_recipient?: string | null
          payment_reference?: string | null
          sort_order?: number
          source_template_task_id?: string | null
          stage_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["v2_task_status"]
          task_type?: Database["public"]["Enums"]["v2_task_type"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_tasks_partner"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_source_template_task_id_fkey"
            columns: ["source_template_task_id"]
            isOneToOne: false
            referencedRelation: "template_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "asset_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          auth_user_id: string | null
          avatar_url: string | null
          created_at: string
          dd_report_url: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean
          permissions: Json
          phone: string | null
          role: string
          title: string | null
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string
          dd_report_url?: string | null
          email: string
          full_name: string
          id?: string
          is_active?: boolean
          permissions?: Json
          phone?: string | null
          role: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          avatar_url?: string | null
          created_at?: string
          dd_report_url?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          permissions?: Json
          phone?: string | null
          role?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      template_stages: {
        Row: {
          created_at: string
          description: string | null
          gate_id: string | null
          id: string
          is_gate: boolean
          is_hidden: boolean
          name: string
          phase: Database["public"]["Enums"]["v2_phase"]
          regulatory_basis: string | null
          regulatory_citation: string | null
          required_approvals: Json | null
          required_document_types: string[] | null
          sort_order: number
          source_url: string | null
          template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          gate_id?: string | null
          id?: string
          is_gate?: boolean
          is_hidden?: boolean
          name: string
          phase: Database["public"]["Enums"]["v2_phase"]
          regulatory_basis?: string | null
          regulatory_citation?: string | null
          required_approvals?: Json | null
          required_document_types?: string[] | null
          sort_order?: number
          source_url?: string | null
          template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          gate_id?: string | null
          id?: string
          is_gate?: boolean
          is_hidden?: boolean
          name?: string
          phase?: Database["public"]["Enums"]["v2_phase"]
          regulatory_basis?: string | null
          regulatory_citation?: string | null
          required_approvals?: Json | null
          required_document_types?: string[] | null
          sort_order?: number
          source_url?: string | null
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_stages_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      template_subtasks: {
        Row: {
          approval_config: Json | null
          created_at: string
          default_assignee_role: string | null
          description: string | null
          id: string
          is_hidden: boolean
          requires_approval: boolean
          sort_order: number
          subtask_type: Database["public"]["Enums"]["v2_task_type"] | null
          template_task_id: string
          title: string
          updated_at: string
        }
        Insert: {
          approval_config?: Json | null
          created_at?: string
          default_assignee_role?: string | null
          description?: string | null
          id?: string
          is_hidden?: boolean
          requires_approval?: boolean
          sort_order?: number
          subtask_type?: Database["public"]["Enums"]["v2_task_type"] | null
          template_task_id: string
          title: string
          updated_at?: string
        }
        Update: {
          approval_config?: Json | null
          created_at?: string
          default_assignee_role?: string | null
          description?: string | null
          id?: string
          is_hidden?: boolean
          requires_approval?: boolean
          sort_order?: number
          subtask_type?: Database["public"]["Enums"]["v2_task_type"] | null
          template_task_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_subtasks_template_task_id_fkey"
            columns: ["template_task_id"]
            isOneToOne: false
            referencedRelation: "template_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      template_tasks: {
        Row: {
          approval_config: Json | null
          created_at: string
          default_assignee_role: string | null
          description: string | null
          estimated_amount: number | null
          estimated_duration_days: number | null
          id: string
          is_hidden: boolean
          partner_type: string | null
          payment_description: string | null
          payment_recipient: string | null
          relative_due_offset_days: number | null
          sort_order: number
          task_type: Database["public"]["Enums"]["v2_task_type"]
          template_stage_id: string
          title: string
          updated_at: string
        }
        Insert: {
          approval_config?: Json | null
          created_at?: string
          default_assignee_role?: string | null
          description?: string | null
          estimated_amount?: number | null
          estimated_duration_days?: number | null
          id?: string
          is_hidden?: boolean
          partner_type?: string | null
          payment_description?: string | null
          payment_recipient?: string | null
          relative_due_offset_days?: number | null
          sort_order?: number
          task_type?: Database["public"]["Enums"]["v2_task_type"]
          template_stage_id: string
          title: string
          updated_at?: string
        }
        Update: {
          approval_config?: Json | null
          created_at?: string
          default_assignee_role?: string | null
          description?: string | null
          estimated_amount?: number | null
          estimated_duration_days?: number | null
          id?: string
          is_hidden?: boolean
          partner_type?: string | null
          payment_description?: string | null
          payment_recipient?: string | null
          relative_due_offset_days?: number | null
          sort_order?: number
          task_type?: Database["public"]["Enums"]["v2_task_type"]
          template_stage_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_tasks_template_stage_id_fkey"
            columns: ["template_stage_id"]
            isOneToOne: false
            referencedRelation: "template_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_templates: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_default: boolean
          is_system: boolean
          metadata: Json
          name: string
          parent_template_id: string | null
          source_asset_id: string | null
          updated_at: string
          value_model: Database["public"]["Enums"]["v2_value_model"] | null
          version: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean
          is_system?: boolean
          metadata?: Json
          name: string
          parent_template_id?: string | null
          source_asset_id?: string | null
          updated_at?: string
          value_model?: Database["public"]["Enums"]["v2_value_model"] | null
          version?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_default?: boolean
          is_system?: boolean
          metadata?: Json
          name?: string
          parent_template_id?: string | null
          source_asset_id?: string | null
          updated_at?: string
          value_model?: Database["public"]["Enums"]["v2_value_model"] | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "workflow_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_templates_parent_template_id_fkey"
            columns: ["parent_template_id"]
            isOneToOne: false
            referencedRelation: "workflow_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_templates_source_asset_id_fkey"
            columns: ["source_asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      advance_phase: {
        Args: {
          p_asset_id: string
          p_force?: boolean
          p_override_reason?: string
          p_target_phase: Database["public"]["Enums"]["v2_phase"]
        }
        Returns: Json
      }
      batch_document_paths: {
        Args: { p_asset_id: string; p_document_ids?: string[] }
        Returns: {
          document_id: string
          document_type: string
          file_size_bytes: number
          filename: string
          stage_name: string
          storage_bucket: string
          storage_path: string
          title: string
        }[]
      }
      evaluate_gate: {
        Args: { p_checked_by: string; p_stage_id: string }
        Returns: Json
      }
      generate_asset_report: { Args: { p_asset_id: string }; Returns: Json }
      get_team_member_id: { Args: never; Returns: string }
      instantiate_from_template: {
        Args: { p_asset_id: string; p_template_id: string }
        Returns: undefined
      }
      instantiate_workflow: {
        Args: {
          p_asset_id: string
          p_value_model?: Database["public"]["Enums"]["v2_value_model"]
        }
        Returns: Json
      }
      is_team_member: { Args: never; Returns: boolean }
      save_as_template: {
        Args: {
          p_asset_id: string
          p_created_by?: string
          p_description?: string
          p_template_name: string
        }
        Returns: string
      }
    }
    Enums: {
      v2_approval_decision: "pending" | "approved" | "rejected" | "abstained"
      v2_asset_status:
        | "active"
        | "paused"
        | "completed"
        | "terminated"
        | "archived"
      v2_audit_action:
        | "created"
        | "updated"
        | "deleted"
        | "status_changed"
        | "phase_advanced"
        | "stage_completed"
        | "task_completed"
        | "subtask_completed"
        | "approval_requested"
        | "approval_decided"
        | "document_uploaded"
        | "document_locked"
        | "document_unlocked"
        | "comment_posted"
        | "template_saved"
        | "template_instantiated"
        | "gate_passed"
        | "gate_failed"
        | "asset_archived"
        | "asset_terminated"
      v2_contact_role:
        | "asset_holder"
        | "beneficial_owner"
        | "investor"
        | "partner_contact"
        | "counsel"
        | "appraiser"
        | "vault_manager"
        | "regulator"
        | "broker"
        | "other"
      v2_dd_status:
        | "not_started"
        | "in_progress"
        | "passed"
        | "failed"
        | "expired"
        | "waived"
      v2_kyc_status:
        | "not_started"
        | "pending"
        | "verified"
        | "failed"
        | "expired"
      v2_notification_type:
        | "comment_mention"
        | "comment_reply"
        | "task_assigned"
        | "subtask_assigned"
        | "approval_requested"
        | "approval_decision"
        | "stage_completed"
        | "phase_advanced"
        | "document_uploaded"
        | "deadline_approaching"
        | "deadline_overdue"
        | "gate_ready"
        | "asset_status_changed"
      v2_partner_type:
        | "appraiser"
        | "vault_custodian"
        | "broker_dealer"
        | "securities_counsel"
        | "general_counsel"
        | "transfer_agent"
        | "tokenization_platform"
        | "oracle_provider"
        | "insurance_broker"
        | "kyc_provider"
        | "registered_agent"
        | "auditor"
        | "smart_contract_auditor"
        | "gemological_lab"
        | "escrow_agent"
        | "title_company"
        | "surveyor"
        | "environmental"
        | "qualified_intermediary"
        | "other"
      v2_phase:
        | "lead"
        | "intake"
        | "asset_maturity"
        | "security"
        | "value_creation"
        | "distribution"
      v2_risk_level: "low" | "medium" | "high" | "critical"
      v2_stage_status: "not_started" | "in_progress" | "completed" | "skipped"
      v2_subtask_status:
        | "todo"
        | "in_progress"
        | "pending_approval"
        | "approved"
        | "rejected"
        | "done"
        | "cancelled"
      v2_task_status:
        | "todo"
        | "in_progress"
        | "blocked"
        | "pending_approval"
        | "approved"
        | "rejected"
        | "done"
        | "cancelled"
      v2_task_type:
        | "document_upload"
        | "meeting"
        | "physical_action"
        | "payment_outgoing"
        | "payment_incoming"
        | "approval"
        | "review"
        | "due_diligence"
        | "filing"
        | "communication"
        | "automated"
        | "call"
        | "email"
        | "note"
        | "research"
        | "verification"
        | "follow_up"
        | "signature"
      v2_value_model:
        | "tokenization"
        | "fractional_securities"
        | "debt_instrument"
        | "broker_sale"
        | "barter"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      v2_approval_decision: ["pending", "approved", "rejected", "abstained"],
      v2_asset_status: [
        "active",
        "paused",
        "completed",
        "terminated",
        "archived",
      ],
      v2_audit_action: [
        "created",
        "updated",
        "deleted",
        "status_changed",
        "phase_advanced",
        "stage_completed",
        "task_completed",
        "subtask_completed",
        "approval_requested",
        "approval_decided",
        "document_uploaded",
        "document_locked",
        "document_unlocked",
        "comment_posted",
        "template_saved",
        "template_instantiated",
        "gate_passed",
        "gate_failed",
        "asset_archived",
        "asset_terminated",
      ],
      v2_contact_role: [
        "asset_holder",
        "beneficial_owner",
        "investor",
        "partner_contact",
        "counsel",
        "appraiser",
        "vault_manager",
        "regulator",
        "broker",
        "other",
      ],
      v2_dd_status: [
        "not_started",
        "in_progress",
        "passed",
        "failed",
        "expired",
        "waived",
      ],
      v2_kyc_status: [
        "not_started",
        "pending",
        "verified",
        "failed",
        "expired",
      ],
      v2_notification_type: [
        "comment_mention",
        "comment_reply",
        "task_assigned",
        "subtask_assigned",
        "approval_requested",
        "approval_decision",
        "stage_completed",
        "phase_advanced",
        "document_uploaded",
        "deadline_approaching",
        "deadline_overdue",
        "gate_ready",
        "asset_status_changed",
      ],
      v2_partner_type: [
        "appraiser",
        "vault_custodian",
        "broker_dealer",
        "securities_counsel",
        "general_counsel",
        "transfer_agent",
        "tokenization_platform",
        "oracle_provider",
        "insurance_broker",
        "kyc_provider",
        "registered_agent",
        "auditor",
        "smart_contract_auditor",
        "gemological_lab",
        "escrow_agent",
        "title_company",
        "surveyor",
        "environmental",
        "qualified_intermediary",
        "other",
      ],
      v2_phase: [
        "lead",
        "intake",
        "asset_maturity",
        "security",
        "value_creation",
        "distribution",
      ],
      v2_risk_level: ["low", "medium", "high", "critical"],
      v2_stage_status: ["not_started", "in_progress", "completed", "skipped"],
      v2_subtask_status: [
        "todo",
        "in_progress",
        "pending_approval",
        "approved",
        "rejected",
        "done",
        "cancelled",
      ],
      v2_task_status: [
        "todo",
        "in_progress",
        "blocked",
        "pending_approval",
        "approved",
        "rejected",
        "done",
        "cancelled",
      ],
      v2_task_type: [
        "document_upload",
        "meeting",
        "physical_action",
        "payment_outgoing",
        "payment_incoming",
        "approval",
        "review",
        "due_diligence",
        "filing",
        "communication",
        "automated",
        "call",
        "email",
        "note",
        "research",
        "verification",
        "follow_up",
        "signature",
      ],
      v2_value_model: [
        "tokenization",
        "fractional_securities",
        "debt_instrument",
        "broker_sale",
        "barter",
      ],
    },
  },
} as const
