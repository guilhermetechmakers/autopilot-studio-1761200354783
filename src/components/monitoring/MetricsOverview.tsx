import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  BarChart3, 
  Calendar, 
  Download, 
  Filter, 
  RefreshCw,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useMonitoringMetrics, useMetricTimeSeries } from '@/hooks/useMonitoring';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, subHours, subDays } from 'date-fns';
import type { MetricTimeSeries } from '@/types/monitoring';

const METRIC_OPTIONS = [
  { value: 'total_requests', label: 'Total Requests' },
  { value: 'error_rate', label: 'Error Rate' },
  { value: 'avg_response_time', label: 'Average Response Time' },
  { value: 'active_users', label: 'Active Users' },
  { value: 'cpu_usage', label: 'CPU Usage' },
  { value: 'memory_usage', label: 'Memory Usage' },
  { value: 'disk_usage', label: 'Disk Usage' },
  { value: 'database_connections', label: 'Database Connections' },
];

const TIME_RANGES = [
  { value: '1h', label: 'Last Hour' },
  { value: '6h', label: 'Last 6 Hours' },
  { value: '24h', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
];

export function MetricsOverview() {
  const [selectedMetric, setSelectedMetric] = useState('total_requests');
  const [timeRange, setTimeRange] = useState('24h');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // Calculate time range
  const getTimeRange = (range: string) => {
    const now = new Date();
    switch (range) {
      case '1h':
        return { start: subHours(now, 1), end: now };
      case '6h':
        return { start: subHours(now, 6), end: now };
      case '24h':
        return { start: subHours(now, 24), end: now };
      case '7d':
        return { start: subDays(now, 7), end: now };
      case '30d':
        return { start: subDays(now, 30), end: now };
      default:
        return { start: subHours(now, 24), end: now };
    }
  };

  const { start, end } = getTimeRange(timeRange);
  const startTime = start.toISOString();
  const endTime = end.toISOString();

  // Fetch metrics data
  const { data: metricsData, isLoading: metricsLoading } = useMonitoringMetrics({
    metric_name: selectedMetric,
    start_time: startTime,
    end_time: endTime,
  }, 1, 1000);

  // Fetch time series data
  const { data: timeSeriesData, isLoading: timeSeriesLoading } = useMetricTimeSeries(
    selectedMetric,
    startTime,
    endTime
  );

  // Process chart data
  const chartData = (timeSeriesData as MetricTimeSeries[] | undefined)?.map((item: MetricTimeSeries) => ({
    timestamp: format(new Date(item.timestamp), 'MMM dd HH:mm'),
    value: item.value,
    fullTimestamp: item.timestamp,
  })) || [];

  // Calculate statistics
  const stats = React.useMemo(() => {
    const timeSeries = timeSeriesData as MetricTimeSeries[] | undefined;
    if (!timeSeries?.length) {
      return {
        current: 0,
        average: 0,
        min: 0,
        max: 0,
        trend: 'stable' as const,
      };
    }

    const values = timeSeries.map((item: MetricTimeSeries) => item.value);
    const current = values[values.length - 1] || 0;
    const average = values.reduce((sum: number, val: number) => sum + val, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    // Calculate trend (comparing first half vs second half)
    const midPoint = Math.floor(values.length / 2);
    const firstHalf = values.slice(0, midPoint);
    const secondHalf = values.slice(midPoint);
    const firstAvg = firstHalf.reduce((sum: number, val: number) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum: number, val: number) => sum + val, 0) / secondHalf.length;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (secondAvg > firstAvg * 1.05) trend = 'up';
    else if (secondAvg < firstAvg * 0.95) trend = 'down';

    return { current, average, min, max, trend };
  }, [timeSeriesData]);

  const isLoading = metricsLoading || timeSeriesLoading;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-white border-[#E5E7EB] shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#151A29]">Metrics Overview</CardTitle>
          <CardDescription>
            Monitor key performance indicators and system metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-[#8A8F98]" />
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  {METRIC_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-[#8A8F98]" />
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_RANGES.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-[#8A8F98]" />
              <Select value={chartType} onValueChange={(value: 'line' | 'bar') => setChartType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" className="ml-auto">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-[#E5E7EB] shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8A8F98]">Current Value</p>
                <p className="text-2xl font-bold text-[#151A29]">
                  {isLoading ? '...' : stats.current.toLocaleString()}
                </p>
              </div>
              <Activity className="h-8 w-8 text-[#4998F3]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E5E7EB] shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8A8F98]">Average</p>
                <p className="text-2xl font-bold text-[#151A29]">
                  {isLoading ? '...' : stats.average.toFixed(2)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-[#3AC569]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E5E7EB] shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8A8F98]">Min</p>
                <p className="text-2xl font-bold text-[#151A29]">
                  {isLoading ? '...' : stats.min.toLocaleString()}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-[#F44336]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E5E7EB] shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8A8F98]">Max</p>
                <p className="text-2xl font-bold text-[#151A29]">
                  {isLoading ? '...' : stats.max.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-[#FFA86A]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Indicator */}
      <Card className="bg-white border-[#E5E7EB] shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[#8A8F98]">Trend:</span>
              <Badge 
                variant={stats.trend === 'up' ? 'default' : stats.trend === 'down' ? 'destructive' : 'secondary'}
                className={stats.trend === 'up' ? 'bg-[#3AC569]' : stats.trend === 'down' ? 'bg-[#F44336]' : ''}
              >
                <div className="flex items-center space-x-1">
                  {stats.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                  {stats.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                  <span className="capitalize">{stats.trend}</span>
                </div>
              </Badge>
            </div>
            <div className="text-sm text-[#8A8F98]">
              {timeRange} • {chartData.length} data points
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="bg-white border-[#E5E7EB] shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#151A29]">
            {METRIC_OPTIONS.find(m => m.value === selectedMetric)?.label} - {timeRange}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-6 w-6 animate-spin text-[#4998F3]" />
                  <span className="text-[#8A8F98]">Loading chart data...</span>
                </div>
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-[#EDEDED] mx-auto mb-4" />
                  <p className="text-[#8A8F98]">No data available for the selected time range</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="#8A8F98"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#8A8F98"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#12223E',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4998F3"
                      strokeWidth={2}
                      dot={{ fill: '#4998F3', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#4998F3', strokeWidth: 2 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="timestamp" 
                      stroke="#8A8F98"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#8A8F98"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#12223E',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                      }}
                    />
                    <Bar dataKey="value" fill="#4998F3" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}