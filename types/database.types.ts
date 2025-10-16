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
      profiles: {
        Row: {
          id: string
          handle: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          handle: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          handle?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          user_id: string
          name: string
          position: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          position?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          position?: number | null
          created_at?: string
        }
      }
      lists: {
        Row: {
          id: string
          user_id: string
          group_id: string | null
          title: string
          description: string | null
          visibility: 'private' | 'unlisted' | 'public'
          slug: string | null
          cover_url: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          group_id?: string | null
          title: string
          description?: string | null
          visibility?: 'private' | 'unlisted' | 'public'
          slug?: string | null
          cover_url?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          group_id?: string | null
          title?: string
          description?: string | null
          visibility?: 'private' | 'unlisted' | 'public'
          slug?: string | null
          cover_url?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      items: {
        Row: {
          id: string
          user_id: string
          list_id: string
          type: 'movie' | 'show' | 'book' | 'podcast' | 'game' | 'boardgame' | 'app' | 'link'
          title: string
          url: string | null
          source: string | null
          source_id: string | null
          status: 'saved' | 'started' | 'done'
          notes: string | null
          tags: string[] | null
          metadata: Json | null
          added_at: string
          completed_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          list_id: string
          type: 'movie' | 'show' | 'book' | 'podcast' | 'game' | 'boardgame' | 'app' | 'link'
          title: string
          url?: string | null
          source?: string | null
          source_id?: string | null
          status?: 'saved' | 'started' | 'done'
          notes?: string | null
          tags?: string[] | null
          metadata?: Json | null
          added_at?: string
          completed_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          list_id?: string
          type?: 'movie' | 'show' | 'book' | 'podcast' | 'game' | 'boardgame' | 'app' | 'link'
          title?: string
          url?: string | null
          source?: string | null
          source_id?: string | null
          status?: 'saved' | 'started' | 'done'
          notes?: string | null
          tags?: string[] | null
          metadata?: Json | null
          added_at?: string
          completed_at?: string | null
          updated_at?: string
        }
      }
      marketplace_listings: {
        Row: {
          id: string
          list_id: string
          owner_user_id: string
          slug: string
          title: string
          summary: string | null
          category: string | null
          tags: string[] | null
          is_public: boolean
          is_indexable: boolean
          is_sober_content: boolean
          admin_approved: boolean | null
          forked_from_list_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          list_id: string
          owner_user_id: string
          slug: string
          title: string
          summary?: string | null
          category?: string | null
          tags?: string[] | null
          is_public?: boolean
          is_indexable?: boolean
          is_sober_content?: boolean
          admin_approved?: boolean | null
          forked_from_list_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          owner_user_id?: string
          slug?: string
          title?: string
          summary?: string | null
          category?: string | null
          tags?: string[] | null
          is_public?: boolean
          is_indexable?: boolean
          is_sober_content?: boolean
          admin_approved?: boolean | null
          forked_from_list_id?: string | null
          created_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string
          created_at?: string
        }
      }
      saves: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
          reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string
          reason?: string | null
          created_at?: string
        }
      }
      catalog_cache: {
        Row: {
          key: string
          payload: Json
          ttl_expires_at: string | null
          created_at: string
        }
        Insert: {
          key: string
          payload: Json
          ttl_expires_at?: string | null
          created_at?: string
        }
        Update: {
          key?: string
          payload?: Json
          ttl_expires_at?: string | null
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

