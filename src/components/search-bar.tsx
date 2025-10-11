'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function SearchBar({ placeholder }: { placeholder: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const paramsString = params.toString();
  const [value, setValue] = useState(params.get('q') ?? '');

  useEffect(() => {
    const handler = setTimeout(() => {
      const query = new URLSearchParams(paramsString);
      if (value) {
        query.set('q', value);
      } else {
        query.delete('q');
      }
      router.replace(`/?${query.toString()}`);
    }, 400);

    return () => clearTimeout(handler);
  }, [value, router, paramsString]);

  return (
    <div className="relative flex w-80 items-center">
      <Search className="absolute left-4 h-4 w-4 text-slate-400" />
      <Input className="pl-10" value={value} placeholder={placeholder} onChange={(event) => setValue(event.target.value)} aria-label={placeholder} />
    </div>
  );
}
