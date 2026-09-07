"use client";

import Link from "next/link";
import { ArrowUp, Lock, Twitter, Instagram, Linkedin, Facebook } from "lucide-react";
import { BrandLogo } from "@/components/website/BrandLogo";
import { Button } from "@/components/ui/button";

const WHATSAPP =
  "https://wa.me/916204574620?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services!";

interface WebsiteFooterProps {
  onPortalLogin?: () => void;
}

export function WebsiteFooter({ onPortalLogin }: WebsiteFooterProps) {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <BrandLogo showWordmark showTagline size="md" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-600">
              Growth-focused digital marketing agency helping businesses build a powerful digital presence, connect with the right audience, and turn attention into measurable growth.
            </p>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-[#FFE600] hover:text-black hover:border-yellow-400 transition-all"
                onClick={onPortalLogin}
                asChild={!onPortalLogin}
              >
                {onPortalLogin ? (
                  <>
                    <Lock className="h-3 w-3" />
                    Employee Portal
                  </>
                ) : (
                  <Link href="/login">
                    <Lock className="h-3 w-3" />
                    Employee Portal
                  </Link>
                )}
              </Button>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.2em] text-neutral-400">
              Core Services
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              {[
                "Social Media Marketing",
                "SEO & Search Strategy",
                "Performance & Paid Ads",
                "Branding & Creative Design",
                "Website Development",
                "Software Development",
              ].map((s) => (
                <li key={s}>
                  <Link href="#services" className="transition-colors hover:text-black hover:underline underline-offset-4">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.2em] text-neutral-400">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><Link href="#about" className="hover:text-black transition-colors">About Us</Link></li>
              <li><Link href="#services" className="hover:text-black transition-colors">Services</Link></li>
              <li><Link href="#work" className="hover:text-black transition-colors">Our Work</Link></li>
              <li><Link href="#testimonials" className="hover:text-black transition-colors">Clients</Link></li>
              <li><Link href="#pricing" className="hover:text-black transition-colors">Packages</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.2em] text-neutral-400">
              Contact & Social
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors font-medium">
                  WhatsApp Us
                </a>
              </li>
              <li>
                <a href="mailto:rishabh@thesocialflys.com" className="hover:text-black transition-colors">
                  rishabh@thesocialflys.com
                </a>
              </li>
            </ul>
            <h4 className="mb-3 mt-6 text-[11px] font-extrabold uppercase tracking-[0.2em] text-neutral-400">
              Follow Us
            </h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>
                <a
                  href="https://x.com/thesocialflys?s=11"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-black transition-colors font-semibold"
                >
                  <Twitter className="h-3.5 w-3.5 fill-black" />
                  Twitter (X)
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/the-social-flys/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-black transition-colors"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/thesocialflys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-black transition-colors"
                >
                  <Instagram className="h-3.5 w-3.5" />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/1Ft7toHm73/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-black transition-colors"
                >
                  <Facebook className="h-3.5 w-3.5" />
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-100 pt-8 sm:flex-row">
          <p className="text-xs font-medium text-neutral-500">
            © 2019 The Social Flys. All rights reserved. <span className="text-[#D97706] font-bold">Grow Beyond Limits.</span>
          </p>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
            <button
              type="button"
              onClick={scrollTop}
              className="flex items-center gap-1 hover:text-black transition-colors font-semibold"
              aria-label="Back to top"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
