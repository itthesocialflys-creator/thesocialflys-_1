import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How The Social Flys collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: August 2026</p>
      <p>
        The Social Flys (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
        This policy describes how we collect, use, and safeguard your personal information when you
        visit our website or submit a contact form.
      </p>
      <h2>Information We Collect</h2>
      <p>We may collect your name, email address, phone number, company name, and any information you provide through our contact forms.</p>
      <h2>How We Use Your Information</h2>
      <p>We use collected information to respond to inquiries, provide our services, and improve our marketing efforts.</p>
      <h2>Contact</h2>
      <p>For privacy-related questions, contact us at rishabh@thesocialflys.com</p>
    </div>
  );
}
