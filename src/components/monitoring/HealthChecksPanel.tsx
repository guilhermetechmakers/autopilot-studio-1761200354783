import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CheckCircle, 
  Clock, 
  Filter, 
  MoreHorizontal, 
  RefreshCw,
  Search,
  Server,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useMonitoringHealthChecks, useUpsertHealthCheck, useUpdateHealthCheck, useDeleteHealthCheck } from '@/hooks/useMonitoring';
import { format, formatDistanceToNow } from 'date-fns';
import type { MonitoringHealthCheck, HealthCheckFilter } from '@/types/monitoring';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'healthy', label: 'Healthy' },
  { value: 'degraded', label: 'Degraded' },
  { value: 'unhealthy', label: 'Unhealthy' },
];

export function HealthChecksPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch health checks data
  const { data: healthChecksData, isLoading, error } = useMonitoringHealthChecks(
    {
      status: statusFilter as HealthCheckFilter['status'] || undefined,
    },
    currentPage,
    pageSize
  );

  // Mutations
  const updateHealthCheckMutation = useUpdateHealthCheck();
  const deleteHealthCheckMutation = useDeleteHealthCheck();

  const healthChecks = (healthChecksData as { data: MonitoringHealthCheck[]; pagination: { page: number; limit: number; total: number; pages: number } } | undefined)?.data || [];
  const pagination = (healthChecksData as { data: MonitoringHealthCheck[]; pagination: { page: number; limit: number; total: number; pages: number } } | undefined)?.pagination;

  // Filter health checks by search term
  const filteredHealthChecks = healthChecks.filter((check: MonitoringHealthCheck) =>
    check.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    check.endpoint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-[#3AC569] text-white';
      case 'degraded':
        return 'bg-[#FFA86A] text-white';
      case 'unhealthy':
        return 'bg-[#F44336] text-white';
      default:
        return 'bg-[#EDEDED] text-[#8A8F98]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4" />;
      case 'unhealthy':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Server className="h-4 w-4" />;
    }
  };

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime < 100) return 'text-[#3AC569]';
    if (responseTime < 500) return 'text-[#FFA86A]';
    return 'text-[#F44336]';
  };

  const handleDeleteHealthCheck = async (healthCheckId: string) => {
    try {
      await deleteHealthCheckMutation.mutateAsync(healthCheckId);
    } catch (error) {
      console.error('Failed to delete health check:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-[#4998F3]" />
          <span className="text-[#8A8F98]">Loading health checks...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-[#F44336] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#151A29] mb-2">Failed to load health checks</h3>
          <p className="text-[#8A8F98]">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <Card className="bg-white border-[#E5E7EB] shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-[#151A29]">Health Checks</CardTitle>
              <CardDescription>
                Monitor the health and availability of your services and endpoints
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2 flex-1 min-w-64">
              <Search className="h-4 w-4 text-[#8A8F98]" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-[#8A8F98]" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Checks List */}
      <div className="space-y-4">
        {filteredHealthChecks.length === 0 ? (
          <Card className="bg-white border-[#E5E7EB] shadow-sm">
            <CardContent className="py-12">
              <div className="text-center">
                <Server className="h-12 w-12 text-[#EDEDED] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#151A29] mb-2">No health checks found</h3>
                <p className="text-[#8A8F98]">
                  {searchTerm || statusFilter
                    ? 'No health checks match your current filters'
                    : 'No health checks have been configured yet'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredHealthChecks.map((healthCheck: MonitoringHealthCheck) => (
            <Card key={healthCheck.id} className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-[#151A29]">
                        {healthCheck.service_name}
                      </h3>
                      <Badge className={`${getStatusColor(healthCheck.status)} px-2 py-1 text-xs flex items-center space-x-1`}>
                        {getStatusIcon(healthCheck.status)}
                        <span>{healthCheck.status.toUpperCase()}</span>
                      </Badge>
                    </div>

                    <div className="text-sm text-[#8A8F98]">
                      <span className="font-medium">Endpoint:</span> {healthCheck.endpoint}
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-[#8A8F98]">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          Last check: {formatDistanceToNow(new Date(healthCheck.last_check), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>Response time:</span>
                        <span className={`font-medium ${getResponseTimeColor(healthCheck.response_time)}`}>
                          {healthCheck.response_time}ms
                        </span>
                      </div>
                    </div>

                    {healthCheck.error_message && (
                      <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <XCircle className="h-4 w-4 text-[#F44336] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-[#F44336]">Error</p>
                            <p className="text-sm text-[#DC2626]">{healthCheck.error_message}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {Object.keys(healthCheck.metadata).length > 0 && (
                      <div className="bg-[#F8F9FB] rounded-lg p-3">
                        <p className="text-sm font-medium text-[#8A8F98] mb-2">Metadata</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          {Object.entries(healthCheck.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-[#8A8F98]">{key}:</span>
                              <span className="text-[#151A29] font-medium">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteHealthCheck(healthCheck.id)}
                      disabled={deleteHealthCheckMutation.isPending}
                      className="text-[#F44336] hover:bg-[#F44336] hover:text-white"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <Card className="bg-white border-[#E5E7EB] shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#8A8F98]">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} health checks
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-[#8A8F98]">
                  Page {currentPage} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                  disabled={currentPage === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}