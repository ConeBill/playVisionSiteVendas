'use client';

import { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
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

  const refreshFavorites = async () => {
    const res = await fetch('/api/favorites');
    const data = await res.json();
    setFavorites(data.favorites || []);
  };

  const handleRemove = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await fetch('/api/favorites', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });
    if (res.ok) {
      await refreshFavorites();
    }
  };

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
                const firstImage = (fav.product_image && String(fav.product_image).trim().length) ? fav.product_image : LOCAL_FALLBACK;
                const href = fav.product_slug ? `/product/${fav.product_slug}` : `/product/${fav.product_id}`;
                return (
                  <div key={fav.product_id} className="flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors">
                    <a
                      href={href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <div className="relative w-10 h-10 rounded-md bg-muted overflow-hidden shrink-0">
                        <Image src={firstImage} alt={fav.product_name || ''} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{fav.product_name || 'Produto'}</p>
                        <p className="text-xs text-muted-foreground">R${(Number(fav.product_price) || 0).toFixed(2)}</p>
                      </div>
                    </a>
                    <button
                      onClick={(e) => handleRemove(e, fav.product_id)}
                      className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                      aria-label="Remover dos favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
