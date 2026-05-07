import { cn, getStatusColor, getPriorityColor } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "status" | "priority" | "default" | "info" | "success" | "warning" | "error";
  status?: string;
  priority?: string;
  className?: string;
}

export function Badge({ children, variant = "default", status, priority, className }: BadgeProps) {
  let colorClass = "bg-surface-100 text-surface-600";

  if (variant === "status" && status)    colorClass = getStatusColor(status);
  if (variant === "priority" && priority) colorClass = getPriorityColor(priority);
  if (variant === "info")    colorClass = "bg-blue-50 text-blue-700";
  if (variant === "success") colorClass = "bg-emerald-50 text-emerald-700";
  if (variant === "warning") colorClass = "bg-yellow-50 text-yellow-700";
  if (variant === "error")   colorClass = "bg-red-50 text-red-700";

  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full", colorClass, className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    DRAFT: "Draft", SUBMITTED: "Submitted", REVIEWED: "Reviewed",
    APPROVED: "Approved", REJECTED: "Rejected", PAID: "Paid",
    ACTIVE: "Active", ON_HOLD: "On Hold", COMPLETED: "Completed", CANCELLED: "Cancelled",
  };
  return <Badge variant="status" status={status}>{labels[status] ?? status}</Badge>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const labels: Record<string, string> = {
    LOW: "Low", MEDIUM: "Medium", HIGH: "High", URGENT: "Urgent",
  };
  return <Badge variant="priority" priority={priority}>{labels[priority] ?? priority}</Badge>;
}
