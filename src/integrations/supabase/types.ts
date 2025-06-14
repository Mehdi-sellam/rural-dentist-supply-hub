export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bundles: {
        Row: {
          badge: string | null
          bundle_price: string
          calculated_savings: number | null
          created_at: string | null
          description: string | null
          description_ar: string | null
          description_fr: string | null
          id: string
          items: string[]
          name: string
          name_ar: string | null
          name_fr: string | null
          original_price: string
          popular: boolean | null
          procedures: string | null
          savings: string | null
          sub_description: string | null
          updated_at: string | null
        }
        Insert: {
          badge?: string | null
          bundle_price: string
          calculated_savings?: number | null
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          description_fr?: string | null
          id?: string
          items?: string[]
          name: string
          name_ar?: string | null
          name_fr?: string | null
          original_price: string
          popular?: boolean | null
          procedures?: string | null
          savings?: string | null
          sub_description?: string | null
          updated_at?: string | null
        }
        Update: {
          badge?: string | null
          bundle_price?: string
          calculated_savings?: number | null
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          description_fr?: string | null
          id?: string
          items?: string[]
          name?: string
          name_ar?: string | null
          name_fr?: string | null
          original_price?: string
          popular?: boolean | null
          procedures?: string | null
          savings?: string | null
          sub_description?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cart_bundles: {
        Row: {
          bundle_id: string | null
          created_at: string | null
          id: string
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bundle_id?: string | null
          created_at?: string | null
          id?: string
          quantity?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bundle_id?: string | null
          created_at?: string | null
          id?: string
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_bundles_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_bundles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          description_ar: string | null
          description_fr: string | null
          icon: string | null
          icon_url: string | null
          id: string
          name: string
          name_ar: string | null
          name_fr: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          description_fr?: string | null
          icon?: string | null
          icon_url?: string | null
          id?: string
          name: string
          name_ar?: string | null
          name_fr: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          description_fr?: string | null
          icon?: string | null
          icon_url?: string | null
          id?: string
          name?: string
          name_ar?: string | null
          name_fr?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      order_bundles: {
        Row: {
          bundle_id: string | null
          bundle_name: string
          bundle_price: string
          created_at: string | null
          id: string
          order_id: string
          quantity: number
        }
        Insert: {
          bundle_id?: string | null
          bundle_name: string
          bundle_price: string
          created_at?: string | null
          id?: string
          order_id: string
          quantity?: number
        }
        Update: {
          bundle_id?: string | null
          bundle_name?: string
          bundle_price?: string
          created_at?: string | null
          id?: string
          order_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_bundles_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_bundles_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          product_id: string | null
          product_name: string
          product_price: number
          quantity: number
          subtotal: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          product_id?: string | null
          product_name: string
          product_price: number
          quantity?: number
          subtotal?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          product_price?: number
          quantity?: number
          subtotal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount_paid: number | null
          created_at: string | null
          delivery_date: string | null
          id: string
          notes: string | null
          partial_payment_history: Json | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          preferred_delivery_date: string | null
          remaining_balance: number | null
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          notes?: string | null
          partial_payment_history?: Json | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          preferred_delivery_date?: string | null
          remaining_balance?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number | null
          created_at?: string | null
          delivery_date?: string | null
          id?: string
          notes?: string | null
          partial_payment_history?: Json | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          preferred_delivery_date?: string | null
          remaining_balance?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_notifications: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          notes: string | null
          order_id: string | null
          payment_method: string
          processed_at: string | null
          processed_by: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_method: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string | null
          payment_method?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_notifications_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          badge: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          description_ar: string | null
          description_fr: string | null
          id: string
          image: string | null
          image_url: string | null
          in_stock: boolean | null
          name: string
          name_ar: string | null
          name_fr: string
          original_price: number | null
          price: number
          product_code: string
          product_id: string
          rating: number | null
          reviews: number | null
          specifications: string[] | null
          stock_status: boolean | null
          updated_at: string | null
        }
        Insert: {
          badge?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          description_fr?: string | null
          id?: string
          image?: string | null
          image_url?: string | null
          in_stock?: boolean | null
          name: string
          name_ar?: string | null
          name_fr: string
          original_price?: number | null
          price: number
          product_code: string
          product_id: string
          rating?: number | null
          reviews?: number | null
          specifications?: string[] | null
          stock_status?: boolean | null
          updated_at?: string | null
        }
        Update: {
          badge?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          description_fr?: string | null
          id?: string
          image?: string | null
          image_url?: string | null
          in_stock?: boolean | null
          name?: string
          name_ar?: string | null
          name_fr?: string
          original_price?: number | null
          price?: number
          product_code?: string
          product_id?: string
          rating?: number | null
          reviews?: number | null
          specifications?: string[] | null
          stock_status?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string
          created_at: string | null
          dental_office_name: string
          email: string
          full_name: string
          id: string
          is_admin: boolean | null
          phone: string
          updated_at: string | null
          wilaya: string
        }
        Insert: {
          address: string
          created_at?: string | null
          dental_office_name: string
          email: string
          full_name: string
          id: string
          is_admin?: boolean | null
          phone: string
          updated_at?: string | null
          wilaya: string
        }
        Update: {
          address?: string
          created_at?: string | null
          dental_office_name?: string
          email?: string
          full_name?: string
          id?: string
          is_admin?: boolean | null
          phone?: string
          updated_at?: string | null
          wilaya?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ensure_admin_profile: {
        Args: { admin_user_id: string; admin_email: string }
        Returns: undefined
      }
      is_current_user_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      order_status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled"
      payment_method: "cod" | "transfer" | "baridimob"
      payment_status: "pending" | "partial" | "paid" | "refunded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_method: ["cod", "transfer", "baridimob"],
      payment_status: ["pending", "partial", "paid", "refunded"],
    },
  },
} as const
