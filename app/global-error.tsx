"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/website/BrandLogo";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0f1f2] p-4 text-center font-sans">
          <div className="mb-6">
            <BrandLogo size="lg" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">Application Error</h1>
          <p className="mt-2 text-sm text-neutral-600">A critical error occurred. Please try reloading.</p>
          <div className="mt-6 flex items-center gap-3">
            <Button onClick={() => reset()} variant="outline">
              Reload
            </Button>
            <Button asChild className="bg-black text-white hover:bg-neutral-800">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
