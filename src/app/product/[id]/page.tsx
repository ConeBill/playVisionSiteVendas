
import { ProductService } from '@/services/product-service';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, Truck, ShieldCheck, Undo2, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddToCartButton } from '@/components/product/AddToCartButton';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id: slug } = await params;
  const product = await ProductService.getProductBySlug(slug);
  if (!product) return notFound();

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden border bg-white shadow-inner">
            <Image 
              src={product.images[0]} 
              alt={product.name} 
              fill 
              className="object-cover"
              priority
            />
            {product.salePrice && <Badge className="absolute top-6 left-6 scale-125 bg-primary">Special Offer</Badge>}
          </div>
          <div className="grid grid-cols-4 gap-4">
             {product.images.map((img, i) => (
               <div key={i} className="relative aspect-square rounded-xl overflow-hidden border cursor-pointer hover:border-primary transition-colors">
                 <Image src={img} alt={`${product.name} thumbnail ${i}`} fill className="object-cover" />
               </div>
             ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{product.category}</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-muted'}`} />
                ))}
                <span className="text-xs text-muted-foreground ml-1">({product.reviewCount} reviews)</span>
              </div>
            </div>
            <h1 className="font-headline text-5xl font-bold leading-tight">{product.name}</h1>
            <p className="text-xl text-muted-foreground font-light leading-relaxed italic">
              {product.shortDescription}
            </p>
            <div className="flex items-baseline gap-4 mt-4">
              {product.salePrice ? (
                <>
                  <span className="text-4xl font-bold text-primary">${product.salePrice.toFixed(2)}</span>
                  <span className="text-2xl text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-4xl font-bold">${product.price.toFixed(2)}</span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <AddToCartButton product={product} />
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 rounded-full"><Heart className="w-4 h-4 mr-2" /> Add to Favorites</Button>
              <Button variant="outline" size="icon" className="rounded-full"><Share2 className="w-4 h-4" /></Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-8 border-t border-b">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-primary" />
              <div className="text-xs">
                <p className="font-bold">Free Shipping</p>
                <p className="text-muted-foreground">On orders over $150</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Undo2 className="w-5 h-5 text-primary" />
              <div className="text-xs">
                <p className="font-bold">30-Day Returns</p>
                <p className="text-muted-foreground">Hassle-free exchange</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <div className="text-xs">
                <p className="font-bold">Secure Checkout</p>
                <p className="text-muted-foreground">PCI-DSS Compliant</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-full h-12">
              <TabsTrigger value="description" className="rounded-full">Details</TabsTrigger>
              <TabsTrigger value="shipping" className="rounded-full">Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-6 space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
              <ul className="grid grid-cols-2 gap-2 mt-4">
                {product.features.map((f, i) => (
                  <li key={i} className="text-xs flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full" /> {f}</li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="shipping" className="pt-6 text-sm text-muted-foreground">
              Standard shipping takes 3-5 business days. Express options available at checkout. We ship globally with sustainable packaging.
            </TabsContent>
          </Tabs>
        </div>
      </div>


    </div>
  );
}
