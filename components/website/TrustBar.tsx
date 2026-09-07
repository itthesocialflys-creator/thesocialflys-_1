"use client";

import { useEffect, useRef, useState } from "react";

const CLIENTS = [
  "FreshBrew Co.",
  "TechNova India",
  "Velvet Fashion",
  "Orbit Labs",
  "NovaPay",
  "Skyline Media",
  "Pulse Health",
  "Zenith Retail",
];

export function TrustBar() {
  return (
    <section className="border-b border-black/5 bg-white py-14" aria-label="Trusted by leading brands">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="mb-10 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
          Trusted by brands across India
        </p>
        <div className="relative overflow-hidden">
          <div className="flex animate-marquee gap-16">
            {[...CLIENTS, ...CLIENTS].map((client, i) => (
              <span
                key={i}
                className="shrink-0 text-base font-semibold tracking-tight text-neutral-300 grayscale transition-colors hover:text-neutral-500"
              >
                {client}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface StatProps {
  value: number;
  suffix: string;
  label: string;
}

function AnimatedStat({ value, suffix, label }: StatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 2000;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl font-bold tracking-tighter text-black md:text-4xl">
        {count}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-neutral-500">{label}</div>
    </div>
  );
}

export function StatsStrip() {
  return (
    <section className="border-y border-black/5 bg-[#f0f1f2] py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4 lg:px-10">
        <AnimatedStat value={120} suffix="+" label="Clients Served" />
        <AnimatedStat value={450} suffix="+" label="Campaigns Launched" />
        <AnimatedStat value={50} suffix="Cr+" label="Revenue Generated" />
        <AnimatedStat value={98} suffix="%" label="Client Retention" />
      </div>
    </section>
  );
}
