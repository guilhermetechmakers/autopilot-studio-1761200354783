/**
 * Monitoring system types
 * Generated: 2024-12-13T12:00:00Z
 */

// =====================================================
// METRICS TYPES
// =====================================================

export interface MonitoringMetric {
  id: string;
  user_id: string;
  metric_name: string;
  metric_value: number;
  metric_type: 'counter' | 'gauge' | 'histogram' | 'summary';
  labels: Record<string, string>;
  timestamp: string;
  created_at: string;
}

export interface MonitoringMetricInsert {
  id?: string;
  user_id: string;
  metric_name: string;
  metric_value: number;
  metric_type?: 'counter' | 'gauge' | 'histogram' | 'summary';
  labels?: Record<string, string>;
  timestamp?: string;
}

export interface MonitoringMetricUpdate {
  metric_value?: number;
  labels?: Record<string, string>;
}

// =====================================================
// LOGS TYPES
// =====================================================

export interface MonitoringLog {
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
}

export interface MonitoringLogInsert {
  id?: string;
  user_id: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  context?: Record<string, any>;
  service: string;
  trace_id?: string;
  span_id?: string;
  timestamp?: string;
}

export interface MonitoringLogUpdate {
  context?: Record<string, any>;
}

// =====================================================
// ALERTS TYPES
// =====================================================

export interface MonitoringAlert {
  id: string;
  user_id: string;
  alert_name: string;
  description: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'suppressed';
  condition: Record<string, any>;
  threshold_value: number;
  current_value: number;
  triggered_at: string;
  resolved_at: string | null;
  notification_channels: string[];
  created_at: string;
  updated_at: string;
}

export interface MonitoringAlertInsert {
  id?: string;
  user_id: string;
  alert_name: string;
  description?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status?: 'active' | 'resolved' | 'suppressed';
  condition: Record<string, any>;
  threshold_value: number;
  current_value: number;
  triggered_at?: string;
  notification_channels: string[];
}

export interface MonitoringAlertUpdate {
  status?: 'active' | 'resolved' | 'suppressed';
  current_value?: number;
  resolved_at?: string | null;
}

// =====================================================
// HEALTH CHECKS TYPES
// =====================================================

export interface MonitoringHealthCheck {
  id: string;
  user_id: string;
  service_name: string;
  endpoint: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  response_time: number;
  last_check: string;
  error_message: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface MonitoringHealthCheckInsert {
  id?: string;
  user_id: string;
  service_name: string;
  endpoint: string;
  status?: 'healthy' | 'unhealthy' | 'degraded';
  response_time?: number;
  last_check?: string;
  error_message?: string;
  metadata?: Record<string, any>;
}

export interface MonitoringHealthCheckUpdate {
  status?: 'healthy' | 'unhealthy' | 'degraded';
  response_time?: number;
  last_check?: string;
  error_message?: string;
  metadata?: Record<string, any>;
}

// =====================================================
// DASHBOARD TYPES
// =====================================================

export interface MonitoringDashboard {
  metrics: {
    total_requests: number;
    error_rate: number;
    average_response_time: number;
    active_users: number;
  };
  alerts: {
    active: number;
    critical: number;
    resolved_today: number;
  };
  health_checks: {
    healthy_services: number;
    total_services: number;
    degraded_services: number;
  };
  logs: {
    error_count: number;
    warning_count: number;
    info_count: number;
  };
}

export interface MetricTimeSeries {
  timestamp: string;
  value: number;
  labels?: Record<string, string>;
}

export interface LogEntry {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  service: string;
  timestamp: string;
  context: Record<string, any>;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  metric_name: string;
  condition: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  notification_channels: string[];
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface MonitoringApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface MonitoringPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  success: boolean;
}

// =====================================================
// FILTER TYPES
// =====================================================

export interface MetricFilter {
  metric_name?: string;
  metric_type?: 'counter' | 'gauge' | 'histogram' | 'summary';
  start_time?: string;
  end_time?: string;
  labels?: Record<string, string>;
}

export interface LogFilter {
  level?: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  service?: string;
  start_time?: string;
  end_time?: string;
  search?: string;
}

export interface AlertFilter {
  status?: 'active' | 'resolved' | 'suppressed';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  start_time?: string;
  end_time?: string;
}

export interface HealthCheckFilter {
  status?: 'healthy' | 'unhealthy' | 'degraded';
  service_name?: string;
}