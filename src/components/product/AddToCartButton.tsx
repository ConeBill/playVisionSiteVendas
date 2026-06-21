"use client"

import { useState } from 'react';
import { useCartStore } from '@/store/use-cart-store';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import type { Product } from '@/domain/models/product';

export function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore(state => state.addItem);

  const stock = typeof product.stock === 'number' ? product.stock : undefined;
  const limit = stock ?? 99;

  const handleAdd = () => {
    if (typeof stock === 'number' && stock <= 0) {
      toast({
        title: "Sem estoque",
        description: "Não há unidades disponíveis no momento.",
        variant: "destructive",
      });
      return;
    }

    const finalQty = Math.min(qty, limit);
    addItem(product, finalQty);
    toast({
      title: "Bag updated",
      description: `${finalQty}x ${product.name} added to your bag.`,
    });
    setQty(1);
  };

  return (
    <div className="flex gap-4">
      <div className="flex items-center border rounded-full px-4 h-14 bg-muted/30">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="p-1 hover:text-primary transition-colors disabled:opacity-40"
          disabled={qty <= 1}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-10 text-center font-bold">{qty}</span>
        <button
          onClick={() => setQty((q) => Math.min(q + 1, limit))}
          className="p-1 hover:text-primary transition-colors disabled:opacity-40"
          disabled={qty >= limit}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <Button
        onClick={handleAdd}
        disabled={typeof stock === 'number' && stock <= 0}
        className="flex-1 h-14 text-lg rounded-full font-bold shadow-lg shadow-primary/20"
      >
        <ShoppingBag className="w-5 h-5 mr-2" /> {typeof stock === 'number' && stock <= 0 ? 'Esgotado' : 'Add to Bag'}
      </Button>
    </div>
  );
}
