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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          asset_id: string | null
          category: string | null
          changes: Json | null
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
          step_id: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          asset_id?: string | null
          category?: string | null
          changes?: Json | null
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
          step_id?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          asset_id?: string | null
          category?: string | null
          changes?: Json | null
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
          step_id?: string | null
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
            foreignKeyName: "activity_log_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_asset_governance_progress"
            referencedColumns: ["asset_id"]
          },
          {
            foreignKeyName: "activity_log_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_board"
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
            foreignKeyName: "activity_log_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "asset_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "v_asset_governance_progress"
            referencedColumns: ["step_id"]
          },
        ]
      }
      asset_partners: {
        Row: {
          asset_id: string
          created_at: string
          engagement_date: string | null
          id: string
          module_id: string | null
          notes: string | null
          partner_id: string
          role_on_asset: string | null
        }
        Insert: {
          asset_id: string
          created_at?: string
          engagement_date?: string | null
          id?: string
          module_id?: string | null
          notes?: string | null
          partner_id: string
          role_on_asset?: string | null
        }
        Update: {
          asset_id?: string
          created_at?: string
          engagement_date?: string | null
          id?: string
          module_id?: string | null
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
            foreignKeyName: "asset_partners_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_asset_governance_progress"
            referencedColumns: ["asset_id"]
          },
          {
            foreignKeyName: "asset_partners_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_board"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_partners_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "partner_modules"
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
      asset_steps: {
        Row: {
          actual_cost: number | null
          asset_id: string
          blocked_at: string | null
          blocked_reason: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string
          depends_on: string[] | null
          due_date: string | null
          estimated_cost_high: number | null
          estimated_cost_low: number | null
          estimated_cost_mid: number | null
          estimated_duration_days: number | null
          evidence_urls: string[] | null
          governance_requirement_id: string | null
          id: string
          is_gate: boolean
          notes: string | null
          partner_module_id: string | null
          phase: Database["public"]["Enums"]["workflow_phase"]
          sort_order: number
          started_at: string | null
          status: Database["public"]["Enums"]["step_status"]
          step_description: string | null
          step_number: string
          step_title: string
          updated_at: string
        }
        Insert: {
          actual_cost?: number | null
          asset_id: string
          blocked_at?: string | null
          blocked_reason?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          depends_on?: string[] | null
          due_date?: string | null
          estimated_cost_high?: number | null
          estimated_cost_low?: number | null
          estimated_cost_mid?: number | null
          estimated_duration_days?: number | null
          evidence_urls?: string[] | null
          governance_requirement_id?: string | null
          id?: string
          is_gate?: boolean
          notes?: string | null
          partner_module_id?: string | null
          phase: Database["public"]["Enums"]["workflow_phase"]
          sort_order?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["step_status"]
          step_description?: string | null
          step_number: string
          step_title: string
          updated_at?: string
        }
        Update: {
          actual_cost?: number | null
          asset_id?: string
          blocked_at?: string | null
          blocked_reason?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          depends_on?: string[] | null
          due_date?: string | null
          estimated_cost_high?: number | null
          estimated_cost_low?: number | null
          estimated_cost_mid?: number | null
          estimated_duration_days?: number | null
          evidence_urls?: string[] | null
          governance_requirement_id?: string | null
          id?: string
          is_gate?: boolean
          notes?: string | null
          partner_module_id?: string | null
          phase?: Database["public"]["Enums"]["workflow_phase"]
          sort_order?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["step_status"]
          step_description?: string | null
          step_number?: string
          step_title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_steps_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_steps_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_asset_governance_progress"
            referencedColumns: ["asset_id"]
          },
          {
            foreignKeyName: "asset_steps_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_board"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_steps_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_steps_governance_requirement_id_fkey"
            columns: ["governance_requirement_id"]
            isOneToOne: false
            referencedRelation: "governance_requirements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_steps_governance_requirement_id_fkey"
            columns: ["governance_requirement_id"]
            isOneToOne: false
            referencedRelation: "v_governance_coverage"
            referencedColumns: ["governance_requirement_id"]
          },
          {
            foreignKeyName: "asset_steps_partner_module_id_fkey"
            columns: ["partner_module_id"]
            isOneToOne: false
            referencedRelation: "partner_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_task_instances: {
        Row: {
          asset_id: string
          asset_step_id: string
          assigned_to: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string
          description: string | null
          evidence_url: string | null
          id: string
          notes: string | null
          source_task_id: string | null
          source_type: string
          status: Database["public"]["Enums"]["task_status"]
          task_type: Database["public"]["Enums"]["task_type"]
          title: string
          updated_at: string
        }
        Insert: {
          asset_id: string
          asset_step_id: string
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          description?: string | null
          evidence_url?: string | null
          id?: string
          notes?: string | null
          source_task_id?: string | null
          source_type?: string
          status?: Database["public"]["Enums"]["task_status"]
          task_type?: Database["public"]["Enums"]["task_type"]
          title: string
          updated_at?: string
        }
        Update: {
          asset_id?: string
          asset_step_id?: string
          assigned_to?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          description?: string | null
          evidence_url?: string | null
          id?: string
          notes?: string | null
          source_task_id?: string | null
          source_type?: string
          status?: Database["public"]["Enums"]["task_status"]
          task_type?: Database["public"]["Enums"]["task_type"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_task_instances_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_task_instances_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_asset_governance_progress"
            referencedColumns: ["asset_id"]
          },
          {
            foreignKeyName: "asset_task_instances_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_board"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_task_instances_asset_step_id_fkey"
            columns: ["asset_step_id"]
            isOneToOne: false
            referencedRelation: "asset_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_task_instances_asset_step_id_fkey"
            columns: ["asset_step_id"]
            isOneToOne: false
            referencedRelation: "v_asset_governance_progress"
            referencedColumns: ["step_id"]
          },
          {
            foreignKeyName: "asset_task_instances_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_task_instances_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
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
          current_phase: Database["public"]["Enums"]["workflow_phase"]
          current_step: string | null
          description: string | null
          id: string
          lead_team_member_id: string | null
          metadata: Json
          name: string
          offering_value: number | null
          origin: string | null
          reference_code: string | null
          spv_ein: string | null
          spv_name: string | null
          status: Database["public"]["Enums"]["asset_status"]
          terminated_at: string | null
          termination_reason: string | null
          updated_at: string
          value_path: Database["public"]["Enums"]["value_path"]
        }
        Insert: {
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
          current_phase?: Database["public"]["Enums"]["workflow_phase"]
          current_step?: string | null
          description?: string | null
          id?: string
          lead_team_member_id?: string | null
          metadata?: Json
          name: string
          offering_value?: number | null
          origin?: string | null
          reference_code?: string | null
          spv_ein?: string | null
          spv_name?: string | null
          status?: Database["public"]["Enums"]["asset_status"]
          terminated_at?: string | null
          termination_reason?: string | null
          updated_at?: string
          value_path?: Database["public"]["Enums"]["value_path"]
        }
        Update: {
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
          current_phase?: Database["public"]["Enums"]["workflow_phase"]
          current_step?: string | null
          description?: string | null
          id?: string
          lead_team_member_id?: string | null
          metadata?: Json
          name?: string
          offering_value?: number | null
          origin?: string | null
          reference_code?: string | null
          spv_ein?: string | null
          spv_name?: string | null
          status?: Database["public"]["Enums"]["asset_status"]
          terminated_at?: string | null
          termination_reason?: string | null
          updated_at?: string
          value_path?: Database["public"]["Enums"]["value_path"]
        }
        Relationships: [
          {
            foreignKeyName: "assets_lead_team_member_id_fkey"
            columns: ["lead_team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_stones_asset_holder"
            columns: ["asset_holder_contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_id: string
          body: string
          created_at: string
          edited_at: string | null
          entity_id: string
          entity_type: string
          id: string
          is_edited: boolean
          mentioned_team_ids: string[] | null
          parent_comment_id: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          created_at?: string
          edited_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          is_edited?: boolean
          mentioned_team_ids?: string[] | null
          parent_comment_id?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          created_at?: string
          edited_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          is_edited?: boolean
          mentioned_team_ids?: string[] | null
          parent_comment_id?: string | null
          updated_at?: string
        }
        Relationships: [
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
        ]
      }
      contacts: {
        Row: {
          address: string | null
          asset_ids: string[] | null
          created_at: string
          email: string | null
          entity: string | null
          full_name: string
          id: string
          kyc_expires_at: string | null
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          kyc_verified_at: string | null
          metadata: Json
          notes: string | null
          ofac_screened_at: string | null
          ofac_status: string | null
          partner_id: string | null
          pep_screened_at: string | null
          pep_status: string | null
          phone: string | null
          role: Database["public"]["Enums"]["contact_role"]
          tags: string[] | null
          title: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          asset_ids?: string[] | null
          created_at?: string
          email?: string | null
          entity?: string | null
          full_name: string
          id?: string
          kyc_expires_at?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          kyc_verified_at?: string | null
          metadata?: Json
          notes?: string | null
          ofac_screened_at?: string | null
          ofac_status?: string | null
          partner_id?: string | null
          pep_screened_at?: string | null
          pep_status?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["contact_role"]
          tags?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          asset_ids?: string[] | null
          created_at?: string
          email?: string | null
          entity?: string | null
          full_name?: string
          id?: string
          kyc_expires_at?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          kyc_verified_at?: string | null
          metadata?: Json
          notes?: string | null
          ofac_screened_at?: string | null
          ofac_status?: string | null
          partner_id?: string | null
          pep_screened_at?: string | null
          pep_status?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["contact_role"]
          tags?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      default_tasks: {
        Row: {
          assigned_role: string | null
          created_at: string
          estimated_duration: string | null
          governance_requirement_id: string
          id: string
          sort_order: number
          task_description: string | null
          task_title: string
          task_type: Database["public"]["Enums"]["task_type"]
          updated_at: string
        }
        Insert: {
          assigned_role?: string | null
          created_at?: string
          estimated_duration?: string | null
          governance_requirement_id: string
          id?: string
          sort_order?: number
          task_description?: string | null
          task_title: string
          task_type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
        }
        Update: {
          assigned_role?: string | null
          created_at?: string
          estimated_duration?: string | null
          governance_requirement_id?: string
          id?: string
          sort_order?: number
          task_description?: string | null
          task_title?: string
          task_type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "default_tasks_governance_requirement_id_fkey"
            columns: ["governance_requirement_id"]
            isOneToOne: false
            referencedRelation: "governance_requirements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "default_tasks_governance_requirement_id_fkey"
            columns: ["governance_requirement_id"]
            isOneToOne: false
            referencedRelation: "v_governance_coverage"
            referencedColumns: ["governance_requirement_id"]
          },
        ]
      }
      documents: {
        Row: {
          asset_id: string | null
          contact_id: string | null
          created_at: string
          description: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          expires_at: string | null
          file_size_bytes: number | null
          filename: string
          id: string
          is_current: boolean
          is_locked: boolean
          lock_reason: string | null
          locked_at: string | null
          locked_by: string | null
          meeting_id: string | null
          mime_type: string | null
          notes: string | null
          parent_document_id: string | null
          partner_id: string | null
          step_id: string | null
          storage_bucket: string
          storage_path: string
          tags: string[] | null
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
          document_type: Database["public"]["Enums"]["document_type"]
          expires_at?: string | null
          file_size_bytes?: number | null
          filename: string
          id?: string
          is_current?: boolean
          is_locked?: boolean
          lock_reason?: string | null
          locked_at?: string | null
          locked_by?: string | null
          meeting_id?: string | null
          mime_type?: string | null
          notes?: string | null
          parent_document_id?: string | null
          partner_id?: string | null
          step_id?: string | null
          storage_bucket: string
          storage_path: string
          tags?: string[] | null
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
          document_type?: Database["public"]["Enums"]["document_type"]
          expires_at?: string | null
          file_size_bytes?: number | null
          filename?: string
          id?: string
          is_current?: boolean
          is_locked?: boolean
          lock_reason?: string | null
          locked_at?: string | null
          locked_by?: string | null
          meeting_id?: string | null
          mime_type?: string | null
          notes?: string | null
          parent_document_id?: string | null
          partner_id?: string | null
          step_id?: string | null
          storage_bucket?: string
          storage_path?: string
          tags?: string[] | null
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
            foreignKeyName: "documents_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_asset_governance_progress"
            referencedColumns: ["asset_id"]
          },
          {
            foreignKeyName: "documents_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_board"
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
            foreignKeyName: "documents_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "asset_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "v_asset_governance_progress"
            referencedColumns: ["step_id"]
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
          {
            foreignKeyName: "fk_documents_meeting"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meeting_notes"
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
          gate_name: string
          gate_number: number
          id: string
          notes: string | null
          passed: boolean
          phase_from: Database["public"]["Enums"]["workflow_phase"]
          phase_to: Database["public"]["Enums"]["workflow_phase"] | null
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
          gate_name: string
          gate_number: number
          id?: string
          notes?: string | null
          passed: boolean
          phase_from: Database["public"]["Enums"]["workflow_phase"]
          phase_to?: Database["public"]["Enums"]["workflow_phase"] | null
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
          gate_name?: string
          gate_number?: number
          id?: string
          notes?: string | null
          passed?: boolean
          phase_from?: Database["public"]["Enums"]["workflow_phase"]
          phase_to?: Database["public"]["Enums"]["workflow_phase"] | null
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
            foreignKeyName: "gate_checks_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_asset_governance_progress"
            referencedColumns: ["asset_id"]
          },
          {
            foreignKeyName: "gate_checks_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_board"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gate_checks_checked_by_fkey"
            columns: ["checked_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      governance_documents: {
        Row: {
          created_at: string
          description: string | null
          document_type: string
          governance_requirement_id: string
          id: string
          is_required: boolean
          template_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_type: string
          governance_requirement_id: string
          id?: string
          is_required?: boolean
          template_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          document_type?: string
          governance_requirement_id?: string
          id?: string
          is_required?: boolean
          template_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "governance_documents_governance_requirement_id_fkey"
            columns: ["governance_requirement_id"]
            isOneToOne: false
            referencedRelation: "governance_requirements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "governance_documents_governance_requirement_id_fkey"
            columns: ["governance_requirement_id"]
            isOneToOne: false
            referencedRelation: "v_governance_coverage"
            referencedColumns: ["governance_requirement_id"]
          },
        ]
      }
      governance_requirements: {
        Row: {
          created_at: string
          description: string
          gate_id: string | null
          id: string
          is_active: boolean
          is_gate: boolean
          phase: Database["public"]["Enums"]["workflow_phase"]
          regulatory_basis: string
          regulatory_citation: string | null
          required_approvals: Json | null
          required_documents: string[] | null
          sort_order: number
          source_url: string | null
          step_number: string
          title: string
          updated_at: string
          value_path: Database["public"]["Enums"]["value_path"] | null
        }
        Insert: {
          created_at?: string
          description: string
          gate_id?: string | null
          id?: string
          is_active?: boolean
          is_gate?: boolean
          phase: Database["public"]["Enums"]["workflow_phase"]
          regulatory_basis: string
          regulatory_citation?: string | null
          required_approvals?: Json | null
          required_documents?: string[] | null
          sort_order?: number
          source_url?: string | null
          step_number: string
          title: string
          updated_at?: string
          value_path?: Database["public"]["Enums"]["value_path"] | null
        }
        Update: {
          created_at?: string
          description?: string
          gate_id?: string | null
          id?: string
          is_active?: boolean
          is_gate?: boolean
          phase?: Database["public"]["Enums"]["workflow_phase"]
          regulatory_basis?: string
          regulatory_citation?: string | null
          required_approvals?: Json | null
          required_documents?: string[] | null
          sort_order?: number
          source_url?: string | null
          step_number?: string
          title?: string
          updated_at?: string
          value_path?: Database["public"]["Enums"]["value_path"] | null
        }
        Relationships: []
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
            foreignKeyName: "meeting_notes_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_asset_governance_progress"
            referencedColumns: ["asset_id"]
          },
          {
            foreignKeyName: "meeting_notes_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_board"
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
        ]
      }
      module_tasks: {
        Row: {
          assigned_role: string | null
          created_at: string
          estimated_duration: string | null
          governance_requirement_id: string
          id: string
          is_active: boolean
          partner_module_id: string
          replaces_default: boolean
          sort_order: number
          task_description: string | null
          task_title: string
          task_type: Database["public"]["Enums"]["task_type"]
          updated_at: string
        }
        Insert: {
          assigned_role?: string | null
          created_at?: string
          estimated_duration?: string | null
          governance_requirement_id: string
          id?: string
          is_active?: boolean
          partner_module_id: string
          replaces_default?: boolean
          sort_order?: number
          task_description?: string | null
          task_title: string
          task_type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
        }
        Update: {
          assigned_role?: string | null
          created_at?: string
          estimated_duration?: string | null
          governance_requirement_id?: string
          id?: string
          is_active?: boolean
          partner_module_id?: string
          replaces_default?: boolean
          sort_order?: number
          task_description?: string | null
          task_title?: string
          task_type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "module_tasks_governance_requirement_id_fkey"
            columns: ["governance_requirement_id"]
            isOneToOne: false
            referencedRelation: "governance_requirements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_tasks_governance_requirement_id_fkey"
            columns: ["governance_requirement_id"]
            isOneToOne: false
            referencedRelation: "v_governance_coverage"
            referencedColumns: ["governance_requirement_id"]
          },
          {
            foreignKeyName: "module_tasks_partner_module_id_fkey"
            columns: ["partner_module_id"]
            isOneToOne: false
            referencedRelation: "partner_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          asset_id: string | null
          created_at: string
          id: string
          is_dismissed: boolean
          is_read: boolean
          message: string
          priority: string
          read_at: string | null
          recipient_id: string
          step_id: string | null
          task_id: string | null
          title: string
          type: string
        }
        Insert: {
          action_url?: string | null
          asset_id?: string | null
          created_at?: string
          id?: string
          is_dismissed?: boolean
          is_read?: boolean
          message: string
          priority?: string
          read_at?: string | null
          recipient_id: string
          step_id?: string | null
          task_id?: string | null
          title: string
          type?: string
        }
        Update: {
          action_url?: string | null
          asset_id?: string | null
          created_at?: string
          id?: string
          is_dismissed?: boolean
          is_read?: boolean
          message?: string
          priority?: string
          read_at?: string | null
          recipient_id?: string
          step_id?: string | null
          task_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_asset_governance_progress"
            referencedColumns: ["asset_id"]
          },
          {
            foreignKeyName: "notifications_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_board"
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
            foreignKeyName: "notifications_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "asset_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "v_asset_governance_progress"
            referencedColumns: ["step_id"]
          },
          {
            foreignKeyName: "notifications_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "v_task_dashboard"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_modules: {
        Row: {
          covers_functions: string[] | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          module_name: string
          partner_id: string
          updated_at: string
          value_paths: Database["public"]["Enums"]["value_path"][] | null
          version: number
        }
        Insert: {
          covers_functions?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          module_name: string
          partner_id: string
          updated_at?: string
          value_paths?: Database["public"]["Enums"]["value_path"][] | null
          version?: number
        }
        Update: {
          covers_functions?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          module_name?: string
          partner_id?: string
          updated_at?: string
          value_paths?: Database["public"]["Enums"]["value_path"][] | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "partner_modules_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
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
          dd_status: Database["public"]["Enums"]["dd_status"]
          description: string | null
          engagement_status: string | null
          fee_structure: Json | null
          id: string
          metadata: Json
          name: string
          notes: string | null
          risk_level: Database["public"]["Enums"]["risk_level"] | null
          tags: string[] | null
          type: Database["public"]["Enums"]["partner_type"]
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
          dd_status?: Database["public"]["Enums"]["dd_status"]
          description?: string | null
          engagement_status?: string | null
          fee_structure?: Json | null
          id?: string
          metadata?: Json
          name: string
          notes?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          tags?: string[] | null
          type: Database["public"]["Enums"]["partner_type"]
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
          dd_status?: Database["public"]["Enums"]["dd_status"]
          description?: string | null
          engagement_status?: string | null
          fee_structure?: Json | null
          id?: string
          metadata?: Json
          name?: string
          notes?: string | null
          risk_level?: Database["public"]["Enums"]["risk_level"] | null
          tags?: string[] | null
          type?: Database["public"]["Enums"]["partner_type"]
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          asset_id: string | null
          assigned_by: string | null
          assigned_to: string | null
          blocks_step_id: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string
          depends_on_task_id: string | null
          description: string | null
          due_date: string | null
          id: string
          meeting_id: string | null
          notes: string | null
          priority: Database["public"]["Enums"]["task_priority"]
          started_at: string | null
          status: Database["public"]["Enums"]["task_status"]
          step_id: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          asset_id?: string | null
          assigned_by?: string | null
          assigned_to?: string | null
          blocks_step_id?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          depends_on_task_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          meeting_id?: string | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          started_at?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          step_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          asset_id?: string | null
          assigned_by?: string | null
          assigned_to?: string | null
          blocks_step_id?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          depends_on_task_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          meeting_id?: string | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          started_at?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          step_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_asset_governance_progress"
            referencedColumns: ["asset_id"]
          },
          {
            foreignKeyName: "tasks_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_board"
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
            foreignKeyName: "tasks_blocks_step_id_fkey"
            columns: ["blocks_step_id"]
            isOneToOne: false
            referencedRelation: "asset_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_blocks_step_id_fkey"
            columns: ["blocks_step_id"]
            isOneToOne: false
            referencedRelation: "v_asset_governance_progress"
            referencedColumns: ["step_id"]
          },
          {
            foreignKeyName: "tasks_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_depends_on_task_id_fkey"
            columns: ["depends_on_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_depends_on_task_id_fkey"
            columns: ["depends_on_task_id"]
            isOneToOne: false
            referencedRelation: "v_task_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meeting_notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "asset_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "v_asset_governance_progress"
            referencedColumns: ["step_id"]
          },
        ]
      }
      team_members: {
        Row: {
          auth_user_id: string | null
          avatar_url: string | null
          created_at: string
          dd_report_url: string | null
          dd_status: Database["public"]["Enums"]["dd_status"]
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
          dd_status?: Database["public"]["Enums"]["dd_status"]
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
          dd_status?: Database["public"]["Enums"]["dd_status"]
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
    }
    Views: {
      v_asset_governance_progress: {
        Row: {
          asset_id: string | null
          asset_name: string | null
          completed_tasks: number | null
          gate_id: string | null
          is_gate: boolean | null
          partner_module: string | null
          phase: Database["public"]["Enums"]["workflow_phase"] | null
          regulatory_basis: string | null
          regulatory_citation: string | null
          step_id: string | null
          step_number: string | null
          step_status: Database["public"]["Enums"]["step_status"] | null
          step_title: string | null
          total_tasks: number | null
          value_path: Database["public"]["Enums"]["value_path"] | null
        }
        Relationships: []
      }
      v_compliance_dashboard: {
        Row: {
          alert_type: string | null
          asset_id: string | null
          asset_name: string | null
          days_remaining: number | null
          deadline: string | null
          detail: string | null
          entity_id: string | null
          entity_name: string | null
        }
        Relationships: []
      }
      v_governance_coverage: {
        Row: {
          covered_by_modules: string | null
          default_task_count: number | null
          governance_requirement_id: string | null
          is_gate: boolean | null
          module_coverage_count: number | null
          phase: Database["public"]["Enums"]["workflow_phase"] | null
          regulatory_citation: string | null
          step_number: string | null
          title: string | null
          value_path: Database["public"]["Enums"]["value_path"] | null
        }
        Insert: {
          covered_by_modules?: never
          default_task_count?: never
          governance_requirement_id?: string | null
          is_gate?: boolean | null
          module_coverage_count?: never
          phase?: Database["public"]["Enums"]["workflow_phase"] | null
          regulatory_citation?: string | null
          step_number?: string | null
          title?: string | null
          value_path?: Database["public"]["Enums"]["value_path"] | null
        }
        Update: {
          covered_by_modules?: never
          default_task_count?: never
          governance_requirement_id?: string | null
          is_gate?: boolean | null
          module_coverage_count?: never
          phase?: Database["public"]["Enums"]["workflow_phase"] | null
          regulatory_citation?: string | null
          step_number?: string | null
          title?: string | null
          value_path?: Database["public"]["Enums"]["value_path"] | null
        }
        Relationships: []
      }
      v_pipeline_board: {
        Row: {
          active_steps: number | null
          asset_holder_entity: string | null
          asset_type: string | null
          blocked_steps: number | null
          claimed_value: number | null
          completed_steps: number | null
          created_at: string | null
          current_phase: Database["public"]["Enums"]["workflow_phase"] | null
          current_step: string | null
          days_in_phase: number | null
          document_count: number | null
          id: string | null
          last_activity_at: string | null
          lead_name: string | null
          lead_team_member_id: string | null
          name: string | null
          offering_value: number | null
          open_tasks: number | null
          overdue_tasks: number | null
          reference_code: string | null
          status: Database["public"]["Enums"]["asset_status"] | null
          total_steps: number | null
          updated_at: string | null
          value_path: Database["public"]["Enums"]["value_path"] | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_lead_team_member_id_fkey"
            columns: ["lead_team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      v_task_dashboard: {
        Row: {
          asset_id: string | null
          asset_name: string | null
          asset_reference: string | null
          assigned_to: string | null
          assignee_name: string | null
          created_at: string | null
          days_until_due: number | null
          description: string | null
          due_date: string | null
          id: string | null
          is_overdue: boolean | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          step_id: string | null
          step_number: string | null
          step_title: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_asset_governance_progress"
            referencedColumns: ["asset_id"]
          },
          {
            foreignKeyName: "tasks_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "v_pipeline_board"
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
            foreignKeyName: "tasks_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "asset_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "v_asset_governance_progress"
            referencedColumns: ["step_id"]
          },
        ]
      }
      v_unified_tasks: {
        Row: {
          asset_id: string | null
          asset_name: string | null
          asset_reference: string | null
          asset_step_id: string | null
          assigned_to: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          description: string | null
          evidence_url: string | null
          id: string | null
          notes: string | null
          phase: string | null
          status: string | null
          step_number: string | null
          task_source: string | null
          task_type: string | null
          title: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assemble_asset_workflow: {
        Args: {
          p_asset_id: string
          p_partner_module_ids?: string[]
          p_value_path: Database["public"]["Enums"]["value_path"]
        }
        Returns: undefined
      }
      generate_asset_reference: { Args: never; Returns: string }
      get_team_member_id: { Args: never; Returns: string }
      is_team_member: { Args: never; Returns: boolean }
      populate_asset_steps: {
        Args: {
          p_asset_id: string
          p_value_path: Database["public"]["Enums"]["value_path"]
        }
        Returns: undefined
      }
    }
    Enums: {
      asset_status:
        | "prospect"
        | "screening"
        | "active"
        | "paused"
        | "completed"
        | "terminated"
        | "archived"
      contact_role:
        | "asset_holder"
        | "beneficial_owner"
        | "investor"
        | "partner_contact"
        | "counsel"
        | "appraiser"
        | "vault_manager"
        | "regulator"
        | "other"
      dd_status:
        | "not_started"
        | "in_progress"
        | "passed"
        | "failed"
        | "expired"
        | "waived"
      document_type:
        | "gia_report"
        | "ssef_report"
        | "appraisal_report"
        | "articles_of_organization"
        | "operating_agreement"
        | "board_resolution"
        | "engagement_agreement"
        | "ppm"
        | "subscription_agreement"
        | "investor_questionnaire"
        | "accreditation_verification"
        | "legal_opinion"
        | "kyc_report"
        | "aml_policy"
        | "ofac_screening"
        | "pep_screening"
        | "sanctions_screening"
        | "background_check"
        | "custody_receipt"
        | "insurance_certificate"
        | "transport_manifest"
        | "vault_agreement"
        | "smart_contract_audit"
        | "token_deployment_record"
        | "chainlink_por_config"
        | "form_d_filing"
        | "blue_sky_filing"
        | "form_d_amendment"
        | "investor_report"
        | "tax_document"
        | "fee_schedule"
        | "invoice"
        | "dd_report"
        | "partner_agreement"
        | "nda"
        | "meeting_recording"
        | "transcript"
        | "photo"
        | "correspondence"
        | "other"
      kyc_status: "not_started" | "pending" | "verified" | "failed" | "expired"
      partner_type:
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
        | "other"
      risk_level: "low" | "medium" | "high" | "critical"
      step_status:
        | "not_started"
        | "in_progress"
        | "blocked"
        | "completed"
        | "skipped"
      task_priority: "low" | "medium" | "high" | "urgent" | "blocker"
      task_status: "todo" | "in_progress" | "review" | "done" | "cancelled"
      task_type: "action" | "upload" | "review" | "approval" | "automated"
      value_path:
        | "fractional_securities"
        | "tokenization"
        | "debt_instruments"
        | "evaluating"
      workflow_phase:
        | "phase_0_foundation"
        | "phase_1_intake"
        | "phase_2_certification"
        | "phase_3_custody"
        | "phase_4_legal"
        | "phase_5_tokenization"
        | "phase_6_regulatory"
        | "phase_7_distribution"
        | "phase_8_ongoing"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      asset_status: [
        "prospect",
        "screening",
        "active",
        "paused",
        "completed",
        "terminated",
        "archived",
      ],
      contact_role: [
        "asset_holder",
        "beneficial_owner",
        "investor",
        "partner_contact",
        "counsel",
        "appraiser",
        "vault_manager",
        "regulator",
        "other",
      ],
      dd_status: [
        "not_started",
        "in_progress",
        "passed",
        "failed",
        "expired",
        "waived",
      ],
      document_type: [
        "gia_report",
        "ssef_report",
        "appraisal_report",
        "articles_of_organization",
        "operating_agreement",
        "board_resolution",
        "engagement_agreement",
        "ppm",
        "subscription_agreement",
        "investor_questionnaire",
        "accreditation_verification",
        "legal_opinion",
        "kyc_report",
        "aml_policy",
        "ofac_screening",
        "pep_screening",
        "sanctions_screening",
        "background_check",
        "custody_receipt",
        "insurance_certificate",
        "transport_manifest",
        "vault_agreement",
        "smart_contract_audit",
        "token_deployment_record",
        "chainlink_por_config",
        "form_d_filing",
        "blue_sky_filing",
        "form_d_amendment",
        "investor_report",
        "tax_document",
        "fee_schedule",
        "invoice",
        "dd_report",
        "partner_agreement",
        "nda",
        "meeting_recording",
        "transcript",
        "photo",
        "correspondence",
        "other",
      ],
      kyc_status: ["not_started", "pending", "verified", "failed", "expired"],
      partner_type: [
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
        "other",
      ],
      risk_level: ["low", "medium", "high", "critical"],
      step_status: [
        "not_started",
        "in_progress",
        "blocked",
        "completed",
        "skipped",
      ],
      task_priority: ["low", "medium", "high", "urgent", "blocker"],
      task_status: ["todo", "in_progress", "review", "done", "cancelled"],
      task_type: ["action", "upload", "review", "approval", "automated"],
      value_path: [
        "fractional_securities",
        "tokenization",
        "debt_instruments",
        "evaluating",
      ],
      workflow_phase: [
        "phase_0_foundation",
        "phase_1_intake",
        "phase_2_certification",
        "phase_3_custody",
        "phase_4_legal",
        "phase_5_tokenization",
        "phase_6_regulatory",
        "phase_7_distribution",
        "phase_8_ongoing",
      ],
    },
  },
} as const
