'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Product, Category } from '@/domain/models/product';

interface CatalogContentProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

export function CatalogContent({
  initialProducts,
  initialCategories,
}: CatalogContentProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || undefined;

  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    let result = initialProducts;

    if (categoryParam) {
      result = result.filter(product =>
        product.category.toLowerCase().replace(/\s+/g, '-') === categoryParam
      );
    }

    const term = searchTerm.trim().toLowerCase();
    if (term) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(term)
      );
    }

    return result;
  }, [searchTerm, categoryParam, initialProducts]);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
        <div className="space-y-4">
          <h1 className="font-headline text-5xl font-bold">Explore Our Boutique</h1>
          <p className="text-muted-foreground max-w-lg">
            From handcrafted journals to precision fountain pens, find everything you need for your artistic journey.
          </p>
        </div>

        <div className="w-full md:w-96 flex gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-10 rounded-full bg-muted border-none"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-12">
        <Button
          variant={categoryParam ? 'outline' : 'default'}
          asChild
          className="rounded-full"
        >
          <Link href="/catalog">Todos</Link>
        </Button>
        {initialCategories.map(cat => (
          <Button
            key={cat.id}
            variant={categoryParam === cat.slug ? 'default' : 'outline'}
            asChild
            className="rounded-full"
          >
            <Link href={`/catalog?category=${cat.slug}`}>{cat.name}</Link>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Search className="w-10 h-10 text-muted-foreground" />
          </div>
          <p className="text-xl font-headline font-bold">Nenhum produto encontrado</p>
          <p className="text-muted-foreground">Tente buscar por outro nome.</p>
        </div>
      )}
    </div>
  );
}
