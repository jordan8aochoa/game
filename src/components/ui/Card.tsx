import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = {
  none: "",
  sm:   "p-3",
  md:   "p-5",
  lg:   "p-6",
};

export function Card({ className, hover, padding = "md", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-surface-200 shadow-card",
        hover && "transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer",
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-base font-semibold text-surface-900", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

interface StatCardProps {
  label:      string;
  value:      string | number;
  icon:       React.ReactNode;
  trend?:     { value: number; label: string };
  color?:     "blue" | "green" | "orange" | "purple" | "red";
  className?: string;
}

const colorMap = {
  blue:   { bg: "bg-brand-50",   icon: "text-brand-600",   trend: "text-brand-600" },
  green:  { bg: "bg-emerald-50", icon: "text-emerald-600", trend: "text-emerald-600" },
  orange: { bg: "bg-accent-50",  icon: "text-accent-600",  trend: "text-accent-600" },
  purple: { bg: "bg-violet-50",  icon: "text-violet-600",  trend: "text-violet-600" },
  red:    { bg: "bg-red-50",     icon: "text-red-600",     trend: "text-red-600" },
};

export function StatCard({ label, value, icon, trend, color = "blue", className }: StatCardProps) {
  const colors = colorMap[color];
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-surface-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-surface-900">{value}</p>
          {trend && (
            <p className={cn("mt-1 text-xs font-medium", trend.value >= 0 ? "text-emerald-600" : "text-red-600")}>
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn("p-2.5 rounded-lg", colors.bg)}>
          <span className={cn("block", colors.icon)}>{icon}</span>
        </div>
      </div>
    </Card>
  );
}
