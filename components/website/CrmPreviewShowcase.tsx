"use client";

import { useState } from "react";
import { BarChart3, Kanban, MessageSquare, Users } from "lucide-react";
import { ScrollTilt } from "@/components/website/ScrollTilt";
import { cn } from "@/lib/utils";

const TABS = [
  {
    id: "pipeline",
    label: "Pipeline",
    icon: Kanban,
    preview: (
      <div className="grid grid-cols-3 gap-2 p-4">
        {["New", "Qualified", "Won"].map((col) => (
          <div key={col} className="rounded-lg bg-muted/50 p-2">
            <div className="mb-2 text-xs font-medium text-muted-foreground">{col}</div>
            {[1, 2].map((i) => (
              <div key={i} className="mb-2 rounded-md border bg-card p-2 text-xs shadow-sm">
                <div className="font-medium">Lead {i}</div>
                <div className="text-muted-foreground">₹{(i * 50).toFixed(0)}K</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    preview: (
      <div className="flex h-full items-end justify-around gap-2 p-6">
        {[40, 65, 45, 80, 55, 90].map((h, i) => (
          <div
            key={i}
            className="w-8 rounded-t bg-gradient-to-t from-indigo-600 to-emerald-500"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    ),
  },
  {
    id: "chat",
    label: "Team Chat",
    icon: MessageSquare,
    preview: (
      <div className="space-y-3 p-4">
        {[
          { user: "Agent", msg: "New lead assigned from web form" },
          { user: "Admin", msg: "CSV batch of 50 leads imported" },
          { user: "You", msg: "Closed deal with TechNova! 🎉" },
        ].map((m, i) => (
          <div key={i} className={cn("rounded-lg p-2 text-xs", i === 2 ? "ml-8 bg-indigo-500/20" : "mr-8 bg-muted")}>
            <span className="font-medium">{m.user}: </span>
            {m.msg}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "team",
    label: "Team",
    icon: Users,
    preview: (
      <div className="grid grid-cols-2 gap-3 p-4">
        {["Rishabh", "Priya", "Rohit", "Ananya"].map((name) => (
          <div key={name} className="flex items-center gap-2 rounded-lg border p-2">
            <div className="relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold">
                {name[0]}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
            </div>
            <span className="text-xs font-medium">{name}</span>
          </div>
        ))}
      </div>
    ),
  },
];

export function CrmPreviewShowcase() {
  const [active, setActive] = useState("pipeline");
  const current = TABS.find((t) => t.id === active)!;

  return (
    <section id="process" className="bg-[#f0f1f2] py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
              Built-In CRM
            </p>
            <ScrollTilt initialRotate={-6}>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tighter text-black md:text-4xl">
                Mission control for your sales team
              </h2>
            </ScrollTilt>
            <ScrollTilt initialRotate={-4} delay={0.15}>
              <p className="mt-4 text-lg text-neutral-600">
                Every lead from your website flows directly into our CRM. Agents get
                real-time pipeline views, team chat, and analytics — all in one place.
              </p>
            </ScrollTilt>
            <div className="mt-8 flex flex-wrap gap-2">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActive(tab.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                      active === tab.id
                        ? "border-black bg-black text-white"
                        : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <ScrollTilt initialRotate={6} delay={0.2}>
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl">
              <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="ml-2 text-xs text-neutral-400">Social Flys CRM</span>
              </div>
              <div className="aspect-[4/3] min-h-[280px]">{current.preview}</div>
            </div>
          </ScrollTilt>
        </div>
      </div>
    </section>
  );
}
