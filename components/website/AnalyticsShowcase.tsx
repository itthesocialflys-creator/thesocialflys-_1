"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList,
  Cell,
} from "recharts";
import { ScrollTilt } from "@/components/website/ScrollTilt";

const FUNNEL_DATA = [
  { name: "New", value: 1000, fill: "#111111" },
  { name: "Contacted", value: 750, fill: "#333333" },
  { name: "Qualified", value: 450, fill: "#555555" },
  { name: "Proposal", value: 200, fill: "#777777" },
  { name: "Won", value: 85, fill: "#a3a3a3" },
];

const SOURCE_DATA = [
  { source: "Web Form", leads: 420 },
  { source: "CSV Import", leads: 280 },
  { source: "Outbound", leads: 150 },
  { source: "Referral", leads: 95 },
];

const KPIS = [
  { label: "Pipeline Value", value: "₹2.4Cr", change: "+12%" },
  { label: "Win Rate", value: "8.5%", change: "+2.1%" },
  { label: "Avg. Deal Size", value: "₹3.2L", change: "+8%" },
  { label: "Velocity", value: "18 days", change: "-3 days" },
];

export function AnalyticsShowcase() {
  return (
    <section className="bg-white py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
            Analytics
          </p>
          <ScrollTilt initialRotate={-5}>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tighter text-black md:text-4xl">
              Data that drives decisions
            </h2>
          </ScrollTilt>
          <ScrollTilt initialRotate={-3} delay={0.1}>
            <p className="mt-4 max-w-2xl text-lg text-neutral-600">
              Real-time KPIs, conversion funnels, and source attribution — because
              every rupee tracked is a rupee optimised.
            </p>
          </ScrollTilt>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((kpi, idx) => (
            <ScrollTilt key={kpi.label} initialRotate={idx % 2 === 0 ? -5 : 5} delay={idx * 0.08}>
              <div className="rounded-xl border border-neutral-200 bg-[#f9fafa] p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                <p className="text-sm font-medium text-neutral-500">{kpi.label}</p>
                <p className="mt-1 text-3xl font-black tracking-tighter text-black">{kpi.value}</p>
                <p className="mt-1 text-xs font-semibold text-emerald-600">{kpi.change}</p>
              </div>
            </ScrollTilt>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <ScrollTilt initialRotate={-4} delay={0.2}>
            <div className="rounded-xl border border-neutral-200 bg-[#f9fafa] p-6 shadow-sm">
              <h3 className="mb-4 font-bold tracking-tight text-black">Conversion Funnel</h3>
              <ResponsiveContainer width="100%" height={280}>
                <FunnelChart>
                  <Tooltip />
                  <Funnel dataKey="value" data={FUNNEL_DATA} isAnimationActive>
                    <LabelList position="right" fill="#888" stroke="none" dataKey="name" />
                    {FUNNEL_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>
          </ScrollTilt>

          <ScrollTilt initialRotate={4} delay={0.25}>
            <div className="rounded-xl border border-neutral-200 bg-[#f9fafa] p-6 shadow-sm">
              <h3 className="mb-4 font-bold tracking-tight text-black">Lead Source Attribution</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={SOURCE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="source" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#000000" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ScrollTilt>
        </div>
      </div>
    </section>
  );
}
