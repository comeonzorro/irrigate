import Image from "next/image";
import type { LandingImage } from "@/lib/landing-images";

interface LandingImageStripProps {
  images: LandingImage[];
}

export function LandingImageStrip({ images }: LandingImageStripProps) {
  return (
    <section
      aria-label="Potagers en France"
      className="border-b border-emerald-200/60 bg-emerald-50/50 px-4 py-8"
    >
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
        {images.map((image) => (
          <figure
            key={image.src}
            className="group relative overflow-hidden rounded-2xl border border-emerald-200/70 shadow-md"
          >
            <div className="relative aspect-[16/10]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 text-sm font-medium text-white">
                {image.caption}
              </figcaption>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
