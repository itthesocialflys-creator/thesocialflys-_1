import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollTilt } from "@/components/website/ScrollTilt";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Starter",
    subtitle: "Small Brands",
    price: "CUSTOM",
    popular: false,
    features: [
      { label: "Social media management", value: "2 platforms" },
      { label: "Content creation", value: "4 posts/mo" },
      { label: "Paid ads (Meta / Google)", included: true },
      { label: "SEO optimisation", included: true },
      { label: "Priority support", included: false },
    ],
  },
  {
    name: "Growth",
    subtitle: "Most Popular",
    price: "CUSTOM",
    popular: true,
    features: [
      { label: "Social media management", value: "4 platforms" },
      { label: "Content creation", value: "12 posts/mo" },
      { label: "Paid ads (Meta / Google)", included: true },
      { label: "Influencer marketing", included: true },
      { label: "Priority support", value: "Business hrs" },
    ],
  },
  {
    name: "Enterprise",
    subtitle: "Agencies",
    price: "CUSTOM",
    popular: false,
    features: [
      { label: "Social media management", value: "All platforms" },
      { label: "Content creation", value: "Unlimited" },
      { label: "Brand strategy", included: true },
      { label: "Dedicated account manager", included: true },
      { label: "Priority support", value: "24 / 7" },
    ],
  },
];

const WHATSAPP =
  "https://wa.me/916204574620?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services!";

export function PricingSection() {
  return (
    <section id="pricing" className="bg-white py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
            Packages
          </p>
          <ScrollTilt initialRotate={-6}>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tighter text-black md:text-4xl">
              Built for your goals
            </h2>
          </ScrollTilt>
          <ScrollTilt initialRotate={-3} delay={0.1}>
            <p className="mt-4 max-w-2xl text-lg text-neutral-600">
              Every brand is unique. Our pricing is custom — built around your brief,
              not a catalogue.
            </p>
          </ScrollTilt>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {PLANS.map((plan, idx) => (
            <ScrollTilt key={plan.name} initialRotate={idx === 1 ? 0 : idx === 0 ? -6 : 6} delay={idx * 0.1}>
              <Card
                className={cn(
                  "relative flex flex-col border-neutral-200 bg-[#f9fafa] transition-transform hover:-translate-y-1 hover:shadow-xl",
                  plan.popular && "border-black ring-2 ring-black"
                )}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-0.5">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                  <p className="text-sm text-neutral-500">{plan.subtitle}</p>
                  <div className="mt-4 text-3xl font-extrabold tracking-tight">{plan.price}</div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f.label} className="flex items-start gap-2 text-sm">
                        {"included" in f && f.included === false ? (
                          <span className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40">—</span>
                        ) : (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        )}
                        <span>
                          {f.label}
                          {"value" in f && f.value && (
                            <span className="ml-1 font-medium text-foreground">({f.value})</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-black hover:bg-neutral-800" variant={plan.popular ? "default" : "outline"} asChild>
                    <Link href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                      Get a Quote
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </ScrollTilt>
          ))}
        </div>
      </div>
    </section>
  );
}
