import type { Product, Category } from '@/domain/models/product';
import type { ProductApiDTO, ProductsApiResponse } from '@/api/dtos/product-estoquedanny-dto';

const ESTOQUE_API = 'https://estoquedanny.netlify.app/api/produtos';

function mapToDomain(dto: ProductApiDTO): Product {
  const name = dto.nome.trim() || dto.codigo;
  const category = (dto.categoria && dto.categoria.trim()) ? dto.categoria.trim() : 'Não catalogado';
  const slug = `${dto.codigo}-${name.toLowerCase().replace(/\s+/g, '-')}`.replace(/[^a-z0-9-]/g, '');
  const images = (() => {
    const arr = Array.isArray(dto.fotos) ? dto.fotos.filter((img): img is string => typeof img === 'string' && img.trim().length > 0) : [];
    if (arr.length) return arr.slice(0, 6);
    if (typeof dto.foto === 'string' && dto.foto.trim().length > 0) return [dto.foto.trim()];
    return [];
  })();
  return {
    id: dto.id,
    externalId: dto.id,
    name,
    slug,
    description: name,
    shortDescription: name,
    price: dto.preco,
    salePrice: undefined,
    currency: 'BRL',
    category,
    images,
    features: [`Código: ${dto.codigo}`, dto.disponivel ? 'Disponível' : 'Indisponível'],
    stock: dto.estoque,
    status: dto.disponivel ? 'active' : 'out_of_stock',
    rating: 0,
    reviewCount: 0,
    tags: [],
  };
}

export class ProductService {
  static async getFeaturedProducts(): Promise<Product[]> {
    const apiKey = process.env.ESTOQUE_DANNY_KEY;
    if (!apiKey) throw new Error('ESTOQUE_DANNY_KEY is not configured');

    const res = await fetch(ESTOQUE_API, {
      headers: { 'x-api-key': apiKey, accept: 'application/json' },
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`Failed to load products (${res.status})`);

    const data = (await res.json()) as ProductsApiResponse;
    return data.produtos.map(mapToDomain);
  }

  static async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getFeaturedProducts();
    const normalized = slug.toLowerCase();
    const bySlug = products.find(p => p.slug === normalized);
    const byId = products.find(p => p.id === normalized || p.externalId === normalized);
    return (bySlug ?? byId) ?? null;
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    const products = await this.getFeaturedProducts();
    const q = category.toLowerCase();
    return products.filter(p => p.category.toLowerCase() === q);
  }

  static async getCategories(): Promise<Category[]> {
    const products = await this.getFeaturedProducts();
    const seen = new Set<string>();
    const categories = products
      .map(p => ({ raw: (p.category || '').trim(), name: (p.category || '').trim() || 'Não catalogado' }))
      .filter((item): item is { raw: string; name: string } => {
        if (!item.raw || seen.has(item.raw)) return false;
        seen.add(item.raw);
        return true;
      })
      .map(({ raw, name }, index) => ({
        id: String(index + 1),
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        imageUrl: `https://picsum.photos/seed/${name.toLowerCase().replace(/\s+/g, '-')}${index}/400/400`,
      }));

    return categories;
  }
}
