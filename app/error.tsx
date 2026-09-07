"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/website/BrandLogo";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0f1f2] p-4 text-center">
      <div className="mb-6">
        <BrandLogo size="lg" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">Something went wrong</h1>
      <p className="mt-2 text-sm text-neutral-600">An unexpected error occurred. Please try again.</p>
      <div className="mt-6 flex items-center gap-3">
        <Button onClick={() => reset()} variant="outline">
          Try again
        </Button>
        <Button asChild className="bg-black text-white hover:bg-neutral-800">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );
}
