"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Search, Plus, ChevronDown, Menu, HardHat, Sparkles } from "lucide-react";
import { Button, Avatar } from "@/components/ui";
import { cn, formatRelative } from "@/lib/utils";
import type { Notification } from "@/types";

interface TopBarProps {
  title?:         string;
  user?:          { name: string; email: string; role: string; avatar?: string };
  notifications?: Notification[];
  onMenuToggle?:  () => void;
}

export function TopBar({ title, user, notifications = [], onMenuToggle }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu]           = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-xl border-b border-surface-200 flex items-center px-4 md:px-6 gap-4">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="md:hidden btn-ghost p-2"
      >
        <Menu size={20} />
      </button>

      {/* Mobile logo */}
      <div className="md:hidden flex items-center gap-2">
        <div className="w-7 h-7 rounded-md gradient-brand flex items-center justify-center">
          <HardHat size={15} className="text-white" />
        </div>
        <span className="text-sm font-bold">FieldFlow <span className="text-brand-600">AI</span></span>
      </div>

      {/* Page title */}
      {title && <h1 className="hidden md:block text-lg font-semibold text-surface-900">{title}</h1>}

      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-sm">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search projects, COs, tickets…"
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg
                       placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* Quick create */}
      <Button size="sm" leftIcon={<Plus size={14} />}>
        New
      </Button>

      {/* AI badge */}
      <Link href="/ai-assistant">
        <Button variant="secondary" size="sm" leftIcon={<Sparkles size={14} className="text-brand-600" />}>
          AI
        </Button>
      </Link>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative btn-ghost p-2"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-accent-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-12 w-80 bg-white rounded-xl border border-surface-200 shadow-2xl z-50 overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100">
              <span className="text-sm font-semibold text-surface-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs text-brand-600 font-medium">{unreadCount} new</span>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-surface-50">
              {notifications.length === 0 ? (
                <p className="text-center text-sm text-surface-500 py-8">No notifications</p>
              ) : notifications.map((n) => (
                <div key={n.id} className={cn("px-4 py-3", !n.read && "bg-brand-50/40")}>
                  <p className="text-sm font-medium text-surface-900">{n.title}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-surface-400 mt-1">{formatRelative(n.createdAt)}</p>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 border-t border-surface-100">
              <Link href="/notifications" className="text-xs text-brand-600 font-medium hover:text-brand-700">
                View all notifications →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* User menu */}
      {user && (
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 hover:bg-surface-50 rounded-lg px-2 py-1.5 transition-all"
          >
            <Avatar name={user.name} src={user.avatar} size="sm" />
            <ChevronDown size={14} className="text-surface-400 hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 w-52 bg-white rounded-xl border border-surface-200 shadow-2xl z-50 overflow-hidden animate-slide-up">
              <div className="px-4 py-3 border-b border-surface-100">
                <p className="text-sm font-semibold text-surface-900">{user.name}</p>
                <p className="text-xs text-surface-500">{user.email}</p>
              </div>
              <div className="p-1">
                {[
                  { label: "Profile", href: "/settings/profile" },
                  { label: "Company", href: "/settings/company" },
                  { label: "Billing", href: "/settings/billing" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2 text-sm text-surface-700 rounded-md hover:bg-surface-50"
                  >
                    {item.label}
                  </Link>
                ))}
                <hr className="my-1 border-surface-100" />
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50">
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
