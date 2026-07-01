"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/use-cart-store';
import { cn } from '@/lib/utils';
import { UserMenu } from '@/components/auth/UserMenu';
import { FavoritesMenu } from '@/components/auth/FavoritesMenu';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const totalItems = useCartStore(state => state.totalItems());

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 h-16 flex items-center justify-between",
      isScrolled ? "bg-background/80 backdrop-blur-md border-b shadow-sm" : "bg-transparent"
    )}>
      <div className="flex items-center gap-8">
        <Link href="/" className="font-headline text-2xl font-bold tracking-wider text-primary">
          Play Vision Papelaria
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/catalog" className="hover:text-primary transition-colors">Buscar todos</Link>
          <Link href="/catalog?category=escolares" className="hover:text-primary transition-colors">Escolares</Link>
          <Link href="/catalog?category=presentes" className="hover:text-primary transition-colors">Presentes</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        
        <Link href="/cart" className="p-2 hover:bg-muted rounded-full transition-colors relative">
          <ShoppingBag className="w-5 h-5" />
          {mounted && totalItems > 0 && (
            <span className="absolute top-0 right-0 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
            )}
            </Link>
            <FavoritesMenu />
            <UserMenu />
        <button 
          className="md:hidden p-2 hover:bg-muted rounded-full"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top duration-300">
          <Link href="/catalog" onClick={() => setIsMobileMenuOpen(false)}>Buscar todos</Link>
          <Link href="/catalog?category=escolares" onClick={() => setIsMobileMenuOpen(false)}>Escolares</Link>
          <Link href="/catalog?category=presentes" onClick={() => setIsMobileMenuOpen(false)}>Presentes</Link>
        </div>
      )}
    </nav>
  );
}
