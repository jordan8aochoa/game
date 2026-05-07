import type { Project, ChangeOrder, TMTicket, ActivityLog, Notification } from "@/types";

export const mockProjects: Project[] = [
  {
    id: "p1", name: "Riverside Tower Phase 2", description: "24-story mixed-use development",
    address: "445 Riverside Dr, New York, NY 10027", status: "ACTIVE",
    budget: 12500000, startDate: "2025-01-15", endDate: "2026-06-30",
    companyId: "c1", _count: { changeOrders: 14, tmTickets: 47, members: 8 },
    createdAt: "2025-01-10T00:00:00Z", updatedAt: "2026-05-01T00:00:00Z",
  },
  {
    id: "p2", name: "Midtown Office Renovation", description: "Full interior gut renovation, floors 12–18",
    address: "1251 6th Ave, New York, NY 10020", status: "ACTIVE",
    budget: 3200000, startDate: "2025-03-01", endDate: "2025-12-31",
    companyId: "c1", _count: { changeOrders: 6, tmTickets: 22, members: 5 },
    createdAt: "2025-02-20T00:00:00Z", updatedAt: "2026-04-28T00:00:00Z",
  },
  {
    id: "p3", name: "Harbor Bridge Repair", description: "Structural assessment and deck rehabilitation",
    address: "Harbor Blvd, Brooklyn, NY 11201", status: "ON_HOLD",
    budget: 8750000, startDate: "2024-09-01", endDate: "2026-03-31",
    companyId: "c1", _count: { changeOrders: 9, tmTickets: 31, members: 12 },
    createdAt: "2024-08-15T00:00:00Z", updatedAt: "2026-04-10T00:00:00Z",
  },
  {
    id: "p4", name: "Westside School Expansion", description: "New gymnasium and 12 classroom wing",
    address: "890 W 231st St, Bronx, NY 10463", status: "ACTIVE",
    budget: 5400000, startDate: "2025-06-01", endDate: "2026-09-30",
    companyId: "c1", _count: { changeOrders: 3, tmTickets: 8, members: 6 },
    createdAt: "2025-05-20T00:00:00Z", updatedAt: "2026-05-05T00:00:00Z",
  },
];

export const mockChangeOrders: ChangeOrder[] = [
  {
    id: "co1", number: "CO-2026-0047", title: "Additional foundation waterproofing",
    description: "Owner requested full membrane waterproofing on all below-grade walls after soil report showed higher water table than anticipated.",
    status: "SUBMITTED", priority: "HIGH", version: 1,
    projectId: "p1", createdById: "u1",
    laborCost: 18500, materialCost: 22400, equipmentCost: 3200,
    markupPercent: 15, totalCost: 50715,
    submittedAt: "2026-05-03T09:00:00Z",
    createdAt: "2026-05-01T14:22:00Z", updatedAt: "2026-05-03T09:00:00Z",
  },
  {
    id: "co2", number: "CO-2026-0046", title: "Electrical panel upgrade – floors 12-15",
    description: "Existing electrical panels are undersized for the new mechanical loads. Requires full panel replacement and load calculation review.",
    status: "REVIEWED", priority: "URGENT", version: 2,
    projectId: "p1", createdById: "u1",
    laborCost: 31000, materialCost: 45000, equipmentCost: 0,
    markupPercent: 12, totalCost: 85120,
    submittedAt: "2026-04-28T10:00:00Z",
    createdAt: "2026-04-25T08:30:00Z", updatedAt: "2026-04-29T11:15:00Z",
  },
  {
    id: "co3", number: "CO-2026-0045", title: "HVAC ductwork rerouting",
    description: "Structural beam conflict requires ductwork to be rerouted 18\" north on floors 8-10.",
    status: "APPROVED", priority: "MEDIUM", version: 1,
    projectId: "p2", createdById: "u2",
    laborCost: 9800, materialCost: 5400, equipmentCost: 1200,
    markupPercent: 10, totalCost: 18040,
    submittedAt: "2026-04-20T00:00:00Z", approvedAt: "2026-04-22T14:00:00Z",
    createdAt: "2026-04-18T00:00:00Z", updatedAt: "2026-04-22T14:00:00Z",
  },
  {
    id: "co4", number: "CO-2026-0044", title: "Concrete pour delay – weather",
    description: "3-day delay due to sustained temperatures below 40°F. Additional heating equipment and extended cure time required.",
    status: "DRAFT", priority: "MEDIUM", version: 1,
    projectId: "p1", createdById: "u1",
    laborCost: 4200, materialCost: 1800, equipmentCost: 3600,
    markupPercent: 15, totalCost: 11040,
    createdAt: "2026-05-06T00:00:00Z", updatedAt: "2026-05-06T00:00:00Z",
  },
  {
    id: "co5", number: "CO-2026-0043", title: "Plumbing rough-in changes",
    description: "Architect revised bathroom layouts on floors 3–6 requiring full re-rough of waste and supply lines.",
    status: "PAID", priority: "LOW", version: 1,
    projectId: "p2", createdById: "u2",
    laborCost: 12000, materialCost: 8500, equipmentCost: 0,
    markupPercent: 10, totalCost: 22550,
    submittedAt: "2026-04-01T00:00:00Z", approvedAt: "2026-04-05T00:00:00Z", paidAt: "2026-04-25T00:00:00Z",
    createdAt: "2026-03-28T00:00:00Z", updatedAt: "2026-04-25T00:00:00Z",
  },
];

export const mockTMTickets: TMTicket[] = [
  {
    id: "tm1", number: "TM-2026-0183", title: "Emergency electrical repair – B2 level",
    description: "Discovered damaged conduit during excavation. Emergency repair to avoid schedule delay.",
    status: "SUBMITTED", date: "2026-05-07T06:00:00Z",
    projectId: "p1", createdById: "u3",
    laborCost: 2400, materialCost: 380, equipmentCost: 0, totalCost: 2780,
    location: "40.8448° N, 73.9441° W", weatherCondition: "Partly Cloudy, 58°F",
    createdAt: "2026-05-07T06:15:00Z", updatedAt: "2026-05-07T06:15:00Z",
  },
  {
    id: "tm2", number: "TM-2026-0182", title: "Additional shoring – grid line D",
    status: "APPROVED", date: "2026-05-06T07:00:00Z",
    projectId: "p1", createdById: "u3",
    laborCost: 1800, materialCost: 950, equipmentCost: 600, totalCost: 3350,
    signedBy: "Mike Chen", signedAt: "2026-05-06T15:30:00Z",
    createdAt: "2026-05-06T07:30:00Z", updatedAt: "2026-05-06T16:00:00Z",
  },
  {
    id: "tm3", number: "TM-2026-0181", title: "Steel beam cutting and grinding",
    status: "DRAFT", date: "2026-05-07T00:00:00Z",
    projectId: "p2", createdById: "u4",
    laborCost: 960, materialCost: 120, equipmentCost: 240, totalCost: 1320,
    createdAt: "2026-05-07T08:00:00Z", updatedAt: "2026-05-07T08:00:00Z",
  },
];

export const mockActivityLogs: ActivityLog[] = [
  { id: "a1", userId: "u2", action: "submitted", entity: "ChangeOrder", entityId: "co1",
    createdAt: "2026-05-07T09:00:00Z", user: { id: "u2", name: "Sarah Kim", email: "sarah@apex.com", role: "GENERAL_CONTRACTOR", createdAt: "" } },
  { id: "a2", userId: "u3", action: "created", entity: "TMTicket", entityId: "tm1",
    createdAt: "2026-05-07T06:15:00Z", user: { id: "u3", name: "Jose Martinez", email: "jose@fieldflow.ai", role: "FOREMAN", createdAt: "" } },
  { id: "a3", userId: "u1", action: "approved", entity: "ChangeOrder", entityId: "co3",
    createdAt: "2026-04-22T14:00:00Z", user: { id: "u1", name: "Alex Johnson", email: "alex@fieldflow.ai", role: "GENERAL_CONTRACTOR", createdAt: "" } },
  { id: "a4", userId: "u4", action: "created", entity: "TMTicket", entityId: "tm3",
    createdAt: "2026-05-07T08:00:00Z", user: { id: "u4", name: "Tom Walsh", email: "tom@sub.com", role: "FOREMAN", createdAt: "" } },
  { id: "a5", userId: "u2", action: "updated", entity: "ChangeOrder", entityId: "co2",
    createdAt: "2026-04-29T11:15:00Z", user: { id: "u2", name: "Sarah Kim", email: "sarah@apex.com", role: "GENERAL_CONTRACTOR", createdAt: "" } },
];

export const mockNotifications: Notification[] = [
  { id: "n1", userId: "u1", title: "Change Order Submitted", message: "CO-2026-0047 requires your review", type: "co", read: false, link: "/change-orders/co1", createdAt: "2026-05-07T09:00:00Z" },
  { id: "n2", userId: "u1", title: "T&M Ticket Created", message: "Jose Martinez submitted TM-2026-0183", type: "tm", read: false, link: "/tm-tickets/tm1", createdAt: "2026-05-07T06:20:00Z" },
  { id: "n3", userId: "u1", title: "Change Order Approved", message: "CO-2026-0045 has been approved", type: "co", read: true, link: "/change-orders/co3", createdAt: "2026-04-22T14:05:00Z" },
];

export const mockFinancialData = {
  monthly: [
    { month: "Nov", approved: 48000, pending: 22000, paid: 41000 },
    { month: "Dec", approved: 61000, pending: 18000, paid: 55000 },
    { month: "Jan", approved: 38000, pending: 45000, paid: 32000 },
    { month: "Feb", approved: 72000, pending: 31000, paid: 68000 },
    { month: "Mar", approved: 55000, pending: 28000, paid: 50000 },
    { month: "Apr", approved: 83000, pending: 19000, paid: 78000 },
    { month: "May", approved: 27000, pending: 61000, paid: 22000 },
  ],
  statusBreakdown: [
    { name: "Draft", value: 11040, color: "#94a3b8" },
    { name: "Submitted", value: 50715, color: "#60a5fa" },
    { name: "Reviewed", value: 85120, color: "#a78bfa" },
    { name: "Approved", value: 18040, color: "#34d399" },
    { name: "Paid", value: 22550, color: "#10b981" },
  ],
};
