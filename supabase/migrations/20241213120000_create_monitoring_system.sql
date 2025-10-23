-- =====================================================
-- Migration: Create Monitoring System Tables
-- Created: 2024-12-13T12:00:00Z
-- Tables: monitoring_metrics, monitoring_logs, monitoring_alerts, monitoring_health_checks
-- Purpose: Comprehensive monitoring and observability system
-- =====================================================

-- Enable UUID extension (idempotent)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function for updated_at (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TABLE: monitoring_metrics
-- Purpose: Store application metrics for monitoring and alerting
-- =====================================================
CREATE TABLE IF NOT EXISTS monitoring_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Core metric fields
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type TEXT DEFAULT 'gauge' CHECK (metric_type IN ('counter', 'gauge', 'histogram', 'summary')),
  
  -- Flexible labels for filtering and grouping
  labels JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamp for time-series data
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT monitoring_metrics_name_not_empty CHECK (length(trim(metric_name)) > 0),
  CONSTRAINT monitoring_metrics_value_valid CHECK (metric_value >= 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS monitoring_metrics_user_id_idx ON monitoring_metrics(user_id);
CREATE INDEX IF NOT EXISTS monitoring_metrics_name_idx ON monitoring_metrics(metric_name);
CREATE INDEX IF NOT EXISTS monitoring_metrics_timestamp_idx ON monitoring_metrics(timestamp DESC);
CREATE INDEX IF NOT EXISTS monitoring_metrics_type_idx ON monitoring_metrics(metric_type);
CREATE INDEX IF NOT EXISTS monitoring_metrics_labels_idx ON monitoring_metrics USING GIN(labels);

-- =====================================================
-- TABLE: monitoring_logs
-- Purpose: Centralized logging for application events and errors
-- =====================================================
CREATE TABLE IF NOT EXISTS monitoring_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Log level and message
  level TEXT NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error', 'fatal')),
  message TEXT NOT NULL,
  
  -- Context and metadata
  context JSONB DEFAULT '{}'::jsonb,
  service TEXT NOT NULL,
  
  -- Distributed tracing
  trace_id TEXT,
  span_id TEXT,
  
  -- Timestamp
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT monitoring_logs_message_not_empty CHECK (length(trim(message)) > 0),
  CONSTRAINT monitoring_logs_service_not_empty CHECK (length(trim(service)) > 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS monitoring_logs_user_id_idx ON monitoring_logs(user_id);
CREATE INDEX IF NOT EXISTS monitoring_logs_level_idx ON monitoring_logs(level);
CREATE INDEX IF NOT EXISTS monitoring_logs_service_idx ON monitoring_logs(service);
CREATE INDEX IF NOT EXISTS monitoring_logs_timestamp_idx ON monitoring_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS monitoring_logs_trace_id_idx ON monitoring_logs(trace_id) WHERE trace_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS monitoring_logs_context_idx ON monitoring_logs USING GIN(context);

-- =====================================================
-- TABLE: monitoring_alerts
-- Purpose: Alert definitions and current alert states
-- =====================================================
CREATE TABLE IF NOT EXISTS monitoring_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Alert definition
  alert_name TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  
  -- Alert state
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'suppressed')),
  
  -- Alert conditions
  condition JSONB NOT NULL,
  threshold_value NUMERIC NOT NULL,
  current_value NUMERIC NOT NULL,
  
  -- Timing
  triggered_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  resolved_at TIMESTAMPTZ,
  
  -- Notification settings
  notification_channels TEXT[] DEFAULT '{}',
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT monitoring_alerts_name_not_empty CHECK (length(trim(alert_name)) > 0),
  CONSTRAINT monitoring_alerts_threshold_positive CHECK (threshold_value > 0),
  CONSTRAINT monitoring_alerts_current_positive CHECK (current_value >= 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS monitoring_alerts_user_id_idx ON monitoring_alerts(user_id);
CREATE INDEX IF NOT EXISTS monitoring_alerts_status_idx ON monitoring_alerts(status);
CREATE INDEX IF NOT EXISTS monitoring_alerts_severity_idx ON monitoring_alerts(severity);
CREATE INDEX IF NOT EXISTS monitoring_alerts_triggered_at_idx ON monitoring_alerts(triggered_at DESC);
CREATE INDEX IF NOT EXISTS monitoring_alerts_condition_idx ON monitoring_alerts USING GIN(condition);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_monitoring_alerts_updated_at ON monitoring_alerts;
CREATE TRIGGER update_monitoring_alerts_updated_at
  BEFORE UPDATE ON monitoring_alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: monitoring_health_checks
-- Purpose: Health check status for various services and endpoints
-- =====================================================
CREATE TABLE IF NOT EXISTS monitoring_health_checks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Service information
  service_name TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  
  -- Health status
  status TEXT DEFAULT 'healthy' CHECK (status IN ('healthy', 'unhealthy', 'degraded')),
  response_time INTEGER NOT NULL DEFAULT 0, -- in milliseconds
  last_check TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  error_message TEXT,
  
  -- Additional metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT monitoring_health_checks_service_not_empty CHECK (length(trim(service_name)) > 0),
  CONSTRAINT monitoring_health_checks_endpoint_not_empty CHECK (length(trim(endpoint)) > 0),
  CONSTRAINT monitoring_health_checks_response_time_positive CHECK (response_time >= 0)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS monitoring_health_checks_user_id_idx ON monitoring_health_checks(user_id);
CREATE INDEX IF NOT EXISTS monitoring_health_checks_service_idx ON monitoring_health_checks(service_name);
CREATE INDEX IF NOT EXISTS monitoring_health_checks_status_idx ON monitoring_health_checks(status);
CREATE INDEX IF NOT EXISTS monitoring_health_checks_last_check_idx ON monitoring_health_checks(last_check DESC);
CREATE INDEX IF NOT EXISTS monitoring_health_checks_metadata_idx ON monitoring_health_checks USING GIN(metadata);

-- Auto-update trigger
DROP TRIGGER IF EXISTS update_monitoring_health_checks_updated_at ON monitoring_health_checks;
CREATE TRIGGER update_monitoring_health_checks_updated_at
  BEFORE UPDATE ON monitoring_health_checks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE monitoring_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_health_checks ENABLE ROW LEVEL SECURITY;

-- monitoring_metrics policies
CREATE POLICY "monitoring_metrics_select_own"
  ON monitoring_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "monitoring_metrics_insert_own"
  ON monitoring_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "monitoring_metrics_update_own"
  ON monitoring_metrics FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "monitoring_metrics_delete_own"
  ON monitoring_metrics FOR DELETE
  USING (auth.uid() = user_id);

-- monitoring_logs policies
CREATE POLICY "monitoring_logs_select_own"
  ON monitoring_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "monitoring_logs_insert_own"
  ON monitoring_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "monitoring_logs_update_own"
  ON monitoring_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "monitoring_logs_delete_own"
  ON monitoring_logs FOR DELETE
  USING (auth.uid() = user_id);

-- monitoring_alerts policies
CREATE POLICY "monitoring_alerts_select_own"
  ON monitoring_alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "monitoring_alerts_insert_own"
  ON monitoring_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "monitoring_alerts_update_own"
  ON monitoring_alerts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "monitoring_alerts_delete_own"
  ON monitoring_alerts FOR DELETE
  USING (auth.uid() = user_id);

-- monitoring_health_checks policies
CREATE POLICY "monitoring_health_checks_select_own"
  ON monitoring_health_checks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "monitoring_health_checks_insert_own"
  ON monitoring_health_checks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "monitoring_health_checks_update_own"
  ON monitoring_health_checks FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "monitoring_health_checks_delete_own"
  ON monitoring_health_checks FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- DOCUMENTATION
-- =====================================================
COMMENT ON TABLE monitoring_metrics IS 'Application metrics for monitoring and alerting';
COMMENT ON TABLE monitoring_logs IS 'Centralized application logs with structured data';
COMMENT ON TABLE monitoring_alerts IS 'Alert definitions and current alert states';
COMMENT ON TABLE monitoring_health_checks IS 'Health check status for services and endpoints';

-- =====================================================
-- ROLLBACK INSTRUCTIONS (for documentation only)
-- =====================================================
-- To rollback this migration, execute:
-- DROP TABLE IF EXISTS monitoring_health_checks CASCADE;
-- DROP TABLE IF EXISTS monitoring_alerts CASCADE;
-- DROP TABLE IF EXISTS monitoring_logs CASCADE;
-- DROP TABLE IF EXISTS monitoring_metrics CASCADE;