"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Kanban,
  LogOut,
  MessageSquare,
  Upload,
  Users,
} from "lucide-react";
import { BrandLogo } from "@/components/website/BrandLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { AppRole } from "@/lib/types/database";

const ADMIN_LINKS = [
  { href: "/admin/leads", label: "Leads", icon: Kanban },
  { href: "/admin/importer", label: "Importer", icon: Upload },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/messages", label: "Messages", icon: MessageSquare },
];

const AGENT_LINKS = [
  { href: "/pipeline", label: "Pipeline", icon: Kanban },
  { href: "/messages", label: "Messages", icon: MessageSquare },
];

interface SidebarProps {
  role: AppRole;
  userName?: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const links = role === "ADMIN" ? ADMIN_LINKS : AGENT_LINKS;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="border-b p-4">
        <Link href={role === "ADMIN" ? "/admin/leads" : "/pipeline"}>
          <BrandLogo size="sm" />
        </Link>
        {userName && (
          <p className="mt-2 truncate text-xs text-muted-foreground">{userName}</p>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
