"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/website/BrandLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#testimonials", label: "Clients" },
  { href: "#pricing", label: "Packages" },
];

const WHATSAPP =
  "https://wa.me/916204574620?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services!";

export function WebsiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-[#f0f1f2]/90 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="shrink-0" aria-label="The Social Flys home">
          <BrandLogo showWordmark showTagline size="md" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-700 transition-colors hover:text-black"
            >
              {link.label}
              <ChevronDown className="h-3 w-3 opacity-40 transition-transform group-hover:opacity-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            size="sm"
            className="hidden h-9 rounded-md bg-[#FFE600] px-4 text-xs font-extrabold text-black border border-yellow-400 shadow-sm hover:bg-yellow-300 transition-all hover:scale-105 sm:inline-flex items-center gap-1.5"
            asChild
          >
            <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              <Sparkles className="h-3.5 w-3.5 fill-black" />
              Talk to Sales
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className={cn("border-t border-black/5 lg:hidden bg-white/90 backdrop-blur-lg", open ? "block" : "hidden")}>
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-yellow-50 hover:text-black"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-md bg-[#FFE600] border border-yellow-400 px-3 py-2.5 text-center text-xs font-extrabold text-black shadow-sm"
            onClick={() => setOpen(false)}
          >
            Talk to Sales
          </Link>
        </nav>
      </div>
    </header>
  );
}
