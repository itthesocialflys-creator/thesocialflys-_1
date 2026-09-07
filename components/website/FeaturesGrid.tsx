"use client";

import { useState } from "react";
import Image from "next/image";
import { Megaphone, Target, Palette, Search, Code2, LineChart, TrendingUp, Layers, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollTilt, HeadlineBadge } from "@/components/website/ScrollTilt";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    num: "01",
    icon: Megaphone,
    title: "Social Media Marketing",
    description: "Strategic campaigns across Instagram, Facebook, LinkedIn & YouTube that build community, drive engagement, and convert followers into revenue.",
    image: "/images/services/social-media.png",
  },
  {
    num: "02",
    icon: Search,
    title: "Search Engine Optimization (SEO)",
    description: "Data-led SEO strategies to dominate Google search rankings, drive organic high-intent traffic, and scale your brand visibility sustainably.",
    image: "/images/services/seo-web-design.png",
  },
  {
    num: "03",
    icon: Target,
    title: "Performance & Paid Advertising",
    description: "High-ROI Meta Ads, Google PPC & YouTube ad campaigns targeted to the right audience to maximize ROAS and optimize ad spend.",
    image: "/images/services/paid-ads.png",
  },
  {
    num: "04",
    icon: Palette,
    title: "Branding & Creative Design",
    description: "Visual identity, brand positioning, logo design, and scroll-stopping creative assets that establish trust and differentiate your business.",
    image: "/images/services/brand-strategy.png",
  },
  {
    num: "05",
    icon: Code2,
    title: "Website Development",
    description: "Fast, responsive, and conversion-optimized websites designed to turn casual visitors into long-term paying customers.",
    image: "/images/services/software-development-glass.png",
  },
  {
    num: "06",
    icon: Layers,
    title: "Content Strategy & Marketing",
    description: "Reels, carousels, video production, and high-converting copywriting that tells your story effectively and sparks audience action.",
    image: "/images/services/content-creation.png",
  },
  {
    num: "07",
    icon: TrendingUp,
    title: "Lead Generation",
    description: "High-converting funnel setup, lead magnets, and targeted campaigns that deliver qualified, ready-to-buy sales leads consistently.",
    image: "/images/services/influencer-marketing.png",
  },
  {
    num: "08",
    icon: LineChart,
    title: "Digital Growth Consulting",
    description: "End-to-end digital audit, market positioning, and growth roadmaps designed to help startups and established brands scale rapidly.",
    image: "/images/services/ai-automation-glass.png",
  },
  {
    num: "09",
    icon: Cpu,
    title: "Software Development",
    description: "Tailored web applications, custom CRM integration, and software solutions engineered to streamline operations and scale your business.",
    image: "/images/services/software-development-glass.png",
  },
];

export function FeaturesGrid() {
  const [active, setActive] = useState(0);

  return (
    <section id="services" className="overflow-hidden bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div>
          <div className="mb-2 inline-block rounded-md bg-[#FFE600] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-black border border-yellow-400">
            What We Do
          </div>
          <HeadlineBadge prefix="Customized Strategies for" highlight="Real Business Growth" className="mb-4" />
          <ScrollTilt initialRotate={-3} delay={0.1}>
            <p className="mt-4 max-w-2xl text-lg text-neutral-600">
              We create customized digital strategies based on your business goals—not generic marketing packages. We bring strategy, creativity, technology, and performance together under one roof.
            </p>
          </ScrollTilt>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <ScrollTilt key={feature.num} initialRotate={index % 2 === 0 ? -5 : 5} delay={index * 0.05}>
                <Card
                  className={cn(
                    "group cursor-pointer overflow-hidden border-neutral-200 bg-[#f9fafa] transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400 hover:shadow-xl",
                    active === index && "border-black ring-2 ring-[#FFE600]"
                  )}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => setActive(index)}
                >
                  <div className="relative mx-4 mt-4 h-36 overflow-hidden rounded-xl bg-neutral-100">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-xs font-bold text-neutral-400 group-hover:text-black">
                        {feature.num}
                      </span>
                      <div className="rounded-lg bg-[#FFE600] p-2.5 text-black border border-yellow-400 transition-transform group-hover:scale-110">
                        <Icon className="h-5 w-5 stroke-[2.2]" />
                      </div>
                    </div>
                    <CardTitle className="mt-2 text-xl font-bold tracking-tight text-black">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-neutral-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </ScrollTilt>
            );
          })}
        </div>
      </div>
    </section>
  );
}
