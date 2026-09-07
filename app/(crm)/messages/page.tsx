"use client";

import { useEffect, useState, useRef } from "react";
import { Send, Plus, AtSign } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ChatMessage, ChatRoom, Lead, Profile } from "@/lib/types/database";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeadCardPreview } from "@/components/chat/LeadCardPreview";
import { CreateGroupModal } from "@/components/chat/CreateGroupModal";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState("");
  const [members, setMembers] = useState<Profile[]>([]);
  const [groupOpen, setGroupOpen] = useState(false);
  const [attachedLead, setAttachedLead] = useState<Lead | null>(null);
  const [leadResults, setLeadResults] = useState<Lead[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
    supabase.from("profiles").select("*").then(({ data }) => setMembers(data ?? []));
    supabase
      .from("chat_members")
      .select("room_id, chat_rooms(*)")
      .then(({ data }) => {
        const roomList = (data ?? []).map((d) => d.chat_rooms as unknown as ChatRoom).filter(Boolean);
        setRooms(roomList);
        if (roomList.length) setActiveRoom(roomList[0].id);
      });
  }, []);

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
      .channel(`messages-${activeRoom}`)
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
    setLeadResults([]);
  }

  async function handleInputChange(val: string) {
    setContent(val);
    if (val.includes("@")) {
      const term = val.split("@").pop()?.trim() ?? "";
      if (term.length >= 1) {
        const supabase = createClient();
        const { data } = await supabase
          .from("leads")
          .select("*")
          .or(`first_name.ilike.%${term}%,company.ilike.%${term}%`)
          .limit(5);
        setLeadResults(data ?? []);
      }
    } else {
      setLeadResults([]);
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border bg-card">
      <div className="w-64 shrink-0 border-r">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold">Channels</h2>
          <Button variant="ghost" size="icon" onClick={() => setGroupOpen(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-2 space-y-1">
          {rooms.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setActiveRoom(r.id)}
              className={cn(
                "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                activeRoom === r.id ? "bg-indigo-500/10 text-indigo-600 font-medium" : "hover:bg-accent"
              )}
            >
              {r.name ?? "Direct Message"}
            </button>
          ))}
          {rooms.length === 0 && (
            <p className="p-3 text-xs text-muted-foreground">No channels yet. Create a group to start.</p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "max-w-lg rounded-lg p-3",
                m.sender_id === userId ? "ml-auto bg-indigo-500/10" : "bg-muted"
              )}
            >
              <p className="text-xs font-medium text-muted-foreground">
                {(m.profiles as Profile | undefined)?.full_name ?? "System"} · {formatDate(m.created_at)}
              </p>
              <p className="mt-1">{m.content}</p>
              {m.leads && (
                <div className="mt-2">
                  <LeadCardPreview lead={m.leads as Lead} />
                </div>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {leadResults.length > 0 && (
          <div className="border-t p-2 space-y-1 max-h-32 overflow-y-auto">
            {leadResults.map((l) => (
              <button
                key={l.id}
                type="button"
                className="w-full rounded p-2 text-left text-sm hover:bg-accent"
                onClick={() => { setAttachedLead(l); setLeadResults([]); setContent(""); }}
              >
                {l.first_name} {l.last_name} {l.company && `· ${l.company}`}
              </button>
            ))}
          </div>
        )}

        {attachedLead && (
          <div className="border-t px-4 py-2">
            <LeadCardPreview lead={attachedLead} compact />
          </div>
        )}

        <div className="flex gap-2 border-t p-4">
          <Button variant="ghost" size="icon" title="@lead picker">
            <AtSign className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Message... Type @ to attach a lead"
            value={content}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={!content.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CreateGroupModal
        open={groupOpen}
        onOpenChange={setGroupOpen}
        members={members}
        currentUserId={userId}
        onCreated={(roomId) => {
          setRooms((prev) => [...prev, { id: roomId, name: "New Group", type: "GROUP", created_by: userId, created_at: new Date().toISOString() }]);
          setActiveRoom(roomId);
        }}
      />
    </div>
  );
}
