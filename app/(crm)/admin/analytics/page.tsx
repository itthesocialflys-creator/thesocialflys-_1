"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
} from "recharts";
import { createClient } from "@/lib/supabase/client";
import type { Lead } from "@/lib/types/database";
import { LEAD_STATUSES } from "@/lib/types/database";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#64748b", "#3b82f6", "#6366f1", "#8b5cf6", "#10b981", "#ef4444"];

export default function AdminAnalyticsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("leads").select("*").then(({ data }) => setLeads(data ?? []));
  }, []);

  const totalLeads = leads.length;
  const pipelineValue = leads.reduce((s, l) => s + Number(l.estimated_value), 0);
  const wonLeads = leads.filter((l) => l.status === "WON");
  const wonRevenue = wonLeads.reduce((s, l) => s + Number(l.estimated_value), 0);
  const winRate = totalLeads ? ((wonLeads.length / totalLeads) * 100).toFixed(1) : "0";

  const funnelData = LEAD_STATUSES.map((status, i) => ({
    name: status,
    value: leads.filter((l) => l.status === status).length,
    fill: COLORS[i],
  }));

  const sourceMap: Record<string, number> = {};
  leads.forEach((l) => {
    sourceMap[l.source] = (sourceMap[l.source] ?? 0) + Number(l.estimated_value);
  });
  const sourceData = Object.entries(sourceMap).map(([source, value]) => ({ source, value }));

  const agentMap: Record<string, { assigned: number; won: number }> = {};
  leads.forEach((l) => {
    const id = l.assigned_agent_id ?? "unassigned";
    if (!agentMap[id]) agentMap[id] = { assigned: 0, won: 0 };
    agentMap[id].assigned++;
    if (l.status === "WON") agentMap[id].won++;
  });
  const agentData = Object.entries(agentMap).map(([id, d]) => ({
    agent: id.slice(0, 8),
    assigned: d.assigned,
    won: d.won,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Executive KPIs and conversion insights</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Leads", value: totalLeads.toString() },
          { label: "Pipeline Value", value: formatCurrency(pipelineValue) },
          { label: "Won Revenue", value: formatCurrency(wonRevenue) },
          { label: "Win Rate", value: `${winRate}%` },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <p className="mt-1 text-2xl font-bold">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 font-semibold">Conversion Funnel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <FunnelChart>
              <Tooltip />
              <Funnel dataKey="value" data={funnelData} isAnimationActive>
                <LabelList position="right" fill="#888" stroke="none" dataKey="name" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 font-semibold">Revenue by Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={sourceData} dataKey="value" nameKey="source" cx="50%" cy="50%" outerRadius={100} label>
                {sourceData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border bg-card p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold">Agent Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="agent" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="assigned" fill="#6366f1" name="Assigned" />
              <Bar dataKey="won" fill="#10b981" name="Won" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
