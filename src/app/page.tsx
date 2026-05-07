import Link from "next/link";
import {
  HardHat, ArrowRight, CheckCircle, BarChart3,
  Smartphone, FileText, Receipt, Sparkles, Star, Shield,
  ChevronRight, Clock, Users, DollarSign,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Smart Change Orders",
    description: "Create, track, and approve change orders with AI-assisted wording, automatic cost calculations, and digital signatures.",
    color: "bg-brand-50 text-brand-600",
  },
  {
    icon: Receipt,
    title: "Mobile T&M Tickets",
    description: "Field crews create time & material tickets from their phone in under 60 seconds. Built for gloves-on, outdoor use.",
    color: "bg-accent-50 text-accent-600",
  },
  {
    icon: Sparkles,
    title: "AI Assistant",
    description: "AI generates professional RFI wording, summarizes change orders, detects duplicate work, and predicts cost overruns.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: BarChart3,
    title: "Financial Analytics",
    description: "Real-time visibility into pending exposure, approved revenue, and paid amounts across all your projects.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Shield,
    title: "Approval Workflows",
    description: "Role-based approval chains with timestamps, digital signatures, and full audit logs for every decision.",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Works beautifully on iPhone, Android, and iPad. Foremen love it. Designed for high-contrast outdoor visibility.",
    color: "bg-pink-50 text-pink-600",
  },
];

const stats = [
  { label: "Change orders processed", value: "2.4M+" },
  { label: "Cost exposure tracked",   value: "$8.7B"  },
  { label: "Field crews",             value: "12,000+" },
  { label: "Time saved per ticket",   value: "47 min" },
];

const testimonials = [
  {
    quote: "FieldFlow cut our change order approval cycle from 2 weeks to 3 days. The AI wording alone is worth the subscription.",
    name:  "Marcus Chen",
    role:  "VP of Operations, Apex Construction",
    avatar: "MC",
  },
  {
    quote: "My foremen used to hate paperwork. Now they are submitting T&M tickets from the field in under a minute. Game changer.",
    name:  "Rosa Delgado",
    role:  "Project Manager, SkyBuild Group",
    avatar: "RD",
  },
  {
    quote: "The financial dashboard alone pays for itself. I can see our entire CO pipeline at a glance every morning.",
    name:  "James Wheeler",
    role:  "GC Owner, Wheeler Brothers LLC",
    avatar: "JW",
  },
];

const plans = [
  {
    name:  "Starter",
    price: 49,
    desc:  "For small teams getting started",
    features: ["3 projects", "5 team members", "Change orders and T&M", "Basic analytics", "Email support"],
    highlight: false,
  },
  {
    name:  "Pro",
    price: 149,
    desc:  "For growing construction companies",
    features: ["Unlimited projects", "Unlimited team members", "AI assistant", "Advanced analytics", "Priority support", "Digital signatures", "PDF exports"],
    highlight: true,
  },
  {
    name:  "Enterprise",
    price: null,
    desc:  "For large GCs and multi-company setups",
    features: ["Everything in Pro", "Custom integrations", "SSO / SAML", "Dedicated CSM", "SLA guarantee", "Custom AI training", "White-label options"],
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <HardHat size={18} className="text-white" />
            </div>
            <span className="font-bold text-surface-900">FieldFlow <span className="text-brand-600">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-surface-600">
            <a href="#features"     className="hover:text-surface-900">Features</a>
            <a href="#how-it-works" className="hover:text-surface-900">How it works</a>
            <a href="#pricing"      className="hover:text-surface-900">Pricing</a>
            <a href="#testimonials" className="hover:text-surface-900">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-surface-700 hover:text-surface-900">Sign in</Link>
            <Link href="/register" className="btn-primary text-sm px-4 py-2">
              Start free trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent-500/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles size={14} className="text-accent-400" />
            <span className="text-sm text-brand-100 font-medium">Powered by Claude AI</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            The modern OS for
            <span className="block mt-2" style={{
              background: "linear-gradient(135deg, #60a5fa, #f97316)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              construction workflows
            </span>
          </h1>

          <p className="text-xl text-brand-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Change orders, T&amp;M tickets, and field documentation in one AI-powered platform.
            Built for GCs, subs, and foremen who work in the real world.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold text-lg rounded-xl hover:bg-surface-50 transition-all shadow-lg">
              Start free trial <ArrowRight size={20} />
            </Link>
            <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-700/50 text-white font-bold text-lg rounded-xl border border-white/20 hover:bg-brand-700/70 transition-all">
              View live demo
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-brand-300">
            {["Free 14-day trial", "No credit card required", "Cancel anytime"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-accent-400" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard preview wireframe */}
        <div className="relative max-w-5xl mx-auto px-6 pb-0 -mb-16">
          <div className="bg-white rounded-t-2xl border border-surface-200 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-surface-100 border-b border-surface-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded-md px-3 py-1 text-xs text-surface-400 border border-surface-200 max-w-xs mx-auto text-center">
                  app.fieldflow.ai/dashboard
                </div>
              </div>
            </div>
            <div className="bg-surface-50 p-4 md:p-6">
              <div className="grid grid-cols-4 gap-3 mb-4">
                {["4 Active Projects","2 Pending COs","3 Open Tickets","$146K Exposure"].map((s, i) => (
                  <div key={s} className="bg-white rounded-xl border border-surface-200 p-3 shadow-sm">
                    <p className="text-xs text-surface-500 truncate">{s.split(" ").slice(1).join(" ")}</p>
                    <p className={`text-xl font-bold mt-0.5 ${["text-brand-600","text-accent-600","text-violet-600","text-red-600"][i]}`}>
                      {s.split(" ")[0]}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 bg-white rounded-xl border border-surface-200 h-24 p-3 shadow-sm">
                  <p className="text-[10px] font-semibold text-surface-500 mb-2">Revenue Pipeline</p>
                  <div className="flex items-end gap-1.5 h-14">
                    {[40,60,35,80,55,90,30].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end gap-0.5">
                        <div className="bg-brand-500 rounded-sm opacity-70" style={{ height: `${h * 0.55}%` }} />
                        <div className="bg-accent-400 rounded-sm opacity-60" style={{ height: `${h * 0.25}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-surface-200 h-24 p-3 shadow-sm">
                  <p className="text-[10px] font-semibold text-surface-500 mb-2">CO Status</p>
                  <div className="flex flex-col gap-1.5">
                    {[["Draft","#94a3b8",25],["Submitted","#60a5fa",45],["Approved","#34d399",70],["Paid","#10b981",15]].map(([label,color,pct]) => (
                      <div key={String(label)} className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: String(color) }} />
                        <span className="text-[9px] text-surface-500 w-14 truncate">{label}</span>
                        <div className="flex-1 h-1 bg-surface-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: String(color) }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-950 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl md:text-4xl font-bold text-white">{s.value}</p>
                <p className="text-sm text-brand-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-surface-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">Everything your team needs</h2>
            <p className="text-lg text-surface-500 max-w-xl mx-auto">
              From the field to the office, FieldFlow AI connects your entire construction workflow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl border border-surface-200 p-6 hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-surface-900 mb-2">{f.title}</h3>
                <p className="text-sm text-surface-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">Simple. Fast. Powerful.</h2>
            <p className="text-lg text-surface-500">Three steps from field to payment</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {[
              { step: "01", title: "Create in the field", desc: "A foreman opens the app, snaps photos, logs labor and materials, and submits in under 60 seconds.", icon: "📱" },
              { step: "02", title: "Review and approve",  desc: "GCs and PMs review, comment, and approve from anywhere. AI flags issues before they become disputes.", icon: "✅" },
              { step: "03", title: "Get paid faster",     desc: "Approved items convert directly to billing. Track payment status in real time across all projects.",   icon: "💰" },
            ].map((step, i) => (
              <div key={step.step} className="relative text-center">
                <div className="text-5xl mb-4">{step.icon}</div>
                <div className="text-xs font-bold text-brand-500 mb-2">STEP {step.step}</div>
                <h3 className="text-xl font-bold text-surface-900 mb-3">{step.title}</h3>
                <p className="text-surface-600 text-sm leading-relaxed">{step.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 -right-5 text-surface-300">
                    <ChevronRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-surface-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">Trusted by construction pros</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-surface-200 p-6 shadow-card">
                <div className="flex gap-0.5 mb-4">
                  {[0,1,2,3,4].map((i) => <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-surface-700 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-900">{t.name}</p>
                    <p className="text-xs text-surface-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-surface-500">Start free. Scale as you grow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-2xl border p-6 ${
                plan.highlight
                  ? "bg-brand-900 border-brand-700 ring-2 ring-brand-500 relative"
                  : "bg-white border-surface-200"
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-lg font-bold mb-1 ${plan.highlight ? "text-white" : "text-surface-900"}`}>{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.highlight ? "text-brand-300" : "text-surface-500"}`}>{plan.desc}</p>
                <div className="mb-6">
                  {plan.price ? (
                    <div className="flex items-end gap-1">
                      <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-surface-900"}`}>${plan.price}</span>
                      <span className={`text-sm pb-1 ${plan.highlight ? "text-brand-400" : "text-surface-500"}`}>/month</span>
                    </div>
                  ) : (
                    <p className={`text-2xl font-bold ${plan.highlight ? "text-white" : "text-surface-900"}`}>Custom pricing</p>
                  )}
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={15} className={plan.highlight ? "text-accent-400" : "text-emerald-500"} />
                      <span className={plan.highlight ? "text-brand-100" : "text-surface-700"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  plan.highlight ? "bg-white text-brand-700 hover:bg-surface-50" : "bg-brand-600 text-white hover:bg-brand-700"
                }`}>
                  {plan.price ? "Start free trial" : "Contact sales"} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-brand-900 to-brand-950">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-brand mx-auto mb-6 flex items-center justify-center shadow-lg">
            <HardHat size={32} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to modernize your workflows?</h2>
          <p className="text-lg text-brand-300 mb-8">
            Join thousands of construction professionals who use FieldFlow AI every day. No setup fees. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold text-lg rounded-xl hover:bg-surface-50 transition-all">
              Start free trial <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-700/50 text-white font-bold text-lg rounded-xl border border-white/20 hover:bg-brand-700/70 transition-all">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-950 border-t border-brand-900 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md gradient-brand flex items-center justify-center">
                <HardHat size={15} className="text-white" />
              </div>
              <span className="text-sm font-bold text-white">FieldFlow AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-brand-400">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Security</a>
              <a href="#" className="hover:text-white">Contact</a>
            </div>
            <p className="text-xs text-brand-600">2026 FieldFlow AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
