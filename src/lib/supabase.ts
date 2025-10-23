import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Database types
export type Database = {
  public: {
    Tables: {
      monitoring_metrics: {
        Row: {
          id: string;
          user_id: string;
          metric_name: string;
          metric_value: number;
          metric_type: 'counter' | 'gauge' | 'histogram' | 'summary';
          labels: Record<string, string>;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          metric_name: string;
          metric_value: number;
          metric_type: 'counter' | 'gauge' | 'histogram' | 'summary';
          labels?: Record<string, string>;
          timestamp?: string;
        };
        Update: {
          metric_value?: number;
          labels?: Record<string, string>;
        };
      };
      monitoring_logs: {
        Row: {
          id: string;
          user_id: string;
          level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
          message: string;
          context: Record<string, any>;
          service: string;
          trace_id?: string;
          span_id?: string;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
          message: string;
          context?: Record<string, any>;
          service: string;
          trace_id?: string;
          span_id?: string;
          timestamp?: string;
        };
        Update: {
          context?: Record<string, any>;
        };
      };
      monitoring_alerts: {
        Row: {
          id: string;
          user_id: string;
          alert_name: string;
          description: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          status: 'active' | 'resolved' | 'suppressed';
          condition: Record<string, any>;
          threshold_value: number;
          current_value: number;
          triggered_at: string;
          resolved_at?: string;
          notification_channels: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          alert_name: string;
          description: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          status?: 'active' | 'resolved' | 'suppressed';
          condition: Record<string, any>;
          threshold_value: number;
          current_value: number;
          triggered_at?: string;
          notification_channels: string[];
        };
        Update: {
          status?: 'active' | 'resolved' | 'suppressed';
          current_value?: number;
          resolved_at?: string;
        };
      };
      monitoring_health_checks: {
        Row: {
          id: string;
          user_id: string;
          service_name: string;
          endpoint: string;
          status: 'healthy' | 'unhealthy' | 'degraded';
          response_time: number;
          last_check: string;
          error_message?: string;
          metadata: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          service_name: string;
          endpoint: string;
          status?: 'healthy' | 'unhealthy' | 'degraded';
          response_time?: number;
          last_check?: string;
          error_message?: string;
          metadata?: Record<string, any>;
        };
        Update: {
          status?: 'healthy' | 'unhealthy' | 'degraded';
          response_time?: number;
          last_check?: string;
          error_message?: string;
          metadata?: Record<string, any>;
        };
      };
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];