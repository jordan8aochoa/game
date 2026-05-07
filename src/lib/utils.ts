import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(num);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d, yyyy");
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "MMM d, yyyy 'at' h:mm a");
}

export function formatRelative(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function calculateTotal(
  labor: number,
  material: number,
  equipment: number,
  markupPercent: number
): number {
  const subtotal = labor + material + equipment;
  return subtotal * (1 + markupPercent / 100);
}

export function generateTicketNumber(prefix: string): string {
  const date = format(new Date(), "yyyyMMdd");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${date}-${random}`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    DRAFT:     "bg-surface-100 text-surface-600",
    SUBMITTED: "bg-blue-50 text-blue-700",
    REVIEWED:  "bg-purple-50 text-purple-700",
    APPROVED:  "bg-emerald-50 text-emerald-700",
    REJECTED:  "bg-red-50 text-red-700",
    PAID:      "bg-green-50 text-green-800",
    ACTIVE:    "bg-emerald-50 text-emerald-700",
    ON_HOLD:   "bg-yellow-50 text-yellow-700",
    COMPLETED: "bg-blue-50 text-blue-700",
    CANCELLED: "bg-red-50 text-red-700",
  };
  return map[status] ?? "bg-surface-100 text-surface-600";
}

export function getPriorityColor(priority: string): string {
  const map: Record<string, string> = {
    LOW:    "bg-surface-100 text-surface-500",
    MEDIUM: "bg-yellow-50 text-yellow-700",
    HIGH:   "bg-orange-50 text-orange-700",
    URGENT: "bg-red-50 text-red-700",
  };
  return map[priority] ?? "bg-surface-100 text-surface-500";
}

export function getRoleLabel(role: string): string {
  const map: Record<string, string> = {
    ADMIN:              "Admin",
    GENERAL_CONTRACTOR: "General Contractor",
    SUBCONTRACTOR:      "Subcontractor",
    FOREMAN:            "Foreman",
    OWNER:              "Owner",
    VIEWER:             "Viewer",
  };
  return map[role] ?? role;
}
