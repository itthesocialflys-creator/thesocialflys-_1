import Link from "next/link";
import { BrandLogo } from "@/components/website/BrandLogo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0f1f2] p-4 text-center">
      <div className="mb-6">
        <BrandLogo size="lg" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">404 - Page Not Found</h1>
      <p className="mt-2 text-sm text-neutral-600">The page you are looking for does not exist or has been moved.</p>
      <Button asChild className="mt-6 bg-black text-white hover:bg-neutral-800">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
