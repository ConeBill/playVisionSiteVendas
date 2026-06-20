
import { Hero } from '@/components/home/Hero';
import { ProductService } from '@/services/product-service';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Star, Sparkles, PenTool } from 'lucide-react';
import Image from 'next/image';

export default async function Home() {
  const products = await ProductService.getFeaturedProducts();
  const categories = await ProductService.getCategories();

  return (
    <div className="space-y-24">
      <Hero />

      {/* Categories Grid - Bento Style */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
          {(categories[0] ? [categories[0]] : []).map(cat => (
            <Link key={cat.id} href={`/catalog?category=${cat.slug}`} className="md:col-span-2 group relative overflow-hidden rounded-3xl border bg-secondary">
              <Image src={cat.imageUrl!} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="font-headline text-3xl font-bold">{cat.name}</h3>
                <p className="text-sm text-white/80 mt-2">Precision engineered for timeless beauty.</p>
              </div>
            </Link>
          ))}
          {(categories[1] ? [categories[1]] : []).map(cat => (
            <Link key={cat.id} href={`/catalog?category=${cat.slug}`} className="group relative overflow-hidden rounded-3xl border bg-muted">
               <Image src={cat.imageUrl!} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="font-headline text-xl font-bold">{cat.name}</h3>
              </div>
            </Link>
          ))}
          <div className="bg-primary/10 rounded-3xl p-8 flex flex-col justify-between border border-primary/20">
            <Sparkles className="w-10 h-10 text-primary" />
            <div>
              <h3 className="font-headline text-2xl font-bold text-primary">New Arrivals</h3>
              <p className="text-sm mt-2 mb-6">Check out the latest drops in our catalog.</p>
              <Button asChild size="sm" variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-white">
                <Link href="/catalog?sort=newest">Browse</Link>
              </Button>
            </div>
          </div>
          {(categories[2] ? [categories[2]] : []).map(cat => (
            <Link key={cat.id} href={`/catalog?category=${cat.slug}`} className="group relative overflow-hidden rounded-3xl border bg-muted">
              <Image src={cat.imageUrl!} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="font-headline text-xl font-bold">{cat.name}</h3>
              </div>
            </Link>
          ))}
          {(categories[3] ? [categories[3]] : []).map(cat => (
            <Link key={cat.id} href={`/catalog?category=${cat.slug}`} className="md:col-span-2 group relative overflow-hidden rounded-3xl border bg-secondary">
              <Image src={cat.imageUrl!} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="font-headline text-2xl font-bold">{cat.name}</h3>
                <p className="text-sm text-white/80 mt-2">Enhance your workspace with modern tools.</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-4">
            <h2 className="font-headline text-4xl font-bold">Curated Selection</h2>
            <p className="text-muted-foreground max-w-lg">Every item in our boutique is hand-picked for quality, durability, and that unique 'wow' factor.</p>
          </div>
          <Button variant="link" asChild className="text-primary gap-2">
            <Link href="/catalog">View all collection <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-muted py-24">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Star className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-headline text-xl font-bold">Premium Quality</h4>
            <p className="text-muted-foreground text-sm">We only source the highest grade materials for our journals and pens.</p>
          </div>
          <div className="space-y-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <PenTool className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-headline text-xl font-bold">Artisan Craft</h4>
            <p className="text-muted-foreground text-sm">Supporting traditional craftsmanship in the digital age.</p>
          </div>
          <div className="space-y-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-headline text-xl font-bold">Global Shipping</h4>
            <p className="text-muted-foreground text-sm">Delivering inspiration to your doorstep, anywhere in the world.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
