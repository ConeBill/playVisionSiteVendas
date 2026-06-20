import type { ExternalProductDTO } from '@/api/dtos/product-dto';
import type { Product } from '@/domain/models/product';

export class ProductAdapter {
  static toDomain(dto: ExternalProductDTO): Product {
    // Generate a stable "random" number based on the SKU length to avoid hydration mismatches
    const stableReviewCount = (dto.sku.length * 7) % 45 + 5;
    
    return {
      id: dto.sku,
      externalId: dto.sku,
      name: dto.title,
      slug: dto.title.toLowerCase().replace(/\s+/g, '-'),
      description: dto.content,
      shortDescription: dto.content.substring(0, 160) + '...',
      price: dto.price_amount,
      salePrice: dto.discounted_price,
      currency: 'USD',
      category: dto.categories[0] || 'Uncategorized',
      images: dto.media.map(m => m.url),
      features: (dto.attributes.features as string[]) || [],
      stock: dto.inventory_level,
      status: dto.inventory_level > 0 ? 'active' : 'out_of_stock',
      rating: dto.metadata.average_score,
      reviewCount: stableReviewCount,
      tags: dto.metadata.seo_keywords
    };
  }
}
