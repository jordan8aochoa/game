"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Camera, Plus, Trash2, MapPin, Cloud, Clock,
  User, Package, Truck, PenTool, CheckCircle, Mic,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { mockProjects } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface WorkerRow { id: string; name: string; role: string; hours: number; rate: number }
interface MaterialRow { id: string; description: string; qty: number; unit: string; cost: number }

const steps = ["Info", "Labor", "Materials", "Sign"];

export default function NewTMTicketPage() {
  const router = useRouter();
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [signed, setSigned]   = useState(false);

  const [form, setForm] = useState({
    title: "", projectId: "", description: "",
    location: "Detecting location…", weather: "Partly Cloudy, 62°F",
    signedBy: "",
  });

  const [workers, setWorkers] = useState<WorkerRow[]>([
    { id: "1", name: "", role: "Laborer", hours: 8, rate: 75 },
  ]);
  const [materials, setMaterials] = useState<MaterialRow[]>([]);
  const [photos, setPhotos]       = useState<string[]>([]);

  const laborTotal    = workers.reduce((s, w) => s + w.hours * w.rate, 0);
  const materialTotal = materials.reduce((s, m) => s + m.qty * m.cost, 0);
  const total         = laborTotal + materialTotal;

  function addWorker() {
    setWorkers([...workers, { id: Date.now().toString(), name: "", role: "Laborer", hours: 8, rate: 75 }]);
  }
  function addMaterial() {
    setMaterials([...materials, { id: Date.now().toString(), description: "", qty: 1, unit: "EA", cost: 0 }]);
  }

  async function handleSubmit() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/tm-tickets");
  }

  return (
    <div className="max-w-lg mx-auto space-y-4 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/tm-tickets">
          <Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-surface-900">New T&M Ticket</h1>
          <p className="text-xs text-surface-500">Step {step + 1} of {steps.length}</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex gap-1.5">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-1">
            <div className={cn(
              "h-1.5 w-full rounded-full transition-all",
              i <= step ? "bg-brand-600" : "bg-surface-200"
            )} />
            <span className={cn("text-[10px] font-medium", i <= step ? "text-brand-600" : "text-surface-400")}>{s}</span>
          </div>
        ))}
      </div>

      {/* Context bar */}
      <div className="bg-surface-50 rounded-xl px-4 py-3 flex items-center gap-4 text-xs text-surface-600">
        <span className="flex items-center gap-1"><MapPin size={12} /> {form.location}</span>
        <span className="flex items-center gap-1"><Cloud size={12} /> {form.weather}</span>
        <span className="flex items-center gap-1 ml-auto"><Clock size={12} /> Today</span>
      </div>

      {/* Step 0: Info */}
      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="label">What work was done? *</label>
            <input
              type="text" value={form.title} placeholder="e.g. Emergency electrical repair"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input text-base"
              autoFocus
            />
          </div>
          <div>
            <label className="label">Project *</label>
            <select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} className="input">
              <option value="">Select project…</option>
              {mockProjects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Any additional notes, instructions, or context…"
              rows={3} className="input resize-none" />
          </div>

          {/* Photos */}
          <div>
            <label className="label">Photos</label>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((p, i) => (
                <div key={i} className="aspect-square bg-surface-100 rounded-lg overflow-hidden relative">
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              <button
                type="button"
                className="aspect-square bg-surface-50 border-2 border-dashed border-surface-300 rounded-lg
                           flex flex-col items-center justify-center gap-1 text-surface-400 hover:border-brand-400 hover:bg-brand-50/30 transition-all"
              >
                <Camera size={20} />
                <span className="text-xs">Add Photo</span>
              </button>
            </div>
          </div>

          {/* Voice note */}
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-surface-200 text-surface-500 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50/20 transition-all text-sm font-medium">
            <Mic size={16} /> Record voice note
          </button>
        </div>
      )}

      {/* Step 1: Labor */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-surface-900">Workers &amp; Hours</h2>
            <span className="text-sm font-bold text-brand-600">{formatCurrency(laborTotal)}</span>
          </div>
          <div className="space-y-3">
            {workers.map((w) => (
              <div key={w.id} className="bg-surface-50 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-surface-400 flex-shrink-0" />
                  <input placeholder="Worker name" value={w.name}
                    onChange={(e) => setWorkers(workers.map((r) => r.id === w.id ? { ...r, name: e.target.value } : r))}
                    className="flex-1 bg-white input py-1.5 text-sm" />
                  <button onClick={() => setWorkers(workers.filter((r) => r.id !== w.id))}
                    className="text-surface-400 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-surface-500 font-medium">Role</label>
                    <select value={w.role} onChange={(e) => setWorkers(workers.map((r) => r.id === w.id ? { ...r, role: e.target.value } : r))}
                      className="input py-1.5 text-sm mt-0.5">
                      {["Laborer","Foreman","Operator","Electrician","Plumber","Ironworker","Carpenter"].map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-surface-500 font-medium">Hours</label>
                    <input type="number" value={w.hours} min="0" step="0.5"
                      onChange={(e) => setWorkers(workers.map((r) => r.id === w.id ? { ...r, hours: Number(e.target.value) } : r))}
                      className="input py-1.5 text-sm mt-0.5" />
                  </div>
                  <div>
                    <label className="text-[10px] text-surface-500 font-medium">$/hr</label>
                    <input type="number" value={w.rate} min="0"
                      onChange={(e) => setWorkers(workers.map((r) => r.id === w.id ? { ...r, rate: Number(e.target.value) } : r))}
                      className="input py-1.5 text-sm mt-0.5" />
                  </div>
                </div>
                <div className="text-right text-xs font-semibold text-surface-700">
                  Subtotal: {formatCurrency(w.hours * w.rate)}
                </div>
              </div>
            ))}
          </div>
          <Button variant="secondary" size="sm" leftIcon={<Plus size={14} />} onClick={addWorker} className="w-full justify-center">
            Add Worker
          </Button>
        </div>
      )}

      {/* Step 2: Materials */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-surface-900">Materials &amp; Equipment</h2>
            <span className="text-sm font-bold text-brand-600">{formatCurrency(materialTotal)}</span>
          </div>
          {materials.length === 0 && (
            <div className="text-center py-8 text-surface-400">
              <Package size={32} className="mx-auto mb-2" />
              <p className="text-sm">No materials added yet</p>
            </div>
          )}
          <div className="space-y-3">
            {materials.map((m) => (
              <div key={m.id} className="bg-surface-50 rounded-xl p-3 space-y-2">
                <div className="flex gap-2">
                  <input placeholder="Description" value={m.description}
                    onChange={(e) => setMaterials(materials.map((r) => r.id === m.id ? { ...r, description: e.target.value } : r))}
                    className="flex-1 input py-1.5 text-sm" />
                  <button onClick={() => setMaterials(materials.filter((r) => r.id !== m.id))}
                    className="text-surface-400 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" placeholder="Qty" value={m.qty || ""}
                    onChange={(e) => setMaterials(materials.map((r) => r.id === m.id ? { ...r, qty: Number(e.target.value) } : r))}
                    className="input py-1.5 text-sm" />
                  <select value={m.unit} onChange={(e) => setMaterials(materials.map((r) => r.id === m.id ? { ...r, unit: e.target.value } : r))}
                    className="input py-1.5 text-sm">
                    {["EA","SF","LF","LB","GAL","HR"].map((u) => <option key={u}>{u}</option>)}
                  </select>
                  <input type="number" placeholder="$/unit" value={m.cost || ""}
                    onChange={(e) => setMaterials(materials.map((r) => r.id === m.id ? { ...r, cost: Number(e.target.value) } : r))}
                    className="input py-1.5 text-sm" />
                </div>
                <div className="text-right text-xs font-semibold text-surface-700">
                  Subtotal: {formatCurrency(m.qty * m.cost)}
                </div>
              </div>
            ))}
          </div>
          <Button variant="secondary" size="sm" leftIcon={<Plus size={14} />} onClick={addMaterial} className="w-full justify-center">
            Add Material / Equipment
          </Button>

          {/* Total preview */}
          {(laborTotal + materialTotal) > 0 && (
            <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-surface-600">Labor</span><span className="font-medium">{formatCurrency(laborTotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-surface-600">Materials</span><span className="font-medium">{formatCurrency(materialTotal)}</span>
              </div>
              <div className="h-px bg-brand-200 mb-2" />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span><span>{formatCurrency(total)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Signature */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-surface-900">Signature &amp; Submit</h2>

          {/* Summary */}
          <div className="bg-surface-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="font-semibold text-surface-900">{form.title || "Untitled Ticket"}</div>
            <div className="text-surface-500">{mockProjects.find((p) => p.id === form.projectId)?.name}</div>
            <div className="h-px bg-surface-200 my-2" />
            <div className="flex justify-between"><span className="text-surface-600">Workers</span><span>{workers.length}</span></div>
            <div className="flex justify-between"><span className="text-surface-600">Labor</span><span>{formatCurrency(laborTotal)}</span></div>
            <div className="flex justify-between"><span className="text-surface-600">Materials</span><span>{formatCurrency(materialTotal)}</span></div>
            <div className="flex justify-between font-bold text-base"><span>Total</span><span>{formatCurrency(total)}</span></div>
          </div>

          <div>
            <label className="label">Signed by (print name)</label>
            <input type="text" placeholder="Owner / GC representative name" value={form.signedBy}
              onChange={(e) => setForm({ ...form, signedBy: e.target.value })} className="input" />
          </div>

          {/* Signature pad placeholder */}
          <div>
            <label className="label">Signature</label>
            <div
              onClick={() => setSigned(true)}
              className={cn(
                "h-32 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-all",
                signed ? "bg-emerald-50 border-emerald-300" : "border-dashed border-surface-300 bg-surface-50 hover:border-brand-400"
              )}
            >
              {signed ? (
                <div className="flex flex-col items-center gap-1 text-emerald-600">
                  <CheckCircle size={24} />
                  <span className="text-sm font-medium">Signed</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-surface-400">
                  <PenTool size={24} />
                  <span className="text-sm">Tap to sign</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        {step > 0 && (
          <Button variant="secondary" onClick={() => setStep(step - 1)} className="flex-1">Back</Button>
        )}
        {step < steps.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} className="flex-1" disabled={step === 0 && !form.title}>
            Continue
          </Button>
        ) : (
          <Button onClick={handleSubmit} loading={loading} className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            leftIcon={<CheckCircle size={16} />}>
            Submit Ticket
          </Button>
        )}
      </div>
    </div>
  );
}
