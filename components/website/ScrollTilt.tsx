"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollTiltProps {
  children: ReactNode;
  className?: string;
  initialRotate?: number;
  delay?: number;
  duration?: number;
}

export function ScrollTilt({
  children,
  className = "",
  initialRotate = -7,
  delay = 0,
  duration = 0.7,
}: ScrollTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { rootMargin: "-60px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "rotate(0deg) translateY(0px) scale(1)"
          : `rotate(${initialRotate}deg) translateY(32px) scale(0.96)`,
        transition: `opacity ${duration}s cubic-bezier(0.21,0.47,0.32,0.98) ${delay}s, transform ${duration}s cubic-bezier(0.21,0.47,0.32,0.98) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

export function HeadlineBadge({
  prefix = "How we do",
  highlight = "this?",
  className = "",
}: {
  prefix?: string;
  highlight?: string;
  className?: string;
}) {
  return (
    <ScrollTilt initialRotate={-8} className={cn("inline-flex flex-wrap items-center gap-3", className)}>
      <span className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl">
        {prefix}
      </span>
      <span className="rounded-xl bg-neutral-900 px-4 py-1.5 text-3xl font-extrabold text-white shadow-xl sm:text-5xl md:text-6xl">
        {highlight}
      </span>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg transition-transform hover:scale-110 sm:h-14 sm:w-14">
        <ArrowRight className="h-6 w-6 sm:h-7 sm:w-7" />
      </div>
    </ScrollTilt>
  );
}
