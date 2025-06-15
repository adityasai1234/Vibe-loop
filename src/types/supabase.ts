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
      media_files: {
        Row: {
          id: string
          owner_id: string
          bucket: string
          path: string
          file_name: string
          inserted_at: string
        }
        Insert: {
          id?: string
          owner_id?: string
          bucket: string
          path: string
          file_name: string
          inserted_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          bucket?: string
          path?: string
          file_name?: string
          inserted_at?: string
        }
      }
    }
    Views: {
      // Add your view definitions here if needed
    }
    Functions: {
      add_media_file: {
        Args: {
          _bucket: string
          _path: string
          _file_name: string
        }
        Returns: Json
      }
    }
    Enums: {
      // Add your enum definitions here if needed
    }
  }
  storage: {
    buckets: {
      media: {
        name: 'media'
        owner: string
        public: boolean
        file_size_limit: number
        allowed_mime_types: string[]
      }
    }
  }
} 
