"use client";

import { useState, useRef, useEffect } from "react";
import {
  Sparkles, Send, FileText, DollarSign, AlertTriangle,
  Zap, MessageSquare, RotateCcw, Copy, ThumbsUp, ThumbsDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

interface Message {
  id:      string;
  role:    "user" | "assistant";
  content: string;
  loading?: boolean;
}

const quickActions = [
  { icon: FileText,     label: "Summarize CO",     prompt: "Summarize my most recent submitted change order in professional language." },
  { icon: DollarSign,   label: "Price analysis",   prompt: "Analyze the pricing on my pending change orders and flag any that look under-priced." },
  { icon: AlertTriangle,label: "Risk check",       prompt: "Which of my active projects show signs of budget overrun risk?" },
  { icon: Zap,          label: "Write CO wording", prompt: "Help me write professional contract language for a change order involving unforeseen soil conditions." },
  { icon: MessageSquare,label: "Draft RFI",        prompt: "Draft an RFI for unclear structural details on floor 14 of the Riverside Tower project." },
  { icon: RotateCcw,    label: "Find duplicates",  prompt: "Do any of my open change orders appear to cover duplicate or overlapping work?" },
];

const systemMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content: `Hello! I'm your FieldFlow AI assistant. I can help you with:

• **Summarizing change orders** in professional language
• **Generating RFI and CO wording** from your notes
• **Pricing analysis** and markup suggestions
• **Risk detection** across your project portfolio
• **Duplicate work identification** across tickets
• **Converting field notes** into clean documentation

What would you like help with today?`,
  },
];

const mockResponses: Record<string, string> = {
  default: `Based on your project data, I've analyzed the current situation.

**Key findings:**
• You have **3 change orders** totaling $146,875 pending approval
• The electrical panel upgrade (CO-2026-0046) at $85,120 is your highest-value pending item and is currently under review
• Your current markup percentages (10-15%) are within industry standard range

**Recommendations:**
1. Prioritize getting CO-2026-0046 approved — it's been in review for 9 days
2. CO-2026-0044 (concrete pour delay) should be documented with weather logs before submission
3. Consider increasing markup on T&M tickets to account for supervision overhead

Would you like me to draft specific language for any of these items?`,
  summarize: `Here's a professional summary of CO-2026-0047:

---

**Change Order #CO-2026-0047**
**Project:** Riverside Tower Phase 2
**Subject:** Additional Foundation Waterproofing — Below-Grade Walls

**Summary:**
This change order addresses the installation of a comprehensive waterproofing system on all below-grade structural walls, necessitated by an unexpectedly elevated water table confirmed in the geotechnical report dated April 2026.

**Scope of Work:**
- Installation of 2,400 SF of 60-mil HDPE waterproofing membrane
- Application of composite drainage board (1,800 SF)
- Installation of termination bar at grade transitions

**Cost Breakdown:** Labor $18,500 | Materials $22,400 | Equipment $3,200
**Subtotal:** $44,100 | **Markup (15%):** $6,615
**Total:** **$50,715**

**Justification:** Work is owner-directed and outside original contract scope. Supporting documentation: Soil Report Section 47, Geotech Amendment #2.

---

Would you like me to adjust the tone or add any additional justification?`,
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(systemMessages);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const content = text ?? input.trim();
    if (!content || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content };
    const loadingMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: "", loading: true };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1800 + Math.random() * 800));

    const response = content.toLowerCase().includes("summar")
      ? mockResponses.summarize
      : mockResponses.default;

    setMessages((prev) =>
      prev.map((m) => m.id === loadingMsg.id ? { ...m, content: response, loading: false } : m)
    );
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function renderContent(content: string) {
    return content
      .split("\n")
      .map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return <p key={i} className="font-bold text-surface-900 mt-3 mb-1">{line.replace(/\*\*/g, "")}</p>;
        }
        if (line.startsWith("• ")) {
          return <li key={i} className="ml-3 text-surface-700">{line.replace(/\*\*/g, "").slice(2)}</li>;
        }
        if (line.startsWith("---")) {
          return <hr key={i} className="my-3 border-surface-200" />;
        }
        if (line.match(/^\d+\./)) {
          return <li key={i} className="ml-3 text-surface-700 list-decimal">{line.replace(/\*\*/g, "").replace(/^\d+\.\s/, "")}</li>;
        }
        if (line.trim() === "") return <div key={i} className="h-2" />;
        return <p key={i} className="text-surface-700" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />;
      });
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl gradient-brand">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-surface-900">AI Assistant</h1>
          <p className="text-xs text-surface-500">Powered by Claude · Context-aware construction intelligence</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-600 font-medium">Online</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => sendMessage(action.prompt)}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2.5 bg-white border border-surface-200 rounded-xl text-left
                       hover:bg-brand-50 hover:border-brand-200 transition-all text-sm font-medium text-surface-700
                       hover:text-brand-700 disabled:opacity-50"
          >
            <action.icon size={15} className="text-brand-500 flex-shrink-0" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}>
            {msg.role === "assistant" ? (
              <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center flex-shrink-0">
                <Sparkles size={14} className="text-white" />
              </div>
            ) : (
              <Avatar name="Alex Johnson" size="sm" />
            )}
            <div className={cn("max-w-[85%]", msg.role === "user" && "items-end flex flex-col")}>
              <div className={cn(
                "rounded-2xl px-4 py-3 text-sm",
                msg.role === "user"
                  ? "bg-brand-600 text-white rounded-tr-sm"
                  : "bg-white border border-surface-200 rounded-tl-sm shadow-card"
              )}>
                {msg.loading ? (
                  <div className="flex items-center gap-2 text-surface-400">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-surface-300 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                    <span className="text-xs">Thinking…</span>
                  </div>
                ) : msg.role === "user" ? (
                  <p className="text-white">{msg.content}</p>
                ) : (
                  <div className="space-y-0.5">{renderContent(msg.content)}</div>
                )}
              </div>
              {msg.role === "assistant" && !msg.loading && (
                <div className="flex items-center gap-1 mt-1.5 px-1">
                  <button className="p-1 text-surface-300 hover:text-surface-500 transition-colors">
                    <Copy size={12} />
                  </button>
                  <button className="p-1 text-surface-300 hover:text-emerald-500 transition-colors">
                    <ThumbsUp size={12} />
                  </button>
                  <button className="p-1 text-surface-300 hover:text-red-500 transition-colors">
                    <ThumbsDown size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="relative bg-white rounded-2xl border border-surface-200 shadow-card p-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me to summarize a change order, write RFI language, analyze costs…"
          rows={2}
          disabled={loading}
          className="w-full px-3 py-2 text-sm text-surface-900 resize-none bg-transparent
                     placeholder:text-surface-400 focus:outline-none"
        />
        <div className="flex items-center justify-between px-2 pt-1">
          <p className="text-xs text-surface-400">Press Enter to send · Shift+Enter for new line</p>
          <Button size="sm" onClick={() => sendMessage()} disabled={!input.trim() || loading}
            leftIcon={<Send size={13} />}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
