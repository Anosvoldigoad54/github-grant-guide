// Comprehensive HRM Database Schema and Types
// Generated for Arise HRM System

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // ========================================
      // USER MANAGEMENT
      // ========================================
      user_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          first_name: string
          last_name: string
          employee_id: string
          phone: string | null
          profile_photo_url: string | null
          date_of_birth: string | null
          gender: 'male' | 'female' | 'other' | null
          address: Json | null
          emergency_contact: Json | null
          department_id: string | null
          position_id: string | null
          role_id: string | null
          manager_id: string | null
          hire_date: string
          employment_type: 'full_time' | 'part_time' | 'contract' | 'intern'
          status: 'active' | 'inactive' | 'on_leave' | 'terminated'
          salary: number | null
          salary_currency: string
          location: string | null
          time_zone: string | null
          skills: string[] | null
          languages: string[] | null
          qualifications: Json | null
          is_active: boolean
          last_login: string | null
          preferences: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          first_name: string
          last_name: string
          employee_id: string
          phone?: string | null
          profile_photo_url?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | null
          address?: Json | null
          emergency_contact?: Json | null
          department_id?: string | null
          position_id?: string | null
          role_id?: string | null
          manager_id?: string | null
          hire_date: string
          employment_type?: 'full_time' | 'part_time' | 'contract' | 'intern'
          status?: 'active' | 'inactive' | 'on_leave' | 'terminated'
          salary?: number | null
          salary_currency?: string
          location?: string | null
          time_zone?: string | null
          skills?: string[] | null
          languages?: string[] | null
          qualifications?: Json | null
          is_active?: boolean
          last_login?: string | null
          preferences?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          first_name?: string
          last_name?: string
          employee_id?: string
          phone?: string | null
          profile_photo_url?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | null
          address?: Json | null
          emergency_contact?: Json | null
          department_id?: string | null
          position_id?: string | null
          role_id?: string | null
          manager_id?: string | null
          hire_date?: string
          employment_type?: 'full_time' | 'part_time' | 'contract' | 'intern'
          status?: 'active' | 'inactive' | 'on_leave' | 'terminated'
          salary?: number | null
          salary_currency?: string
          location?: string | null
          time_zone?: string | null
          skills?: string[] | null
          languages?: string[] | null
          qualifications?: Json | null
          is_active?: boolean
          last_login?: string | null
          preferences?: Json | null
        }
      }

      // ========================================
      // ORGANIZATIONAL STRUCTURE
      // ========================================
      departments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          code: string
          description: string | null
          parent_department_id: string | null
          manager_id: string | null
          budget: number | null
          location: string | null
          is_active: boolean
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          code: string
          description?: string | null
          parent_department_id?: string | null
          manager_id?: string | null
          budget?: number | null
          location?: string | null
          is_active?: boolean
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          code?: string
          description?: string | null
          parent_department_id?: string | null
          manager_id?: string | null
          budget?: number | null
          location?: string | null
          is_active?: boolean
          metadata?: Json | null
        }
      }

      positions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          code: string
          description: string | null
          department_id: string | null
          level: number
          min_salary: number | null
          max_salary: number | null
          required_skills: string[] | null
          qualifications: string[] | null
          responsibilities: string[] | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          code: string
          description?: string | null
          department_id?: string | null
          level?: number
          min_salary?: number | null
          max_salary?: number | null
          required_skills?: string[] | null
          qualifications?: string[] | null
          responsibilities?: string[] | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          code?: string
          description?: string | null
          department_id?: string | null
          level?: number
          min_salary?: number | null
          max_salary?: number | null
          required_skills?: string[] | null
          qualifications?: string[] | null
          responsibilities?: string[] | null
          is_active?: boolean
        }
      }

      // ========================================
      // ROLES & PERMISSIONS
      // ========================================
      roles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          display_name: string
          description: string | null
          level: number
          is_system_role: boolean
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          display_name: string
          description?: string | null
          level?: number
          is_system_role?: boolean
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          display_name?: string
          description?: string | null
          level?: number
          is_system_role?: boolean
          is_active?: boolean
        }
      }

      permissions: {
        Row: {
          id: string
          created_at: string
          name: string
          display_name: string
          description: string | null
          resource: string
          action: string
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          display_name: string
          description?: string | null
          resource: string
          action: string
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          display_name?: string
          description?: string | null
          resource?: string
          action?: string
          is_active?: boolean
        }
      }

      role_permissions: {
        Row: {
          id: string
          created_at: string
          role_id: string
          permission_id: string
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          role_id: string
          permission_id: string
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          role_id?: string
          permission_id?: string
          is_active?: boolean
        }
      }

      // ========================================
      // ATTENDANCE MANAGEMENT
      // ========================================
      attendance_records: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          employee_id: string
          date: string
          check_in: string | null
          check_out: string | null
          break_start: string | null
          break_end: string | null
          total_hours: number | null
          overtime_hours: number | null
          status: 'present' | 'absent' | 'late' | 'half_day' | 'holiday' | 'weekend'
          location_check_in: Json | null
          location_check_out: Json | null
          ip_address: string | null
          device_info: Json | null
          photos: Json | null
          notes: string | null
          approved_by: string | null
          approved_at: string | null
          is_correction: boolean
          correction_reason: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          employee_id: string
          date: string
          check_in?: string | null
          check_out?: string | null
          break_start?: string | null
          break_end?: string | null
          total_hours?: number | null
          overtime_hours?: number | null
          status?: 'present' | 'absent' | 'late' | 'half_day' | 'holiday' | 'weekend'
          location_check_in?: Json | null
          location_check_out?: Json | null
          ip_address?: string | null
          device_info?: Json | null
          photos?: Json | null
          notes?: string | null
          approved_by?: string | null
          approved_at?: string | null
          is_correction?: boolean
          correction_reason?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          employee_id?: string
          date?: string
          check_in?: string | null
          check_out?: string | null
          break_start?: string | null
          break_end?: string | null
          total_hours?: number | null
          overtime_hours?: number | null
          status?: 'present' | 'absent' | 'late' | 'half_day' | 'holiday' | 'weekend'
          location_check_in?: Json | null
          location_check_out?: Json | null
          ip_address?: string | null
          device_info?: Json | null
          photos?: Json | null
          notes?: string | null
          approved_by?: string | null
          approved_at?: string | null
          is_correction?: boolean
          correction_reason?: string | null
        }
      }

      work_schedules: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          employee_id: string
          day_of_week: number
          start_time: string
          end_time: string
          break_duration: number
          is_working_day: boolean
          is_flexible: boolean
          timezone: string | null
          effective_from: string
          effective_to: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          employee_id: string
          day_of_week: number
          start_time: string
          end_time: string
          break_duration?: number
          is_working_day?: boolean
          is_flexible?: boolean
          timezone?: string | null
          effective_from: string
          effective_to?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          employee_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          break_duration?: number
          is_working_day?: boolean
          is_flexible?: boolean
          timezone?: string | null
          effective_from?: string
          effective_to?: string | null
        }
      }

      // ========================================
      // LEAVE MANAGEMENT
      // ========================================
      leave_types: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          code: string
          description: string | null
          annual_allocation: number
          is_paid: boolean
          requires_approval: boolean
          max_consecutive_days: number | null
          advance_notice_days: number
          carry_forward_allowed: boolean
          carry_forward_limit: number | null
          is_active: boolean
          color: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          code: string
          description?: string | null
          annual_allocation?: number
          is_paid?: boolean
          requires_approval?: boolean
          max_consecutive_days?: number | null
          advance_notice_days?: number
          carry_forward_allowed?: boolean
          carry_forward_limit?: number | null
          is_active?: boolean
          color?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          code?: string
          description?: string | null
          annual_allocation?: number
          is_paid?: boolean
          requires_approval?: boolean
          max_consecutive_days?: number | null
          advance_notice_days?: number
          carry_forward_allowed?: boolean
          carry_forward_limit?: number | null
          is_active?: boolean
          color?: string | null
        }
      }

      leave_requests: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          employee_id: string
          leave_type_id: string
          start_date: string
          end_date: string
          days_requested: number
          reason: string
          status: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled'
          applied_date: string
          reviewed_by: string | null
          reviewed_at: string | null
          rejection_reason: string | null
          documents: Json | null
          handover_notes: string | null
          emergency_contact: Json | null
          is_half_day: boolean
          half_day_period: 'morning' | 'afternoon' | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          employee_id: string
          leave_type_id: string
          start_date: string
          end_date: string
          days_requested: number
          reason: string
          status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled'
          applied_date?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          rejection_reason?: string | null
          documents?: Json | null
          handover_notes?: string | null
          emergency_contact?: Json | null
          is_half_day?: boolean
          half_day_period?: 'morning' | 'afternoon' | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          employee_id?: string
          leave_type_id?: string
          start_date?: string
          end_date?: string
          days_requested?: number
          reason?: string
          status?: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled'
          applied_date?: string
          reviewed_by?: string | null
          reviewed_at?: string | null
          rejection_reason?: string | null
          documents?: Json | null
          handover_notes?: string | null
          emergency_contact?: Json | null
          is_half_day?: boolean
          half_day_period?: 'morning' | 'afternoon' | null
        }
      }

      leave_balances: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          employee_id: string
          leave_type_id: string
          year: number
          allocated_days: number
          used_days: number
          pending_days: number
          carried_forward: number
          expires_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          employee_id: string
          leave_type_id: string
          year: number
          allocated_days: number
          used_days?: number
          pending_days?: number
          carried_forward?: number
          expires_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          employee_id?: string
          leave_type_id?: string
          year?: number
          allocated_days?: number
          used_days?: number
          pending_days?: number
          carried_forward?: number
          expires_at?: string | null
        }
      }

      // ========================================
      // PERFORMANCE MANAGEMENT
      // ========================================
      performance_reviews: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          employee_id: string
          reviewer_id: string
          review_period_start: string
          review_period_end: string
          review_type: 'annual' | 'quarterly' | 'monthly' | 'project' | '360'
          status: 'draft' | 'in_progress' | 'completed' | 'approved'
          overall_rating: number | null
          goals_achievement: number | null
          competency_rating: Json | null
          strengths: string | null
          improvement_areas: string | null
          development_plan: Json | null
          comments: string | null
          employee_comments: string | null
          approved_by: string | null
          approved_at: string | null
          due_date: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          employee_id: string
          reviewer_id: string
          review_period_start: string
          review_period_end: string
          review_type: 'annual' | 'quarterly' | 'monthly' | 'project' | '360'
          status?: 'draft' | 'in_progress' | 'completed' | 'approved'
          overall_rating?: number | null
          goals_achievement?: number | null
          competency_rating?: Json | null
          strengths?: string | null
          improvement_areas?: string | null
          development_plan?: Json | null
          comments?: string | null
          employee_comments?: string | null
          approved_by?: string | null
          approved_at?: string | null
          due_date?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          employee_id?: string
          reviewer_id?: string
          review_period_start?: string
          review_period_end?: string
          review_type?: 'annual' | 'quarterly' | 'monthly' | 'project' | '360'
          status?: 'draft' | 'in_progress' | 'completed' | 'approved'
          overall_rating?: number | null
          goals_achievement?: number | null
          competency_rating?: Json | null
          strengths?: string | null
          improvement_areas?: string | null
          development_plan?: Json | null
          comments?: string | null
          employee_comments?: string | null
          approved_by?: string | null
          approved_at?: string | null
          due_date?: string | null
        }
      }

      goals: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          employee_id: string
          title: string
          description: string | null
          category: 'individual' | 'team' | 'company'
          priority: 'low' | 'medium' | 'high' | 'critical'
          status: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
          progress: number
          target_date: string
          completion_date: string | null
          metrics: Json | null
          created_by: string
          assigned_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          employee_id: string
          title: string
          description?: string | null
          category: 'individual' | 'team' | 'company'
          priority: 'low' | 'medium' | 'high' | 'critical'
          status?: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
          progress?: number
          target_date: string
          completion_date?: string | null
          metrics?: Json | null
          created_by: string
          assigned_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          employee_id?: string
          title?: string
          description?: string | null
          category?: 'individual' | 'team' | 'company'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'not_started' | 'in_progress' | 'completed' | 'cancelled'
          progress?: number
          target_date?: string
          completion_date?: string | null
          metrics?: Json | null
          created_by?: string
          assigned_by?: string | null
        }
      }

      // ========================================
      // PAYROLL MANAGEMENT
      // ========================================
      payroll_records: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          employee_id: string
          period_start: string
          period_end: string
          basic_salary: number
          allowances: Json | null
          deductions: Json | null
          overtime_amount: number
          gross_salary: number
          tax_deduction: number
          net_salary: number
          status: 'draft' | 'calculated' | 'approved' | 'paid'
          payment_date: string | null
          payment_method: string | null
          payment_reference: string | null
          processed_by: string | null
          approved_by: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          employee_id: string
          period_start: string
          period_end: string
          basic_salary: number
          allowances?: Json | null
          deductions?: Json | null
          overtime_amount?: number
          gross_salary: number
          tax_deduction: number
          net_salary: number
          status?: 'draft' | 'calculated' | 'approved' | 'paid'
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          processed_by?: string | null
          approved_by?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          employee_id?: string
          period_start?: string
          period_end?: string
          basic_salary?: number
          allowances?: Json | null
          deductions?: Json | null
          overtime_amount?: number
          gross_salary?: number
          tax_deduction?: number
          net_salary?: number
          status?: 'draft' | 'calculated' | 'approved' | 'paid'
          payment_date?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          processed_by?: string | null
          approved_by?: string | null
          notes?: string | null
        }
      }

      // ========================================
      // SYSTEM & AUDIT
      // ========================================
      audit_logs: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string | null
          action?: string
          resource_type?: string
          resource_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          metadata?: Json | null
        }
      }

      notifications: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          recipient_id: string
          sender_id: string | null
          type: string
          title: string
          message: string
          data: Json | null
          read_at: string | null
          is_read: boolean
          priority: 'low' | 'medium' | 'high' | 'urgent'
          expires_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          recipient_id: string
          sender_id?: string | null
          type: string
          title: string
          message: string
          data?: Json | null
          read_at?: string | null
          is_read?: boolean
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          expires_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          recipient_id?: string
          sender_id?: string | null
          type?: string
          title?: string
          message?: string
          data?: Json | null
          read_at?: string | null
          is_read?: boolean
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          expires_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
