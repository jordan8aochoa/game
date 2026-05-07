"use client";

import { useState } from "react";
import { Plus, Search, Filter, Download, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate, formatRelative } from "@/lib/utils";
import { mockChangeOrders, mockProjects } from "@/lib/mock-data";
import type { ChangeOrderStatus } from "@/types";

const statusFilters: { label: string; value: ChangeOrderStatus | "ALL" }[] = [
  { label: "All",       value: "ALL" },
  { label: "Draft",     value: "DRAFT" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Reviewed",  value: "REVIEWED" },
  { label: "Approved",  value: "APPROVED" },
  { label: "Rejected",  value: "REJECTED" },
  { label: "Paid",      value: "PAID" },
];

export default function ChangeOrdersPage() {
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState<ChangeOrderStatus | "ALL">("ALL");

  const filtered = mockChangeOrders.filter((co) => {
    const matchesSearch = co.title.toLowerCase().includes(search.toLowerCase()) ||
                          co.number.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || co.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalExposure = filtered
    .filter((co) => ["DRAFT","SUBMITTED","REVIEWED"].includes(co.status))
    .reduce((s, co) => s + co.totalCost, 0);

  const totalApproved = filtered
    .filter((co) => co.status === "APPROVED")
    .reduce((s, co) => s + co.totalCost, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Change Orders</h1>
          <p className="text-sm text-surface-500 mt-1">{filtered.length} change orders</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" leftIcon={<Download size={14} />}>Export</Button>
          <Link href="/change-orders/new">
            <Button size="sm" leftIcon={<Plus size={14} />}>New Change Order</Button>
          </Link>
        </div>
      </div>

      {/* Summary pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total COs",         value: String(filtered.length),              color: "text-surface-900" },
          { label: "Pending Exposure",  value: formatCurrency(totalExposure),        color: "text-accent-600" },
          { label: "Approved Revenue",  value: formatCurrency(totalApproved),        color: "text-emerald-600" },
          { label: "Avg Value",         value: filtered.length ? formatCurrency(filtered.reduce((s,co) => s+co.totalCost, 0)/filtered.length) : "$0", color: "text-brand-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-surface-200 px-4 py-3 shadow-card">
            <p className="text-xs text-surface-500 font-medium">{s.label}</p>
            <p className={`text-lg font-bold mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search change orders…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-surface-200 rounded-lg
                       placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === f.value
                  ? "bg-brand-600 text-white"
                  : "bg-white border border-surface-200 text-surface-600 hover:bg-surface-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100 bg-surface-50/50">
                {["Number","Title","Project","Status","Priority","Labor","Material","Equipment","Total","Date"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {filtered.map((co) => {
                const project = mockProjects.find((p) => p.id === co.projectId);
                return (
                  <tr key={co.id} className="hover:bg-brand-50/30 transition-colors cursor-pointer group">
                    <td className="px-4 py-3.5">
                      <Link href={`/change-orders/${co.id}`} className="text-sm font-mono font-semibold text-brand-600 hover:text-brand-700 group-hover:underline">
                        {co.number}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 max-w-[220px]">
                      <Link href={`/change-orders/${co.id}`}>
                        <p className="text-sm font-medium text-surface-900 truncate hover:text-brand-700">{co.title}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-surface-600 whitespace-nowrap truncate max-w-[140px]">{project?.name}</p>
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={co.status} /></td>
                    <td className="px-4 py-3.5"><PriorityBadge priority={co.priority} /></td>
                    <td className="px-4 py-3.5 text-sm text-surface-700 whitespace-nowrap">{formatCurrency(co.laborCost)}</td>
                    <td className="px-4 py-3.5 text-sm text-surface-700 whitespace-nowrap">{formatCurrency(co.materialCost)}</td>
                    <td className="px-4 py-3.5 text-sm text-surface-700 whitespace-nowrap">{formatCurrency(co.equipmentCost)}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-surface-900 whitespace-nowrap">{formatCurrency(co.totalCost)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-surface-400 whitespace-nowrap">{formatRelative(co.updatedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-surface-500">
              <FileText size={40} className="mx-auto mb-3 text-surface-300" />
              <p className="text-sm font-medium">No change orders found</p>
              <p className="text-xs mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
