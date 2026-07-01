
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Heart } from 'lucide-react';
import type { Product } from '@/domain/models/product';
import { useCartStore } from '@/store/use-cart-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const LOCAL_PRODUCT_FALLBACK = '/img/hero-stationery.jpg';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(state => state.addItem);
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your bag.`,
    });
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return;
    setFavoriteLoading(true);
    try {
      const res = await fetch('/api/favorites', {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      if (!res.ok) throw new Error();
      setIsFavorite(!isFavorite);
      toast({
        title: isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
        description: product.name,
      });
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar favoritos.',
        variant: 'destructive',
      });
    } finally {
      setFavoriteLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden rounded-xl bg-muted border">
            {(() => {
              const src = (product.images && product.images[0] && String(product.images[0]).trim().length) ? product.images[0] : LOCAL_PRODUCT_FALLBACK;
              return (
                <Image
                  src={src}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              );
            })()}
            {product.salePrice && (
              <Badge className="absolute top-3 left-3 bg-primary">Sale</Badge>
            )}
          {isLoggedIn && (
            <button
              onClick={toggleFavorite}
              disabled={favoriteLoading}
              className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur shadow-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-muted-foreground hover:text-primary"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
            </button>
          )}
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
            <Button onClick={handleQuickAdd} size="sm" className="shadow-lg">
              <Plus className="w-4 h-4 mr-1" /> Quick Add
            </Button>
          </div>
        </div>
        
        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{product.category}</p>
            {typeof product.stock === 'number' && (
              <span className="text-[11px] font-semibold text-foreground/80 bg-muted/70 px-2 py-0.5 rounded-full">
                Estoque: {product.stock}
              </span>
            )}
          </div>
          <h3 className="font-headline text-lg font-medium leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
          <div className="flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-primary font-bold">R${product.salePrice.toFixed(2)}</span>
                <span className="text-muted-foreground text-sm line-through">R${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-foreground font-bold">R${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
