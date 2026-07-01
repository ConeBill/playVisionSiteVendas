'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import Image from 'next/image';

export function FavoritesMenu() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    fetch('/api/favorites')
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setFavorites(data.favorites || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  const LOCAL_FALLBACK = '/img/hero-stationery.jpg';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 hover:bg-muted rounded-full transition-colors relative"
        aria-label="Favoritos"
      >
        <Heart className="w-5 h-5" />
        {mounted && favorites.length > 0 && (
          <span className="absolute top-0 right-0 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            {favorites.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-background border rounded-md shadow-lg z-50 max-h-[70vh] overflow-auto">
          <div className="p-2 space-y-1">
            {!mounted || loading ? (
              <p className="text-sm text-muted-foreground px-2 py-3">Carregando...</p>
            ) : favorites.length === 0 ? (
              <p className="text-sm text-muted-foreground px-2 py-3">Nenhum favorito ainda.</p>
            ) : (
              favorites.map((fav) => {
                const firstImage = (fav.images && fav.images[0] && String(fav.images[0]).trim().length) ? fav.images[0] : LOCAL_FALLBACK;
                return (
                  <a
                    key={fav.product_id}
                    href={`/product/${fav.product_id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-2 rounded hover:bg-muted transition-colors"
                  >
                    <div className="relative w-10 h-10 rounded-md bg-muted overflow-hidden shrink-0">
                      <Image src={firstImage} alt={fav.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{fav.name}</p>
                      <p className="text-xs text-muted-foreground">R${(fav.price ?? 0).toFixed(2)}</p>
                    </div>
                  </a>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
