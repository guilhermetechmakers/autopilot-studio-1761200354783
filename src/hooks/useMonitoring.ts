import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  monitoringMetricsApi,
  monitoringLogsApi,
  monitoringAlertsApi,
  monitoringHealthChecksApi,
  monitoringDashboardApi,
} from '@/api/monitoring';
import type {
  MonitoringMetric,
  MonitoringMetricInsert,
  MonitoringMetricUpdate,
  MonitoringLog,
  MonitoringLogInsert,
  MonitoringAlert,
  MonitoringAlertInsert,
  MonitoringAlertUpdate,
  MonitoringHealthCheck,
  MonitoringHealthCheckInsert,
  MonitoringHealthCheckUpdate,
  MonitoringDashboard,
  MetricTimeSeries,
  LogEntry,
  MetricFilter,
  LogFilter,
  AlertFilter,
  HealthCheckFilter,
} from '@/types/monitoring';

// =====================================================
// QUERY KEYS
// =====================================================

export const monitoringQueryKeys = {
  all: ['monitoring'] as const,
  dashboard: () => [...monitoringQueryKeys.all, 'dashboard'] as const,
  metrics: () => [...monitoringQueryKeys.all, 'metrics'] as const,
  metricsList: (filter: MetricFilter, page: number, limit: number) => 
    [...monitoringQueryKeys.metrics(), 'list', filter, page, limit] as const,
  metricTimeSeries: (metricName: string, startTime: string, endTime: string, labels?: Record<string, string>) =>
    [...monitoringQueryKeys.metrics(), 'timeseries', metricName, startTime, endTime, labels] as const,
  logs: () => [...monitoringQueryKeys.all, 'logs'] as const,
  logsList: (filter: LogFilter, page: number, limit: number) =>
    [...monitoringQueryKeys.logs(), 'list', filter, page, limit] as const,
  logsStats: (startTime: string, endTime: string) =>
    [...monitoringQueryKeys.logs(), 'stats', startTime, endTime] as const,
  alerts: () => [...monitoringQueryKeys.all, 'alerts'] as const,
  alertsList: (filter: AlertFilter, page: number, limit: number) =>
    [...monitoringQueryKeys.alerts(), 'list', filter, page, limit] as const,
  healthChecks: () => [...monitoringQueryKeys.all, 'health-checks'] as const,
  healthChecksList: (filter: HealthCheckFilter, page: number, limit: number) =>
    [...monitoringQueryKeys.healthChecks(), 'list', filter, page, limit] as const,
};

// =====================================================
// DASHBOARD HOOKS
// =====================================================

export function useMonitoringDashboard() {
  return useQuery({
    queryKey: monitoringQueryKeys.dashboard(),
    queryFn: () => monitoringDashboardApi.getDashboard(),
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000, // Consider stale after 10 seconds
  });
}

// =====================================================
// METRICS HOOKS
// =====================================================

export function useMonitoringMetrics(
  filter: MetricFilter = {},
  page = 1,
  limit = 100
) {
  return useQuery({
    queryKey: monitoringQueryKeys.metricsList(filter, page, limit),
    queryFn: () => monitoringMetricsApi.getMetrics(filter, page, limit),
  });
}

export function useMetricTimeSeries(
  metricName: string,
  startTime: string,
  endTime: string,
  labels?: Record<string, string>
) {
  return useQuery({
    queryKey: monitoringQueryKeys.metricTimeSeries(metricName, startTime, endTime, labels),
    queryFn: () => monitoringMetricsApi.getMetricTimeSeries(metricName, startTime, endTime, labels),
    enabled: !!metricName && !!startTime && !!endTime,
  });
}

export function useCreateMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (metric: MonitoringMetricInsert) => monitoringMetricsApi.createMetric(metric),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.metrics() });
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.dashboard() });
      toast.success('Metric created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create metric: ${error.message}`);
    },
  });
}

export function useUpdateMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: MonitoringMetricUpdate }) =>
      monitoringMetricsApi.updateMetric(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.metrics() });
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.dashboard() });
      toast.success('Metric updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update metric: ${error.message}`);
    },
  });
}

export function useDeleteMetric() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => monitoringMetricsApi.deleteMetric(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.metrics() });
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.dashboard() });
      toast.success('Metric deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete metric: ${error.message}`);
    },
  });
}

// =====================================================
// LOGS HOOKS
// =====================================================

export function useMonitoringLogs(
  filter: LogFilter = {},
  page = 1,
  limit = 100
) {
  return useQuery({
    queryKey: monitoringQueryKeys.logsList(filter, page, limit),
    queryFn: () => monitoringLogsApi.getLogs(filter, page, limit),
  });
}

export function useLogStats(startTime: string, endTime: string) {
  return useQuery({
    queryKey: monitoringQueryKeys.logsStats(startTime, endTime),
    queryFn: () => monitoringLogsApi.getLogStats(startTime, endTime),
    enabled: !!startTime && !!endTime,
  });
}

export function useCreateLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (log: MonitoringLogInsert) => monitoringLogsApi.createLog(log),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.logs() });
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.dashboard() });
    },
    onError: (error: Error) => {
      console.error('Failed to create log:', error.message);
    },
  });
}

// =====================================================
// ALERTS HOOKS
// =====================================================

export function useMonitoringAlerts(
  filter: AlertFilter = {},
  page = 1,
  limit = 100
) {
  return useQuery({
    queryKey: monitoringQueryKeys.alertsList(filter, page, limit),
    queryFn: () => monitoringAlertsApi.getAlerts(filter, page, limit),
  });
}

export function useCreateAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alert: MonitoringAlertInsert) => monitoringAlertsApi.createAlert(alert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.alerts() });
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.dashboard() });
      toast.success('Alert created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create alert: ${error.message}`);
    },
  });
}

export function useUpdateAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: MonitoringAlertUpdate }) =>
      monitoringAlertsApi.updateAlert(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.alerts() });
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.dashboard() });
      toast.success('Alert updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update alert: ${error.message}`);
    },
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => monitoringAlertsApi.resolveAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.alerts() });
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.dashboard() });
      toast.success('Alert resolved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to resolve alert: ${error.message}`);
    },
  });
}

export function useSuppressAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => monitoringAlertsApi.suppressAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.alerts() });
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.dashboard() });
      toast.success('Alert suppressed successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to suppress alert: ${error.message}`);
    },
  });
}

export function useDeleteAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => monitoringAlertsApi.deleteAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.alerts() });
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.dashboard() });
      toast.success('Alert deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete alert: ${error.message}`);
    },
  });
}

// =====================================================
// HEALTH CHECKS HOOKS
// =====================================================

export function useMonitoringHealthChecks(
  filter: HealthCheckFilter = {},
  page = 1,
  limit = 100
) {
  return useQuery({
    queryKey: monitoringQueryKeys.healthChecksList(filter, page, limit),
    queryFn: () => monitoringHealthChecksApi.getHealthChecks(filter, page, limit),
  });
}

export function useUpsertHealthCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (healthCheck: MonitoringHealthCheckInsert) =>
      monitoringHealthChecksApi.upsertHealthCheck(healthCheck),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.healthChecks() });
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.dashboard() });
    },
    onError: (error: Error) => {
      console.error('Failed to upsert health check:', error.message);
    },
  });
}

export function useUpdateHealthCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: MonitoringHealthCheckUpdate }) =>
      monitoringHealthChecksApi.updateHealthCheck(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.healthChecks() });
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.dashboard() });
      toast.success('Health check updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update health check: ${error.message}`);
    },
  });
}

export function useDeleteHealthCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => monitoringHealthChecksApi.deleteHealthCheck(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.healthChecks() });
      queryClient.invalidateQueries({ queryKey: monitoringQueryKeys.dashboard() });
      toast.success('Health check deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete health check: ${error.message}`);
    },
  });
}