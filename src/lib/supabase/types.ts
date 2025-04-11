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
      trend_keywords: {
        Row: {
          id: string
          created_at: string
          keyword: string
          search_count: number
          last_searched: string | null
          is_trending: boolean
          status: string
          last_generated: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          keyword: string
          search_count?: number
          last_searched?: string | null
          is_trending?: boolean
          status?: string
          last_generated?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          keyword?: string
          search_count?: number
          last_searched?: string | null
          is_trending?: boolean
          status?: string
          last_generated?: string | null
        }
      }
      generated_products: {
        Row: {
          id: string
          keyword_id: string
          keyword: string
          sku: string
          product_url: string
          created_at: string
        }
        Insert: {
          id?: string
          keyword_id: string
          keyword: string
          sku: string
          product_url: string
          created_at?: string
        }
        Update: {
          id?: string
          keyword_id?: string
          keyword?: string
          sku?: string
          product_url?: string
          created_at?: string
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
  }
}