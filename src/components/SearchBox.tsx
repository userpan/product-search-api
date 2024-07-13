'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/searchResult?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button 
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Search
      </button>
    </form>
  );
}