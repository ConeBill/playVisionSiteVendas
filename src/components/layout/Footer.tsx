
import Link from 'next/link';
import { Mail, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="bg-muted mt-20 py-20 border-t">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link href="/" className="font-headline text-2xl font-bold tracking-wider text-primary">
            BLUSH & INK
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Curating the finest stationery since 2018. We believe every word deserves a beautiful surface and every thought a perfect pen.
          </p>
          <div className="flex gap-4">
            <button type="button" aria-label="Share" className="text-muted-foreground hover:text-primary">
              <Share2 className="w-5 h-5" />
            </button>
            <button type="button" aria-label="Contact" className="text-muted-foreground hover:text-primary">
              <Mail className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-headline text-lg font-semibold mb-6">Shop</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="/catalog" className="hover:text-primary">All Products</Link></li>
            <li><Link href="/catalog?category=pens" className="hover:text-primary">Fountain Pens</Link></li>
            <li><Link href="/catalog?category=notebooks" className="hover:text-primary">Notebooks & Planners</Link></li>
            <li><Link href="/catalog?category=inks" className="hover:text-primary">Inks & Refills</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline text-lg font-semibold mb-6">Customer Care</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="/shipping" className="hover:text-primary">Shipping Info</Link></li>
            <li><Link href="/returns" className="hover:text-primary">Returns & Exchanges</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-headline text-lg font-semibold">Join the Inkwell</h4>
          <p className="text-sm text-muted-foreground">Subscribe for exclusive offers and calligraphy tips.</p>
          <div className="flex gap-2">
            <Input placeholder="Email Address" className="bg-background" />
            <Button size="icon"><Mail className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 mt-20 pt-8 border-t text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Blush & Ink. Handcrafted with passion.
      </div>
    </footer>
  );
}
