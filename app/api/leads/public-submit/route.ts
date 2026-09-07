import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { roundRobinAllocate } from "@/lib/utils/roundRobin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { first_name, last_name, email, phone, company } = body;

    if (!first_name?.trim()) {
      return NextResponse.json({ error: "First name is required" }, { status: 400 });
    }

    const supabase = await createServiceClient();

    const { data: agents } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "AGENT")
      .eq("is_active", true);

    const activeAgents = agents ?? [];
    let assignedAgentId: string | null = null;

    if (activeAgents.length > 0) {
      const allocated = roundRobinAllocate([{ first_name: first_name.trim() }], activeAgents);
      assignedAgentId = allocated[0].assigned_agent_id;
    }

    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        first_name: first_name.trim(),
        last_name: last_name?.trim() || null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        company: company?.trim() || null,
        source: "Web Form",
        assigned_agent_id: assignedAgentId,
        status: "NEW",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (assignedAgentId) {
      await supabase.from("lead_activities").insert({
        lead_id: lead.id,
        performed_by: null,
        activity_type: "ALLOCATION",
        content: "Auto-assigned from web form submission",
      });
    }

    return NextResponse.json({ success: true, lead });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
