"use client"

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/use-cart-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShoppingBag, CreditCard, Landmark, QrCode, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <h1 className="text-2xl font-bold">Your bag is empty</h1>
        <Button asChild className="mt-4 rounded-full">
          <Link href="/catalog">Go to Shop</Link>
        </Button>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="container mx-auto px-6 py-32 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500">
        <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-600" />
        </div>
        <div className="space-y-4">
          <h1 className="font-headline text-5xl font-bold">Thank you for your order!</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Your beautiful stationery is being prepared. We've sent a confirmation email to your inbox.
          </p>
        </div>
        <Button asChild size="lg" className="rounded-full px-12 h-14">
          <Link href="/">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          {step === 'info' ? (
            <div className="space-y-8 animate-in slide-in-from-left duration-300">
              <h2 className="font-headline text-3xl font-bold">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input placeholder="Jane" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input placeholder="123 Writer's Ln" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>City</Label>
                  <Input placeholder="New York" />
                </div>
                <div className="space-y-2">
                  <Label>Zip</Label>
                  <Input placeholder="10001" />
                </div>
              </div>
              <Button className="w-full h-14 rounded-full" onClick={() => setStep('payment')}>Continue to Payment</Button>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-3xl font-bold">Payment Method</h2>
                <Image src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo.png" alt="Mercado Pago" width={100} height={40} className="object-contain" />
              </div>
              <RadioGroup defaultValue="credit-card" className="grid grid-cols-1 gap-4">
                <Label htmlFor="cc" className="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer hover:bg-muted/30 transition-colors has-[:checked]:border-primary">
                  <RadioGroupItem value="credit-card" id="cc" />
                  <CreditCard className="w-5 h-5 text-primary" />
                  <div className="flex-grow">
                    <p className="font-bold">Credit or Debit Card</p>
                    <p className="text-xs text-muted-foreground">Up to 12 installments</p>
                  </div>
                </Label>
                <Label htmlFor="pix" className="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer hover:bg-muted/30 transition-colors has-[:checked]:border-primary">
                  <RadioGroupItem value="pix" id="pix" />
                  <QrCode className="w-5 h-5 text-green-600" />
                  <div className="flex-grow">
                    <p className="font-bold">PIX</p>
                    <p className="text-xs text-muted-foreground">Instant approval with 5% off</p>
                  </div>
                </Label>
                <Label htmlFor="boleto" className="flex items-center gap-4 p-4 border rounded-2xl cursor-pointer hover:bg-muted/30 transition-colors has-[:checked]:border-primary">
                  <RadioGroupItem value="boleto" id="boleto" />
                  <Landmark className="w-5 h-5 text-blue-600" />
                  <div className="flex-grow">
                    <p className="font-bold">Boleto Bancário</p>
                    <p className="text-xs text-muted-foreground">Approve in 1-2 business days</p>
                  </div>
                </Label>
              </RadioGroup>
              <div className="space-y-4 pt-4">
                <Button className="w-full h-14 rounded-full text-lg font-bold" onClick={() => { clearCart(); setStep('success'); }}>Complete Purchase</Button>
                <Button variant="ghost" className="w-full" onClick={() => setStep('info')}>Back to Shipping</Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Preview */}
        <div className="bg-muted p-8 rounded-3xl border h-fit space-y-8">
          <h3 className="font-headline text-2xl font-bold">Review Your Bag</h3>
          <div className="space-y-6">
            {items.map(item => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border bg-white flex-shrink-0">
                  <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">${(item.salePrice || item.price).toFixed(2)} each</p>
                </div>
                <p className="font-bold text-sm">${((item.salePrice || item.price) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-bold">${subtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-green-600 font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-4">
              <span>Total</span>
              <span className="text-primary">${subtotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
