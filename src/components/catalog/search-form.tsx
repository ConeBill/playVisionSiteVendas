'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SearchFormProps {
  initialQuery?: string;
}

export function SearchForm({ initialQuery = '' }: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = (formData.get('q') as string | null) ?? '';
    const params = new URLSearchParams();
    if (value.trim()) params.set('q', value.trim());
    router.push(`/catalog${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-96 flex gap-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 w-full rounded-full bg-muted border-none py-2"
          placeholder="Buscar produtos..."
        />
      </div>
      <Button type="submit" variant="outline" size="icon" className="rounded-full flex-shrink-0">
        <SlidersHorizontal className="w-4 h-4" />
      </Button>
    </form>
  );
}
