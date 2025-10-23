import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Filter, 
  MoreHorizontal, 
  RefreshCw,
  Search,
  X
} from 'lucide-react';
import { useMonitoringAlerts, useResolveAlert, useSuppressAlert, useDeleteAlert } from '@/hooks/useMonitoring';
import { format } from 'date-fns';
import type { MonitoringAlert, AlertFilter } from '@/types/monitoring';

const SEVERITY_OPTIONS = [
  { value: '', label: 'All Severities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'suppressed', label: 'Suppressed' },
];

export function AlertsPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch alerts data
  const { data: alertsData, isLoading, error } = useMonitoringAlerts(
    {
      severity: severityFilter as AlertFilter['severity'] || undefined,
      status: statusFilter as AlertFilter['status'] || undefined,
    },
    currentPage,
    pageSize
  );

  // Mutations
  const resolveAlertMutation = useResolveAlert();
  const suppressAlertMutation = useSuppressAlert();
  const deleteAlertMutation = useDeleteAlert();

  const alerts = (alertsData as { data: MonitoringAlert[]; pagination: { page: number; limit: number; total: number; pages: number } } | undefined)?.data || [];
  const pagination = (alertsData as { data: MonitoringAlert[]; pagination: { page: number; limit: number; total: number; pages: number } } | undefined)?.pagination;

  // Filter alerts by search term
  const filteredAlerts = alerts.filter((alert: MonitoringAlert) =>
    alert.alert_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-[#F44336] text-white';
      case 'high':
        return 'bg-[#FF9800] text-white';
      case 'medium':
        return 'bg-[#FFA86A] text-white';
      case 'low':
        return 'bg-[#8A8F98] text-white';
      default:
        return 'bg-[#EDEDED] text-[#8A8F98]';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[#F44336] text-white';
      case 'resolved':
        return 'bg-[#3AC569] text-white';
      case 'suppressed':
        return 'bg-[#8A8F98] text-white';
      default:
        return 'bg-[#EDEDED] text-[#8A8F98]';
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      await resolveAlertMutation.mutateAsync(alertId);
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  const handleSuppressAlert = async (alertId: string) => {
    try {
      await suppressAlertMutation.mutateAsync(alertId);
    } catch (error) {
      console.error('Failed to suppress alert:', error);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await deleteAlertMutation.mutateAsync(alertId);
    } catch (error) {
      console.error('Failed to delete alert:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-[#4998F3]" />
          <span className="text-[#8A8F98]">Loading alerts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-[#F44336] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#151A29] mb-2">Failed to load alerts</h3>
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
              <CardTitle className="text-lg font-semibold text-[#151A29]">Alerts</CardTitle>
              <CardDescription>
                Monitor and manage system alerts and notifications
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
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-[#8A8F98]" />
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  {SEVERITY_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card className="bg-white border-[#E5E7EB] shadow-sm">
            <CardContent className="py-12">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-[#EDEDED] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#151A29] mb-2">No alerts found</h3>
                <p className="text-[#8A8F98]">
                  {searchTerm || severityFilter || statusFilter
                    ? 'No alerts match your current filters'
                    : 'No alerts have been triggered recently'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert: MonitoringAlert) => (
            <Card key={alert.id} className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-[#151A29]">
                        {alert.alert_name}
                      </h3>
                      <Badge className={`${getSeverityColor(alert.severity)} px-2 py-1 text-xs`}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge className={`${getStatusColor(alert.status)} px-2 py-1 text-xs`}>
                        {alert.status.toUpperCase()}
                      </Badge>
                    </div>

                    {alert.description && (
                      <p className="text-[#8A8F98] text-sm">
                        {alert.description}
                      </p>
                    )}

                    <div className="flex items-center space-x-6 text-sm text-[#8A8F98]">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          Triggered: {format(new Date(alert.triggered_at), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                      {alert.resolved_at && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>
                            Resolved: {format(new Date(alert.resolved_at), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-[#8A8F98]">Threshold:</span>
                        <span className="font-medium text-[#151A29]">
                          {alert.threshold_value}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[#8A8F98]">Current:</span>
                        <span className="font-medium text-[#151A29]">
                          {alert.current_value}
                        </span>
                      </div>
                    </div>

                    {alert.notification_channels.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-[#8A8F98]">Notifications:</span>
                        <div className="flex space-x-1">
                          {alert.notification_channels.map((channel: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {alert.status === 'active' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveAlert(alert.id)}
                          disabled={resolveAlertMutation.isPending}
                          className="text-[#3AC569] hover:bg-[#3AC569] hover:text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSuppressAlert(alert.id)}
                          disabled={suppressAlertMutation.isPending}
                          className="text-[#8A8F98] hover:bg-[#8A8F98] hover:text-white"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Suppress
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteAlert(alert.id)}
                      disabled={deleteAlertMutation.isPending}
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
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} alerts
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