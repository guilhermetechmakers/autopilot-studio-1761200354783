import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  FileText, 
  RefreshCw,
  Server,
  TrendingUp,
  Users
} from 'lucide-react';
import { useMonitoringDashboard } from '@/hooks/useMonitoring';
import { MetricsOverview } from '@/components/monitoring/MetricsOverview';
import { AlertsPanel } from '@/components/monitoring/AlertsPanel';
import { HealthChecksPanel } from '@/components/monitoring/HealthChecksPanel';
import { LogsPanel } from '@/components/monitoring/LogsPanel';
import { SystemStatus } from '@/components/monitoring/SystemStatus';

export default function MonitoringDashboard() {
  const { data: dashboardData, isLoading, error, refetch } = useMonitoringDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-[#4998F3]" />
          <span className="text-[#8A8F98]">Loading monitoring data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-[#F44336] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#151A29] mb-2">Failed to load monitoring data</h2>
          <p className="text-[#8A8F98] mb-4">{error.message}</p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const { metrics, alerts, health_checks, logs } = dashboardData?.data || {};

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#151A29]">Monitoring Dashboard</h1>
            <p className="text-[#8A8F98] mt-1">Real-time system performance and health monitoring</p>
          </div>
          <Button 
            onClick={() => refetch()} 
            variant="outline"
            className="bg-white hover:bg-[#E9F3FE] border-[#E5E7EB]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* System Status Overview */}
        <SystemStatus 
          metrics={metrics}
          alerts={alerts}
          healthChecks={health_checks}
          logs={logs}
        />

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#8A8F98]">Total Requests</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#4998F3]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#151A29]">
                {metrics?.total_requests?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-[#8A8F98]">Last hour</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#8A8F98]">Error Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-[#F44336]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#151A29]">
                {metrics?.error_rate?.toFixed(2) || '0.00'}%
              </div>
              <p className="text-xs text-[#8A8F98]">Last hour</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#8A8F98]">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-[#FFA86A]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#151A29]">
                {metrics?.average_response_time?.toFixed(0) || '0'}ms
              </div>
              <p className="text-xs text-[#8A8F98]">Last hour</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#8A8F98]">Active Users</CardTitle>
              <Users className="h-4 w-4 text-[#3AC569]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#151A29]">
                {metrics?.active_users || '0'}
              </div>
              <p className="text-xs text-[#8A8F98]">Currently online</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts and Health Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-[#F44336]" />
                <span>Active Alerts</span>
                <Badge variant="destructive" className="ml-auto">
                  {alerts?.active || 0}
                </Badge>
              </CardTitle>
              <CardDescription>
                {alerts?.critical || 0} critical, {alerts?.resolved_today || 0} resolved today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8A8F98]">Critical</span>
                  <Badge variant="destructive" className="text-xs">
                    {alerts?.critical || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8A8F98]">High</span>
                  <Badge variant="secondary" className="text-xs">
                    {Math.max(0, (alerts?.active || 0) - (alerts?.critical || 0))}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E5E7EB] shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5 text-[#3AC569]" />
                <span>Service Health</span>
                <Badge 
                  variant={health_checks?.healthy_services === health_checks?.total_services ? "default" : "secondary"}
                  className="ml-auto"
                >
                  {health_checks?.healthy_services || 0}/{health_checks?.total_services || 0}
                </Badge>
              </CardTitle>
              <CardDescription>
                {health_checks?.degraded_services || 0} degraded services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8A8F98]">Healthy</span>
                  <Badge variant="default" className="text-xs bg-[#3AC569]">
                    {health_checks?.healthy_services || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#8A8F98]">Degraded</span>
                  <Badge variant="secondary" className="text-xs">
                    {health_checks?.degraded_services || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Monitoring Tabs */}
        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border-[#E5E7EB]">
            <TabsTrigger value="metrics" className="data-[state=active]:bg-[#E9F3FE] data-[state=active]:text-[#4998F3]">
              <Activity className="h-4 w-4 mr-2" />
              Metrics
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-[#E9F3FE] data-[state=active]:text-[#4998F3]">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="health" className="data-[state=active]:bg-[#E9F3FE] data-[state=active]:text-[#4998F3]">
              <CheckCircle className="h-4 w-4 mr-2" />
              Health Checks
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-[#E9F3FE] data-[state=active]:text-[#4998F3]">
              <FileText className="h-4 w-4 mr-2" />
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-6">
            <MetricsOverview />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertsPanel />
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <HealthChecksPanel />
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <LogsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}