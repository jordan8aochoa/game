"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, MapPin, Users, FileText, Receipt, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { AvatarGroup } from "@/components/ui/Avatar";
import { formatCurrency, formatDate } from "@/lib/utils";
import { mockProjects } from "@/lib/mock-data";
import type { ProjectStatus } from "@/types";

const statusTabs: { label: string; value: ProjectStatus | "ALL" }[] = [
  { label: "All",       value: "ALL" },
  { label: "Active",    value: "ACTIVE" },
  { label: "On Hold",   value: "ON_HOLD" },
  { label: "Completed", value: "COMPLETED" },
];

const mockMembers = [
  { name: "Alex Johnson" }, { name: "Sarah Kim" }, { name: "Jose Martinez" }, { name: "Tom Walsh" },
];

export default function ProjectsPage() {
  const [search, setSearch]   = useState("");
  const [status, setStatus]   = useState<ProjectStatus | "ALL">("ALL");

  const filtered = mockProjects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === "ALL" || p.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Projects</h1>
          <p className="text-sm text-surface-500 mt-1">{filtered.length} projects</p>
        </div>
        <Link href="/projects/new">
          <Button leftIcon={<Plus size={14} />}>New Project</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input type="text" placeholder="Search projects…" value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-surface-200 rounded-lg
                       placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent" />
        </div>
        <div className="flex gap-1.5">
          {statusTabs.map((t) => (
            <button key={t.value} onClick={() => setStatus(t.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                status === t.value ? "bg-brand-600 text-white" : "bg-white border border-surface-200 text-surface-600 hover:bg-surface-50"
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((project) => {
          const spent = (project._count?.changeOrders ?? 0) * 18000;
          const pct   = project.budget ? Math.min(100, (spent / project.budget) * 100) : 0;
          return (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card hover className="p-0 overflow-hidden h-full flex flex-col">
                {/* Color header */}
                <div className="h-2 gradient-brand" />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-surface-900 truncate">{project.name}</p>
                      {project.address && (
                        <p className="text-xs text-surface-500 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin size={10} /> {project.address}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={project.status} />
                  </div>

                  {project.description && (
                    <p className="text-sm text-surface-600 line-clamp-2 mb-4">{project.description}</p>
                  )}

                  {/* Budget progress */}
                  {project.budget && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-surface-500">Budget: {formatCurrency(project.budget)}</span>
                        <span className={`font-semibold ${pct > 85 ? "text-red-600" : pct > 60 ? "text-accent-600" : "text-emerald-600"}`}>
                          {pct.toFixed(0)}% used
                        </span>
                      </div>
                      <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pct > 85 ? "bg-red-500" : pct > 60 ? "bg-accent-500" : "bg-brand-500"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-surface-100">
                    <div className="flex items-center gap-3 text-xs text-surface-500">
                      <span className="flex items-center gap-1"><FileText size={12} /> {project._count?.changeOrders} COs</span>
                      <span className="flex items-center gap-1"><Receipt size={12} /> {project._count?.tmTickets} TM</span>
                    </div>
                    <AvatarGroup users={mockMembers.slice(0, project._count?.members ?? 2)} max={3} size="xs" />
                  </div>

                  {(project.startDate || project.endDate) && (
                    <div className="flex items-center gap-1 text-xs text-surface-400 mt-2">
                      <Calendar size={11} />
                      {project.startDate && formatDate(project.startDate)} → {project.endDate && formatDate(project.endDate)}
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
