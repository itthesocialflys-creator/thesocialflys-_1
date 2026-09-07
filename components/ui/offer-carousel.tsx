"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Offer { id: string | number; imageSrc: string; imageAlt: string; tag: string; title: string; description: string; brandLogoSrc: string; brandName: string; promoCode?: string; href: string; }
export interface OfferCarouselProps extends React.HTMLAttributes<HTMLDivElement> { offers: Offer[]; }

export const OfferCarousel = React.forwardRef<HTMLDivElement, OfferCarouselProps>(({ offers, className, ...props }, ref) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const scroll = (direction: "left" | "right") => { const el = scrollContainerRef.current; if (el) el.scrollBy({ left: direction === "left" ? -el.clientWidth * 0.8 : el.clientWidth * 0.8, behavior: "smooth" }); };
  return <div ref={ref} className={cn("group relative w-full", className)} {...props}>
    <button aria-label="Previous services" onClick={() => scroll("left")} className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/55 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus:opacity-100"><ChevronLeft className="h-5 w-5" /></button>
    <div ref={scrollContainerRef} className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {offers.map((offer) => <motion.a key={offer.id} href={offer.href} className="group/card relative h-[390px] w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm" whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
        <Image src={offer.imageSrc} alt={offer.imageAlt} fill sizes="300px" className="h-1/2 object-cover transition-transform duration-500 group-hover/card:scale-110" />
        <div className="absolute inset-x-0 bottom-0 flex h-1/2 flex-col justify-between bg-white p-5"><div className="space-y-2"><div className="flex items-center text-xs text-neutral-500"><Tag className="mr-2 h-4 w-4" />{offer.tag}</div><h3 className="text-xl font-bold leading-tight text-black">{offer.title}</h3><p className="text-sm leading-relaxed text-neutral-600">{offer.description}</p></div><div className="flex items-center justify-between border-t border-neutral-200 pt-4"><div className="flex items-center gap-3"><Image src={offer.brandLogoSrc} alt="The Social Flys logo" width={30} height={30} className="rounded-full" /><div><p className="text-xs font-semibold text-black">{offer.brandName}</p>{offer.promoCode && <p className="text-xs text-neutral-500">{offer.promoCode}</p>}</div></div><span className="grid h-8 w-8 place-items-center rounded-full bg-neutral-100 text-black transition-all group-hover/card:rotate-[-45deg] group-hover/card:bg-black group-hover/card:text-white"><ArrowRight className="h-4 w-4" /></span></div></div>
      </motion.a>)}
    </div>
    <button aria-label="Next services" onClick={() => scroll("right")} className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/55 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus:opacity-100"><ChevronRight className="h-5 w-5" /></button>
  </div>;
});
OfferCarousel.displayName = "OfferCarousel";
