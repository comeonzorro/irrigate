import Image from "next/image";
import { LANDING_GALLERY } from "@/lib/landing-images";

export function LandingGallery() {
  return (
    <section
      aria-labelledby="gallery-heading"
      className="border-t border-emerald-200/60 bg-gradient-to-b from-emerald-50/90 to-white px-4 py-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            En situation réelle
          </p>
          <h2
            id="gallery-heading"
            className="mt-2 text-3xl font-bold text-emerald-950"
          >
            Votre potager, partout en France
          </h2>
          <p className="mt-3 leading-relaxed text-emerald-800">
            Balcon parisien, serre, jardin partagé ou cour de ferme : Irrigate
            s&apos;adapte à votre espace et à votre région.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LANDING_GALLERY.map((image) => (
            <li
              key={image.src}
              className="group overflow-hidden rounded-2xl border border-emerald-200/80 bg-white shadow-md shadow-emerald-950/5 transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/75 via-emerald-950/10 to-transparent" />
                <p className="absolute inset-x-0 bottom-0 p-4 text-sm font-medium leading-snug text-white">
                  {image.caption}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
