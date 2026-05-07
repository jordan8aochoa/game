export type UserRole =
  | "ADMIN"
  | "GENERAL_CONTRACTOR"
  | "SUBCONTRACTOR"
  | "FOREMAN"
  | "OWNER"
  | "VIEWER";

export type ProjectStatus = "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";

export type ChangeOrderStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "REVIEWED"
  | "APPROVED"
  | "REJECTED"
  | "PAID";

export type TMTicketStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "PAID";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  companyId?: string;
  company?: Company;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  address?: string;
  status: ProjectStatus;
  budget?: number;
  startDate?: string;
  endDate?: string;
  companyId: string;
  company?: Company;
  members?: ProjectMember[];
  _count?: {
    changeOrders: number;
    tmTickets: number;
    members: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: UserRole;
  user?: User;
  joinedAt: string;
}

export interface ChangeOrder {
  id: string;
  number: string;
  title: string;
  description?: string;
  status: ChangeOrderStatus;
  priority: Priority;
  version: number;
  projectId: string;
  project?: Project;
  createdById: string;
  createdBy?: User;
  laborCost: number;
  materialCost: number;
  equipmentCost: number;
  markupPercent: number;
  totalCost: number;
  aiSummary?: string;
  submittedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  laborEntries?: LaborEntry[];
  materialEntries?: MaterialEntry[];
  attachments?: Attachment[];
  comments?: Comment[];
  approvals?: Approval[];
  createdAt: string;
  updatedAt: string;
}

export interface TMTicket {
  id: string;
  number: string;
  title: string;
  description?: string;
  status: TMTicketStatus;
  date: string;
  projectId: string;
  project?: Project;
  createdById: string;
  createdBy?: User;
  laborCost: number;
  materialCost: number;
  equipmentCost: number;
  totalCost: number;
  signature?: string;
  signedBy?: string;
  signedAt?: string;
  location?: string;
  weatherCondition?: string;
  laborEntries?: LaborEntry[];
  materialEntries?: MaterialEntry[];
  attachments?: Attachment[];
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface LaborEntry {
  id: string;
  workerName: string;
  role?: string;
  hoursWorked: number;
  hourlyRate: number;
  total: number;
  date: string;
}

export interface MaterialEntry {
  id: string;
  description: string;
  quantity: number;
  unit?: string;
  unitCost: number;
  total: number;
  supplier?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size?: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Approval {
  id: string;
  status: string;
  comment?: string;
  approverId: string;
  approver?: User;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  user?: User;
  projectId?: string;
  action: string;
  entity: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  pendingChangeOrders: number;
  openTMTickets: number;
  totalPendingExposure: number;
  totalApprovedRevenue: number;
  totalPaidRevenue: number;
  recentActivity: ActivityLog[];
}

export interface FinancialSummary {
  pendingExposure: number;
  approvedRevenue: number;
  paidRevenue: number;
  laborTotal: number;
  materialTotal: number;
  equipmentTotal: number;
  changeOrderPipeline: {
    draft: number;
    submitted: number;
    reviewed: number;
    approved: number;
    rejected: number;
    paid: number;
  };
}

export interface AIRequest {
  type: "summarize" | "suggest_pricing" | "detect_duplicate" | "generate_wording" | "predict_overrun";
  context: Record<string, unknown>;
}

export interface AIResponse {
  result: string;
  confidence?: number;
  suggestions?: string[];
}
