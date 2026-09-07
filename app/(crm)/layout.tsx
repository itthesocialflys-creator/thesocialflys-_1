import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import type { Profile } from "@/lib/types/database";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={profile.role} userName={profile.full_name} />
      <main className="flex-1 overflow-y-auto bg-muted/20 p-6">
        {children}
      </main>
      <ChatDrawer userId={user.id} profile={profile as Profile} />
    </div>
  );
}
