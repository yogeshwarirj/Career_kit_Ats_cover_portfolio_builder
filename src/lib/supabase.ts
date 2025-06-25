import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dnbhflyyreunhfczvzxl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      resumes: {
        Row: {
          id: string;
          user_id: string;
          resume_data: any;
          template_used: string;
          last_updated: string;
          created_at: string;
          title: string;
          version: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_data: any;
          template_used: string;
          last_updated?: string;
          created_at?: string;
          title: string;
          version?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          resume_data?: any;
          template_used?: string;
          last_updated?: string;
          title?: string;
          version?: number;
        };
      };
      resume_changes_log: {
        Row: {
          id: string;
          resume_id: string;
          changed_section: string;
          change_timestamp: string;
          change_data: any;
        };
        Insert: {
          id?: string;
          resume_id: string;
          changed_section: string;
          change_timestamp?: string;
          change_data: any;
        };
        Update: {
          id?: string;
          resume_id?: string;
          changed_section?: string;
          change_timestamp?: string;
          change_data?: any;
        };
      };
    };
  };
};