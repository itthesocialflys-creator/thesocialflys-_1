import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollTilt } from "@/components/website/ScrollTilt";

export function ContactFormSection() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/leads/public-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: data.get("first_name"),
          last_name: data.get("last_name"),
          email: data.get("email"),
          phone: data.get("phone"),
          company: data.get("company"),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }

      setSuccess(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="contact" className="bg-white py-20 md:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400">
              Get In Touch
            </p>
            <ScrollTilt initialRotate={-6}>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tighter text-black md:text-5xl">
                The galaxy is calling
              </h2>
            </ScrollTilt>
            <ScrollTilt initialRotate={-3} delay={0.1}>
              <p className="mt-4 text-lg text-neutral-600">
                Ready to launch your brand? Fill out the form and our team will reach
                out within 24 hours. Or chat with us directly on WhatsApp.
              </p>
            </ScrollTilt>
            <div className="mt-6 space-y-2 text-sm text-neutral-600">
              <p>
                <span className="font-medium text-black">Email:</span>{" "}
                <a href="mailto:rishabh@thesocialflys.com" className="underline underline-offset-2 hover:text-black">
                  rishabh@thesocialflys.com
                </a>
              </p>
              <p>
                <span className="font-medium text-black">WhatsApp:</span>{" "}
                <a
                  href="https://wa.me/916204574620"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-black"
                >
                  +91 6204574620
                </a>
              </p>
            </div>
          </div>

          <ScrollTilt initialRotate={5} delay={0.15}>
            <Card className="border-neutral-200 bg-[#f9fafa] shadow-lg">
              <CardHeader>
                <CardTitle className="tracking-tight text-xl font-bold">Start your journey</CardTitle>
                <CardDescription className="text-neutral-500">
                  Tell us about your brand and goals. We&apos;ll handle the rest.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {success ? (
                  <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
                    <p className="font-semibold text-black">Thank you!</p>
                    <p className="mt-1 text-sm text-neutral-500">
                      We&apos;ve received your inquiry and will be in touch soon.
                    </p>
                    <Button variant="outline" className="mt-4 border-neutral-300" onClick={() => setSuccess(false)}>
                      Submit Another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name *</Label>
                        <Input id="first_name" name="first_name" required className="border-neutral-300 bg-white" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input id="last_name" name="last_name" className="border-neutral-300 bg-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" className="border-neutral-300 bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" type="tel" className="border-neutral-300 bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" name="company" className="border-neutral-300 bg-white" />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full bg-black hover:bg-neutral-800" disabled={loading}>
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Launch the Conversation
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </ScrollTilt>
        </div>
      </div>
    </section>
  );
}
