import type { Metadata } from "next";
import { HomePageClient } from "./HomePageClient";

export const metadata: Metadata = {
  title: "The Social Flys — Digital Growth Agency | Social Media, SEO & Paid Ads | Bengaluru",
  description:
    "The Social Flys is a growth-focused digital marketing agency in Bengaluru. We offer social media marketing, SEO, paid ads, branding, content strategy, lead generation, and custom software development to help businesses grow beyond limits.",
  keywords: [
    "digital marketing agency Bengaluru",
    "social media marketing India",
    "SEO services Bengaluru",
    "paid ads agency",
    "brand strategy",
    "performance marketing",
    "lead generation",
    "website development",
    "software development",
    "The Social Flys",
    "growth marketing",
    "CRM",
  ],
  openGraph: {
    title: "The Social Flys — Digital Growth Agency | Bengaluru",
    description:
      "Data-driven social media marketing, branding, and digital strategy that turns your audience into a loyal community. Grow Beyond Limits.",
    url: "/",
    siteName: "The Social Flys",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Social Flys — Digital Growth Agency",
    description:
      "Data-driven social media marketing, branding, and digital strategy that turns your audience into a loyal community.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
