import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  name:       string;
  src?:       string;
  size?:      "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
};

const colors = [
  "bg-brand-500",
  "bg-accent-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-cyan-500",
];

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash;
  return colors[hash % colors.length];
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover flex-shrink-0", sizes[size], className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold",
        sizes[size],
        getColorFromName(name),
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}

export function AvatarGroup({ users, max = 3, size = "sm" }: { users: { name: string; src?: string }[]; max?: number; size?: "xs" | "sm" | "md" }) {
  const visible = users.slice(0, max);
  const remainder = users.length - max;
  return (
    <div className="flex items-center -space-x-2">
      {visible.map((u, i) => (
        <div key={i} className="ring-2 ring-white rounded-full">
          <Avatar name={u.name} src={u.src} size={size} />
        </div>
      ))}
      {remainder > 0 && (
        <div className={cn(
          "ring-2 ring-white rounded-full bg-surface-200 flex items-center justify-center text-xs font-semibold text-surface-600",
          size === "xs" ? "w-6 h-6" : size === "sm" ? "w-8 h-8" : "w-10 h-10"
        )}>
          +{remainder}
        </div>
      )}
    </div>
  );
}
