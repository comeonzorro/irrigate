import Image from "next/image";
import Link from "next/link";
import type { LandingSpotlight } from "@/lib/landing-images";

interface LandingSpotlightProps {
  spotlight: LandingSpotlight;
  reverse?: boolean;
}

export function LandingSpotlightSection({
  spotlight,
  reverse = false,
}: LandingSpotlightProps) {
  return (
    <section className="border-b border-emerald-200/60 bg-white px-4 py-14 sm:py-16">
      <div
        className={`mx-auto flex max-w-6xl flex-col items-center gap-10 lg:gap-14 ${
          reverse ? "lg:flex-row-reverse" : "lg:flex-row"
        }`}
      >
        <div className="relative w-full max-w-md shrink-0 overflow-hidden rounded-3xl border border-emerald-200/80 shadow-xl shadow-emerald-950/10 lg:max-w-lg">
          <div className="relative aspect-[4/5]">
            <Image
              src={spotlight.image.src}
              alt={spotlight.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/50 via-transparent to-transparent" />
            <p className="absolute inset-x-0 bottom-0 p-5 text-sm font-medium text-white">
              {spotlight.image.caption}
            </p>
          </div>
        </div>

        <div className="max-w-xl text-center lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            {spotlight.eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-950">
            {spotlight.title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-emerald-800">
            {spotlight.description}
          </p>
          {spotlight.cta ? (
            <Link
              href={spotlight.cta.href}
              className="mt-6 inline-flex rounded-xl bg-emerald-700 px-6 py-3 text-base font-semibold text-white transition hover:bg-emerald-800"
            >
              {spotlight.cta.label} →
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
