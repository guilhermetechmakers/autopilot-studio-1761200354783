import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building2, 
  DollarSign, 
  Activity,
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">System administration and monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-success border-success">
              <CheckCircle className="w-3 h-3 mr-1" />
              System Healthy
            </Badge>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">1,247</div>
              <p className="text-xs text-success flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Companies
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">89</div>
              <p className="text-xs text-muted-foreground">
                +5 new this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$45,230</div>
              <p className="text-xs text-success flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                +8.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                System Uptime
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">99.9%</div>
              <p className="text-xs text-success">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Current system status and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "API Response Time", status: "healthy", value: "120ms", threshold: "< 200ms" },
                  { name: "Database Performance", status: "healthy", value: "45ms", threshold: "< 100ms" },
                  { name: "Memory Usage", status: "warning", value: "78%", threshold: "< 80%" },
                  { name: "CPU Usage", status: "healthy", value: "45%", threshold: "< 70%" },
                  { name: "Disk Space", status: "healthy", value: "62%", threshold: "< 85%" }
                ].map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">{metric.name}</h4>
                      <p className="text-sm text-muted-foreground">{metric.threshold}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{metric.value}</p>
                      <Badge 
                        variant={metric.status === "healthy" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: "user",
                    message: "New user registration: john@techcorp.com",
                    time: "5 minutes ago",
                    icon: Users
                  },
                  {
                    type: "system",
                    message: "Database backup completed successfully",
                    time: "1 hour ago",
                    icon: Shield
                  },
                  {
                    type: "warning",
                    message: "High memory usage detected on server-02",
                    time: "2 hours ago",
                    icon: AlertTriangle
                  },
                  {
                    type: "success",
                    message: "Payment processed: $2,500 for TechFlow Agency",
                    time: "3 hours ago",
                    icon: DollarSign
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === "warning" ? "bg-destructive/10" :
                      activity.type === "success" ? "bg-success/10" :
                      "bg-primary/10"
                    }`}>
                      <activity.icon className={`w-4 h-4 ${
                        activity.type === "warning" ? "text-destructive" :
                        activity.type === "success" ? "text-success" :
                        "text-primary"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage users, roles, and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Recent Users</h3>
                <Button variant="outline">View All Users</Button>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: "John Doe", email: "john@techcorp.com", role: "Admin", status: "active", lastActive: "2 hours ago" },
                  { name: "Jane Smith", email: "jane@startupxyz.com", role: "Owner", status: "active", lastActive: "1 day ago" },
                  { name: "Mike Johnson", email: "mike@enterprise.com", role: "PM", status: "pending", lastActive: "Never" },
                  { name: "Sarah Wilson", email: "sarah@agency.com", role: "Dev", status: "active", lastActive: "3 hours ago" }
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{user.role}</Badge>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{user.lastActive}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Active alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  type: "warning",
                  title: "High Memory Usage",
                  message: "Server-02 is using 78% of available memory",
                  time: "2 hours ago",
                  action: "Investigate"
                },
                {
                  type: "info",
                  title: "Scheduled Maintenance",
                  message: "Database maintenance scheduled for tonight at 2 AM",
                  time: "4 hours ago",
                  action: "View Details"
                },
                {
                  type: "success",
                  title: "Backup Completed",
                  message: "Daily backup completed successfully",
                  time: "6 hours ago",
                  action: "View Logs"
                }
              ].map((alert, index) => (
                <div key={index} className={`flex items-start gap-4 p-4 border rounded-xl ${
                  alert.type === "warning" ? "border-destructive/20 bg-destructive/5" :
                  alert.type === "info" ? "border-primary/20 bg-primary/5" :
                  "border-success/20 bg-success/5"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    alert.type === "warning" ? "bg-destructive/10" :
                    alert.type === "info" ? "bg-primary/10" :
                    "bg-success/10"
                  }`}>
                    {alert.type === "warning" ? (
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    ) : alert.type === "info" ? (
                      <Clock className="w-4 h-4 text-primary" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-success" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{alert.time}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {alert.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}