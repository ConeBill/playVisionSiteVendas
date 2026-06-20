
import { ExternalProductDTO } from '../dtos/product-dto';

export const MOCK_EXTERNAL_PRODUCTS: ExternalProductDTO[] = [
  {
    sku: 'pen-001',
    title: 'Midnight Blossom Fountain Pen',
    content: 'An exquisite writing instrument crafted with deep rose gold accents and a midnight purple barrel. Perfect for daily journaling or signing significant documents.',
    price_amount: 145.00,
    discounted_price: 125.00,
    inventory_level: 15,
    media: [{ url: 'https://picsum.photos/seed/pen1/800/800', type: 'image' }],
    categories: ['Fountain Pens'],
    attributes: { features: ['18k Gold Nib', 'Ergonomic Grip', 'Piston Filler'] },
    metadata: { seo_keywords: ['luxury pen', 'gift ideas', 'writing'], average_score: 4.8 }
  },
  {
    sku: 'book-001',
    title: 'Gilded Petals Leather Journal',
    content: 'Handcrafted leather journal with acid-free ivory pages and a delicate floral embossing on the cover.',
    price_amount: 45.00,
    inventory_level: 50,
    media: [{ url: 'https://picsum.photos/seed/book1/800/800', type: 'image' }],
    categories: ['Notebooks'],
    attributes: { features: ['160 Pages', 'Lay-flat Binding', 'Ribbon Bookmark'] },
    metadata: { seo_keywords: ['leather journal', 'sketchbook', 'stationery'], average_score: 4.9 }
  },
  {
    sku: 'ink-001',
    title: 'Lavender Dusk Calligraphy Ink',
    content: 'Rich, non-clogging ink with a subtle lavender scent and deep purple sheen. Ideal for dip pens and brush lettering.',
    price_amount: 22.00,
    inventory_level: 30,
    media: [{ url: 'https://picsum.photos/seed/ink1/800/800', type: 'image' }],
    categories: ['Inks'],
    attributes: { features: ['50ml Bottle', 'Water-resistant', 'Pigment-based'] },
    metadata: { seo_keywords: ['purple ink', 'calligraphy', 'art supplies'], average_score: 4.7 }
  },
  {
    sku: 'org-001',
    title: 'Minimalist Brass Pen Holder',
    content: 'Solid brass weighted pen holder with a brushed finish. A timeless piece for any desk setup.',
    price_amount: 65.00,
    inventory_level: 10,
    media: [{ url: 'https://picsum.photos/seed/organizer1/800/800', type: 'image' }],
    categories: ['Desk Accessories'],
    attributes: { features: ['Heavyweight', 'Non-slip Base', 'Hand-polished'] },
    metadata: { seo_keywords: ['desk organizer', 'brass', 'minimalist'], average_score: 4.6 }
  }
];
