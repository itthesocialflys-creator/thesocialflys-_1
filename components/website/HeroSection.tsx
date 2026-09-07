"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollTilt } from "@/components/website/ScrollTilt";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#f0f1f2] pb-16 pt-12 md:pb-24 md:pt-16">
      {/* Subtle Blazing Yellow Background Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-[600px] -translate-x-1/2 rounded-full bg-[#FFE600]/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:mb-10 md:justify-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/50 bg-[#FFE600] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-black shadow-sm">
            <Sparkles className="h-3.5 w-3.5 fill-black" />
            Grow Beyond Limits
          </div>
          <span className="text-xs font-semibold text-neutral-500">
            Digital Growth Agency • Bengaluru
          </span>
        </div>

        <div className="relative max-w-4xl">
          <ScrollTilt initialRotate={-4} duration={0.8}>
            <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tighter text-black sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              We Don’t Just Market Brands.{" "}
              <span className="relative inline-block rounded-md bg-[#FFE600] px-2.5 py-0.5 text-black shadow-sm border border-yellow-300">
                We Make Them Fly.
              </span>
            </h1>
          </ScrollTilt>

          <ScrollTilt initialRotate={-2} delay={0.15}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600 md:text-xl">
              <strong>The Social Flys</strong> is a growth-focused digital marketing agency helping businesses build a powerful digital presence, connect with the right audience, and turn attention into measurable growth.
            </p>
          </ScrollTilt>

          <ScrollTilt initialRotate={-1} delay={0.25}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="h-12 rounded-md bg-[#FFE600] px-6 text-sm font-extrabold text-black border border-yellow-400 hover:bg-yellow-300 shadow-md transition-all hover:scale-105"
                asChild
              >
                <Link href="#contact">
                  Launch Your Growth <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-md border-neutral-300 bg-white/80 px-6 text-sm font-semibold text-black hover:bg-white"
                asChild
              >
                <Link href="#services">Explore Our Services</Link>
              </Button>
            </div>
          </ScrollTilt>
        </div>
      </div>

      <div className="relative mt-16 overflow-hidden border-y border-black/5 bg-white/40 py-3.5">
        <div className="flex animate-marquee whitespace-nowrap">
          {[
            "SOCIAL MEDIA MARKETING",
            "SEARCH ENGINE OPTIMIZATION (SEO)",
            "PERFORMANCE & PAID ADS",
            "BRANDING & CREATIVE DESIGN",
            "WEBSITE DEVELOPMENT",
            "CONTENT STRATEGY & MARKETING",
            "LEAD GENERATION",
            "DIGITAL GROWTH CONSULTING",
            "SOFTWARE DEVELOPMENT",
            "GROW BEYOND LIMITS",
          ]
            .concat([
              "SOCIAL MEDIA MARKETING",
              "SEARCH ENGINE OPTIMIZATION (SEO)",
              "PERFORMANCE & PAID ADS",
              "BRANDING & CREATIVE DESIGN",
              "WEBSITE DEVELOPMENT",
              "CONTENT STRATEGY & MARKETING",
              "LEAD GENERATION",
              "DIGITAL GROWTH CONSULTING",
              "SOFTWARE DEVELOPMENT",
              "GROW BEYOND LIMITS",
            ])
            .map((item, i) => (
              <span
                key={i}
                className="mx-8 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500 flex items-center gap-2"
              >
                {item === "GROW BEYOND LIMITS" ? (
                  <span className="rounded bg-[#FFE600] px-2 py-0.5 text-black font-extrabold shadow-sm">
                    {item}
                  </span>
                ) : (
                  item
                )}
              </span>
            ))}
        </div>
      </div>
    </section>
  );
}
