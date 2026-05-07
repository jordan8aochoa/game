"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { cn } from "@/lib/utils";
import { HardHat, X, LayoutDashboard, FolderOpen, FileText, Receipt, BarChart3, Sparkles, Settings, Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard",     href: "/dashboard",     icon: LayoutDashboard },
  { label: "Projects",      href: "/projects",      icon: FolderOpen },
  { label: "Change Orders", href: "/change-orders", icon: FileText },
  { label: "T&M Tickets",  href: "/tm-tickets",    icon: Receipt },
  { label: "Analytics",     href: "/analytics",     icon: BarChart3 },
  { label: "AI Assistant",  href: "/ai-assistant",  icon: Sparkles },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings",      href: "/settings",      icon: Settings },
];

interface AppLayoutProps {
  children:   React.ReactNode;
  title?:     string;
  user?:      { name: string; email: string; role: string; avatar?: string };
}

export function AppLayout({ children, title, user }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const mockUser = user ?? {
    name: "Alex Johnson",
    email: "alex@fieldflow.ai",
    role: "General Contractor",
  };

  return (
    <div className="flex h-screen bg-surface-50 overflow-hidden">
      <Sidebar user={mockUser} />

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-surface-900/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col animate-slide-right">
            <div className="flex items-center justify-between px-4 py-4 border-b border-surface-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                  <HardHat size={16} className="text-white" />
                </div>
                <span className="font-bold text-surface-900">FieldFlow <span className="text-brand-600">AI</span></span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg text-surface-400 hover:bg-surface-100">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
              {navItems.map(({ label, href, icon: Icon }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-surface-600 hover:bg-surface-100 hover:text-surface-900"
                    )}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          title={title}
          user={mockUser}
          onMenuToggle={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
