"use client";

import { useState } from "react";
import {
  WebsiteHeader,
  HeroSection,
  TrustBar,
  AboutSection,
  FeaturesGrid,
  CrmPreviewShowcase,
  AnalyticsShowcase,
  StatsStrip,
  TestimonialsCarousel,
  PricingSection,
  FaqSection,
  ContactFormSection,
  WebsiteFooter,
} from "@/components/website";
import { AuthModal } from "@/components/layout/AuthModal";

export function HomePageClient() {
  const [authOpen, setAuthOpen] = useState(false);

  const openPortal = () => setAuthOpen(true);

  return (
    <>
      <WebsiteHeader />
      <main className="bg-[#f0f1f2]">
        <HeroSection />
        <TrustBar />
        <AboutSection />
        <FeaturesGrid />
        <StatsStrip />
        <CrmPreviewShowcase />
        <AnalyticsShowcase />
        <TestimonialsCarousel />
        <PricingSection />
        <FaqSection />
        <ContactFormSection />
      </main>
      <WebsiteFooter onPortalLogin={openPortal} />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
