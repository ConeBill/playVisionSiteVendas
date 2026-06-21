import { Suspense } from 'react';
import { ProductService } from '@/services/product-service';
import { CatalogContent } from '@/components/catalog/catalog-content';

export default async function CatalogPage() {
  const products = await ProductService.getFeaturedProducts();
  const categories = await ProductService.getCategories();

  return (
    <Suspense fallback={<div className="container mx-auto px-6 py-12">Carregando catálogo...</div>}>
      <CatalogContent
        initialProducts={products}
        initialCategories={categories}
      />
    </Suspense>
  );
}
