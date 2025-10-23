// User types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'admin' | 'owner' | 'pm' | 'dev' | 'client' | 'billing';
  company_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  domain?: string;
  logo_url?: string;
  plan: 'free' | 'pro' | 'enterprise';
  created_at: string;
  updated_at: string;
}

// Project types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  budget: number;
  currency: string;
  start_date: string;
  end_date?: string;
  client_id: string;
  team_lead_id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  budget: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  milestone_id?: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

// Intake types
export interface Intake {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string;
  project_goals: string;
  budget_range: string;
  timeline: string;
  tech_stack: string[];
  attachments: string[];
  qualification_score: number;
  status: 'pending' | 'qualified' | 'disqualified' | 'converted';
  created_at: string;
  updated_at: string;
}

// Proposal types
export interface Proposal {
  id: string;
  intake_id: string;
  project_id?: string;
  title: string;
  content: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected';
  version: number;
  total_amount: number;
  currency: string;
  valid_until: string;
  created_at: string;
  updated_at: string;
}

// Invoice types
export interface Invoice {
  id: string;
  project_id: string;
  invoice_number: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  amount: number;
  currency: string;
  due_date: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

// Meeting types
export interface Meeting {
  id: string;
  project_id: string;
  title: string;
  description: string;
  scheduled_at: string;
  duration: number;
  attendees: string[];
  recording_url?: string;
  transcript?: string;
  minutes?: string;
  action_items: ActionItem[];
  created_at: string;
  updated_at: string;
}

export interface ActionItem {
  id: string;
  meeting_id: string;
  description: string;
  assignee_id: string;
  due_date: string;
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
}

// Notification types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  action_url?: string;
  created_at: string;
}

// Dashboard types
export interface DashboardStats {
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  total_revenue: number;
  monthly_revenue: number;
  open_tickets: number;
  pending_invoices: number;
  team_members: number;
}

export interface PipelineData {
  stage: string;
  count: number;
  value: number;
}

// Chart data types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface SignupForm {
  full_name: string;
  email: string;
  password: string;
  company_name: string;
  accept_terms: boolean;
}

export interface CreateProjectForm {
  name: string;
  description: string;
  budget: number;
  currency: string;
  start_date: string;
  end_date?: string;
  client_id: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}