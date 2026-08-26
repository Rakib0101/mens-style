"use client";

import { useState } from "react";
import Image from "next/image";

export default function HeroGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-sm border-8 border-white bg-ink-soft shadow-xl">
        <Image
          src={images[active]}
          alt={alt}
          width={800}
          height={1000}
          className="aspect-[4/5] w-full object-cover"
          priority
        />
      </div>

      {images.length > 1 ? (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${alt} ${i + 1}`}
              className={`overflow-hidden rounded-sm border-2 transition-colors ${
                i === active ? "border-brand" : "border-transparent"
              }`}
            >
              <Image
                src={src}
                alt=""
                width={200}
                height={250}
                className="aspect-[4/5] w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
