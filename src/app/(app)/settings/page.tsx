"use client";

import { useState } from "react";
import { User, Building2, Bell, Shield, CreditCard, Moon, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "profile",  label: "Profile",       icon: User },
  { id: "company",  label: "Company",        icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security",       icon: Shield },
  { id: "billing",  label: "Billing",        icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved]         = useState(false);

  async function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Settings</h1>
        <p className="text-sm text-surface-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar tabs */}
        <div className="md:w-52 flex-shrink-0">
          <nav className="space-y-0.5">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all",
                  activeTab === id
                    ? "bg-brand-50 text-brand-700"
                    : "text-surface-600 hover:bg-surface-100 hover:text-surface-900"
                )}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {activeTab === "profile" && (
            <>
              <Card>
                <h2 className="text-base font-semibold text-surface-900 mb-4">Profile Information</h2>
                <div className="flex items-center gap-4 mb-6">
                  <Avatar name="Alex Johnson" size="xl" />
                  <div>
                    <Button variant="secondary" size="sm">Change Photo</Button>
                    <p className="text-xs text-surface-400 mt-1">JPG, GIF or PNG. Max 2MB.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name"   defaultValue="Alex Johnson"             />
                  <Input label="Email"       defaultValue="alex@fieldflow.ai" type="email" />
                  <Input label="Phone"       defaultValue="+1 (555) 234-5678" type="tel" />
                  <Input label="Job Title"   defaultValue="General Contractor"       />
                </div>
              </Card>

              <Card>
                <h2 className="text-base font-semibold text-surface-900 mb-4">Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: "Theme",    value: "Light",     icon: Moon },
                    { label: "Language", value: "English",   icon: Globe },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className="text-surface-400" />
                        <span className="text-sm text-surface-700">{label}</span>
                      </div>
                      <select className="text-sm border border-surface-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                        <option>{value}</option>
                      </select>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {activeTab === "company" && (
            <Card>
              <h2 className="text-base font-semibold text-surface-900 mb-4">Company Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input label="Company Name" defaultValue="Apex Construction LLC" />
                </div>
                <Input label="Address"     defaultValue="123 Main St, New York, NY" />
                <Input label="Phone"       defaultValue="+1 (555) 100-2000" type="tel" />
                <Input label="Website"     defaultValue="apexconstruction.com" />
                <Input label="Tax ID / EIN" defaultValue="12-3456789" />
              </div>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <h2 className="text-base font-semibold text-surface-900 mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: "Change order submitted",    email: true,  push: true  },
                  { label: "Change order approved",     email: true,  push: true  },
                  { label: "Change order rejected",     email: true,  push: true  },
                  { label: "T&M ticket created",        email: false, push: true  },
                  { label: "Budget threshold exceeded", email: true,  push: true  },
                  { label: "New team member added",     email: true,  push: false },
                  { label: "Weekly summary report",     email: true,  push: false },
                ].map((n) => (
                  <div key={n.label} className="flex items-center justify-between py-2 border-b border-surface-100 last:border-0">
                    <span className="text-sm text-surface-700">{n.label}</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs text-surface-500 cursor-pointer">
                        <input type="checkbox" defaultChecked={n.email} className="rounded" />
                        Email
                      </label>
                      <label className="flex items-center gap-2 text-xs text-surface-500 cursor-pointer">
                        <input type="checkbox" defaultChecked={n.push} className="rounded" />
                        Push
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <h2 className="text-base font-semibold text-surface-900 mb-4">Security</h2>
              <div className="space-y-4">
                <Input label="Current Password" type="password" placeholder="••••••••" />
                <Input label="New Password"     type="password" placeholder="8+ characters" />
                <Input label="Confirm Password" type="password" placeholder="••••••••" />
                <div className="pt-2">
                  <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-surface-900">Two-factor authentication</p>
                      <p className="text-xs text-surface-500 mt-0.5">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="secondary" size="sm">Enable 2FA</Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "billing" && (
            <div className="space-y-4">
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-surface-900">Pro Plan</h2>
                    <p className="text-sm text-surface-500 mt-0.5">$149/month · Billed monthly</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">Active</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  {[
                    { label: "Projects", used: 4, limit: "Unlimited" },
                    { label: "Team members", used: 8, limit: "Unlimited" },
                    { label: "Storage", used: "12 GB", limit: "100 GB" },
                    { label: "AI credits", used: "847", limit: "2,000/mo" },
                  ].map((f) => (
                    <div key={f.label} className="bg-surface-50 rounded-xl p-3">
                      <p className="text-xs text-surface-500">{f.label}</p>
                      <p className="font-bold text-surface-900 mt-0.5">{f.used}</p>
                      <p className="text-xs text-surface-400">of {f.limit}</p>
                    </div>
                  ))}
                </div>
                <Button variant="secondary" size="sm">Upgrade to Enterprise</Button>
              </Card>

              <Card>
                <h2 className="text-base font-semibold text-surface-900 mb-4">Payment Method</h2>
                <div className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl">
                  <div className="w-10 h-7 bg-white rounded-md border border-surface-200 flex items-center justify-center">
                    <span className="text-xs font-bold text-brand-700">VISA</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">Visa ending in 4242</p>
                    <p className="text-xs text-surface-500">Expires 12/27</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">Update</Button>
                </div>
              </Card>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleSave} leftIcon={<Save size={14} />}>
              {saved ? "Saved!" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
