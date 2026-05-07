"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Calendar, DollarSign, Users, FileText,
  Receipt, Settings, Plus, BarChart3, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Card, StatCard } from "@/components/ui/Card";
import { Avatar, AvatarGroup } from "@/components/ui/Avatar";
import { StatusBadge as SB } from "@/components/ui/Badge";
import { formatCurrency, formatDate, formatRelative } from "@/lib/utils";
import { mockProjects, mockChangeOrders, mockTMTickets } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const tabs = ["Overview", "Change Orders", "T&M Tickets", "Team", "Files"];

const mockMembers = [
  { id: "u1", name: "Alex Johnson",   role: "GENERAL_CONTRACTOR", email: "alex@fieldflow.ai" },
  { id: "u2", name: "Sarah Kim",      role: "GENERAL_CONTRACTOR", email: "sarah@apex.com" },
  { id: "u3", name: "Jose Martinez",  role: "FOREMAN",             email: "jose@sub.com" },
  { id: "u4", name: "Tom Walsh",      role: "FOREMAN",             email: "tom@sub.com" },
  { id: "u5", name: "Rachel Chen",    role: "SUBCONTRACTOR",       email: "rachel@mep.com" },
];

export default function ProjectDetailPage() {
  const params    = useParams();
  const project   = mockProjects.find((p) => p.id === params.id) ?? mockProjects[0];
  const projectCOs = mockChangeOrders.filter((co) => co.projectId === project.id);
  const projectTMs = mockTMTickets.filter((t) => t.projectId === project.id);

  const [activeTab, setActiveTab] = useState("Overview");

  const totalCOValue = projectCOs.reduce((s, co) => s + co.totalCost, 0);
  const approvedCOValue = projectCOs.filter((co) => co.status === "APPROVED").reduce((s, co) => s + co.totalCost, 0);
  const spent = (project._count?.changeOrders ?? 0) * 18000;
  const budgetPct = project.budget ? Math.min(100, (spent / project.budget) * 100) : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-surface-500">
        <Link href="/projects" className="hover:text-surface-700 flex items-center gap-1">
          <ArrowLeft size={14} /> Projects
        </Link>
        <span>/</span>
        <span className="font-semibold text-surface-700 truncate">{project.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <StatusBadge status={project.status} />
          </div>
          <h1 className="text-2xl font-bold text-surface-900">{project.name}</h1>
          {project.address && (
            <p className="text-sm text-surface-500 mt-1 flex items-center gap-1.5">
              <MapPin size={14} /> {project.address}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/change-orders/new?project=${project.id}`}>
            <Button variant="secondary" size="sm" leftIcon={<Plus size={14} />}>Add CO</Button>
          </Link>
          <Link href={`/tm-tickets/new?project=${project.id}`}>
            <Button size="sm" leftIcon={<Plus size={14} />}>New T&M</Button>
          </Link>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Budget"          value={project.budget ? formatCurrency(project.budget) : "—"} icon={<DollarSign size={18} />} color="blue" />
        <StatCard label="CO Exposure"     value={formatCurrency(totalCOValue)}    icon={<FileText size={18} />}  color="orange" />
        <StatCard label="Change Orders"   value={projectCOs.length}               icon={<FileText size={18} />}  color="purple" />
        <StatCard label="T&M Tickets"     value={projectTMs.length}               icon={<Receipt size={18} />}   color="green" />
      </div>

      {/* Budget bar */}
      {project.budget && (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-surface-700">Budget Utilization</span>
            <span className={cn("text-sm font-bold", budgetPct > 85 ? "text-red-600" : "text-surface-700")}>
              {formatCurrency(spent)} / {formatCurrency(project.budget)}
            </span>
          </div>
          <div className="h-3 bg-surface-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${budgetPct > 85 ? "bg-red-500" : budgetPct > 60 ? "bg-accent-500" : "bg-brand-500"}`}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-surface-400 mt-1.5">
            <span>{budgetPct.toFixed(1)}% used</span>
            <span>{formatCurrency(Math.max(0, (project.budget ?? 0) - spent))} remaining</span>
          </div>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-surface-200">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px",
              activeTab === tab
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-surface-500 hover:text-surface-700"
            )}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="text-sm font-semibold text-surface-700 mb-3">Project Info</h3>
            <div className="space-y-2 text-sm">
              {[
                { label: "Description", value: project.description ?? "—" },
                { label: "Start Date",  value: project.startDate ? formatDate(project.startDate) : "—" },
                { label: "End Date",    value: project.endDate   ? formatDate(project.endDate)   : "—" },
                { label: "Members",     value: String(project._count?.members ?? 0) },
              ].map((r) => (
                <div key={r.label} className="flex gap-3">
                  <span className="text-surface-500 w-28 flex-shrink-0">{r.label}</span>
                  <span className="text-surface-800 font-medium">{r.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-surface-700 mb-3">CO Summary</h3>
            <div className="space-y-2 text-sm">
              {[
                { label: "Draft",     count: projectCOs.filter((c) => c.status === "DRAFT").length     },
                { label: "Submitted", count: projectCOs.filter((c) => c.status === "SUBMITTED").length },
                { label: "Reviewed",  count: projectCOs.filter((c) => c.status === "REVIEWED").length  },
                { label: "Approved",  count: projectCOs.filter((c) => c.status === "APPROVED").length  },
                { label: "Paid",      count: projectCOs.filter((c) => c.status === "PAID").length      },
              ].map((r) => (
                <div key={r.label} className="flex justify-between">
                  <span className="text-surface-600">{r.label}</span>
                  <span className="font-semibold text-surface-900">{r.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "Change Orders" && (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-100 bg-surface-50/50">
                  {["Number","Title","Status","Total","Date"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                {projectCOs.map((co) => (
                  <tr key={co.id} className="hover:bg-surface-50">
                    <td className="px-4 py-3"><Link href={`/change-orders/${co.id}`} className="text-sm font-mono font-semibold text-brand-600 hover:text-brand-700">{co.number}</Link></td>
                    <td className="px-4 py-3 text-sm font-medium text-surface-900">{co.title}</td>
                    <td className="px-4 py-3"><SB status={co.status} /></td>
                    <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(co.totalCost)}</td>
                    <td className="px-4 py-3 text-xs text-surface-400">{formatRelative(co.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === "T&M Tickets" && (
        <div className="space-y-3">
          {projectTMs.map((t) => (
            <Link key={t.id} href={`/tm-tickets/${t.id}`}>
              <Card hover className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-surface-900">{t.title}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{t.number} · {formatDate(t.date)}</p>
                </div>
                <SB status={t.status} />
                <p className="text-sm font-bold text-surface-900">{formatCurrency(t.totalCost)}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {activeTab === "Team" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mockMembers.map((m) => (
            <Card key={m.id} className="flex items-center gap-3">
              <Avatar name={m.name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-surface-900 truncate">{m.name}</p>
                <p className="text-xs text-surface-500">{m.email}</p>
              </div>
              <SB status={m.role === "FOREMAN" ? "REVIEWED" : m.role === "GENERAL_CONTRACTOR" ? "APPROVED" : "SUBMITTED"} />
            </Card>
          ))}
          <Card className="border-dashed border-surface-300 bg-surface-50 cursor-pointer hover:border-brand-400 hover:bg-brand-50/20 transition-all flex items-center justify-center gap-2 text-surface-400 hover:text-brand-600">
            <Plus size={16} />
            <span className="text-sm font-medium">Add team member</span>
          </Card>
        </div>
      )}

      {activeTab === "Files" && (
        <Card>
          <div className="border-2 border-dashed border-surface-200 rounded-xl p-10 text-center hover:border-brand-300 hover:bg-brand-50/20 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-surface-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <FileText size={22} className="text-surface-400" />
            </div>
            <p className="text-sm font-medium text-surface-600">Drop files or click to upload</p>
            <p className="text-xs text-surface-400 mt-1">PDFs, images, drawings up to 100MB</p>
          </div>
        </Card>
      )}
    </div>
  );
}
