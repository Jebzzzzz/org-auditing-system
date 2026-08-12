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
    PostgrestVersion: "14.15"
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
      academic_periods: {
        Row: {
          academic_year: string
          created_at: string
          end_date: string | null
          id: string
          semester: Database["public"]["Enums"]["semester_type"]
          start_date: string | null
          status: Database["public"]["Enums"]["period_status"]
          updated_at: string
        }
        Insert: {
          academic_year: string
          created_at?: string
          end_date?: string | null
          id?: string
          semester: Database["public"]["Enums"]["semester_type"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["period_status"]
          updated_at?: string
        }
        Update: {
          academic_year?: string
          created_at?: string
          end_date?: string | null
          id?: string
          semester?: Database["public"]["Enums"]["semester_type"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["period_status"]
          updated_at?: string
        }
        Relationships: []
      }
      attachment_c_report_signatures: {
        Row: {
          id: string
          organization_id: string
          position_holder_id: string
          position_id: string
          report_version_id: string
          role: Database["public"]["Enums"]["position_role"]
          signed_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          position_holder_id: string
          position_id: string
          report_version_id: string
          role: Database["public"]["Enums"]["position_role"]
          signed_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          position_holder_id?: string
          position_id?: string
          report_version_id?: string
          role?: Database["public"]["Enums"]["position_role"]
          signed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachment_c_report_signature_position_holder_id_organizat_fkey"
            columns: ["position_holder_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "position_holders"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "attachment_c_report_signature_position_holder_id_position__fkey"
            columns: ["position_holder_id", "position_id"]
            isOneToOne: false
            referencedRelation: "position_holders"
            referencedColumns: ["id", "position_id"]
          },
          {
            foreignKeyName: "attachment_c_report_signature_report_version_id_organizati_fkey"
            columns: ["report_version_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "attachment_c_report_versions"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "attachment_c_report_signatures_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachment_c_report_signatures_position_id_organization_id_fkey"
            columns: ["position_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      attachment_c_report_versions: {
        Row: {
          generated_at: string
          generated_by_position_holder_id: string
          id: string
          organization_id: string
          pdf_path: string | null
          report_id: string
          snapshot_data: Json
          source_hash: string
          supersedes_version_id: string | null
          version_number: number
        }
        Insert: {
          generated_at?: string
          generated_by_position_holder_id: string
          id?: string
          organization_id: string
          pdf_path?: string | null
          report_id: string
          snapshot_data: Json
          source_hash: string
          supersedes_version_id?: string | null
          version_number: number
        }
        Update: {
          generated_at?: string
          generated_by_position_holder_id?: string
          id?: string
          organization_id?: string
          pdf_path?: string | null
          report_id?: string
          snapshot_data?: Json
          source_hash?: string
          supersedes_version_id?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "attachment_c_report_versions_generated_by_position_holder__fkey"
            columns: ["generated_by_position_holder_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "position_holders"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "attachment_c_report_versions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachment_c_report_versions_report_id_organization_id_fkey"
            columns: ["report_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "attachment_c_reports"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "attachment_c_report_versions_supersedes_fk"
            columns: ["supersedes_version_id", "report_id"]
            isOneToOne: false
            referencedRelation: "attachment_c_report_versions"
            referencedColumns: ["id", "report_id"]
          },
        ]
      }
      attachment_c_reports: {
        Row: {
          academic_period_id: string
          created_at: string
          created_by_position_holder_id: string
          current_version_id: string | null
          id: string
          organization_id: string
        }
        Insert: {
          academic_period_id: string
          created_at?: string
          created_by_position_holder_id: string
          current_version_id?: string | null
          id?: string
          organization_id: string
        }
        Update: {
          academic_period_id?: string
          created_at?: string
          created_by_position_holder_id?: string
          current_version_id?: string | null
          id?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachment_c_reports_academic_period_id_fkey"
            columns: ["academic_period_id"]
            isOneToOne: false
            referencedRelation: "academic_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachment_c_reports_created_by_position_holder_id_organiz_fkey"
            columns: ["created_by_position_holder_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "position_holders"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "attachment_c_reports_current_version_fk"
            columns: ["current_version_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "attachment_c_report_versions"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "attachment_c_reports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_position_holder_id: string | null
          actor_system_admin_id: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          organization_id: string | null
          reason: string | null
          request_id: string | null
        }
        Insert: {
          action: string
          actor_position_holder_id?: string | null
          actor_system_admin_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          organization_id?: string | null
          reason?: string | null
          request_id?: string | null
        }
        Update: {
          action?: string
          actor_position_holder_id?: string | null
          actor_system_admin_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          organization_id?: string | null
          reason?: string | null
          request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_position_holder_id_organization_id_fkey"
            columns: ["actor_position_holder_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "position_holders"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "audit_log_actor_system_admin_id_fkey"
            columns: ["actor_system_admin_id"]
            isOneToOne: false
            referencedRelation: "system_admins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string
          created_at: string
          faculty_id: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          faculty_id: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          faculty_id?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculties"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          academic_period_id: string
          created_at: string
          created_by_position_holder_id: string
          end_date: string | null
          id: string
          organization_id: string
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          academic_period_id: string
          created_at?: string
          created_by_position_holder_id: string
          end_date?: string | null
          id?: string
          organization_id: string
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          academic_period_id?: string
          created_at?: string
          created_by_position_holder_id?: string
          end_date?: string | null
          id?: string
          organization_id?: string
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_academic_period_id_fkey"
            columns: ["academic_period_id"]
            isOneToOne: false
            referencedRelation: "academic_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_created_by_position_holder_id_organization_id_fkey"
            columns: ["created_by_position_holder_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "position_holders"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      faculties: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      fund_transfers: {
        Row: {
          academic_period_id: string
          amount: number
          created_at: string
          created_by_position_holder_id: string
          description: string | null
          from_fund_source: Database["public"]["Enums"]["fund_source"]
          id: string
          organization_id: string
          reference: string
          status: Database["public"]["Enums"]["financial_status"]
          to_fund_source: Database["public"]["Enums"]["fund_source"]
          transfer_date: string
          updated_at: string
          void_reason: string | null
          voided_at: string | null
          voided_by_position_holder_id: string | null
        }
        Insert: {
          academic_period_id: string
          amount: number
          created_at?: string
          created_by_position_holder_id: string
          description?: string | null
          from_fund_source: Database["public"]["Enums"]["fund_source"]
          id?: string
          organization_id: string
          reference: string
          status?: Database["public"]["Enums"]["financial_status"]
          to_fund_source: Database["public"]["Enums"]["fund_source"]
          transfer_date: string
          updated_at?: string
          void_reason?: string | null
          voided_at?: string | null
          voided_by_position_holder_id?: string | null
        }
        Update: {
          academic_period_id?: string
          amount?: number
          created_at?: string
          created_by_position_holder_id?: string
          description?: string | null
          from_fund_source?: Database["public"]["Enums"]["fund_source"]
          id?: string
          organization_id?: string
          reference?: string
          status?: Database["public"]["Enums"]["financial_status"]
          to_fund_source?: Database["public"]["Enums"]["fund_source"]
          transfer_date?: string
          updated_at?: string
          void_reason?: string | null
          voided_at?: string | null
          voided_by_position_holder_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fund_transfers_academic_period_id_fkey"
            columns: ["academic_period_id"]
            isOneToOne: false
            referencedRelation: "academic_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fund_transfers_created_by_position_holder_id_organization__fkey"
            columns: ["created_by_position_holder_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "position_holders"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "fund_transfers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fund_transfers_voided_by_position_holder_id_organization_i_fkey"
            columns: ["voided_by_position_holder_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "position_holders"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      handover_requests: {
        Row: {
          completed_at: string | null
          id: string
          incoming_profile_id: string
          initiated_at: string
          initiated_by_position_holder_id: string
          organization_id: string
          outgoing_holder_id: string
          position_id: string
          reason: string | null
          reviewed_at: string | null
          reviewed_by_system_admin_id: string | null
          status: Database["public"]["Enums"]["handover_status"]
        }
        Insert: {
          completed_at?: string | null
          id?: string
          incoming_profile_id: string
          initiated_at?: string
          initiated_by_position_holder_id: string
          organization_id: string
          outgoing_holder_id: string
          position_id: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by_system_admin_id?: string | null
          status?: Database["public"]["Enums"]["handover_status"]
        }
        Update: {
          completed_at?: string | null
          id?: string
          incoming_profile_id?: string
          initiated_at?: string
          initiated_by_position_holder_id?: string
          organization_id?: string
          outgoing_holder_id?: string
          position_id?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by_system_admin_id?: string | null
          status?: Database["public"]["Enums"]["handover_status"]
        }
        Relationships: [
          {
            foreignKeyName: "handover_requests_incoming_profile_id_fkey"
            columns: ["incoming_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "handover_requests_initiated_by_position_holder_id_organiza_fkey"
            columns: ["initiated_by_position_holder_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "position_holders"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "handover_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "handover_requests_outgoing_holder_id_organization_id_fkey"
            columns: ["outgoing_holder_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "position_holders"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "handover_requests_position_id_organization_id_fkey"
            columns: ["position_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "handover_requests_reviewed_by_system_admin_id_fkey"
            columns: ["reviewed_by_system_admin_id"]
            isOneToOne: false
            referencedRelation: "system_admins"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          department_id: string
          id: string
          name: string
          status: Database["public"]["Enums"]["organization_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["organization_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["organization_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      period_opening_balances: {
        Row: {
          academic_period_id: string
          bank_balance: number
          cash_on_hand_balance: number
          created_at: string
          entered_by_position_holder_id: string
          id: string
          organization_id: string
          update_reason: string | null
          updated_at: string
          updated_by_position_holder_id: string | null
        }
        Insert: {
          academic_period_id: string
          bank_balance: number
          cash_on_hand_balance: number
          created_at?: string
          entered_by_position_holder_id: string
          id?: string
          organization_id: string
          update_reason?: string | null
          updated_at?: string
          updated_by_position_holder_id?: string | null
        }
        Update: {
          academic_period_id?: string
          bank_balance?: number
          cash_on_hand_balance?: number
          created_at?: string
          entered_by_position_holder_id?: string
          id?: string
          organization_id?: string
          update_reason?: string | null
          updated_at?: string
          updated_by_position_holder_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "period_opening_balances_academic_period_id_fkey"
            columns: ["academic_period_id"]
            isOneToOne: false
            referencedRelation: "academic_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "period_opening_balances_entered_by_position_holder_id_orga_fkey"
            columns: ["entered_by_position_holder_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "position_holders"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "period_opening_balances_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "period_opening_balances_updated_by_position_holder_id_orga_fkey"
            columns: ["updated_by_position_holder_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "position_holders"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      position_holders: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          organization_id: string
          position_id: string
          profile_id: string
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          organization_id: string
          position_id: string
          profile_id: string
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          organization_id?: string
          position_id?: string
          profile_id?: string
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "position_holders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "position_holders_position_id_organization_id_fkey"
            columns: ["position_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "position_holders_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          auth_user_id: string
          created_at: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["position_role"]
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          id?: string
          organization_id: string
          role: Database["public"]["Enums"]["position_role"]
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["position_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_admins: {
        Row: {
          auth_user_id: string
          created_at: string
          id: string
          profile_id: string | null
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          id?: string
          profile_id?: string | null
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          id?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_admins_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_revisions: {
        Row: {
          after_data: Json
          before_data: Json
          change_reason: string
          changed_at: string
          changed_by_position_holder_id: string
          id: string
          organization_id: string
          revision_number: number
          transaction_id: string
        }
        Insert: {
          after_data: Json
          before_data: Json
          change_reason: string
          changed_at?: string
          changed_by_position_holder_id: string
          id?: string
          organization_id: string
          revision_number: number
          transaction_id: string
        }
        Update: {
          after_data?: Json
          before_data?: Json
          change_reason?: string
          changed_at?: string
          changed_by_position_holder_id?: string
          id?: string
          organization_id?: string
          revision_number?: number
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_revisions_changed_by_position_holder_id_organi_fkey"
            columns: ["changed_by_position_holder_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "position_holders"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "transaction_revisions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_revisions_transaction_id_organization_id_fkey"
            columns: ["transaction_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      transactions: {
        Row: {
          academic_period_id: string
          amount: number
          category_id: string | null
          created_at: string
          created_by_position_holder_id: string
          description: string | null
          event_id: string | null
          fund_source: Database["public"]["Enums"]["fund_source"]
          id: string
          item_details: string
          organization_id: string
          quantity: number | null
          reference: string
          status: Database["public"]["Enums"]["financial_status"]
          transaction_date: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          unit_price: number | null
          updated_at: string
          void_reason: string | null
          voided_at: string | null
          voided_by_position_holder_id: string | null
          voucher_number: string
          voucher_sequence: number
        }
        Insert: {
          academic_period_id: string
          amount: number
          category_id?: string | null
          created_at?: string
          created_by_position_holder_id: string
          description?: string | null
          event_id?: string | null
          fund_source: Database["public"]["Enums"]["fund_source"]
          id?: string
          item_details: string
          organization_id: string
          quantity?: number | null
          reference: string
          status?: Database["public"]["Enums"]["financial_status"]
          transaction_date: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          unit_price?: number | null
          updated_at?: string
          void_reason?: string | null
          voided_at?: string | null
          voided_by_position_holder_id?: string | null
          voucher_number: string
          voucher_sequence: number
        }
        Update: {
          academic_period_id?: string
          amount?: number
          category_id?: string | null
          created_at?: string
          created_by_position_holder_id?: string
          description?: string | null
          event_id?: string | null
          fund_source?: Database["public"]["Enums"]["fund_source"]
          id?: string
          item_details?: string
          organization_id?: string
          quantity?: number | null
          reference?: string
          status?: Database["public"]["Enums"]["financial_status"]
          transaction_date?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          unit_price?: number | null
          updated_at?: string
          void_reason?: string | null
          voided_at?: string | null
          voided_by_position_holder_id?: string | null
          voucher_number?: string
          voucher_sequence?: number
        }
        Relationships: [
          {
            foreignKeyName: "transactions_academic_period_id_fkey"
            columns: ["academic_period_id"]
            isOneToOne: false
            referencedRelation: "academic_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_organization_id_fkey"
            columns: ["category_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "transactions_created_by_position_holder_id_organization_id_fkey"
            columns: ["created_by_position_holder_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "position_holders"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "transactions_event_id_organization_id_fkey"
            columns: ["event_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id", "organization_id"]
          },
          {
            foreignKeyName: "transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_voided_by_position_holder_id_organization_id_fkey"
            columns: ["voided_by_position_holder_id", "organization_id"]
            isOneToOne: false
            referencedRelation: "position_holders"
            referencedColumns: ["id", "organization_id"]
          },
        ]
      }
      voucher_sequences: {
        Row: {
          academic_year: string
          last_number: number
          organization_id: string
        }
        Insert: {
          academic_year: string
          last_number?: number
          organization_id: string
        }
        Update: {
          academic_year?: string
          last_number?: number
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "voucher_sequences_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      financial_status: "posted" | "voided"
      fund_source: "bank" | "cash_on_hand"
      handover_status:
        | "pending"
        | "approved"
        | "completed"
        | "rejected"
        | "cancelled"
      organization_status: "active" | "inactive"
      period_status: "open" | "closed" | "archived"
      position_role: "treasurer" | "auditor" | "president"
      semester_type: "first_semester" | "second_semester"
      transaction_type: "income" | "expense"
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
      financial_status: ["posted", "voided"],
      fund_source: ["bank", "cash_on_hand"],
      handover_status: [
        "pending",
        "approved",
        "completed",
        "rejected",
        "cancelled",
      ],
      organization_status: ["active", "inactive"],
      period_status: ["open", "closed", "archived"],
      position_role: ["treasurer", "auditor", "president"],
      semester_type: ["first_semester", "second_semester"],
      transaction_type: ["income", "expense"],
    },
  },
} as const
