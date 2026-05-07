"use client";

import { useState } from "react";
import { Plus, Search, Camera, Clock, CheckCircle, AlertCircle, Receipt } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Card, StatCard } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { formatCurrency, formatDate, formatRelative } from "@/lib/utils";
import { mockTMTickets, mockProjects } from "@/lib/mock-data";

export default function TMTicketsPage() {
  const [search, setSearch]   = useState("");
  const [view, setView]       = useState<"grid" | "list">("list");

  const filtered = mockTMTickets.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.number.toLowerCase().includes(search.toLowerCase())
  );

  const totalSubmitted = mockTMTickets.filter((t) => t.status === "SUBMITTED").length;
  const totalApproved  = mockTMTickets.filter((t) => t.status === "APPROVED").length;
  const totalValue     = mockTMTickets.reduce((s, t) => s + t.totalCost, 0);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">T&M Tickets</h1>
          <p className="text-sm text-surface-500 mt-1">Time &amp; material field tickets</p>
        </div>
        <Link href="/tm-tickets/new">
          <Button leftIcon={<Plus size={14} />}>New Ticket</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total Tickets"  value={mockTMTickets.length} icon={<Receipt size={20} />}     color="blue" />
        <StatCard label="Pending Review" value={totalSubmitted}        icon={<Clock size={20} />}       color="orange" />
        <StatCard label="Approved"       value={totalApproved}         icon={<CheckCircle size={20} />} color="green" />
        <StatCard label="Total Value"    value={formatCurrency(totalValue)} icon={<AlertCircle size={20} />} color="purple" />
      </div>

      {/* Mobile CTA */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-white font-semibold text-base">Create ticket in under 60 seconds</p>
          <p className="text-brand-200 text-sm mt-0.5">Optimized for phone use in the field</p>
        </div>
        <Link href="/tm-tickets/new">
          <Button variant="accent" leftIcon={<Camera size={16} />}>Quick Ticket</Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          type="text" placeholder="Search tickets…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-surface-200 rounded-lg
                     placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      {/* Tickets list */}
      <div className="space-y-3">
        {filtered.map((ticket) => {
          const project = mockProjects.find((p) => p.id === ticket.projectId);
          return (
            <Link key={ticket.id} href={`/tm-tickets/${ticket.id}`}>
              <Card hover className="p-0 overflow-hidden">
                <div className="flex items-stretch">
                  {/* Color bar */}
                  <div className={`w-1.5 flex-shrink-0 ${
                    ticket.status === "APPROVED"  ? "bg-emerald-500" :
                    ticket.status === "SUBMITTED" ? "bg-blue-500" :
                    ticket.status === "REJECTED"  ? "bg-red-500" :
                    "bg-surface-300"
                  }`} />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-semibold text-brand-600">{ticket.number}</span>
                          <StatusBadge status={ticket.status} />
                        </div>
                        <p className="text-sm font-semibold text-surface-900 truncate">{ticket.title}</p>
                        <p className="text-xs text-surface-500 mt-0.5">{project?.name} · {formatDate(ticket.date)}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-base font-bold text-surface-900">{formatCurrency(ticket.totalCost)}</p>
                        <p className="text-xs text-surface-500 mt-0.5">{formatRelative(ticket.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-surface-50 text-xs text-surface-500">
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-surface-700">Labor:</span> {formatCurrency(ticket.laborCost)}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-surface-700">Material:</span> {formatCurrency(ticket.materialCost)}
                      </span>
                      {ticket.signedBy && (
                        <span className="flex items-center gap-1 ml-auto">
                          <CheckCircle size={12} className="text-emerald-500" />
                          Signed by {ticket.signedBy}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-surface-500">
            <Receipt size={40} className="mx-auto mb-3 text-surface-300" />
            <p className="text-sm font-medium">No tickets found</p>
          </div>
        )}
      </div>
    </div>
  );
}
