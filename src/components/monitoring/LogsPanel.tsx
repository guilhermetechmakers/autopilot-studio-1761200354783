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
  XCircle,
  Info,
  AlertCircle
} from 'lucide-react';
import { useMonitoringLogs } from '@/hooks/useMonitoring';
import { format } from 'date-fns';
import type { LogEntry, LogFilter } from '@/types/monitoring';

const LEVEL_OPTIONS = [
  { value: '', label: 'All Levels' },
  { value: 'debug', label: 'Debug' },
  { value: 'info', label: 'Info' },
  { value: 'warn', label: 'Warning' },
  { value: 'error', label: 'Error' },
  { value: 'fatal', label: 'Fatal' },
];

const SERVICE_OPTIONS = [
  { value: '', label: 'All Services' },
  { value: 'api', label: 'API' },
  { value: 'database', label: 'Database' },
  { value: 'auth', label: 'Authentication' },
  { value: 'worker', label: 'Worker' },
  { value: 'scheduler', label: 'Scheduler' },
];

export function LogsPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Fetch logs data
  const { data: logsData, isLoading, error } = useMonitoringLogs(
    {
      level: levelFilter as LogFilter['level'] || undefined,
      service: serviceFilter || undefined,
      search: searchTerm || undefined,
    },
    currentPage,
    pageSize
  );

  const logs = (logsData as { data: LogEntry[]; pagination: { page: number; limit: number; total: number; pages: number } } | undefined)?.data || [];
  const pagination = (logsData as { data: LogEntry[]; pagination: { page: number; limit: number; total: number; pages: number } } | undefined)?.pagination;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
      case 'fatal':
        return 'bg-[#F44336] text-white';
      case 'warn':
        return 'bg-[#FFA86A] text-white';
      case 'info':
        return 'bg-[#4998F3] text-white';
      case 'debug':
        return 'bg-[#8A8F98] text-white';
      default:
        return 'bg-[#EDEDED] text-[#8A8F98]';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
      case 'fatal':
        return <XCircle className="h-4 w-4" />;
      case 'warn':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'debug':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-[#4998F3]" />
          <span className="text-[#8A8F98]">Loading logs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-[#F44336] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#151A29] mb-2">Failed to load logs</h3>
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
              <CardTitle className="text-lg font-semibold text-[#151A29]">System Logs</CardTitle>
              <CardDescription>
                Monitor application logs and system events
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
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-[#8A8F98]" />
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {LEVEL_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_OPTIONS.map(option => (
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

      {/* Logs List */}
      <div className="space-y-4">
        {logs.length === 0 ? (
          <Card className="bg-white border-[#E5E7EB] shadow-sm">
            <CardContent className="py-12">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-[#EDEDED] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#151A29] mb-2">No logs found</h3>
                <p className="text-[#8A8F98]">
                  {searchTerm || levelFilter || serviceFilter
                    ? 'No logs match your current filters'
                    : 'No logs have been generated recently'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          logs.map((log: LogEntry) => (
            <Card key={log.id} className="bg-white border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getLevelColor(log.level)} px-2 py-1 text-xs flex items-center space-x-1`}>
                        {getLevelIcon(log.level)}
                        <span>{log.level.toUpperCase()}</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {log.service}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-[#8A8F98]">
                        <Clock className="h-4 w-4" />
                        <span>
                          {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                        </span>
                      </div>
                    </div>

                    <p className="text-[#151A29] text-sm font-medium">
                      {log.message}
                    </p>

                    {Object.keys(log.context).length > 0 && (
                      <div className="bg-[#F8F9FB] rounded-lg p-3">
                        <p className="text-sm font-medium text-[#8A8F98] mb-2">Context</p>
                        <pre className="text-xs text-[#151A29] overflow-x-auto">
                          {JSON.stringify(log.context, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[#8A8F98] hover:bg-[#8A8F98] hover:text-white"
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
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} logs
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