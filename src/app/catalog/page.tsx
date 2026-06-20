
import { ProductService } from '@/services/product-service';
import { CatalogContent } from '@/components/catalog/catalog-content';

export default async function CatalogPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const products = await ProductService.getFeaturedProducts();
  const categories = await ProductService.getCategories();
  const filteredProducts = resolvedSearchParams.category
    ? products.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === resolvedSearchParams.category)
    : products;

  return (
    <CatalogContent
      initialProducts={filteredProducts}
      initialCategories={categories}
    />
  );
}
