"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { BrandLogo } from "@/components/website/BrandLogo";

interface FooterProps {
  onPortalLogin?: () => void;
}

export function Footer({ onPortalLogin }: FooterProps) {
  return (
    <footer className="border-t bg-muted/30 py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <BrandLogo size="sm" />
        <p className="text-xs text-muted-foreground">
          © 2019 thesocialflys.com — All rights reserved.
        </p>
        {onPortalLogin ? (
          <button
            type="button"
            onClick={onPortalLogin}
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Lock className="h-3 w-3" />
            Employee Portal
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Lock className="h-3 w-3" />
            Employee Portal
          </Link>
        )}
      </div>
    </footer>
  );
}
