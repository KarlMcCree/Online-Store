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
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          error_message: string | null
          ip_address: unknown
          log_id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          request_method: string | null
          request_url: string | null
          status_code: number | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          error_message?: string | null
          ip_address?: unknown
          log_id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          request_method?: string | null
          request_url?: string | null
          status_code?: number | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          error_message?: string | null
          ip_address?: unknown
          log_id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          request_method?: string | null
          request_url?: string | null
          status_code?: number | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      blog_comments: {
        Row: {
          author_email: string | null
          author_name: string | null
          comment_id: string
          content: string
          created_at: string | null
          ip_address: unknown
          is_approved: boolean | null
          is_spam: boolean | null
          likes: number | null
          parent_comment_id: string | null
          post_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          author_email?: string | null
          author_name?: string | null
          comment_id?: string
          content: string
          created_at?: string | null
          ip_address?: unknown
          is_approved?: boolean | null
          is_spam?: boolean | null
          likes?: number | null
          parent_comment_id?: string | null
          post_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          author_email?: string | null
          author_name?: string | null
          comment_id?: string
          content?: string
          created_at?: string | null
          ip_address?: unknown
          is_approved?: boolean | null
          is_spam?: boolean | null
          likes?: number | null
          parent_comment_id?: string | null
          post_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "blog_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "blog_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "blog_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          allow_comments: boolean | null
          author_id: string | null
          category: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          is_featured: boolean | null
          is_published: boolean | null
          likes: number | null
          post_id: string
          published_at: string | null
          reading_time: number | null
          search_vector: unknown
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          shares: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          allow_comments?: boolean | null
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          likes?: number | null
          post_id?: string
          published_at?: string | null
          reading_time?: number | null
          search_vector?: unknown
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          shares?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          allow_comments?: boolean | null
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          likes?: number | null
          post_id?: string
          published_at?: string | null
          reading_time?: number | null
          search_vector?: unknown
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          shares?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      carts: {
        Row: {
          cart_id: string
          coupon_code: string | null
          created_at: string | null
          items: Json
          last_activity: string | null
          session_id: string | null
          total: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cart_id?: string
          coupon_code?: string | null
          created_at?: string | null
          items?: Json
          last_activity?: string | null
          session_id?: string | null
          total?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cart_id?: string
          coupon_code?: string | null
          created_at?: string | null
          items?: Json
          last_activity?: string | null
          session_id?: string | null
          total?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      categories: {
        Row: {
          category_id: string
          created_at: string | null
          description: string | null
          display_order: number | null
          icon_class: string | null
          image_url: string | null
          is_active: boolean | null
          meta_description: string | null
          meta_title: string | null
          name: string
          parent_category_id: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_class?: string | null
          image_url?: string | null
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          parent_category_id?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_class?: string | null
          image_url?: string | null
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          parent_category_id?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
      consultations: {
        Row: {
          cancellation_reason: string | null
          consultant_id: string | null
          consultation_id: string
          consultation_type: string | null
          created_at: string | null
          customer_feedback: string | null
          customer_rating: number | null
          duration_minutes: number | null
          follow_up_actions: string | null
          meeting_provider: string | null
          meeting_url: string | null
          notes: string | null
          recording_url: string | null
          rescheduled_from: string | null
          scheduled_at: string
          service_order_id: string
          status: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancellation_reason?: string | null
          consultant_id?: string | null
          consultation_id?: string
          consultation_type?: string | null
          created_at?: string | null
          customer_feedback?: string | null
          customer_rating?: number | null
          duration_minutes?: number | null
          follow_up_actions?: string | null
          meeting_provider?: string | null
          meeting_url?: string | null
          notes?: string | null
          recording_url?: string | null
          rescheduled_from?: string | null
          scheduled_at: string
          service_order_id: string
          status?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancellation_reason?: string | null
          consultant_id?: string | null
          consultation_id?: string
          consultation_type?: string | null
          created_at?: string | null
          customer_feedback?: string | null
          customer_rating?: number | null
          duration_minutes?: number | null
          follow_up_actions?: string | null
          meeting_provider?: string | null
          meeting_url?: string | null
          notes?: string | null
          recording_url?: string | null
          rescheduled_from?: string | null
          scheduled_at?: string
          service_order_id?: string
          status?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultations_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "consultations_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "consultations_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "consultations_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["service_order_id"]
          },
          {
            foreignKeyName: "consultations_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "v_service_pipeline"
            referencedColumns: ["service_order_id"]
          },
          {
            foreignKeyName: "consultations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "consultations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "consultations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      coupons: {
        Row: {
          applicable_category_ids: string[] | null
          applicable_product_ids: string[] | null
          applicable_to: string | null
          code: string
          coupon_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          discount_type: string
          discount_value: number
          end_date: string
          is_active: boolean | null
          is_public: boolean | null
          maximum_discount: number | null
          minimum_spend: number | null
          start_date: string
          updated_at: string | null
          usage_limit_per_coupon: number | null
          usage_limit_per_user: number | null
          used_count: number | null
        }
        Insert: {
          applicable_category_ids?: string[] | null
          applicable_product_ids?: string[] | null
          applicable_to?: string | null
          code: string
          coupon_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_type: string
          discount_value: number
          end_date: string
          is_active?: boolean | null
          is_public?: boolean | null
          maximum_discount?: number | null
          minimum_spend?: number | null
          start_date?: string
          updated_at?: string | null
          usage_limit_per_coupon?: number | null
          usage_limit_per_user?: number | null
          used_count?: number | null
        }
        Update: {
          applicable_category_ids?: string[] | null
          applicable_product_ids?: string[] | null
          applicable_to?: string | null
          code?: string
          coupon_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          end_date?: string
          is_active?: boolean | null
          is_public?: boolean | null
          maximum_discount?: number | null
          minimum_spend?: number | null
          start_date?: string
          updated_at?: string | null
          usage_limit_per_coupon?: number | null
          usage_limit_per_user?: number | null
          used_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "coupons_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "coupons_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      customer_downloads: {
        Row: {
          created_at: string | null
          digital_product_id: string
          download_count: number | null
          download_record_id: string
          download_token: string | null
          expires_at: string | null
          first_downloaded_at: string | null
          ip_address: unknown
          last_downloaded_at: string | null
          order_item_id: string
          product_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          digital_product_id: string
          download_count?: number | null
          download_record_id?: string
          download_token?: string | null
          expires_at?: string | null
          first_downloaded_at?: string | null
          ip_address?: unknown
          last_downloaded_at?: string | null
          order_item_id: string
          product_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          digital_product_id?: string
          download_count?: number | null
          download_record_id?: string
          download_token?: string | null
          expires_at?: string | null
          first_downloaded_at?: string | null
          ip_address?: unknown
          last_downloaded_at?: string | null
          order_item_id?: string
          product_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_downloads_digital_product_id_fkey"
            columns: ["digital_product_id"]
            isOneToOne: false
            referencedRelation: "digital_products"
            referencedColumns: ["digital_product_id"]
          },
          {
            foreignKeyName: "customer_downloads_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "customer_downloads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "customer_downloads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_inventory_status"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "customer_downloads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_popular_products_by_country"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "customer_downloads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_performance"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "customer_downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      customer_interactions: {
        Row: {
          created_at: string | null
          interaction_id: string
          interaction_type: string | null
          notes: string | null
          staff_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          interaction_id?: string
          interaction_type?: string | null
          notes?: string | null
          staff_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          interaction_id?: string
          interaction_type?: string | null
          notes?: string | null
          staff_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_interactions_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_interactions_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_interactions_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      customer_profiles: {
        Row: {
          analytics: Json | null
          created_at: string | null
          engagement_score: number | null
          last_email_open: string | null
          last_social_interaction: string | null
          last_website_visit: string | null
          lifetime_value: number | null
          preferences: Json | null
          profile_history: Json[] | null
          profile_id: string
          segment: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          analytics?: Json | null
          created_at?: string | null
          engagement_score?: number | null
          last_email_open?: string | null
          last_social_interaction?: string | null
          last_website_visit?: string | null
          lifetime_value?: number | null
          preferences?: Json | null
          profile_history?: Json[] | null
          profile_id?: string
          segment?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          analytics?: Json | null
          created_at?: string | null
          engagement_score?: number | null
          last_email_open?: string | null
          last_social_interaction?: string | null
          last_website_visit?: string | null
          lifetime_value?: number | null
          preferences?: Json | null
          profile_history?: Json[] | null
          profile_id?: string
          segment?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "customer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      digital_products: {
        Row: {
          access_limit: number | null
          created_at: string | null
          digital_product_id: string
          enable_drm: boolean | null
          expiry_days: number | null
          file_hash: string | null
          file_mime_type: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          is_current_version: boolean | null
          max_downloads: number | null
          product_id: string
          require_login: boolean | null
          updated_at: string | null
          version_number: string | null
          watermark_text: string | null
        }
        Insert: {
          access_limit?: number | null
          created_at?: string | null
          digital_product_id?: string
          enable_drm?: boolean | null
          expiry_days?: number | null
          file_hash?: string | null
          file_mime_type?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          is_current_version?: boolean | null
          max_downloads?: number | null
          product_id: string
          require_login?: boolean | null
          updated_at?: string | null
          version_number?: string | null
          watermark_text?: string | null
        }
        Update: {
          access_limit?: number | null
          created_at?: string | null
          digital_product_id?: string
          enable_drm?: boolean | null
          expiry_days?: number | null
          file_hash?: string | null
          file_mime_type?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          is_current_version?: boolean | null
          max_downloads?: number | null
          product_id?: string
          require_login?: boolean | null
          updated_at?: string | null
          version_number?: string | null
          watermark_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "digital_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_inventory_status"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "digital_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_popular_products_by_country"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "digital_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_performance"
            referencedColumns: ["product_id"]
          },
        ]
      }
      document_requests: {
        Row: {
          created_at: string | null
          deadline: string | null
          description: string | null
          document_name: string
          document_request_id: string
          file_name: string | null
          file_size: number | null
          file_url: string | null
          is_required: boolean | null
          rejection_reason: string | null
          requested_by: string | null
          service_order_id: string
          status: string | null
          updated_at: string | null
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          document_name: string
          document_request_id?: string
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          is_required?: boolean | null
          rejection_reason?: string | null
          requested_by?: string | null
          service_order_id: string
          status?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          document_name?: string
          document_request_id?: string
          file_name?: string | null
          file_size?: number | null
          file_url?: string | null
          is_required?: boolean | null
          rejection_reason?: string | null
          requested_by?: string | null
          service_order_id?: string
          status?: string | null
          updated_at?: string | null
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "document_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "document_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "document_requests_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["service_order_id"]
          },
          {
            foreignKeyName: "document_requests_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "v_service_pipeline"
            referencedColumns: ["service_order_id"]
          },
          {
            foreignKeyName: "document_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "document_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "document_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          download_count: number
          file_name: string
          file_url: string
          id: string
          max_downloads: number
          order_id: string | null
          product_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          download_count?: number
          file_name: string
          file_url: string
          id?: string
          max_downloads?: number
          order_id?: string | null
          product_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          download_count?: number
          file_name?: string
          file_url?: string
          id?: string
          max_downloads?: number
          order_id?: string | null
          product_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "paystack_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "documents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_inventory_status"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "documents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_popular_products_by_country"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "documents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_performance"
            referencedColumns: ["product_id"]
          },
        ]
      }
      enquiries: {
        Row: {
          assigned_to: string | null
          context: Json | null
          created_at: string | null
          email: string
          enquiry_id: string
          enquiry_type: string
          message: string
          name: string
          priority: string
          resolution_notes: string | null
          resolved_at: string | null
          status: string
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          context?: Json | null
          created_at?: string | null
          email: string
          enquiry_id?: string
          enquiry_type: string
          message: string
          name: string
          priority?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          context?: Json | null
          created_at?: string | null
          email?: string
          enquiry_id?: string
          enquiry_type?: string
          message?: string
          name?: string
          priority?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiries_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "enquiries_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "enquiries_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "enquiries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "enquiries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "enquiries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      enquiry_replies: {
        Row: {
          attachments: string[] | null
          created_at: string | null
          enquiry_id: string
          is_automated: boolean | null
          is_internal: boolean | null
          message: string
          reply_id: string
          user_id: string | null
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string | null
          enquiry_id: string
          is_automated?: boolean | null
          is_internal?: boolean | null
          message: string
          reply_id?: string
          user_id?: string | null
        }
        Update: {
          attachments?: string[] | null
          created_at?: string | null
          enquiry_id?: string
          is_automated?: boolean | null
          is_internal?: boolean | null
          message?: string
          reply_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enquiry_replies_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["enquiry_id"]
          },
          {
            foreignKeyName: "enquiry_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "enquiry_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "enquiry_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notifications: {
        Row: {
          channel: string | null
          created_at: string | null
          is_read: boolean | null
          message: string
          notification_id: string
          read_at: string | null
          reference_id: string | null
          reference_type: string | null
          sent_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          channel?: string | null
          created_at?: string | null
          is_read?: boolean | null
          message: string
          notification_id?: string
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          sent_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          channel?: string | null
          created_at?: string | null
          is_read?: boolean | null
          message?: string
          notification_id?: string
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          sent_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          discount_amount: number | null
          download_expires_at: string | null
          download_token: string | null
          is_digital: boolean | null
          order_id: string
          order_item_id: string
          product_code: string | null
          product_id: string | null
          product_name: string
          product_type: string | null
          quantity: number
          subtotal: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          discount_amount?: number | null
          download_expires_at?: string | null
          download_token?: string | null
          is_digital?: boolean | null
          order_id: string
          order_item_id?: string
          product_code?: string | null
          product_id?: string | null
          product_name: string
          product_type?: string | null
          quantity: number
          subtotal: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          discount_amount?: number | null
          download_expires_at?: string | null
          download_token?: string | null
          is_digital?: boolean | null
          order_id?: string
          order_item_id?: string
          product_code?: string | null
          product_id?: string | null
          product_name?: string
          product_type?: string | null
          quantity?: number
          subtotal?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_inventory_status"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_popular_products_by_country"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_performance"
            referencedColumns: ["product_id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_info: Json
          cancelled_at: string | null
          completed_at: string | null
          delivered_at: string | null
          discount_amount: number | null
          metadata: Json | null
          order_id: string
          order_number: string
          ordered_at: string | null
          paid_at: string | null
          payment_status: string
          processed_at: string | null
          shipped_at: string | null
          shipping_amount: number | null
          shipping_carrier: string | null
          shipping_info: Json | null
          status: string
          subtotal: number
          tax_amount: number | null
          total_amount: number
          tracking_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          billing_info: Json
          cancelled_at?: string | null
          completed_at?: string | null
          delivered_at?: string | null
          discount_amount?: number | null
          metadata?: Json | null
          order_id?: string
          order_number: string
          ordered_at?: string | null
          paid_at?: string | null
          payment_status?: string
          processed_at?: string | null
          shipped_at?: string | null
          shipping_amount?: number | null
          shipping_carrier?: string | null
          shipping_info?: Json | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          billing_info?: Json
          cancelled_at?: string | null
          completed_at?: string | null
          delivered_at?: string | null
          discount_amount?: number | null
          metadata?: Json | null
          order_id?: string
          order_number?: string
          ordered_at?: string | null
          paid_at?: string | null
          payment_status?: string
          processed_at?: string | null
          shipped_at?: string | null
          shipping_amount?: number | null
          shipping_carrier?: string | null
          shipping_info?: Json | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          crypto_currency: string | null
          crypto_transaction_hash: string | null
          crypto_wallet_address: string | null
          currency: string | null
          fees: number | null
          net_amount: number | null
          order_id: string
          payment_date: string | null
          payment_id: string
          payment_method: string
          refund_date: string | null
          refund_reason: string | null
          refund_reference: string | null
          status: string
          transaction_reference: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          crypto_currency?: string | null
          crypto_transaction_hash?: string | null
          crypto_wallet_address?: string | null
          currency?: string | null
          fees?: number | null
          net_amount?: number | null
          order_id: string
          payment_date?: string | null
          payment_id?: string
          payment_method: string
          refund_date?: string | null
          refund_reason?: string | null
          refund_reference?: string | null
          status?: string
          transaction_reference: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          crypto_currency?: string | null
          crypto_transaction_hash?: string | null
          crypto_wallet_address?: string | null
          currency?: string | null
          fees?: number | null
          net_amount?: number | null
          order_id?: string
          payment_date?: string | null
          payment_id?: string
          payment_method?: string
          refund_date?: string | null
          refund_reason?: string | null
          refund_reference?: string | null
          status?: string
          transaction_reference?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["order_id"]
          },
        ]
      }
      paystack_orders: {
        Row: {
          created_at: string
          id: string
          metadata: Json
          paystack_reference: string
          status: string
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json
          paystack_reference: string
          status?: string
          total: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json
          paystack_reference?: string
          status?: string
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          content: string | null
          created_at: string | null
          helpful_votes: number | null
          is_approved: boolean | null
          is_verified_purchase: boolean | null
          order_id: string | null
          product_id: string
          rating: number
          reported_count: number | null
          review_id: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          helpful_votes?: number | null
          is_approved?: boolean | null
          is_verified_purchase?: boolean | null
          order_id?: string | null
          product_id: string
          rating: number
          reported_count?: number | null
          review_id?: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          helpful_votes?: number | null
          is_approved?: boolean | null
          is_verified_purchase?: boolean | null
          order_id?: string | null
          product_id?: string
          rating?: number
          reported_count?: number | null
          review_id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "product_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_inventory_status"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_popular_products_by_country"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_performance"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "product_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "product_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      products: {
        Row: {
          attributes: Json | null
          category_id: string | null
          cost_price: number | null
          created_at: string | null
          description: string | null
          featured_image: string | null
          gallery_images: string[] | null
          is_active: boolean | null
          is_bestseller: boolean | null
          is_featured: boolean | null
          is_new: boolean | null
          low_stock_threshold: number | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          metadata: Json | null
          name: string
          price: number
          product_id: string
          quantity_in_stock: number | null
          sale_price: number | null
          sales_count: number | null
          search_vector: unknown
          short_description: string | null
          sku: string
          slug: string
          stock_status: string | null
          target_countries: string[] | null
          type: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          attributes?: Json | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          featured_image?: string | null
          gallery_images?: string[] | null
          is_active?: boolean | null
          is_bestseller?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          low_stock_threshold?: number | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          metadata?: Json | null
          name: string
          price: number
          product_id?: string
          quantity_in_stock?: number | null
          sale_price?: number | null
          sales_count?: number | null
          search_vector?: unknown
          short_description?: string | null
          sku: string
          slug: string
          stock_status?: string | null
          target_countries?: string[] | null
          type?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          attributes?: Json | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          featured_image?: string | null
          gallery_images?: string[] | null
          is_active?: boolean | null
          is_bestseller?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          low_stock_threshold?: number | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          metadata?: Json | null
          name?: string
          price?: number
          product_id?: string
          quantity_in_stock?: number | null
          sale_price?: number | null
          sales_count?: number | null
          search_vector?: unknown
          short_description?: string | null
          sku?: string
          slug?: string
          stock_status?: string | null
          target_countries?: string[] | null
          type?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
      service_orders: {
        Row: {
          assigned_to: string | null
          cancelled_at: string | null
          completed_at: string | null
          created_at: string | null
          customer_notes: string | null
          intake_deadline: string | null
          internal_notes: string | null
          order_id: string
          order_item_id: string
          priority: string | null
          product_id: string
          service_metadata: Json | null
          service_order_id: string
          service_type: string
          stage: string
          target_completion: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_notes?: string | null
          intake_deadline?: string | null
          internal_notes?: string | null
          order_id: string
          order_item_id: string
          priority?: string | null
          product_id: string
          service_metadata?: Json | null
          service_order_id?: string
          service_type: string
          stage?: string
          target_completion?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_notes?: string | null
          intake_deadline?: string | null
          internal_notes?: string | null
          order_id?: string
          order_item_id?: string
          priority?: string | null
          product_id?: string
          service_metadata?: Json | null
          service_order_id?: string
          service_type?: string
          stage?: string
          target_completion?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_orders_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "service_orders_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "service_orders_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "service_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "service_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "service_orders_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["order_item_id"]
          },
          {
            foreignKeyName: "service_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "service_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_inventory_status"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "service_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_popular_products_by_country"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "service_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_performance"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "service_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "service_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "service_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
        ]
      }
      service_timeline_events: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string
          event_id: string
          event_type: string
          is_visible_to_customer: boolean | null
          new_stage: string | null
          previous_stage: string | null
          service_order_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description: string
          event_id?: string
          event_type: string
          is_visible_to_customer?: boolean | null
          new_stage?: string | null
          previous_stage?: string | null
          service_order_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string
          event_id?: string
          event_type?: string
          is_visible_to_customer?: boolean | null
          new_stage?: string | null
          previous_stage?: string | null
          service_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_timeline_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "service_timeline_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_customer_clv"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "service_timeline_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "v_order_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "service_timeline_events_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["service_order_id"]
          },
          {
            foreignKeyName: "service_timeline_events_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "v_service_pipeline"
            referencedColumns: ["service_order_id"]
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
      users: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          email_verified: boolean | null
          first_name: string
          is_active: boolean | null
          last_login: string | null
          last_name: string
          locked_until: string | null
          login_attempts: number | null
          password_hash: string
          phone_number: string | null
          postal_code: string | null
          profile_metadata: Json | null
          role: string
          two_factor_enabled: boolean | null
          two_factor_secret: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          email_verified?: boolean | null
          first_name: string
          is_active?: boolean | null
          last_login?: string | null
          last_name: string
          locked_until?: string | null
          login_attempts?: number | null
          password_hash: string
          phone_number?: string | null
          postal_code?: string | null
          profile_metadata?: Json | null
          role?: string
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          email_verified?: boolean | null
          first_name?: string
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string
          locked_until?: string | null
          login_attempts?: number | null
          password_hash?: string
          phone_number?: string | null
          postal_code?: string | null
          profile_metadata?: Json | null
          role?: string
          two_factor_enabled?: boolean | null
          two_factor_secret?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_customer_clv: {
        Row: {
          avg_order_value: number | null
          customer_lifetime_days: number | null
          email: string | null
          engagement_score: number | null
          first_name: string | null
          first_order_date: string | null
          last_name: string | null
          last_order_date: string | null
          registration_date: string | null
          segment: string | null
          tags: string[] | null
          total_orders: number | null
          total_spent: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_daily_sales: {
        Row: {
          average_order_value: number | null
          cancelled_orders: number | null
          paid_orders: number | null
          sale_date: string | null
          total_discounts: number | null
          total_orders: number | null
          total_revenue: number | null
          total_shipping: number | null
          total_tax: number | null
          unique_customers: number | null
        }
        Relationships: []
      }
      v_download_analytics: {
        Row: {
          at_least_one_download: number | null
          avg_downloads_per_user: number | null
          max_downloads_reached: number | null
          product_id: string | null
          product_name: string | null
          total_downloads: number | null
          unique_downloaders: number | null
        }
        Relationships: [
          {
            foreignKeyName: "digital_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "digital_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_inventory_status"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "digital_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_popular_products_by_country"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "digital_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "v_product_performance"
            referencedColumns: ["product_id"]
          },
        ]
      }
      v_inventory_status: {
        Row: {
          estimated_days_remaining: number | null
          last_30_days_sales: number | null
          low_stock_threshold: number | null
          name: string | null
          product_id: string | null
          quantity_in_stock: number | null
          sku: string | null
          stock_level_status: string | null
          stock_status: string | null
          type: string | null
        }
        Relationships: []
      }
      v_order_summary: {
        Row: {
          email: string | null
          first_name: string | null
          item_count: number | null
          last_name: string | null
          order_id: string | null
          order_number: string | null
          ordered_at: string | null
          payment_detail_status: string | null
          payment_method: string | null
          payment_status: string | null
          status: string | null
          total_amount: number | null
          user_id: string | null
        }
        Relationships: []
      }
      v_popular_products_by_country: {
        Row: {
          country: string | null
          name: string | null
          product_id: string | null
          revenue: number | null
          units_sold: number | null
        }
        Relationships: []
      }
      v_product_performance: {
        Row: {
          average_selling_price: number | null
          category_name: string | null
          conversion_rate: number | null
          name: string | null
          price: number | null
          product_id: string | null
          sales_count: number | null
          sku: string | null
          total_revenue: number | null
          total_sold: number | null
          type: string | null
          unique_orders: number | null
          views_count: number | null
        }
        Relationships: []
      }
      v_service_pipeline: {
        Row: {
          assigned_to_name: string | null
          customer_country: string | null
          customer_email: string | null
          customer_name: string | null
          next_consultation: string | null
          order_number: string | null
          pending_documents: number | null
          priority: string | null
          product_name: string | null
          service_order_id: string | null
          service_type: string | null
          stage: string | null
          started_at: string | null
          target_completion: string | null
        }
        Relationships: []
      }
      v_support_analytics: {
        Row: {
          avg_resolution_hours: number | null
          enquiry_type: string | null
          open_count: number | null
          priority: string | null
          resolved_count: number | null
          status: string | null
          ticket_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      apply_coupon: {
        Args: { p_coupon_code: string; p_subtotal: number; p_user_id: string }
        Returns: {
          discount_amount: number
          message: string
          valid: boolean
        }[]
      }
      calculate_order_totals: {
        Args: { p_order_id: string }
        Returns: undefined
      }
      current_user_id: { Args: never; Returns: string }
      get_db_stats: {
        Args: never
        Returns: {
          metric_name: string
          metric_value: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      update_customer_profile_analytics: {
        Args: { p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
