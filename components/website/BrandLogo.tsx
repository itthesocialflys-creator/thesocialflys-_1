import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  showWordmark?: boolean;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
}

export function BrandLogo({
  className,
  showWordmark = true,
  showTagline = true,
  size = "md",
  variant = "light",
}: BrandLogoProps) {
  const pixelSizes = { sm: 26, md: 32, lg: 42 };

  return (
    <div className={cn("flex items-center gap-2.5 group cursor-pointer select-none", className)}>
      <Image
        src="/logo.svg"
        alt="The Social Flys"
        width={pixelSizes[size]}
        height={pixelSizes[size]}
        className={cn(
          "h-auto w-auto object-contain transition-transform duration-300 group-hover:scale-105",
          size === "sm" ? "max-h-7" : size === "lg" ? "max-h-10" : "max-h-8"
        )}
        priority
      />
      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          <span
            className={cn(
              "font-extrabold uppercase tracking-wider font-sans",
              size === "sm" ? "text-xs sm:text-sm" : size === "lg" ? "text-xl" : "text-sm sm:text-base",
              variant === "dark" ? "text-white" : "text-black"
            )}
          >
            THE SOCIAL FLYS
          </span>
          {showTagline && (
            <span
              className={cn(
                "font-extrabold uppercase tracking-widest text-black bg-[#FFE600] border border-yellow-400 px-1.5 py-0.5 rounded-sm shadow-sm inline-block w-fit mt-1",
                size === "sm" ? "text-[7px]" : size === "lg" ? "text-[10px]" : "text-[8px]"
              )}
            >
              GROW BEYOND LIMITS
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function FaviconSvg({ className }: { className?: string }) {
  return (
    <Image
      src="/favicon.svg"
      alt="The Social Flys Favicon"
      width={32}
      height={32}
      className={cn("h-8 w-8 object-contain", className)}
    />
  );
}
