"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '../../components/SearchBar';
import ProductCard from '../../components/ProductCard';

interface SearchHit {
  id: string;
  title: string;
  description: string;
  sku: string;
  highlight?: {
    title?: string[];
    description?: string[];
  };
}

async function searchProducts(query: string): Promise<SearchHit[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${encodeURIComponent(query)}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await res.json();
  return data.results;
}

export default function SearchResultPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        try {
          setIsLoading(true);
          const results = await searchProducts(query);
          setHits(results);
        } catch (err) {
          setError('An error occurred while fetching results');
        } finally {
          setIsLoading(false);
        }
      } else {
        setHits([]);
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Search Products</h1>
        <SearchBar />
        <p className="mt-8 text-xl text-gray-600 text-center">Please enter a search query</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mt-8">
        {isLoading ? (
          <p className="text-xl text-gray-600 text-center">Loading...</p>
        ) : error ? (
          <p className="text-xl text-red-600 text-center">{error}</p>
        ) : hits.length === 0 ? (
          <p className="text-xl text-gray-600 text-center">No results found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hits.map((hit: SearchHit) => (
              <ProductCard 
                key={hit.id}
                id={hit.id}
                title={hit.title}
                description={hit.description}
                sku={hit.sku}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}