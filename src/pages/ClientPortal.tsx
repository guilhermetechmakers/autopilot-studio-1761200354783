import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  FileText, 
  Download,
  Eye,
  MessageCircle,
  Calendar
} from "lucide-react";

export default function ClientPortal() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">E-commerce Platform</h1>
              <p className="text-muted-foreground">Project Dashboard • TechCorp Inc</p>
            </div>
            <Badge variant="outline" className="text-success border-success">
              <CheckCircle className="w-3 h-3 mr-1" />
              On Track
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Project Overview */}
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Next Milestone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Testing</div>
              <p className="text-xs text-muted-foreground">Starts Feb 10</p>
            </CardContent>
          </Card>
        </div>

        {/* Deliverables */}
        <Card>
          <CardHeader>
            <CardTitle>Project Deliverables</CardTitle>
            <CardDescription>Track the progress of key project components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Project Setup & Planning",
                  status: "completed",
                  progress: 100,
                  description: "Initial project setup, requirements gathering, and planning documentation",
                  files: ["Project Charter.pdf", "Requirements.docx", "Timeline.xlsx"]
                },
                {
                  name: "UI/UX Design",
                  status: "completed", 
                  progress: 100,
                  description: "Complete design system, wireframes, and high-fidelity mockups",
                  files: ["Design System.pdf", "Wireframes.fig", "Mockups.fig"]
                },
                {
                  name: "Frontend Development",
                  status: "in_progress",
                  progress: 75,
                  description: "React-based frontend with responsive design and user interactions",
                  files: ["Frontend Code", "Component Library", "Style Guide"]
                },
                {
                  name: "Backend Development",
                  status: "in_progress",
                  progress: 60,
                  description: "Node.js API with database integration and authentication",
                  files: ["API Documentation", "Database Schema", "Auth System"]
                },
                {
                  name: "Testing & QA",
                  status: "pending",
                  progress: 0,
                  description: "Comprehensive testing including unit, integration, and user acceptance testing",
                  files: []
                }
              ].map((deliverable, index) => (
                <div key={index} className="border border-border rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{deliverable.name}</h3>
                      <p className="text-muted-foreground mb-3">{deliverable.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Progress value={deliverable.progress} className="mb-2" />
                          <p className="text-sm text-muted-foreground">{deliverable.progress}% complete</p>
                        </div>
                        <Badge variant={deliverable.status === "completed" ? "default" : "secondary"}>
                          {deliverable.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {deliverable.files.length > 0 && (
                    <div className="border-t border-border pt-4">
                      <h4 className="text-sm font-medium text-foreground mb-3">Available Files</h4>
                      <div className="flex flex-wrap gap-2">
                        {deliverable.files.map((file, fileIndex) => (
                          <Button key={fileIndex} variant="outline" size="sm" className="h-8">
                            <FileText className="w-3 h-3 mr-2" />
                            {file}
                            <Download className="w-3 h-3 ml-2" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Communication */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
              <CardDescription>Latest project communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: "milestone",
                    title: "Frontend Development 75% Complete",
                    message: "Major UI components are now implemented and responsive design is working across all devices.",
                    time: "2 hours ago",
                    author: "John Doe"
                  },
                  {
                    type: "update",
                    title: "API Integration Progress",
                    message: "Authentication system is complete and payment gateway integration is in progress.",
                    time: "1 day ago",
                    author: "Jane Smith"
                  },
                  {
                    type: "question",
                    title: "Design Review Needed",
                    message: "Please review the updated checkout flow design and provide feedback.",
                    time: "2 days ago",
                    author: "Mike Johnson"
                  }
                ].map((update, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border border-border rounded-xl">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{update.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{update.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{update.author} • {update.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Milestones</CardTitle>
              <CardDescription>Key dates and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Testing Phase Begins",
                    date: "Feb 10, 2024",
                    status: "upcoming",
                    description: "Comprehensive testing of all features"
                  },
                  {
                    name: "Client Review Meeting",
                    date: "Feb 12, 2024",
                    status: "upcoming", 
                    description: "Demo and feedback session"
                  },
                  {
                    name: "Project Delivery",
                    date: "Feb 15, 2024",
                    status: "upcoming",
                    description: "Final delivery and handover"
                  }
                ].map((milestone, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-border rounded-xl">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{milestone.name}</h4>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{milestone.date}</p>
                      <Badge variant="outline">{milestone.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Project Actions</CardTitle>
            <CardDescription>Available actions for this project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex-col gap-2">
                <Eye className="w-6 h-6" />
                <span>View Live Demo</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <MessageCircle className="w-6 h-6" />
                <span>Send Message</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Download className="w-6 h-6" />
                <span>Download Files</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}