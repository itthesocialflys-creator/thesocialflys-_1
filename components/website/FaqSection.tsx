import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "What services does The Social Flys offer?",
    a: "We offer social media marketing, performance & paid ads, brand strategy, content creation, SEO & web design, and influencer marketing — all data-driven and results-focused.",
  },
  {
    q: "How does your pricing work?",
    a: "Our pricing is fully custom based on your brand's goals, channels, and scope. Every package is built around your brief — contact us for a tailored quote.",
  },
  {
    q: "Do you work with startups and enterprise brands?",
    a: "Yes! From small brands launching their first campaign to agencies managing multiple clients, we scale our services to match your ambitions.",
  },
  {
    q: "How do you measure campaign success?",
    a: "We track ROAS, CPA, engagement rates, organic growth, and revenue attribution. Every rupee is tracked, every result is reported with full transparency.",
  },
  {
    q: "Where are you based?",
    a: "We're a digital growth agency based in Bengaluru, India, serving clients across the country and internationally.",
  },
  {
    q: "How quickly can we get started?",
    a: "After an initial discovery call, we typically onboard within 1-2 weeks with a full audit, strategy blueprint, and execution plan.",
  },
];

export function FaqSection() {
  return (
    <section className="bg-[#f0f1f2] py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-10">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tighter text-black md:text-4xl">
            Common questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-12">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-neutral-200">
              <AccordionTrigger className="text-left font-medium text-black hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-600">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
