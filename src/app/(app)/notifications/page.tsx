"use client";

import { Bell, CheckCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { formatRelative } from "@/lib/utils";
import { mockNotifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

const typeIcons: Record<string, string> = {
  co:   "📄",
  tm:   "🧾",
  project: "🏗️",
  system:  "🔔",
};

export default function NotificationsPage() {
  const unread = mockNotifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-5 max-w-2xl animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Notifications</h1>
          <p className="text-sm text-surface-500 mt-1">{unread} unread</p>
        </div>
        <Button variant="ghost" size="sm" leftIcon={<CheckCheck size={14} />}>Mark all read</Button>
      </div>

      <Card padding="none" className="overflow-hidden divide-y divide-surface-50">
        {mockNotifications.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={40} className="mx-auto mb-3 text-surface-300" />
            <p className="text-sm font-medium text-surface-500">No notifications</p>
          </div>
        ) : mockNotifications.map((n) => (
          <Link key={n.id} href={n.link ?? "#"}>
            <div className={cn("px-5 py-4 flex items-start gap-4 hover:bg-surface-50 transition-colors", !n.read && "bg-brand-50/30")}>
              <div className="text-2xl flex-shrink-0">{typeIcons[n.type] ?? "🔔"}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={cn("text-sm font-semibold text-surface-900", !n.read && "text-brand-700")}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1" />}
                </div>
                <p className="text-sm text-surface-600 mt-0.5">{n.message}</p>
                <p className="text-xs text-surface-400 mt-1">{formatRelative(n.createdAt)}</p>
              </div>
            </div>
          </Link>
        ))}
      </Card>
    </div>
  );
}
