"use client"

import { useCartStore } from '@/store/use-cart-store';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-6 py-32 flex flex-col items-center justify-center text-center space-y-8">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center animate-pulse" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-6 py-32 flex flex-col items-center justify-center text-center space-y-8">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="font-headline text-4xl font-bold">Your bag is empty</h1>
          <p className="text-muted-foreground">It looks like you haven't added anything yet.</p>
        </div>
        <Button asChild size="lg" className="rounded-full px-12 h-14 text-md">
          <Link href="/catalog">Shop the Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="font-headline text-4xl font-bold mb-12">Your Shopping Bag</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 p-4 rounded-2xl border bg-white shadow-sm">
              <div className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
              </div>
              
              <div className="flex-grow flex flex-col justify-between py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{item.category}</span>
                    <h3 className="font-headline text-xl font-bold">{item.name}</h3>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center border rounded-full h-10 px-3 bg-muted/20">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="w-3 h-3" /></button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="w-3 h-3" /></button>
                  </div>
                  <span className="font-bold text-lg">${((item.salePrice || item.price) * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-muted p-8 rounded-3xl sticky top-24 space-y-8 border shadow-sm">
            <h2 className="font-headline text-2xl font-bold">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">${subtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 font-medium">Calculated at next step</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">${subtotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Coupon Code" className="bg-white rounded-full" />
                <Button variant="outline" className="rounded-full">Apply</Button>
              </div>
              <Button asChild className="w-full h-14 rounded-full text-lg shadow-lg">
                <Link href="/checkout">Continue to Checkout <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <p className="text-[10px] text-muted-foreground text-center px-4 uppercase tracking-widest">
                Prices include all taxes. Secure payments powered by Mercado Pago.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
