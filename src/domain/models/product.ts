
export type ProductStatus = 'active' | 'out_of_stock' | 'discontinued';

export interface Product {
  id: string;
  externalId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice?: number;
  currency: string;
  category: string;
  images: string[];
  features: string[];
  stock: number;
  status: ProductStatus;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}
