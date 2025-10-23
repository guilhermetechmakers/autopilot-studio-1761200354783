import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Server,
  TrendingUp,
  Users
} from 'lucide-react';

interface SystemStatusProps {
  metrics?: {
    total_requests: number;
    error_rate: number;
    average_response_time: number;
    active_users: number;
  };
  alerts?: {
    active: number;
    critical: number;
    resolved_today: number;
  };
  healthChecks?: {
    healthy_services: number;
    total_services: number;
    degraded_services: number;
  };
  logs?: {
    error_count: number;
    warning_count: number;
    info_count: number;
  };
}

export function SystemStatus({ metrics, alerts, healthChecks, logs }: SystemStatusProps) {
  const getOverallStatus = () => {
    if (!alerts || !healthChecks) return 'unknown';
    
    if (alerts.critical > 0) return 'critical';
    if (alerts.active > 0 || healthChecks.degraded_services > 0) return 'warning';
    if (healthChecks.healthy_services === healthChecks.total_services) return 'healthy';
    return 'degraded';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-[#3AC569] text-white';
      case 'warning':
        return 'bg-[#FFA86A] text-white';
      case 'critical':
        return 'bg-[#F44336] text-white';
      case 'degraded':
        return 'bg-[#8A8F98] text-white';
      default:
        return 'bg-[#EDEDED] text-[#8A8F98]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5" />;
      case 'degraded':
        return <Server className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <Card className="bg-white border-[#E5E7EB] shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-[#151A29]">
            System Status
          </CardTitle>
          <Badge className={`${getStatusColor(overallStatus)} px-3 py-1`}>
            <div className="flex items-center space-x-2">
              {getStatusIcon(overallStatus)}
              <span className="capitalize">{overallStatus}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Performance Metrics */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[#8A8F98] flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Performance
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8F98]">Requests</span>
                <span className="font-medium text-[#151A29]">
                  {metrics?.total_requests?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8F98]">Response Time</span>
                <span className="font-medium text-[#151A29]">
                  {metrics?.average_response_time?.toFixed(0) || '0'}ms
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8F98]">Error Rate</span>
                <span className={`font-medium ${(metrics?.error_rate || 0) > 5 ? 'text-[#F44336]' : 'text-[#151A29]'}`}>
                  {metrics?.error_rate?.toFixed(2) || '0.00'}%
                </span>
              </div>
            </div>
          </div>

          {/* Alerts Status */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[#8A8F98] flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerts
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8F98]">Active</span>
                <Badge variant={alerts?.active ? "destructive" : "secondary"} className="text-xs">
                  {alerts?.active || 0}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8F98]">Critical</span>
                <Badge variant={alerts?.critical ? "destructive" : "secondary"} className="text-xs">
                  {alerts?.critical || 0}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8F98]">Resolved Today</span>
                <span className="font-medium text-[#3AC569]">
                  {alerts?.resolved_today || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Service Health */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[#8A8F98] flex items-center">
              <Server className="h-4 w-4 mr-2" />
              Services
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8F98]">Healthy</span>
                <Badge variant="default" className="text-xs bg-[#3AC569]">
                  {healthChecks?.healthy_services || 0}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8F98]">Degraded</span>
                <Badge variant="secondary" className="text-xs">
                  {healthChecks?.degraded_services || 0}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8F98]">Total</span>
                <span className="font-medium text-[#151A29]">
                  {healthChecks?.total_services || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Log Activity */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-[#8A8F98] flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Logs (1h)
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8F98]">Errors</span>
                <Badge variant={logs?.error_count ? "destructive" : "secondary"} className="text-xs">
                  {logs?.error_count || 0}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8F98]">Warnings</span>
                <Badge variant={logs?.warning_count ? "secondary" : "outline"} className="text-xs">
                  {logs?.warning_count || 0}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#8A8F98]">Info</span>
                <span className="font-medium text-[#151A29]">
                  {logs?.info_count || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}