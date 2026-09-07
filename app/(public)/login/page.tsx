"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, KeyRound, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { BrandLogo } from "@/components/website/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
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

    if (redirect) {
      router.push(redirect);
    } else {
      router.push(profile?.role === "ADMIN" ? "/admin/leads" : "/pipeline");
    }
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
      options: { emailRedirectTo: `${window.location.origin}/login` },
    });

    if (authError) setError(authError.message);
    else setMessage("Check your email for the magic link!");
    setLoading(false);
  }

  return (
      <Card className="w-full max-w-md border-neutral-200 bg-white">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <BrandLogo />
        </div>
        <CardTitle>Employee Portal</CardTitle>
        <CardDescription>Sign in to access the internal CRM</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <Button variant={mode === "password" ? "default" : "outline"} size="sm" className="flex-1" onClick={() => setMode("password")}>
            <KeyRound className="mr-1 h-4 w-4" /> Password
          </Button>
          <Button variant={mode === "magic" ? "default" : "outline"} size="sm" className="flex-1" onClick={() => setMode("magic")}>
            <Mail className="mr-1 h-4 w-4" /> Magic Link
          </Button>
        </div>

          <form onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="agent@thesocialflys.com" />
            </div>
            {mode === "password" && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            {message && <p className="text-sm text-emerald-600">{message}</p>}
            <Button type="submit" className="w-full bg-black hover:bg-neutral-800" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "password" ? "Sign In" : "Send Magic Link"}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-neutral-400">
            No account yet? Ask your admin to invite you via Supabase.<br />
            Use <strong>Magic Link</strong> if you don&apos;t have a password set.
          </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0f1f2] p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to website
      </Link>
      <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse rounded-lg bg-muted" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
