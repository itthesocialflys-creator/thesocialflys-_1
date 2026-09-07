"use client";

import { useState } from "react";
import { Users, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Profile[];
  currentUserId: string;
  onCreated: (roomId: string) => void;
}

export function CreateGroupModal({
  open,
  onOpenChange,
  members,
  currentUserId,
  onCreated,
}: CreateGroupModalProps) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true);
    const supabase = createClient();

    const { data: room, error } = await supabase
      .from("chat_rooms")
      .insert({ name: name.trim(), type: "GROUP", created_by: currentUserId })
      .select()
      .single();

    if (error || !room) {
      setLoading(false);
      return;
    }

    const memberIds = Array.from(new Set([currentUserId, ...selected]));
    await supabase.from("chat_members").insert(
      memberIds.map((user_id) => ({ room_id: room.id, user_id }))
    );

    setLoading(false);
    onCreated(room.id);
    onOpenChange(false);
    setName("");
    setSelected([]);
  }

  function toggleMember(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Create Group
          </DialogTitle>
          <DialogDescription>Create a new group channel for your team</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Group Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="#sales" />
          </div>
          <div className="space-y-2">
            <Label>Add Members</Label>
            <div className="max-h-48 space-y-1 overflow-y-auto">
              {members
                .filter((m) => m.id !== currentUserId)
                .map((m) => (
                  <label key={m.id} className="flex items-center gap-2 rounded-md p-2 hover:bg-accent cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.includes(m.id)}
                      onChange={() => toggleMember(m.id)}
                    />
                    <span className="text-sm">{m.full_name}</span>
                  </label>
                ))}
            </div>
          </div>
          <Button onClick={handleCreate} disabled={loading || !name.trim()} className="w-full">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Create Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
