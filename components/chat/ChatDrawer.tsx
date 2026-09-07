"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send, AtSign } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ChatMessage, ChatRoom, Lead, Profile } from "@/lib/types/database";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeadCardPreview } from "@/components/chat/LeadCardPreview";
import { cn } from "@/lib/utils";

interface ChatDrawerProps {
  userId: string;
  profile: Profile;
  onLeadClick?: (lead: Lead) => void;
}

export function ChatDrawer({ userId, profile, onLeadClick }: ChatDrawerProps) {
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [content, setContent] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showLeadPicker, setShowLeadPicker] = useState(false);
  const [attachedLead, setAttachedLead] = useState<Lead | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("chat_members")
      .select("room_id, chat_rooms(*)")
      .eq("user_id", userId)
      .then(({ data }) => {
        const roomList = (data ?? []).map((d) => d.chat_rooms as unknown as ChatRoom).filter(Boolean);
        setRooms(roomList);
        if (roomList.length && !activeRoom) setActiveRoom(roomList[0].id);
      });
  }, [userId, activeRoom]);

  useEffect(() => {
    if (!activeRoom) return;
    const supabase = createClient();

    supabase
      .from("chat_messages")
      .select("*, profiles(full_name), leads(*)")
      .eq("room_id", activeRoom)
      .order("created_at")
      .then(({ data }) => setMessages(data ?? []));

    const channel = supabase
      .channel(`room-${activeRoom}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `room_id=eq.${activeRoom}` },
        async () => {
          const { data } = await supabase
            .from("chat_messages")
            .select("*, profiles(full_name), leads(*)")
            .eq("room_id", activeRoom)
            .order("created_at");
          setMessages(data ?? []);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeRoom]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!content.trim() || !activeRoom) return;
    const supabase = createClient();
    await supabase.from("chat_messages").insert({
      room_id: activeRoom,
      sender_id: userId,
      content: content.trim(),
      attached_lead_id: attachedLead?.id ?? null,
    });
    setContent("");
    setAttachedLead(null);
  }

  async function searchLeads(q: string) {
    if (!q.startsWith("@")) return;
    const term = q.slice(1);
    if (term.length < 1) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("leads")
      .select("*")
      .or(`first_name.ilike.%${term}%,company.ilike.%${term}%`)
      .limit(5);
    setLeads(data ?? []);
    setShowLeadPicker(true);
  }

  if (!open) {
    return (
      <Button
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Open chat"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex h-[480px] w-[360px] flex-col overflow-hidden rounded-xl border bg-background shadow-2xl">
      <div className="flex items-center justify-between border-b bg-indigo-600 px-4 py-3 text-white">
        <span className="font-semibold">Team Chat</span>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {rooms.length > 1 && (
        <div className="flex gap-1 overflow-x-auto border-b p-2">
          {rooms.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setActiveRoom(r.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1 text-xs",
                activeRoom === r.id ? "bg-indigo-100 text-indigo-700" : "bg-muted"
              )}
            >
              {r.name ?? "DM"}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("max-w-[85%] rounded-lg p-2 text-sm", m.sender_id === userId ? "ml-auto bg-indigo-500/20" : "bg-muted")}
          >
            <p className="text-xs font-medium text-muted-foreground mb-0.5">
              {(m.profiles as Profile | undefined)?.full_name ?? "System"}
            </p>
            <p>{m.content}</p>
            {m.leads && (
              <div className="mt-2">
                <LeadCardPreview lead={m.leads as Lead} onClick={() => onLeadClick?.(m.leads as Lead)} compact />
              </div>
            )}
            <p className="text-[10px] text-muted-foreground mt-1">{formatDate(m.created_at)}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {attachedLead && (
        <div className="border-t px-3 py-1">
          <LeadCardPreview lead={attachedLead} compact />
        </div>
      )}

      {showLeadPicker && leads.length > 0 && (
        <div className="border-t max-h-32 overflow-y-auto p-2 space-y-1">
          {leads.map((l) => (
            <button
              key={l.id}
              type="button"
              className="w-full text-left rounded p-1 text-xs hover:bg-accent"
              onClick={() => { setAttachedLead(l); setShowLeadPicker(false); setContent(""); }}
            >
              {l.first_name} {l.last_name} {l.company && `(${l.company})`}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 border-t p-3">
        <Button variant="ghost" size="icon" onClick={() => setShowLeadPicker(!showLeadPicker)} title="@lead picker">
          <AtSign className="h-4 w-4" />
        </Button>
        <Input
          placeholder="Type a message... (@ to tag lead)"
          value={content}
          onChange={(e) => { setContent(e.target.value); searchLeads(e.target.value); }}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button size="icon" onClick={sendMessage} disabled={!content.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
