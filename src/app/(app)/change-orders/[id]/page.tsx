"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Edit, Send, CheckCircle, XCircle, DollarSign,
  Paperclip, MessageSquare, Clock, User, Sparkles, FileText,
  ChevronDown, ChevronUp, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { formatCurrency, formatDate, formatDateTime, formatRelative } from "@/lib/utils";
import { mockChangeOrders, mockProjects } from "@/lib/mock-data";

const mockLaborEntries = [
  { id: "l1", workerName: "Jose Martinez", role: "Lead Electrician", hoursWorked: 8, hourlyRate: 95, total: 760, date: "2026-05-01" },
  { id: "l2", workerName: "Tom Walsh",     role: "Apprentice",       hoursWorked: 8, hourlyRate: 55, total: 440, date: "2026-05-01" },
  { id: "l3", workerName: "Jose Martinez", role: "Lead Electrician", hoursWorked: 8, hourlyRate: 95, total: 760, date: "2026-05-02" },
];
const mockMaterialEntries = [
  { id: "m1", description: "Waterproofing membrane 60-mil", quantity: 2400, unit: "SF", unitCost: 4.20, total: 10080 },
  { id: "m2", description: "Drainage board composite",      quantity: 1800, unit: "SF", unitCost: 2.80, total: 5040  },
  { id: "m3", description: "Termination bar",               quantity: 120,  unit: "LF", unitCost: 3.50, total: 420   },
];
const mockComments = [
  { id: "c1", content: "I've reviewed the soil report. The higher water table was noted on page 47. We should also consider adding a sump pump.", author: { name: "Sarah Kim", role: "GC" }, createdAt: "2026-05-03T10:00:00Z" },
  { id: "c2", content: "Agreed. Adding sump pump is a separate CO. This CO covers the waterproofing only per the original scope change request.", author: { name: "Alex Johnson", role: "PM" }, createdAt: "2026-05-03T11:30:00Z" },
];

export default function ChangeOrderDetailPage() {
  const params = useParams();
  const co     = mockChangeOrders.find((c) => c.id === params.id) ?? mockChangeOrders[0];
  const project = mockProjects.find((p) => p.id === co.projectId);

  const [showAI, setShowAI]       = useState(false);
  const [newComment, setComment]  = useState("");
  const [aiLoading, setAILoading] = useState(false);
  const [aiSummary, setAISummary] = useState<string | null>(null);

  async function generateAISummary() {
    setAILoading(true);
    setShowAI(true);
    await new Promise((r) => setTimeout(r, 1500));
    setAISummary(
      `This change order addresses additional foundation waterproofing required due to an unexpectedly high water table discovered during soil assessment. The scope includes installation of a 60-mil waterproofing membrane across 2,400 SF of below-grade wall area, drainage board composite, and termination bar. Total cost of $50,715 represents a ${((co.markupPercent)).toFixed(0)}% markup on $44,100 in direct costs. The work is classified as an owner-directed change and is not attributable to any design error. Recommended action: submit for owner approval with soil report section 47 as supporting documentation.`
    );
    setAILoading(false);
  }

  const subtotal = co.laborCost + co.materialCost + co.equipmentCost;
  const markup   = subtotal * (co.markupPercent / 100);

  return (
    <div className="space-y-5 animate-fade-in max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-surface-500">
        <Link href="/change-orders" className="hover:text-surface-700 flex items-center gap-1">
          <ArrowLeft size={14} /> Change Orders
        </Link>
        <span>/</span>
        <span className="font-mono font-semibold text-surface-700">{co.number}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <StatusBadge status={co.status} />
            <PriorityBadge priority={co.priority} />
            <span className="text-xs text-surface-400">v{co.version}</span>
          </div>
          <h1 className="text-2xl font-bold text-surface-900">{co.title}</h1>
          <p className="text-sm text-surface-500 mt-1">{co.number} · {project?.name}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="secondary" size="sm" leftIcon={<Sparkles size={14} />} onClick={generateAISummary}>
            AI Summary
          </Button>
          <Link href={`/change-orders/${co.id}/edit`}>
            <Button variant="secondary" size="sm" leftIcon={<Edit size={14} />}>Edit</Button>
          </Link>
          {co.status === "DRAFT" && (
            <Button size="sm" leftIcon={<Send size={14} />}>Submit for Review</Button>
          )}
          {co.status === "REVIEWED" && (
            <>
              <Button variant="danger" size="sm" leftIcon={<XCircle size={14} />}>Reject</Button>
              <Button size="sm" leftIcon={<CheckCircle size={14} />} className="bg-emerald-600 hover:bg-emerald-700">Approve</Button>
            </>
          )}
          {co.status === "APPROVED" && (
            <Button size="sm" leftIcon={<DollarSign size={14} />} className="bg-green-600 hover:bg-green-700">Mark Paid</Button>
          )}
        </div>
      </div>

      {/* AI Summary */}
      {showAI && (
        <Card className="border-brand-200 bg-brand-50/40">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-brand-100">
              <Sparkles size={16} className="text-brand-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-brand-800 mb-1">AI Summary</p>
              {aiLoading ? (
                <div className="flex items-center gap-2 text-sm text-brand-600">
                  <div className="animate-pulse-soft">Generating summary…</div>
                </div>
              ) : (
                <p className="text-sm text-surface-700 leading-relaxed">{aiSummary}</p>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Description */}
          <Card>
            <h3 className="text-sm font-semibold text-surface-700 mb-3">Description</h3>
            <p className="text-sm text-surface-700 leading-relaxed">{co.description ?? "No description provided."}</p>
          </Card>

          {/* Labor */}
          <Card padding="none" className="overflow-hidden">
            <div className="px-5 py-3 border-b border-surface-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-900">Labor</h3>
              <span className="text-sm font-semibold text-surface-700">{formatCurrency(co.laborCost)}</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50/50 border-b border-surface-100">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-surface-500">Worker</th>
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-surface-500">Role</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold text-surface-500">Hours</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold text-surface-500">Rate</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold text-surface-500">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                {mockLaborEntries.map((e) => (
                  <tr key={e.id}>
                    <td className="px-5 py-3 font-medium text-surface-900">{e.workerName}</td>
                    <td className="px-5 py-3 text-surface-600">{e.role}</td>
                    <td className="px-5 py-3 text-right text-surface-700">{e.hoursWorked}h</td>
                    <td className="px-5 py-3 text-right text-surface-700">{formatCurrency(e.hourlyRate)}/hr</td>
                    <td className="px-5 py-3 text-right font-semibold text-surface-900">{formatCurrency(e.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Materials */}
          <Card padding="none" className="overflow-hidden">
            <div className="px-5 py-3 border-b border-surface-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-900">Materials</h3>
              <span className="text-sm font-semibold text-surface-700">{formatCurrency(co.materialCost)}</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50/50 border-b border-surface-100">
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-surface-500">Description</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold text-surface-500">Qty</th>
                  <th className="text-left px-5 py-2.5 text-xs font-semibold text-surface-500">Unit</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold text-surface-500">Unit Cost</th>
                  <th className="text-right px-5 py-2.5 text-xs font-semibold text-surface-500">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                {mockMaterialEntries.map((e) => (
                  <tr key={e.id}>
                    <td className="px-5 py-3 font-medium text-surface-900">{e.description}</td>
                    <td className="px-5 py-3 text-right text-surface-700">{e.quantity.toLocaleString()}</td>
                    <td className="px-5 py-3 text-surface-600">{e.unit}</td>
                    <td className="px-5 py-3 text-right text-surface-700">{formatCurrency(e.unitCost)}</td>
                    <td className="px-5 py-3 text-right font-semibold text-surface-900">{formatCurrency(e.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Comments */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={16} className="text-surface-400" />
              <h3 className="text-sm font-semibold text-surface-900">Comments ({mockComments.length})</h3>
            </div>
            <div className="space-y-4">
              {mockComments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <Avatar name={c.author.name} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-surface-900">{c.author.name}</span>
                      <span className="text-xs text-surface-400">{formatRelative(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-surface-700 leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-3 pt-2 border-t border-surface-100">
                <Avatar name="Alex Johnson" size="sm" />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment…"
                    rows={3}
                    className="w-full px-3 py-2 text-sm bg-surface-50 border border-surface-200 rounded-lg resize-none
                               placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  />
                  <div className="flex justify-end mt-2">
                    <Button size="sm" disabled={!newComment.trim()}>Post Comment</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Cost Summary */}
          <Card>
            <h3 className="text-sm font-semibold text-surface-700 mb-4">Cost Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-surface-600">Labor</span><span className="font-medium">{formatCurrency(co.laborCost)}</span></div>
              <div className="flex justify-between"><span className="text-surface-600">Material</span><span className="font-medium">{formatCurrency(co.materialCost)}</span></div>
              <div className="flex justify-between"><span className="text-surface-600">Equipment</span><span className="font-medium">{formatCurrency(co.equipmentCost)}</span></div>
              <div className="h-px bg-surface-100 my-2" />
              <div className="flex justify-between"><span className="text-surface-600">Subtotal</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-surface-600">Markup ({co.markupPercent}%)</span><span className="font-medium text-accent-600">+{formatCurrency(markup)}</span></div>
              <div className="h-px bg-surface-100 my-2" />
              <div className="flex justify-between font-bold text-base">
                <span className="text-surface-900">Total</span>
                <span className="text-surface-900">{formatCurrency(co.totalCost)}</span>
              </div>
            </div>
          </Card>

          {/* Details */}
          <Card>
            <h3 className="text-sm font-semibold text-surface-700 mb-4">Details</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: "Project",    value: project?.name ?? "—" },
                { label: "Status",     value: <StatusBadge status={co.status} /> },
                { label: "Priority",   value: <PriorityBadge priority={co.priority} /> },
                { label: "Created",    value: formatDate(co.createdAt) },
                { label: "Submitted",  value: co.submittedAt ? formatDate(co.submittedAt) : "—" },
                { label: "Approved",   value: co.approvedAt  ? formatDate(co.approvedAt)  : "—" },
              ].map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-2">
                  <span className="text-surface-500 shrink-0">{row.label}</span>
                  <span className="font-medium text-surface-800 text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Attachments */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-surface-700">Attachments</h3>
              <Button variant="ghost" size="sm" leftIcon={<Paperclip size={12} />}>Attach</Button>
            </div>
            <div className="space-y-2">
              {["Soil_Report_Section47.pdf", "Waterproofing_Spec.pdf", "Site_Photo_01.jpg"].map((f) => (
                <div key={f} className="flex items-center gap-2 p-2 rounded-lg border border-surface-200 hover:bg-surface-50 cursor-pointer">
                  <FileText size={14} className="text-surface-400 flex-shrink-0" />
                  <span className="text-xs text-surface-700 truncate">{f}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Approval history */}
          <Card>
            <h3 className="text-sm font-semibold text-surface-700 mb-3">Approval History</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-surface-900">Submitted</p>
                  <p className="text-xs text-surface-500">Alex Johnson · {co.submittedAt ? formatDateTime(co.submittedAt) : "—"}</p>
                </div>
              </div>
              {co.approvedAt && (
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-surface-900">Approved</p>
                    <p className="text-xs text-surface-500">Sarah Kim · {formatDateTime(co.approvedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
