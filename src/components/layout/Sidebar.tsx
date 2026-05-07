"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FolderOpen, FileText, Receipt, BarChart3,
  Sparkles, Settings, ChevronLeft, ChevronRight, Bell,
  Building2, HardHat,
} from "lucide-react";
import { Avatar } from "@/components/ui";
import { useState } from "react";

const navItems = [
  { label: "Dashboard",      href: "/dashboard",      icon: LayoutDashboard },
  { label: "Projects",       href: "/projects",       icon: FolderOpen },
  { label: "Change Orders",  href: "/change-orders",  icon: FileText },
  { label: "T&M Tickets",   href: "/tm-tickets",     icon: Receipt },
  { label: "Analytics",      href: "/analytics",      icon: BarChart3 },
  { label: "AI Assistant",   href: "/ai-assistant",   icon: Sparkles },
];

const bottomItems = [
  { label: "Notifications",  href: "/notifications",  icon: Bell },
  { label: "Settings",       href: "/settings",       icon: Settings },
];

interface SidebarProps {
  user?: { name: string; email: string; role: string; avatar?: string };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen bg-white border-r border-surface-200",
        "sticky top-0 transition-all duration-300 flex-shrink-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-5 border-b border-surface-100",
        collapsed && "justify-center px-0"
      )}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-brand flex-shrink-0">
          <HardHat size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-sm font-bold text-surface-900">FieldFlow</span>
            <span className="text-sm font-bold text-brand-600"> AI</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-all duration-150",
                collapsed ? "justify-center px-0 py-2.5 w-10 mx-auto" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-surface-600 hover:bg-surface-100 hover:text-surface-900"
              )}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-surface-100 space-y-0.5">
        {bottomItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-all duration-150",
                collapsed ? "justify-center px-0 py-2.5 w-10 mx-auto" : "gap-3 px-3 py-2.5",
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-surface-600 hover:bg-surface-100 hover:text-surface-900"
              )}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}

        {/* User */}
        {user && (
          <div className={cn(
            "flex items-center gap-3 px-3 py-3 mt-2 rounded-lg",
            collapsed && "justify-center px-0"
          )}>
            <Avatar name={user.name} src={user.avatar} size="sm" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-surface-900 truncate">{user.name}</p>
                <p className="text-xs text-surface-500 truncate">{user.role}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full
                   bg-white border border-surface-200 shadow-sm
                   flex items-center justify-center text-surface-400
                   hover:text-surface-700 hover:bg-surface-50 transition-all z-10"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
