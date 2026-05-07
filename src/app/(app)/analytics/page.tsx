"use client";

import { DollarSign, TrendingUp, TrendingDown, FileText, Receipt, BarChart2 } from "lucide-react";
import { Card, StatCard } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { mockChangeOrders, mockProjects, mockFinancialData } from "@/lib/mock-data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
} from "recharts";

const totalPending  = mockChangeOrders.filter((co) => ["DRAFT","SUBMITTED","REVIEWED"].includes(co.status)).reduce((s,co) => s+co.totalCost, 0);
const totalApproved = mockChangeOrders.filter((co) => co.status === "APPROVED").reduce((s,co) => s+co.totalCost, 0);
const totalPaid     = mockChangeOrders.filter((co) => co.status === "PAID").reduce((s,co) => s+co.totalCost, 0);
const totalRejected = mockChangeOrders.filter((co) => co.status === "REJECTED").reduce((s,co) => s+co.totalCost, 0);

const projectBreakdown = mockProjects.map((p) => {
  const cos = mockChangeOrders.filter((co) => co.projectId === p.id);
  return {
    name:     p.name.split(" ").slice(0,2).join(" "),
    approved: cos.filter((c) => c.status === "APPROVED").reduce((s,c) => s+c.totalCost, 0),
    pending:  cos.filter((c) => ["DRAFT","SUBMITTED","REVIEWED"].includes(c.status)).reduce((s,c) => s+c.totalCost, 0),
    paid:     cos.filter((c) => c.status === "PAID").reduce((s,c) => s+c.totalCost, 0),
  };
});

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Analytics</h1>
        <p className="text-sm text-surface-500 mt-1">Financial overview and project performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending Exposure" value={formatCurrency(totalPending)}  icon={<TrendingUp size={20} />}   color="orange" trend={{ value: 8,   label: "this month" }} />
        <StatCard label="Approved Revenue" value={formatCurrency(totalApproved)} icon={<DollarSign size={20} />}   color="green"  trend={{ value: 12,  label: "this month" }} />
        <StatCard label="Paid Revenue"     value={formatCurrency(totalPaid)}     icon={<TrendingDown size={20} />} color="blue"   trend={{ value: -3,  label: "vs last month" }} />
        <StatCard label="Rejected Value"   value={formatCurrency(totalRejected)} icon={<BarChart2 size={20} />}    color="red" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly trend */}
        <Card>
          <h3 className="section-title mb-4">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={mockFinancialData.monthly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f97316" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [formatCurrency(Number(v ?? 0))]} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
              <Area type="monotone" dataKey="paid"     stroke="#10b981" strokeWidth={2} fill="url(#ga)" name="Paid" />
              <Area type="monotone" dataKey="approved" stroke="#3b82f6" strokeWidth={2} fill="none" name="Approved" />
              <Area type="monotone" dataKey="pending"  stroke="#f97316" strokeWidth={2} fill="url(#gp)" name="Pending" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Status pie */}
        <Card>
          <h3 className="section-title mb-4">CO Status Breakdown</h3>
          <div className="flex items-center">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={mockFinancialData.statusBreakdown} cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {mockFinancialData.statusBreakdown.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [formatCurrency(Number(v ?? 0))]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {mockFinancialData.statusBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-surface-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-surface-800">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Project breakdown */}
      <Card>
        <h3 className="section-title mb-4">Change Order Value by Project</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={projectBreakdown} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v) => [formatCurrency(Number(v ?? 0))]} contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0" }} />
            <Legend />
            <Bar dataKey="paid"     name="Paid"     fill="#10b981" radius={[4,4,0,0]} />
            <Bar dataKey="approved" name="Approved" fill="#3b82f6" radius={[4,4,0,0]} />
            <Bar dataKey="pending"  name="Pending"  fill="#f97316" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Table */}
      <Card padding="none" className="overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-100">
          <h3 className="section-title">Project Financial Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-50/50 border-b border-surface-100">
                {["Project","Budget","CO Exposure","Approved","Paid","At Risk"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50">
              {mockProjects.map((p) => {
                const cos      = mockChangeOrders.filter((co) => co.projectId === p.id);
                const exposure = cos.filter((c) => ["DRAFT","SUBMITTED","REVIEWED"].includes(c.status)).reduce((s,c) => s+c.totalCost, 0);
                const approved = cos.filter((c) => c.status === "APPROVED").reduce((s,c) => s+c.totalCost, 0);
                const paid     = cos.filter((c) => c.status === "PAID").reduce((s,c) => s+c.totalCost, 0);
                const atRisk   = p.budget ? Math.max(0, exposure + approved - (p.budget * 0.15)) : 0;
                return (
                  <tr key={p.id} className="hover:bg-surface-50">
                    <td className="px-5 py-3.5 font-semibold text-surface-900">{p.name}</td>
                    <td className="px-5 py-3.5 text-surface-700">{p.budget ? formatCurrency(p.budget) : "—"}</td>
                    <td className="px-5 py-3.5 text-accent-600 font-medium">{formatCurrency(exposure)}</td>
                    <td className="px-5 py-3.5 text-emerald-700 font-medium">{formatCurrency(approved)}</td>
                    <td className="px-5 py-3.5 text-green-700 font-medium">{formatCurrency(paid)}</td>
                    <td className="px-5 py-3.5">
                      {atRisk > 0 ? (
                        <span className="text-red-600 font-semibold">{formatCurrency(atRisk)}</span>
                      ) : (
                        <span className="text-emerald-600 text-xs font-medium">Within Budget</span>
                      )}
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
