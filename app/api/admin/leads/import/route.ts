import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { roundRobinAllocate } from "@/lib/utils/roundRobin";
import type { CsvLeadRow } from "@/lib/types/database";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { leads, allocationMode, agentId } = body as {
      leads: CsvLeadRow[];
      allocationMode: "round_robin" | "manual";
      agentId?: string;
    };

    if (!leads?.length) {
      return NextResponse.json({ error: "No leads to import" }, { status: 400 });
    }

    const serviceClient = await createServiceClient();

    const { data: agents } = await serviceClient
      .from("profiles")
      .select("*")
      .eq("role", "AGENT")
      .eq("is_active", true);

    let rowsToInsert: (CsvLeadRow & { assigned_agent_id: string | null; source: string; created_by: string })[];

    if (allocationMode === "manual" && agentId) {
      rowsToInsert = leads.map((l) => ({
        ...l,
        assigned_agent_id: agentId,
        source: "CSV Upload",
        created_by: user.id,
      }));
    } else {
      const allocated = roundRobinAllocate(leads, agents ?? []);
      rowsToInsert = allocated.map((l) => ({
        ...l,
        source: "CSV Upload",
        created_by: user.id,
      }));
    }

    const { data: inserted, error } = await serviceClient
      .from("leads")
      .insert(
        rowsToInsert.map((r) => ({
          first_name: r.first_name,
          last_name: r.last_name ?? null,
          email: r.email ?? null,
          phone: r.phone ?? null,
          company: r.company ?? null,
          estimated_value: r.estimated_value ?? 0,
          assigned_agent_id: r.assigned_agent_id,
          source: r.source,
          created_by: r.created_by,
          status: "NEW",
        }))
      )
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await serviceClient.from("lead_activities").insert(
      (inserted ?? []).map((lead) => ({
        lead_id: lead.id,
        performed_by: user.id,
        activity_type: "ALLOCATION",
        content: `Imported via CSV (${allocationMode})`,
      }))
    );

    const { data: salesRoom } = await serviceClient
      .from("chat_rooms")
      .select("id")
      .eq("name", "#sales")
      .maybeSingle();

    let roomId = salesRoom?.id;

    if (!roomId) {
      const { data: newRoom } = await serviceClient
        .from("chat_rooms")
        .insert({ name: "#sales", type: "GROUP", created_by: user.id })
        .select()
        .single();
      roomId = newRoom?.id;

      if (roomId && agents) {
        const allMembers = [user.id, ...agents.map((a) => a.id)];
        await serviceClient.from("chat_members").insert(
          Array.from(new Set(allMembers)).map((uid) => ({ room_id: roomId!, user_id: uid }))
        );
      }
    }

    if (roomId) {
      await serviceClient.from("chat_messages").insert({
        room_id: roomId,
        sender_id: null,
        content: `Admin uploaded ${inserted?.length ?? 0} new leads via CSV allocation.`,
      });
    }

    return NextResponse.json({ success: true, count: inserted?.length ?? 0 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
