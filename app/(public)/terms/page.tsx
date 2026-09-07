import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for The Social Flys digital growth agency.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 prose dark:prose-invert">
      <h1>Terms of Service</h1>
      <p>Last updated: August 2026</p>
      <p>
        By accessing and using thesocialflys.com, you agree to be bound by these Terms of Service.
      </p>
      <h2>Services</h2>
      <p>We provide digital marketing, branding, and strategy services as described on our website.</p>
      <h2>Contact</h2>
      <p>Questions about these terms? Email rishabh@thesocialflys.com</p>
    </div>
  );
}
