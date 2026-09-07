"use client";

import { Target, Compass, Award, Rocket, CheckCircle2 } from "lucide-react";
import { ScrollTilt } from "@/components/website/ScrollTilt";

export function AboutSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-white py-20 md:py-28">
      {/* Background Subtle Yellow Accent Glow */}
      <div className="pointer-events-none absolute -right-20 top-1/3 -z-10 h-80 w-80 rounded-full bg-[#FFE600]/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-400/50 bg-[#FFE600] px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-black shadow-sm">
            <Rocket className="h-3.5 w-3.5 fill-black" />
            About The Social Flys
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl md:text-5xl">
            We Don’t Just Market Brands.{" "}
            <span className="relative inline-block rounded-md bg-[#FFE600] px-2 py-0.5 text-black border border-yellow-300">
              We Make Them Fly.
            </span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-neutral-600">
            <strong>The Social Flys</strong> is a growth-focused digital marketing agency helping businesses build a powerful digital presence, connect with the right audience, and turn attention into measurable growth.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <ScrollTilt initialRotate={-3}>
            <div className="h-full rounded-2xl border border-neutral-200 bg-[#f9fafa] p-8 shadow-sm transition-all hover:border-yellow-400 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#FFE600] text-black border border-yellow-400 font-bold shadow-sm">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-black">Our Mission</h3>
              </div>
              <p className="mt-4 text-base font-medium leading-relaxed text-black">
                &ldquo;To digitalize businesses and help them grow beyond their limits.&rdquo;
              </p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                We aim to make effective digital marketing accessible to businesses across India by combining creative ideas with data-driven strategies and cutting-edge technology.
              </p>
            </div>
          </ScrollTilt>

          <ScrollTilt initialRotate={3}>
            <div className="h-full rounded-2xl border border-neutral-200 bg-[#f9fafa] p-8 shadow-sm transition-all hover:border-yellow-400 hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#FFE600] text-black border border-yellow-400 font-bold shadow-sm">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-black">Our Vision</h3>
              </div>
              <p className="mt-4 text-base font-medium leading-relaxed text-black">
                To build a digital ecosystem where businesses of every size can use technology, creativity, and digital marketing to reach their full potential.
              </p>
              <div className="mt-4 inline-block rounded-md bg-black px-3 py-1.5 text-xs font-bold text-[#FFE600]">
                The Social Flys — Grow Beyond Limits.
              </div>
            </div>
          </ScrollTilt>
        </div>

        {/* Why The Social Flys */}
        <div className="mt-12 rounded-2xl border border-neutral-200 bg-neutral-900 p-8 text-white md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#FFE600] px-3 py-1 text-xs font-extrabold uppercase text-black">
                <Award className="h-3.5 w-3.5" />
                Why The Social Flys?
              </div>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
                Because we don&apos;t believe in one-size-fits-all marketing.
              </h3>
              <p className="mt-4 text-base text-neutral-300">
                <strong>Your goals become our growth targets.</strong> We bring strategy, creativity, technology, and performance together under one roof.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: "Custom Strategies", desc: "Tailored around your actual business goals—not generic packages." },
                  { title: "Data-Driven Execution", desc: "Combining creative storytelling with measurable ROAS & performance tracking." },
                  { title: "Full-Stack Expertise", desc: "From SMM and SEO to paid ads, web & tailored software development." },
                  { title: "Continuous Optimization", desc: "We constantly analyze and optimize campaigns for higher conversions." },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2 font-bold text-[#FFE600]">
                      <CheckCircle2 className="h-4 w-4" />
                      {item.title}
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
