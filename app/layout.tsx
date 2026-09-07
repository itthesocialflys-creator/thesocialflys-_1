import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "The Social Flys — Digital Growth Agency, Bengaluru",
    template: "%s | The Social Flys",
  },
  description:
    "Data-driven social media marketing, branding, and digital strategy that turns your audience into a loyal community.",
  keywords: [
    "social media marketing",
    "digital agency",
    "bengaluru",
    "brand strategy",
    "paid ads",
    "SEO",
    "CRM",
  ],
  authors: [{ name: "The Social Flys" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "The Social Flys",
    title: "The Social Flys — Digital Growth Agency, Bengaluru",
    description:
      "Data-driven social media marketing, branding, and digital strategy that turns your audience into a loyal community.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Social Flys — Digital Growth Agency",
    description:
      "Data-driven social media marketing, branding, and digital strategy that turns your audience into a loyal community.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased tracking-tight`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
