"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lead, LeadStatus } from "@/lib/types/database";
import { KanbanBoard } from "@/components/crm/KanbanBoard";
import { LeadDrawer } from "@/components/crm/LeadDrawer";

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [userId, setUserId] = useState<string>("");

  const fetchLeads = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setUserId(user.id);

    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    setLeads(data ?? []);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("pipeline-leads")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, () => fetchLeads())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchLeads]);

  async function handleStatusChange(leadId: string, newStatus: LeadStatus) {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    const supabase = createClient();
    const lead = leads.find((l) => l.id === leadId);

    await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);
    await supabase.from("lead_activities").insert({
      lead_id: leadId,
      performed_by: userId,
      activity_type: "STATUS_CHANGE",
      content: `Status changed to ${newStatus}`,
    });

    if (newStatus === "WON" && lead) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .single();

      const { data: salesRoom } = await supabase
        .from("chat_rooms")
        .select("id")
        .eq("name", "#sales")
        .maybeSingle();

      if (salesRoom) {
        await supabase.from("chat_messages").insert({
          room_id: salesRoom.id,
          sender_id: null,
          content: `🎉 ${profile?.full_name ?? "Agent"} just closed deal with ${lead.company ?? lead.first_name} for ${Number(lead.estimated_value).toLocaleString("en-IN", { style: "currency", currency: "INR" })}!`,
        });
      }
    }
  }

  const wonCount = leads.filter((l) => l.status === "WON").length;
  const target = 10;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pipeline</h1>
          <p className="text-muted-foreground">Drag leads across stages to update status</p>
        </div>
        <div className="rounded-xl border bg-card px-4 py-2 text-center">
          <p className="text-xs text-muted-foreground">Monthly Closures</p>
          <p className="text-lg font-bold">
            {wonCount} / {target}
          </p>
          <div className="mt-1 h-2 w-32 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${Math.min((wonCount / target) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <KanbanBoard
        leads={leads}
        onStatusChange={handleStatusChange}
        onLeadClick={setSelectedLead}
      />

      {selectedLead && (
        <LeadDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          userId={userId}
        />
      )}
    </div>
  );
}
