'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div className="p-2 rounded-full bg-muted animate-pulse w-9 h-9" />
    );
  }

  if (!session?.user) {
    return (
      <a
        href="/login"
        className="p-2 hover:bg-muted rounded-full transition-colors"
        aria-label="Entrar"
      >
        <User className="w-5 h-5" />
      </a>
    );
  }

  const avatar = session.user.image;
  const name = session.user.name || 'Conta';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-muted transition-colors"
        aria-label="Menu do usuário"
      >
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
        )}
        <span className="hidden sm:inline text-sm font-medium truncate max-w-[120px]">{name}</span>
        <ChevronDown className="w-4 h-4 hidden sm:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-background border rounded-md shadow-lg py-1 z-50">
          <a
            href="/account"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
          >
            <User className="w-4 h-4" />
            Minha conta
          </a>
          <button
            onClick={() => {
              setIsOpen(false);
              signOut({ callbackUrl: '/' });
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-muted transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
