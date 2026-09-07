export type AppRole = "ADMIN" | "AGENT";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "PROPOSAL"
  | "WON"
  | "LOST";

export type RoomType = "DIRECT" | "GROUP";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: AppRole;
  is_active: boolean;
  created_at: string;
}

export interface Lead {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: LeadStatus;
  estimated_value: number;
  assigned_agent_id: string | null;
  source: string;
  created_by: string | null;
  created_at: string;
  profiles?: Profile | null;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  performed_by: string | null;
  activity_type: string;
  content: string;
  created_at: string;
  profiles?: Profile | null;
}

export interface ChatRoom {
  id: string;
  name: string | null;
  type: RoomType;
  created_by: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string | null;
  content: string;
  attached_lead_id: string | null;
  created_at: string;
  profiles?: Profile | null;
  leads?: Lead | null;
}

export interface CsvLeadRow {
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
  company?: string;
  estimated_value?: number;
}

export const LEAD_STATUSES: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL",
  "WON",
  "LOST",
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  PROPOSAL: "Proposal",
  WON: "Won",
  LOST: "Lost",
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: "bg-slate-500",
  CONTACTED: "bg-blue-500",
  QUALIFIED: "bg-indigo-500",
  PROPOSAL: "bg-violet-500",
  WON: "bg-emerald-500",
  LOST: "bg-red-500",
};
