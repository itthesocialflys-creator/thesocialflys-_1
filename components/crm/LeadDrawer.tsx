"use client";

import { useEffect, useState } from "react";
import { X, Phone, Mail, MessageCircle, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Lead, LeadActivity } from "@/lib/types/database";
import { formatCurrency, formatDate, getWhatsAppUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LEAD_STATUS_LABELS } from "@/lib/types/database";

interface LeadDrawerProps {
  lead: Lead | null;
  onClose: () => void;
  userId?: string;
  onLeadWon?: (lead: Lead) => void;
}

export function LeadDrawer({ lead, onClose, userId, onLeadWon }: LeadDrawerProps) {
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lead) return;
    const supabase = createClient();
    supabase
      .from("lead_activities")
      .select("*, profiles(full_name)")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setActivities(data ?? []));
  }, [lead]);

  if (!lead) return null;

  async function addNote() {
    if (!note.trim() || !lead) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from("lead_activities").insert({
      lead_id: lead.id,
      performed_by: userId,
      activity_type: "NOTE",
      content: note.trim(),
    });
    setNote("");
    const { data } = await supabase
      .from("lead_activities")
      .select("*, profiles(full_name)")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false });
    setActivities(data ?? []);
    setLoading(false);
  }

  async function logCall() {
    if (!lead) return;
    const supabase = createClient();
    await supabase.from("lead_activities").insert({
      lead_id: lead.id,
      performed_by: userId,
      activity_type: "CALL",
      content: "Outbound call initiated",
    });
    if (lead.phone) window.open(`tel:${lead.phone}`);
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l bg-background shadow-xl">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <h2 className="font-semibold">
              {lead.first_name} {lead.last_name}
            </h2>
            {lead.company && <p className="text-sm text-muted-foreground">{lead.company}</p>}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge>{LEAD_STATUS_LABELS[lead.status]}</Badge>
            <Badge variant="secondary">{formatCurrency(Number(lead.estimated_value))}</Badge>
            <Badge variant="outline">{lead.source}</Badge>
          </div>

          <div className="flex gap-2">
            {lead.phone && (
              <>
                <Button variant="outline" size="sm" onClick={logCall}>
                  <Phone className="h-4 w-4" /> Call
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={getWhatsAppUrl(lead.phone, `Hi ${lead.first_name},`) } target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                </Button>
              </>
            )}
            {lead.email && (
              <Button variant="outline" size="sm" asChild>
                <a href={`mailto:${lead.email}`}>
                  <Mail className="h-4 w-4" /> Email
                </a>
              </Button>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Activity Feed</h3>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Add a note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNote()}
              />
              <Button size="icon" onClick={addNote} disabled={loading}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              {activities.map((a) => (
                <div key={a.id} className="rounded-lg border p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-xs uppercase text-muted-foreground">
                      {a.activity_type}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatDate(a.created_at)}</span>
                  </div>
                  <p className="mt-1">{a.content}</p>
                </div>
              ))}
              {activities.length === 0 && (
                <p className="text-sm text-muted-foreground">No activity yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
