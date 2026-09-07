import type { Profile, CsvLeadRow } from "@/lib/types/database";

export function roundRobinAllocate(
  rows: CsvLeadRow[],
  agents: Profile[]
): (CsvLeadRow & { assigned_agent_id: string })[] {
  const activeAgents = agents.filter((a) => a.is_active && a.role === "AGENT");
  if (activeAgents.length === 0) {
    throw new Error("No active agents available for allocation");
  }

  let index = 0;
  return rows.map((row) => {
    const agent = activeAgents[index % activeAgents.length];
    index++;
    return { ...row, assigned_agent_id: agent.id };
  });
}

export function getNextAgent(
  agents: Profile[],
  lastAssignedIndex: number
): { agent: Profile; nextIndex: number } {
  const activeAgents = agents.filter((a) => a.is_active && a.role === "AGENT");
  if (activeAgents.length === 0) {
    throw new Error("No active agents available");
  }
  const nextIndex = (lastAssignedIndex + 1) % activeAgents.length;
  return { agent: activeAgents[nextIndex], nextIndex };
}
