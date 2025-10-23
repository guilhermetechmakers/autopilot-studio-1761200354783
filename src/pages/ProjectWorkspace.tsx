import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle,
  Bot,
  GitBranch,
  ExternalLink
} from "lucide-react";

export default function ProjectWorkspace() {
  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Project Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">E-commerce Platform</h1>
            <p className="text-muted-foreground">TechCorp Inc • Active Project</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-success border-success">
              <CheckCircle className="w-3 h-3 mr-1" />
              On Track
            </Badge>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Client Portal
            </Button>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">75%</div>
              <Progress value={75} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$25,000</div>
              <p className="text-xs text-muted-foreground">$18,750 spent</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">12 days</div>
              <p className="text-xs text-muted-foreground">Due Feb 15, 2024</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">5</div>
              <p className="text-xs text-muted-foreground">Active members</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Milestones */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
                <CardDescription>Track progress through key deliverables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Project Setup", status: "completed", progress: 100 },
                    { name: "Design Phase", status: "completed", progress: 100 },
                    { name: "Development", status: "in_progress", progress: 75 },
                    { name: "Testing", status: "pending", progress: 0 },
                    { name: "Launch", status: "pending", progress: 0 }
                  ].map((milestone, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-border rounded-xl">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{milestone.name}</h4>
                        <Progress value={milestone.progress} className="mt-2" />
                      </div>
                      <Badge variant={milestone.status === "completed" ? "default" : "secondary"}>
                        {milestone.status.replace("_", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Copilot */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI Copilot
                </CardTitle>
                <CardDescription>Your AI assistant for this project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <h4 className="font-medium text-foreground mb-2">Recent Suggestions</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Consider adding user authentication</li>
                      <li>• Implement payment gateway integration</li>
                      <li>• Add mobile responsiveness</li>
                    </ul>
                  </div>
                  
                  <Button className="w-full">
                    <Bot className="w-4 h-4 mr-2" />
                    Ask AI Assistant
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tasks and Repository */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Latest task updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Implement user dashboard", status: "completed", assignee: "John Doe" },
                  { name: "Add payment integration", status: "in_progress", assignee: "Jane Smith" },
                  { name: "Write API documentation", status: "pending", assignee: "Mike Johnson" }
                ].map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">{task.name}</h4>
                      <p className="text-sm text-muted-foreground">{task.assignee}</p>
                    </div>
                    <Badge variant={task.status === "completed" ? "default" : "secondary"}>
                      {task.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Repository Activity</CardTitle>
              <CardDescription>Latest commits and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { message: "feat: add user authentication", author: "John Doe", time: "2 hours ago" },
                  { message: "fix: resolve payment bug", author: "Jane Smith", time: "4 hours ago" },
                  { message: "docs: update API docs", author: "Mike Johnson", time: "1 day ago" }
                ].map((commit, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                    <GitBranch className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{commit.message}</p>
                      <p className="text-xs text-muted-foreground">{commit.author} • {commit.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}