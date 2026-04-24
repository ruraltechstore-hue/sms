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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      assignment_submissions: {
        Row: {
          assignment_id: string
          created_at: string
          id: string
          remarks: string | null
          score: number | null
          status: string
          student_id: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          assignment_id: string
          created_at?: string
          id?: string
          remarks?: string | null
          score?: number | null
          status?: string
          student_id: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          assignment_id?: string
          created_at?: string
          id?: string
          remarks?: string | null
          score?: number | null
          status?: string
          student_id?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          class_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          kind: string
          subject: string | null
          teacher_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          class_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          kind?: string
          subject?: string | null
          teacher_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          class_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          kind?: string
          subject?: string | null
          teacher_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          class_id: string | null
          created_at: string
          date: string
          id: string
          status: string
          student_id: string
          teacher_id: string | null
          updated_at: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          date?: string
          id?: string
          status: string
          student_id: string
          teacher_id?: string | null
          updated_at?: string
        }
        Update: {
          class_id?: string | null
          created_at?: string
          date?: string
          id?: string
          status?: string
          student_id?: string
          teacher_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      book_issues: {
        Row: {
          book_id: string
          created_at: string
          due_date: string | null
          fine: number
          id: string
          issue_date: string
          return_date: string | null
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          book_id: string
          created_at?: string
          due_date?: string | null
          fine?: number
          id?: string
          issue_date?: string
          return_date?: string | null
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          book_id?: string
          created_at?: string
          due_date?: string | null
          fine?: number
          id?: string
          issue_date?: string
          return_date?: string | null
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_issues_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string | null
          available_copies: number
          category: string | null
          created_at: string
          id: string
          isbn: string | null
          title: string
          total_copies: number
          updated_at: string
        }
        Insert: {
          author?: string | null
          available_copies?: number
          category?: string | null
          created_at?: string
          id?: string
          isbn?: string | null
          title: string
          total_copies?: number
          updated_at?: string
        }
        Update: {
          author?: string | null
          available_copies?: number
          category?: string | null
          created_at?: string
          id?: string
          isbn?: string | null
          title?: string
          total_copies?: number
          updated_at?: string
        }
        Relationships: []
      }
      classes: {
        Row: {
          class_teacher_id: string | null
          created_at: string
          id: string
          name: string
          section: string | null
          updated_at: string
        }
        Insert: {
          class_teacher_id?: string | null
          created_at?: string
          id?: string
          name: string
          section?: string | null
          updated_at?: string
        }
        Update: {
          class_teacher_id?: string | null
          created_at?: string
          id?: string
          name?: string
          section?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_class_teacher_id_fkey"
            columns: ["class_teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          created_at: string
          id: string
          license_no: string | null
          name: string
          phone: string | null
          updated_at: string
          vehicle: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          license_no?: string | null
          name: string
          phone?: string | null
          updated_at?: string
          vehicle?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          license_no?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
          vehicle?: string | null
        }
        Relationships: []
      }
      exams: {
        Row: {
          class_id: string | null
          created_at: string
          date: string
          id: string
          max_marks: number
          name: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          date: string
          id?: string
          max_marks?: number
          name: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          class_id?: string | null
          created_at?: string
          date?: string
          id?: string
          max_marks?: number
          name?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exams_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      fees: {
        Row: {
          amount: number
          created_at: string
          due_date: string | null
          fee_type: string
          id: string
          method: string | null
          paid_amount: number
          paid_date: string | null
          receipt_no: string | null
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date?: string | null
          fee_type?: string
          id?: string
          method?: string | null
          paid_amount?: number
          paid_date?: string | null
          receipt_no?: string | null
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string | null
          fee_type?: string
          id?: string
          method?: string | null
          paid_amount?: number
          paid_date?: string | null
          receipt_no?: string | null
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fees_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel: {
        Row: {
          attendance: Json
          created_at: string
          id: string
          room: string
          student_id: string
          updated_at: string
        }
        Insert: {
          attendance?: Json
          created_at?: string
          id?: string
          room: string
          student_id: string
          updated_at?: string
        }
        Update: {
          attendance?: Json
          created_at?: string
          id?: string
          room?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_rooms: {
        Row: {
          block: string | null
          capacity: number
          created_at: string
          id: string
          notes: string | null
          occupancy: number
          room_number: string
          updated_at: string
        }
        Insert: {
          block?: string | null
          capacity?: number
          created_at?: string
          id?: string
          notes?: string | null
          occupancy?: number
          room_number: string
          updated_at?: string
        }
        Update: {
          block?: string | null
          capacity?: number
          created_at?: string
          id?: string
          notes?: string | null
          occupancy?: number
          room_number?: string
          updated_at?: string
        }
        Relationships: []
      }
      library: {
        Row: {
          books_issued: Json
          created_at: string
          fines: number
          id: string
          student_id: string
          updated_at: string
        }
        Insert: {
          books_issued?: Json
          created_at?: string
          fines?: number
          id?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          books_issued?: Json
          created_at?: string
          fines?: number
          id?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "library_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      marks: {
        Row: {
          created_at: string
          exam_id: string | null
          id: string
          max_score: number
          score: number
          student_id: string
          subject: string
          teacher_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          exam_id?: string | null
          id?: string
          max_score?: number
          score: number
          student_id: string
          subject: string
          teacher_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          exam_id?: string | null
          id?: string
          max_score?: number
          score?: number
          student_id?: string
          subject?: string
          teacher_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marks_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marks_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          receiver_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          receiver_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      parents: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          admission_date: string | null
          class_id: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          parent_id: string | null
          phone: string | null
          roll_number: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admission_date?: string | null
          class_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          parent_id?: string | null
          phone?: string | null
          roll_number?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admission_date?: string | null
          class_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          phone?: string | null
          roll_number?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          subjects: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          subjects?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          subjects?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transport: {
        Row: {
          created_at: string
          id: string
          pickup_point: string | null
          route: string
          student_id: string
          updated_at: string
          vehicle: string
        }
        Insert: {
          created_at?: string
          id?: string
          pickup_point?: string | null
          route: string
          student_id: string
          updated_at?: string
          vehicle: string
        }
        Update: {
          created_at?: string
          id?: string
          pickup_point?: string | null
          route?: string
          student_id?: string
          updated_at?: string
          vehicle?: string
        }
        Relationships: [
          {
            foreignKeyName: "transport_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_class_teacher_of: {
        Args: { _class_id: string; _user_id: string }
        Returns: boolean
      }
      is_parent_of_student: {
        Args: { _student_id: string; _user_id: string }
        Returns: boolean
      }
      is_self_student: {
        Args: { _student_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "principal"
        | "sms_admin"
        | "front_desk"
        | "teacher"
        | "class_teacher"
        | "exam_coordinator"
        | "transport_manager"
        | "librarian"
        | "hostel_warden"
        | "student"
        | "parent"
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
      app_role: [
        "principal",
        "sms_admin",
        "front_desk",
        "teacher",
        "class_teacher",
        "exam_coordinator",
        "transport_manager",
        "librarian",
        "hostel_warden",
        "student",
        "parent",
      ],
    },
  },
} as const
