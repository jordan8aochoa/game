"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HardHat, User, Mail, Lock, Building2, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type Role = "GENERAL_CONTRACTOR" | "SUBCONTRACTOR" | "FOREMAN" | "OWNER";

const roles: { value: Role; label: string; description: string; icon: string }[] = [
  { value: "GENERAL_CONTRACTOR", label: "General Contractor", description: "Manage projects, subcontractors, and approvals", icon: "🏗️" },
  { value: "SUBCONTRACTOR",      label: "Subcontractor",      description: "Submit change orders and T&M tickets",          icon: "🔧" },
  { value: "FOREMAN",            label: "Foreman",            description: "Create field tickets and track daily work",      icon: "👷" },
  { value: "OWNER",              label: "Owner / PM",         description: "Review, approve, and track project financials",  icon: "📊" },
];

export default function RegisterPage() {
  const router  = useRouter();
  const [step, setStep]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm]     = useState({
    name: "", email: "", password: "", company: "", role: "" as Role | "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 3) { setStep(step + 1); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-brand shadow-lg mb-4">
            <HardHat size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">FieldFlow AI</h1>
          <p className="text-brand-300 text-sm mt-1">Get started in under 2 minutes</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                s < step  ? "bg-emerald-500 text-white" :
                s === step ? "bg-white text-brand-700" :
                             "bg-brand-800 text-brand-400"
              )}>
                {s < step ? <Check size={14} /> : s}
              </div>
              {s < 3 && <div className={cn("w-12 h-0.5", s < step ? "bg-emerald-500" : "bg-brand-700")} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-surface-900">Create your account</h2>
                  <p className="text-sm text-surface-500 mt-1">Start your free 14-day trial</p>
                </div>
                <Input label="Full name" type="text" placeholder="Alex Johnson" leftIcon={<User size={16} />}
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <Input label="Work email" type="email" placeholder="alex@company.com" leftIcon={<Mail size={16} />}
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <Input label="Password" type="password" placeholder="8+ characters" leftIcon={<Lock size={16} />}
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-surface-900">Your role</h2>
                  <p className="text-sm text-surface-500 mt-1">Choose the option that best describes you</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {roles.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: r.value })}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                        form.role === r.value
                          ? "border-brand-500 bg-brand-50"
                          : "border-surface-200 hover:border-surface-300 hover:bg-surface-50"
                      )}
                    >
                      <span className="text-2xl">{r.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-surface-900">{r.label}</p>
                        <p className="text-xs text-surface-500 mt-0.5">{r.description}</p>
                      </div>
                      {form.role === r.value && (
                        <div className="ml-auto w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-surface-900">Your company</h2>
                  <p className="text-sm text-surface-500 mt-1">Almost there — add your company details</p>
                </div>
                <Input label="Company name" type="text" placeholder="Apex Construction LLC" leftIcon={<Building2 size={16} />}
                  value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
                <div className="bg-brand-50 rounded-xl p-4 border border-brand-100">
                  <p className="text-sm font-semibold text-brand-800">🎉 You&apos;re almost in!</p>
                  <p className="text-xs text-brand-600 mt-1">
                    Free 14-day trial · No credit card required · Cancel anytime
                  </p>
                </div>
              </>
            )}

            <Button type="submit" className="w-full" loading={loading} rightIcon={step < 3 ? <ArrowRight size={16} /> : undefined}>
              {step < 3 ? "Continue" : "Create Account"}
            </Button>
          </form>

          {step === 1 && (
            <p className="text-center text-sm text-surface-500 mt-5">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-600 font-semibold hover:text-brand-700">Sign in</Link>
            </p>
          )}
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="w-full text-center text-sm text-surface-500 mt-5 hover:text-surface-700">
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
