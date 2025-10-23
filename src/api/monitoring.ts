import { supabase } from '@/lib/supabase';
import type {
  MonitoringMetric,
  MonitoringMetricInsert,
  MonitoringMetricUpdate,
  MonitoringLog,
  MonitoringLogInsert,
  MonitoringLogUpdate,
  MonitoringAlert,
  MonitoringAlertInsert,
  MonitoringAlertUpdate,
  MonitoringHealthCheck,
  MonitoringHealthCheckInsert,
  MonitoringHealthCheckUpdate,
  MonitoringDashboard,
  MetricTimeSeries,
  LogEntry,
  AlertRule,
  MetricFilter,
  LogFilter,
  AlertFilter,
  HealthCheckFilter,
  MonitoringApiResponse,
  MonitoringPaginatedResponse,
} from '@/types/monitoring';

// =====================================================
// METRICS API
// =====================================================

export const monitoringMetricsApi = {
  // Get metrics with filtering
  async getMetrics(
    filter: MetricFilter = {},
    page = 1,
    limit = 100
  ): Promise<MonitoringPaginatedResponse<MonitoringMetric>> {
    let query = supabase
      .from('monitoring_metrics')
      .select('*', { count: 'exact' })
      .order('timestamp', { ascending: false });

    // Apply filters
    if (filter.metric_name) {
      query = query.eq('metric_name', filter.metric_name);
    }
    if (filter.metric_type) {
      query = query.eq('metric_type', filter.metric_type);
    }
    if (filter.start_time) {
      query = query.gte('timestamp', filter.start_time);
    }
    if (filter.end_time) {
      query = query.lte('timestamp', filter.end_time);
    }
    if (filter.labels) {
      Object.entries(filter.labels).forEach(([key, value]) => {
        query = query.contains('labels', { [key]: value });
      });
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch metrics: ${error.message}`);
    }

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
      success: true,
    };
  },

  // Get time series data for a specific metric
  async getMetricTimeSeries(
    metricName: string,
    startTime: string,
    endTime: string,
    labels?: Record<string, string>
  ): Promise<MetricTimeSeries[]> {
    let query = supabase
      .from('monitoring_metrics')
      .select('timestamp, metric_value, labels')
      .eq('metric_name', metricName)
      .gte('timestamp', startTime)
      .lte('timestamp', endTime)
      .order('timestamp', { ascending: true });

    if (labels) {
      Object.entries(labels).forEach(([key, value]) => {
        query = query.contains('labels', { [key]: value });
      });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch metric time series: ${error.message}`);
    }

    return (data || []).map(item => ({
      timestamp: item.timestamp,
      value: item.metric_value,
      labels: item.labels,
    }));
  },

  // Create a new metric
  async createMetric(metric: MonitoringMetricInsert): Promise<MonitoringApiResponse<MonitoringMetric>> {
    const { data, error } = await supabase
      .from('monitoring_metrics')
      .insert(metric)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create metric: ${error.message}`);
    }

    return {
      data,
      success: true,
      timestamp: new Date().toISOString(),
    };
  },

  // Update a metric
  async updateMetric(id: string, updates: MonitoringMetricUpdate): Promise<MonitoringApiResponse<MonitoringMetric>> {
    const { data, error } = await supabase
      .from('monitoring_metrics')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update metric: ${error.message}`);
    }

    return {
      data,
      success: true,
      timestamp: new Date().toISOString(),
    };
  },

  // Delete a metric
  async deleteMetric(id: string): Promise<MonitoringApiResponse<null>> {
    const { error } = await supabase
      .from('monitoring_metrics')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete metric: ${error.message}`);
    }

    return {
      data: null,
      success: true,
      timestamp: new Date().toISOString(),
    };
  },
};

// =====================================================
// LOGS API
// =====================================================

export const monitoringLogsApi = {
  // Get logs with filtering
  async getLogs(
    filter: LogFilter = {},
    page = 1,
    limit = 100
  ): Promise<MonitoringPaginatedResponse<LogEntry>> {
    let query = supabase
      .from('monitoring_logs')
      .select('id, level, message, service, timestamp, context', { count: 'exact' })
      .order('timestamp', { ascending: false });

    // Apply filters
    if (filter.level) {
      query = query.eq('level', filter.level);
    }
    if (filter.service) {
      query = query.eq('service', filter.service);
    }
    if (filter.start_time) {
      query = query.gte('timestamp', filter.start_time);
    }
    if (filter.end_time) {
      query = query.lte('timestamp', filter.end_time);
    }
    if (filter.search) {
      query = query.textSearch('message', filter.search);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch logs: ${error.message}`);
    }

    return {
      data: (data || []).map(log => ({
        id: log.id,
        level: log.level,
        message: log.message,
        service: log.service,
        timestamp: log.timestamp,
        context: log.context,
      })),
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
      success: true,
    };
  },

  // Create a new log entry
  async createLog(log: MonitoringLogInsert): Promise<MonitoringApiResponse<MonitoringLog>> {
    const { data, error } = await supabase
      .from('monitoring_logs')
      .insert(log)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create log: ${error.message}`);
    }

    return {
      data,
      success: true,
      timestamp: new Date().toISOString(),
    };
  },

  // Get log statistics
  async getLogStats(startTime: string, endTime: string): Promise<{
    total: number;
    byLevel: Record<string, number>;
    byService: Record<string, number>;
  }> {
    const { data, error } = await supabase
      .from('monitoring_logs')
      .select('level, service')
      .gte('timestamp', startTime)
      .lte('timestamp', endTime);

    if (error) {
      throw new Error(`Failed to fetch log stats: ${error.message}`);
    }

    const stats = {
      total: data?.length || 0,
      byLevel: {} as Record<string, number>,
      byService: {} as Record<string, number>,
    };

    data?.forEach(log => {
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
      stats.byService[log.service] = (stats.byService[log.service] || 0) + 1;
    });

    return stats;
  },
};

// =====================================================
// ALERTS API
// =====================================================

export const monitoringAlertsApi = {
  // Get alerts with filtering
  async getAlerts(
    filter: AlertFilter = {},
    page = 1,
    limit = 100
  ): Promise<MonitoringPaginatedResponse<MonitoringAlert>> {
    let query = supabase
      .from('monitoring_alerts')
      .select('*', { count: 'exact' })
      .order('triggered_at', { ascending: false });

    // Apply filters
    if (filter.status) {
      query = query.eq('status', filter.status);
    }
    if (filter.severity) {
      query = query.eq('severity', filter.severity);
    }
    if (filter.start_time) {
      query = query.gte('triggered_at', filter.start_time);
    }
    if (filter.end_time) {
      query = query.lte('triggered_at', filter.end_time);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch alerts: ${error.message}`);
    }

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
      success: true,
    };
  },

  // Create a new alert
  async createAlert(alert: MonitoringAlertInsert): Promise<MonitoringApiResponse<MonitoringAlert>> {
    const { data, error } = await supabase
      .from('monitoring_alerts')
      .insert(alert)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create alert: ${error.message}`);
    }

    return {
      data,
      success: true,
      timestamp: new Date().toISOString(),
    };
  },

  // Update an alert
  async updateAlert(id: string, updates: MonitoringAlertUpdate): Promise<MonitoringApiResponse<MonitoringAlert>> {
    const { data, error } = await supabase
      .from('monitoring_alerts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update alert: ${error.message}`);
    }

    return {
      data,
      success: true,
      timestamp: new Date().toISOString(),
    };
  },

  // Resolve an alert
  async resolveAlert(id: string): Promise<MonitoringApiResponse<MonitoringAlert>> {
    return this.updateAlert(id, {
      status: 'resolved',
      resolved_at: new Date().toISOString(),
    });
  },

  // Suppress an alert
  async suppressAlert(id: string): Promise<MonitoringApiResponse<MonitoringAlert>> {
    return this.updateAlert(id, {
      status: 'suppressed',
    });
  },

  // Delete an alert
  async deleteAlert(id: string): Promise<MonitoringApiResponse<null>> {
    const { error } = await supabase
      .from('monitoring_alerts')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete alert: ${error.message}`);
    }

    return {
      data: null,
      success: true,
      timestamp: new Date().toISOString(),
    };
  },
};

// =====================================================
// HEALTH CHECKS API
// =====================================================

export const monitoringHealthChecksApi = {
  // Get health checks with filtering
  async getHealthChecks(
    filter: HealthCheckFilter = {},
    page = 1,
    limit = 100
  ): Promise<MonitoringPaginatedResponse<MonitoringHealthCheck>> {
    let query = supabase
      .from('monitoring_health_checks')
      .select('*', { count: 'exact' })
      .order('last_check', { ascending: false });

    // Apply filters
    if (filter.status) {
      query = query.eq('status', filter.status);
    }
    if (filter.service_name) {
      query = query.eq('service_name', filter.service_name);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch health checks: ${error.message}`);
    }

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
      success: true,
    };
  },

  // Create or update a health check
  async upsertHealthCheck(healthCheck: MonitoringHealthCheckInsert): Promise<MonitoringApiResponse<MonitoringHealthCheck>> {
    const { data, error } = await supabase
      .from('monitoring_health_checks')
      .upsert(healthCheck, {
        onConflict: 'service_name,user_id',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to upsert health check: ${error.message}`);
    }

    return {
      data,
      success: true,
      timestamp: new Date().toISOString(),
    };
  },

  // Update a health check
  async updateHealthCheck(id: string, updates: MonitoringHealthCheckUpdate): Promise<MonitoringApiResponse<MonitoringHealthCheck>> {
    const { data, error } = await supabase
      .from('monitoring_health_checks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update health check: ${error.message}`);
    }

    return {
      data,
      success: true,
      timestamp: new Date().toISOString(),
    };
  },

  // Delete a health check
  async deleteHealthCheck(id: string): Promise<MonitoringApiResponse<null>> {
    const { error } = await supabase
      .from('monitoring_health_checks')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete health check: ${error.message}`);
    }

    return {
      data: null,
      success: true,
      timestamp: new Date().toISOString(),
    };
  },
};

// =====================================================
// DASHBOARD API
// =====================================================

export const monitoringDashboardApi = {
  // Get dashboard overview data
  async getDashboard(): Promise<MonitoringApiResponse<MonitoringDashboard>> {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

    try {
      // Get metrics
      const [metricsResponse, alertsResponse, healthChecksResponse, logsResponse] = await Promise.all([
        // Get key metrics
        supabase
          .from('monitoring_metrics')
          .select('metric_name, metric_value')
          .gte('timestamp', oneHourAgo)
          .in('metric_name', ['total_requests', 'error_rate', 'avg_response_time', 'active_users']),
        
        // Get alert counts
        supabase
          .from('monitoring_alerts')
          .select('status, severity')
          .gte('triggered_at', oneDayAgo),
        
        // Get health check status
        supabase
          .from('monitoring_health_checks')
          .select('status'),
        
        // Get log counts by level
        supabase
          .from('monitoring_logs')
          .select('level')
          .gte('timestamp', oneHourAgo),
      ]);

      if (metricsResponse.error) throw metricsResponse.error;
      if (alertsResponse.error) throw alertsResponse.error;
      if (healthChecksResponse.error) throw healthChecksResponse.error;
      if (logsResponse.error) throw logsResponse.error;

      // Process metrics
      const metrics = {
        total_requests: 0,
        error_rate: 0,
        average_response_time: 0,
        active_users: 0,
      };

      metricsResponse.data?.forEach(metric => {
        switch (metric.metric_name) {
          case 'total_requests':
            metrics.total_requests = metric.metric_value;
            break;
          case 'error_rate':
            metrics.error_rate = metric.metric_value;
            break;
          case 'avg_response_time':
            metrics.average_response_time = metric.metric_value;
            break;
          case 'active_users':
            metrics.active_users = metric.metric_value;
            break;
        }
      });

      // Process alerts
      const alerts = {
        active: 0,
        critical: 0,
        resolved_today: 0,
      };

      alertsResponse.data?.forEach(alert => {
        if (alert.status === 'active') {
          alerts.active++;
          if (alert.severity === 'critical') {
            alerts.critical++;
          }
        } else if (alert.status === 'resolved') {
          alerts.resolved_today++;
        }
      });

      // Process health checks
      const healthChecks = {
        healthy_services: 0,
        total_services: 0,
        degraded_services: 0,
      };

      healthChecksResponse.data?.forEach(check => {
        healthChecks.total_services++;
        if (check.status === 'healthy') {
          healthChecks.healthy_services++;
        } else if (check.status === 'degraded') {
          healthChecks.degraded_services++;
        }
      });

      // Process logs
      const logs = {
        error_count: 0,
        warning_count: 0,
        info_count: 0,
      };

      logsResponse.data?.forEach(log => {
        switch (log.level) {
          case 'error':
          case 'fatal':
            logs.error_count++;
            break;
          case 'warn':
            logs.warning_count++;
            break;
          case 'info':
            logs.info_count++;
            break;
        }
      });

      return {
        data: {
          metrics,
          alerts,
          health_checks: healthChecks,
          logs,
        },
        success: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Failed to fetch dashboard data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};