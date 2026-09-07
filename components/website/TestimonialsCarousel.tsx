"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TESTIMONIALS = [
  {
    quote:
      "The Social Flys took us from ₹10L to ₹50L monthly revenue in 6 months. Their data-driven approach is unmatched.",
    name: "Rohit Sharma",
    role: "CEO, FreshBrew Co.",
    initial: "R",
  },
  {
    quote:
      "340% ROAS on our Meta campaigns. They don't just run ads — they build systems that scale.",
    name: "Priya Mehta",
    role: "Marketing Head, TechNova India",
    initial: "P",
  },
  {
    quote:
      "Our brand identity finally matches our ambition. The team understands both creative and commercial goals.",
    name: "Ananya Verma",
    role: "Founder, Velvet Fashion",
    initial: "A",
  },
  {
    quote:
      "2M+ impressions and 18% engagement rate. Influencer partnerships that actually convert.",
    name: "Vikram Patel",
    role: "CMO, Orbit Labs",
    initial: "V",
  },
];

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const t = TESTIMONIALS[current];

  const prev = () => setCurrent((c) => (c === 0 ? TESTIMONIALS.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === TESTIMONIALS.length - 1 ? 0 : c + 1));

  return (
    <section id="testimonials" className="bg-[#f0f1f2] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
            Client Love
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tighter text-black md:text-4xl">
            Brands that already took off
          </h2>
        </div>

        <div className="relative mx-auto mt-12 max-w-3xl">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 md:p-12">
            <Quote className="h-8 w-8 text-neutral-200" />
            <blockquote className="mt-4 text-lg leading-relaxed tracking-tight text-black md:text-xl">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-lg font-bold text-white">
                {t.initial}
              </div>
              <div>
                <div className="font-semibold text-black">{t.name}</div>
                <div className="text-sm text-neutral-500">{t.role}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" className="border-neutral-300" onClick={prev} aria-label="Previous testimonial">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === current ? "w-6 bg-black" : "w-2 bg-neutral-300"
                  )}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" className="border-neutral-300" onClick={next} aria-label="Next testimonial">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
