'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Category = {
  id: string;
  name: string;
  href: string;
  images: string[];
};

const FALLBACK_IMAGE = '/img/hero-stationery.jpg';

const ROTATE_INTERVAL_MS = 15_000;

function useImageRotation(images: string[], intervalMs = ROTATE_INTERVAL_MS) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const safeImages = useMemo(() => {
    const valid = (images || [])
      .filter((img): img is string => typeof img === 'string' && img.trim().length > 0);
    if (valid.length) return valid.slice(0, 4);
    return [FALLBACK_IMAGE];
  }, [images]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [safeImages.join('|')]);

  useEffect(() => {
    if (safeImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % safeImages.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [safeImages.length, intervalMs]);

  return { safeImages, currentIndex };
}

export function CategoryCard({ name, href, images }: Category) {
  const { safeImages, currentIndex } = useImageRotation(images);

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-3xl border bg-muted block"
    >
      <div className="relative aspect-[4/3]">
        <Image
          key={`${name}-${currentIndex}`}
          src={safeImages[currentIndex]}
          alt={`${name} ${currentIndex + 1}`}
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
        <h3 className="font-headline text-xl font-bold">{name}</h3>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md">
        {safeImages.map((_, idx) => (
          <span
            key={idx}
            className={`h-2 w-2 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-white' : 'bg-white/40'
            }`}
            aria-hidden
          />
        ))}
      </div>
    </Link>
  );
}
