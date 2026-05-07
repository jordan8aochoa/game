"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Cloud, CheckCircle, Download, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDateTime, formatDate } from "@/lib/utils";
import { mockTMTickets, mockProjects } from "@/lib/mock-data";

const mockLaborEntries = [
  { id: "l1", workerName: "Jose Martinez", role: "Lead Electrician", hoursWorked: 4, hourlyRate: 95, total: 380 },
  { id: "l2", workerName: "Tom Walsh",     role: "Apprentice",       hoursWorked: 4, hourlyRate: 55, total: 220 },
];
const mockMaterialEntries = [
  { id: "m1", description: "1/2\" EMT conduit 10' sticks", quantity: 3, unit: "EA", unitCost: 12.50, total: 37.50 },
  { id: "m2", description: "1/2\" set screw coupling",     quantity: 6, unit: "EA", unitCost: 1.80,  total: 10.80 },
];

export default function TMTicketDetailPage() {
  const params  = useParams();
  const ticket  = mockTMTickets.find((t) => t.id === params.id) ?? mockTMTickets[0];
  const project = mockProjects.find((p) => p.id === ticket.projectId);

  return (
    <div className="space-y-5 animate-fade-in max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-surface-500">
        <Link href="/tm-tickets" className="hover:text-surface-700 flex items-center gap-1">
          <ArrowLeft size={14} /> T&M Tickets
        </Link>
        <span>/</span>
        <span className="font-mono font-semibold text-surface-700">{ticket.number}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={ticket.status} />
          </div>
          <h1 className="text-2xl font-bold text-surface-900">{ticket.title}</h1>
          <p className="text-sm text-surface-500 mt-1">{ticket.number} · {project?.name} · {formatDate(ticket.date)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" leftIcon={<Download size={14} />}>Export PDF</Button>
          {ticket.status === "SUBMITTED" && (
            <Button size="sm" leftIcon={<CheckCircle size={14} />} className="bg-emerald-600 hover:bg-emerald-700">Approve</Button>
          )}
        </div>
      </div>

      {/* Context */}
      {(ticket.location || ticket.weatherCondition) && (
        <div className="flex items-center gap-4 text-sm text-surface-600 bg-surface-50 rounded-xl px-4 py-3">
          {ticket.location && <span className="flex items-center gap-1.5"><MapPin size={14} className="text-surface-400" /> {ticket.location}</span>}
          {ticket.weatherCondition && <span className="flex items-center gap-1.5"><Cloud size={14} className="text-surface-400" /> {ticket.weatherCondition}</span>}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Main */}
        <div className="md:col-span-2 space-y-4">
          {ticket.description && (
            <Card>
              <h3 className="text-sm font-semibold text-surface-700 mb-2">Description</h3>
              <p className="text-sm text-surface-700 leading-relaxed">{ticket.description}</p>
            </Card>
          )}

          {/* Labor */}
          <Card padding="none" className="overflow-hidden">
            <div className="px-5 py-3 border-b border-surface-100 flex justify-between">
              <h3 className="text-sm font-semibold text-surface-900">Labor</h3>
              <span className="text-sm font-semibold">{formatCurrency(ticket.laborCost)}</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50/50 border-b border-surface-100">
                  {["Worker","Role","Hours","Rate","Total"].map((h) => (
                    <th key={h} className={`px-4 py-2.5 text-xs font-semibold text-surface-500 ${h === "Total" || h === "Hours" || h === "Rate" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                {mockLaborEntries.map((e) => (
                  <tr key={e.id}>
                    <td className="px-4 py-3 font-medium">{e.workerName}</td>
                    <td className="px-4 py-3 text-surface-600">{e.role}</td>
                    <td className="px-4 py-3 text-right">{e.hoursWorked}h</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(e.hourlyRate)}/hr</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatCurrency(e.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Materials */}
          {mockMaterialEntries.length > 0 && (
            <Card padding="none" className="overflow-hidden">
              <div className="px-5 py-3 border-b border-surface-100 flex justify-between">
                <h3 className="text-sm font-semibold text-surface-900">Materials</h3>
                <span className="text-sm font-semibold">{formatCurrency(ticket.materialCost)}</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-50/50 border-b border-surface-100">
                    {["Description","Qty","Unit","Unit Cost","Total"].map((h) => (
                      <th key={h} className={`px-4 py-2.5 text-xs font-semibold text-surface-500 ${["Qty","Unit Cost","Total"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-50">
                  {mockMaterialEntries.map((e) => (
                    <tr key={e.id}>
                      <td className="px-4 py-3 font-medium">{e.description}</td>
                      <td className="px-4 py-3 text-right">{e.quantity}</td>
                      <td className="px-4 py-3 text-surface-600">{e.unit}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(e.unitCost)}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatCurrency(e.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold text-surface-700 mb-3">Cost Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-surface-500">Labor</span><span className="font-medium">{formatCurrency(ticket.laborCost)}</span></div>
              <div className="flex justify-between"><span className="text-surface-500">Material</span><span className="font-medium">{formatCurrency(ticket.materialCost)}</span></div>
              <div className="flex justify-between"><span className="text-surface-500">Equipment</span><span className="font-medium">{formatCurrency(ticket.equipmentCost)}</span></div>
              <div className="h-px bg-surface-100" />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span><span>{formatCurrency(ticket.totalCost)}</span>
              </div>
            </div>
          </Card>

          {ticket.signedBy && (
            <Card className="border-emerald-200 bg-emerald-50/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-emerald-600" />
                <h3 className="text-sm font-semibold text-emerald-800">Signed</h3>
              </div>
              <p className="text-sm text-surface-700">{ticket.signedBy}</p>
              {ticket.signedAt && <p className="text-xs text-surface-500 mt-1">{formatDateTime(ticket.signedAt)}</p>}
            </Card>
          )}

          <Card>
            <h3 className="text-sm font-semibold text-surface-700 mb-3">Details</h3>
            <div className="space-y-2 text-sm">
              {[
                { label: "Status",   value: <StatusBadge status={ticket.status} /> },
                { label: "Date",     value: formatDate(ticket.date) },
                { label: "Project",  value: project?.name ?? "—" },
                { label: "Created",  value: formatDate(ticket.createdAt) },
              ].map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-2">
                  <span className="text-surface-500">{row.label}</span>
                  <span className="font-medium text-surface-800 text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
