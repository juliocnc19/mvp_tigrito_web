'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
}

export function SearchBar({
  placeholder = 'Buscar servicios o profesionales...',
  onSearch,
  onClear,
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setQuery('');
    onClear?.();
  };

  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        🔍
      </div>
      <Input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-10 pr-10 py-2"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </div>
  );
}
