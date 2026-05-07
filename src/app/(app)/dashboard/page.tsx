"use client";

import { DollarSign, FileText, Receipt, FolderOpen, TrendingUp, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { StatCard, Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { formatCurrency, formatRelative, formatDate } from "@/lib/utils";
import { mockProjects, mockChangeOrders, mockTMTickets, mockActivityLogs, mockFinancialData } from "@/lib/mock-data";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const pendingExposure  = mockChangeOrders.filter((co) => ["SUBMITTED", "REVIEWED", "DRAFT"].includes(co.status)).reduce((s, co) => s + co.totalCost, 0);
const approvedRevenue  = mockChangeOrders.filter((co) => co.status === "APPROVED").reduce((s, co) => s + co.totalCost, 0);
const pendingCOs       = mockChangeOrders.filter((co) => ["SUBMITTED", "REVIEWED"].includes(co.status)).length;
const openTickets      = mockTMTickets.filter((t) => ["DRAFT", "SUBMITTED"].includes(t.status)).length;

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
          <p className="text-sm text-surface-500 mt-1">Good morning, Alex. Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/change-orders/new">
            <Button size="sm" leftIcon={<FileText size={14} />}>New Change Order</Button>
          </Link>
          <Link href="/tm-tickets/new">
            <Button size="sm" variant="secondary" leftIcon={<Receipt size={14} />}>New T&M Ticket</Button>
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Projects"     value={mockProjects.filter((p) => p.status === "ACTIVE").length} icon={<FolderOpen size={20} />}  color="blue"   trend={{ value: 25, label: "vs last month" }} />
        <StatCard label="Pending COs"         value={pendingCOs}   icon={<AlertCircle size={20} />} color="orange" trend={{ value: -10, label: "vs last month" }} />
        <StatCard label="Open T&M Tickets"    value={openTickets}  icon={<Clock size={20} />}       color="purple" />
        <StatCard label="Pending Exposure"    value={formatCurrency(pendingExposure)} icon={<DollarSign size={20} />} color="red" trend={{ value: 8, label: "this month" }} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <Card className="lg:col-span-2 p-5">
          <CardHeader>
            <CardTitle>Revenue Pipeline</CardTitle>
            <div className="flex items-center gap-4 text-xs text-surface-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-500 inline-block" />Approved</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-400 inline-block" />Pending</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Paid</span>
            </div>
          </CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockFinancialData.monthly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="approved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f97316" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [formatCurrency(Number(v ?? 0))]} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }} />
              <Area type="monotone" dataKey="approved" stroke="#3b82f6" strokeWidth={2} fill="url(#approved)" />
              <Area type="monotone" dataKey="pending"  stroke="#f97316" strokeWidth={2} fill="url(#pending)" />
              <Area type="monotone" dataKey="paid"     stroke="#10b981" strokeWidth={2} fill="none" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Status breakdown */}
        <Card className="p-5">
          <CardHeader>
            <CardTitle>CO Status Mix</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={mockFinancialData.statusBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                paddingAngle={3} dataKey="value">
                {mockFinancialData.statusBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [formatCurrency(Number(v ?? 0))]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {mockFinancialData.statusBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-surface-600">{item.name}</span>
                </div>
                <span className="font-semibold text-surface-800">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Projects + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active Projects */}
        <Card padding="none" className="overflow-hidden">
          <div className="p-5 border-b border-surface-100 flex items-center justify-between">
            <CardTitle>Active Projects</CardTitle>
            <Link href="/projects">
              <Button variant="ghost" size="sm">View all →</Button>
            </Link>
          </div>
          <div className="divide-y divide-surface-50">
            {mockProjects.filter((p) => p.status === "ACTIVE").map((project) => {
              const spent = (project._count?.changeOrders ?? 0) * 18000;
              const pct   = project.budget ? Math.min(100, (spent / project.budget) * 100) : 0;
              return (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="px-5 py-4 hover:bg-surface-50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-surface-900 truncate">{project.name}</p>
                        <p className="text-xs text-surface-500 mt-0.5 truncate">{project.address}</p>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-surface-500">Budget used</span>
                        <span className="font-medium text-surface-700">{pct.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${pct > 85 ? "bg-red-500" : pct > 60 ? "bg-accent-500" : "bg-brand-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-surface-500">
                      <span>{project._count?.changeOrders} COs</span>
                      <span>{project._count?.tmTickets} T&M</span>
                      <span>{project._count?.members} members</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Activity Feed */}
        <Card padding="none" className="overflow-hidden">
          <div className="p-5 border-b border-surface-100 flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <span className="text-xs text-surface-400 font-medium">Live</span>
          </div>
          <div className="divide-y divide-surface-50">
            {mockActivityLogs.map((log) => {
              const actionColor: Record<string, string> = {
                submitted: "text-blue-600 bg-blue-50",
                created:   "text-emerald-600 bg-emerald-50",
                approved:  "text-green-600 bg-green-50",
                updated:   "text-purple-600 bg-purple-50",
                rejected:  "text-red-600 bg-red-50",
              };
              return (
                <div key={log.id} className="px-5 py-3.5 flex items-start gap-3">
                  <Avatar name={log.user?.name ?? "?"} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-surface-800">
                      <span className="font-semibold">{log.user?.name}</span>
                      {" "}
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${actionColor[log.action] ?? "text-surface-600 bg-surface-100"}`}>
                        {log.action}
                      </span>
                      {" "}
                      <span className="text-surface-600">{log.entity === "ChangeOrder" ? "change order" : "T&M ticket"}</span>
                    </p>
                    <p className="text-xs text-surface-400 mt-0.5">{formatRelative(log.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Change Orders */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-5 border-b border-surface-100 flex items-center justify-between">
          <CardTitle>Recent Change Orders</CardTitle>
          <Link href="/change-orders">
            <Button variant="ghost" size="sm">View all →</Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100">
                {["Number", "Title", "Project", "Status", "Priority", "Total", "Updated"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {mockChangeOrders.slice(0, 5).map((co) => {
                const project = mockProjects.find((p) => p.id === co.projectId);
                return (
                  <tr key={co.id} className="hover:bg-surface-50 transition-colors cursor-pointer">
                    <td className="px-5 py-3.5">
                      <Link href={`/change-orders/${co.id}`} className="text-sm font-mono font-medium text-brand-600 hover:text-brand-700">{co.number}</Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-surface-900 max-w-xs truncate">{co.title}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-surface-600 whitespace-nowrap">{project?.name}</p>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={co.status} /></td>
                    <td className="px-5 py-3.5"><PriorityBadge priority={co.priority} /></td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-surface-900 whitespace-nowrap">{formatCurrency(co.totalCost)}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-surface-500 whitespace-nowrap">{formatRelative(co.updatedAt)}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
