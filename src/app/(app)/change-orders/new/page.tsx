"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Sparkles, Calculator, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { mockProjects } from "@/lib/mock-data";

interface LaborRow { id: string; workerName: string; role: string; hours: number; rate: number }
interface MaterialRow { id: string; description: string; quantity: number; unit: string; unitCost: number }

export default function NewChangeOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAILoading] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", projectId: "", priority: "MEDIUM", markupPercent: 15,
  });

  const [laborRows, setLaborRows] = useState<LaborRow[]>([
    { id: "1", workerName: "", role: "", hours: 0, rate: 0 },
  ]);
  const [materialRows, setMaterialRows] = useState<MaterialRow[]>([
    { id: "1", description: "", quantity: 0, unit: "EA", unitCost: 0 },
  ]);

  const laborTotal    = laborRows.reduce((s, r) => s + r.hours * r.rate, 0);
  const materialTotal = materialRows.reduce((s, r) => s + r.quantity * r.unitCost, 0);
  const subtotal      = laborTotal + materialTotal;
  const markup        = subtotal * (form.markupPercent / 100);
  const total         = subtotal + markup;

  async function generateDescription() {
    if (!form.title) return;
    setAILoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setForm((f) => ({
      ...f,
      description: `This change order addresses ${f.title.toLowerCase()}. The work was not included in the original contract scope and is required to maintain project schedule and quality standards. All labor rates are in accordance with the applicable wage determinations and prevailing wage requirements. Materials are priced at current market rates with appropriate markups per contract terms.`,
    }));
    setAILoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/change-orders");
  }

  function addLaborRow() {
    setLaborRows([...laborRows, { id: Date.now().toString(), workerName: "", role: "", hours: 0, rate: 0 }]);
  }
  function addMaterialRow() {
    setMaterialRows([...materialRows, { id: Date.now().toString(), description: "", quantity: 0, unit: "EA", unitCost: 0 }]);
  }
  function removeLaborRow(id: string)    { setLaborRows(laborRows.filter((r) => r.id !== id)); }
  function removeMaterialRow(id: string) { setMaterialRows(materialRows.filter((r) => r.id !== id)); }

  return (
    <div className="space-y-5 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/change-orders">
          <Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-surface-900">New Change Order</h1>
          <p className="text-sm text-surface-500 mt-0.5">Fill in the details below to create a change order</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info */}
        <Card>
          <h2 className="text-sm font-semibold text-surface-700 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input label="Title *" placeholder="e.g. Additional foundation waterproofing" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <Select label="Project *" options={[{ value: "", label: "Select project…" }, ...mockProjects.map((p) => ({ value: p.id, label: p.name }))]}
              value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} required />
            <Select label="Priority" options={["LOW","MEDIUM","HIGH","URGENT"].map((v) => ({ value: v, label: v.charAt(0)+v.slice(1).toLowerCase() }))}
              value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} />
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-surface-700">Description</label>
              <Button type="button" variant="ghost" size="sm" leftIcon={<Sparkles size={12} />} onClick={generateDescription} loading={aiLoading} disabled={!form.title}>
                AI Generate
              </Button>
            </div>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the change order scope, reason, and impact…"
              rows={5}
              className="w-full px-3 py-2.5 text-sm text-surface-900 bg-white border border-surface-200 rounded-lg
                         placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
            />
          </div>
        </Card>

        {/* Labor */}
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-3 border-b border-surface-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-surface-900">Labor</h2>
            <span className="text-sm font-semibold text-surface-700">{formatCurrency(laborTotal)}</span>
          </div>
          <div className="p-4 space-y-2">
            {laborRows.map((row, i) => (
              <div key={row.id} className="grid grid-cols-12 gap-2 items-center">
                <input placeholder="Worker name" value={row.workerName} onChange={(e) => setLaborRows(laborRows.map((r) => r.id === row.id ? { ...r, workerName: e.target.value } : r))}
                  className="col-span-3 input py-2" />
                <input placeholder="Role" value={row.role} onChange={(e) => setLaborRows(laborRows.map((r) => r.id === row.id ? { ...r, role: e.target.value } : r))}
                  className="col-span-3 input py-2" />
                <input type="number" placeholder="Hours" value={row.hours || ""} onChange={(e) => setLaborRows(laborRows.map((r) => r.id === row.id ? { ...r, hours: Number(e.target.value) } : r))}
                  className="col-span-2 input py-2" min="0" step="0.5" />
                <input type="number" placeholder="$/hr" value={row.rate || ""} onChange={(e) => setLaborRows(laborRows.map((r) => r.id === row.id ? { ...r, rate: Number(e.target.value) } : r))}
                  className="col-span-2 input py-2" min="0" />
                <div className="col-span-1 text-right text-sm font-semibold text-surface-700">
                  {formatCurrency(row.hours * row.rate)}
                </div>
                <button type="button" onClick={() => removeLaborRow(row.id)} className="col-span-1 p-1 text-surface-400 hover:text-red-500 transition-colors mx-auto">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" leftIcon={<Plus size={14} />} onClick={addLaborRow}>Add Worker</Button>
          </div>
        </Card>

        {/* Materials */}
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-3 border-b border-surface-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-surface-900">Materials</h2>
            <span className="text-sm font-semibold text-surface-700">{formatCurrency(materialTotal)}</span>
          </div>
          <div className="p-4 space-y-2">
            {materialRows.map((row) => (
              <div key={row.id} className="grid grid-cols-12 gap-2 items-center">
                <input placeholder="Description" value={row.description} onChange={(e) => setMaterialRows(materialRows.map((r) => r.id === row.id ? { ...r, description: e.target.value } : r))}
                  className="col-span-4 input py-2" />
                <input type="number" placeholder="Qty" value={row.quantity || ""} onChange={(e) => setMaterialRows(materialRows.map((r) => r.id === row.id ? { ...r, quantity: Number(e.target.value) } : r))}
                  className="col-span-2 input py-2" min="0" />
                <select value={row.unit} onChange={(e) => setMaterialRows(materialRows.map((r) => r.id === row.id ? { ...r, unit: e.target.value } : r))}
                  className="col-span-1 input py-2 cursor-pointer">
                  {["EA","SF","LF","CY","LB","TON","GAL"].map((u) => <option key={u}>{u}</option>)}
                </select>
                <input type="number" placeholder="$/unit" value={row.unitCost || ""} onChange={(e) => setMaterialRows(materialRows.map((r) => r.id === row.id ? { ...r, unitCost: Number(e.target.value) } : r))}
                  className="col-span-2 input py-2" min="0" />
                <div className="col-span-2 text-right text-sm font-semibold text-surface-700">
                  {formatCurrency(row.quantity * row.unitCost)}
                </div>
                <button type="button" onClick={() => removeMaterialRow(row.id)} className="col-span-1 p-1 text-surface-400 hover:text-red-500 mx-auto">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" leftIcon={<Plus size={14} />} onClick={addMaterialRow}>Add Material</Button>
          </div>
        </Card>

        {/* Totals + markup */}
        <Card>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-surface-700 mb-3">Markup</h2>
              <div className="flex items-center gap-3 max-w-xs">
                <input
                  type="number" value={form.markupPercent} min="0" max="100"
                  onChange={(e) => setForm({ ...form, markupPercent: Number(e.target.value) })}
                  className="input w-24"
                />
                <span className="text-sm text-surface-600">% markup on all costs</span>
              </div>
            </div>
            <div className="md:w-72">
              <h2 className="text-sm font-semibold text-surface-700 mb-3 flex items-center gap-1.5">
                <Calculator size={14} /> Cost Summary
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-surface-600">Labor</span><span>{formatCurrency(laborTotal)}</span></div>
                <div className="flex justify-between"><span className="text-surface-600">Material</span><span>{formatCurrency(materialTotal)}</span></div>
                <div className="flex justify-between"><span className="text-surface-600">Equipment</span><span>{formatCurrency(0)}</span></div>
                <div className="h-px bg-surface-100" />
                <div className="flex justify-between"><span className="text-surface-600">Subtotal</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-surface-600">Markup ({form.markupPercent}%)</span><span className="text-accent-600 font-medium">+{formatCurrency(markup)}</span></div>
                <div className="h-px bg-surface-100" />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span><span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Attachments */}
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-surface-700">Attachments</h2>
          </div>
          <div className="border-2 border-dashed border-surface-200 rounded-xl p-8 text-center hover:border-brand-300 hover:bg-brand-50/30 transition-all cursor-pointer">
            <Paperclip size={24} className="mx-auto mb-2 text-surface-400" />
            <p className="text-sm text-surface-600 font-medium">Drop files here or click to upload</p>
            <p className="text-xs text-surface-400 mt-1">PDF, images, videos up to 100MB</p>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-end pb-6">
          <Link href="/change-orders">
            <Button variant="secondary">Cancel</Button>
          </Link>
          <Button variant="secondary" type="submit" onClick={() => {}}>Save Draft</Button>
          <Button type="submit" loading={loading} leftIcon={<Calculator size={14} />}>Save &amp; Submit</Button>
        </div>
      </form>
    </div>
  );
}
