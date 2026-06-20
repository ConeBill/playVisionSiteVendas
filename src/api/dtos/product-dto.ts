
export interface ExternalProductDTO {
  sku: string;
  title: string;
  content: string;
  price_amount: number;
  discounted_price?: number;
  inventory_level: number;
  media: Array<{ url: string; type: 'image' | 'video' }>;
  categories: string[];
  attributes: Record<string, any>;
  metadata: {
    seo_keywords: string[];
    average_score: number;
  };
}
