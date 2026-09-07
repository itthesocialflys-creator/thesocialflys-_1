"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
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

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function redirectByRole(userId: string) {
    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    onOpenChange(false);
    router.push(profile?.role === "ADMIN" ? "/admin/leads" : "/pipeline");
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) await redirectByRole(data.user.id);
    setLoading(false);
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (authError) {
      setError(authError.message);
    } else {
      setMessage("Check your email for the magic link!");
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Employee Portal</DialogTitle>
          <DialogDescription>
            Sign in to access the internal CRM workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 border-b pb-4">
          <Button
            variant={mode === "password" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode("password")}
          >
            <KeyRound className="mr-1 h-4 w-4" />
            Password
          </Button>
          <Button
            variant={mode === "magic" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMode("magic")}
          >
            <Mail className="mr-1 h-4 w-4" />
            Magic Link
          </Button>
        </div>

        <form onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {mode === "password" && (
            <div className="space-y-2">
              <Label htmlFor="auth-password">Password</Label>
              <Input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {message && <p className="text-sm text-emerald-600">{message}</p>}
          <Button type="submit" className="w-full bg-black hover:bg-neutral-800" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "password" ? "Sign In" : "Send Magic Link"}
          </Button>
        </form>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-neutral-400 font-medium">Or Quick Demo Login</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-neutral-300 font-medium hover:bg-neutral-100"
            onClick={() => {
              onOpenChange(false);
              router.push("/admin/leads");
            }}
          >
            👑 Admin Portal
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-neutral-300 font-medium hover:bg-neutral-100"
            onClick={() => {
              onOpenChange(false);
              router.push("/pipeline");
            }}
          >
            💼 Agent Pipeline
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground pt-2">
          Or go to{" "}
          <Link href="/login" className="text-black font-semibold hover:underline" onClick={() => onOpenChange(false)}>
            full login page
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  );
}
