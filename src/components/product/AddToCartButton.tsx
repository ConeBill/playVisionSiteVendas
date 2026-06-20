
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

  const handleAdd = () => {
    addItem(product, qty);
    toast({
      title: "Bag updated",
      description: `${qty}x ${product.name} added to your bag.`,
    });
  };

  return (
    <div className="flex gap-4">
      <div className="flex items-center border rounded-full px-4 h-14 bg-muted/30">
        <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1 hover:text-primary transition-colors"><Minus className="w-4 h-4" /></button>
        <span className="w-10 text-center font-bold">{qty}</span>
        <button onClick={() => setQty(qty + 1)} className="p-1 hover:text-primary transition-colors"><Plus className="w-4 h-4" /></button>
      </div>
      <Button 
        onClick={handleAdd}
        className="flex-1 h-14 text-lg rounded-full font-bold shadow-lg shadow-primary/20"
      >
        <ShoppingBag className="w-5 h-5 mr-2" /> Add to Bag
      </Button>
    </div>
  );
}
