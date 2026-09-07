"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Lead } from "@/lib/types/database";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function AdminTeamPage() {
  const [agents, setAgents] = useState<(Profile & { leadCount?: number; wonCount?: number })[]>([]);

  const fetchTeam = useCallback(async () => {
    const supabase = createClient();
    const { data: profiles } = await supabase.from("profiles").select("*").order("full_name");
    const { data: leads } = await supabase.from("leads").select("assigned_agent_id, status, estimated_value");

    const enriched = (profiles ?? []).map((p) => {
      const assigned = (leads ?? []).filter((l) => l.assigned_agent_id === p.id);
      return {
        ...p,
        leadCount: assigned.length,
        wonCount: assigned.filter((l) => l.status === "WON").length,
      };
    });
    setAgents(enriched);
  }, []);

  useEffect(() => { fetchTeam(); }, [fetchTeam]);

  async function toggleActive(agent: Profile) {
    const supabase = createClient();
    await supabase.from("profiles").update({ is_active: !agent.is_active }).eq("id", agent.id);
    fetchTeam();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Team Management</h1>
        <p className="text-muted-foreground">Manage agent availability and capacity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <div key={agent.id} className="rounded-xl border bg-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{agent.full_name}</h3>
                <p className="text-sm text-muted-foreground">{agent.email}</p>
              </div>
              <Badge variant={agent.role === "ADMIN" ? "default" : "secondary"}>{agent.role}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Assigned</p>
                <p className="text-lg font-bold">{agent.leadCount ?? 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Won</p>
                <p className="text-lg font-bold text-emerald-600">{agent.wonCount ?? 0}</p>
              </div>
            </div>
            {agent.role === "AGENT" && (
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <span className="text-sm">Active for allocation</span>
                <Switch checked={agent.is_active} onCheckedChange={() => toggleActive(agent)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
