'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import Pagination from './Pagination';
import { useApiKey } from '../contexts/ApiKeyContext';

interface SearchHit {
  id: string;
  title: string;
  description: string;
  sku: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalHits: number;
}

const searchProducts = async (query: string, apiKey: string, page: number): Promise<{ results?: SearchHit[], pagination?: PaginationInfo, error?: string }> => {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&api_key=${apiKey}&page=${page}`, { cache: 'no-store' });
  const data = await res.json();
  if (!res.ok) {
    return { error: data.error || 'Failed to fetch data' };
  }
  return { results: data.results, pagination: data.pagination };
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiKey } = useApiKey();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchResults = async () => {
      if (query && apiKey) {
        try {
          setIsLoading(true);
          const { results, pagination, error } = await searchProducts(query, apiKey, currentPage);
          if (error) {
            setError(error);
            setHits([]);
          } else if (results) {
            setHits(results);
            setPagination(pagination || null);
            setError(null);
          }
        } catch (err) {
          setError('An error occurred while fetching results');
          setHits([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setHits([]);
        setIsLoading(false);
        if (!apiKey) {
          setError('API key not available. Please select a user.');
        }
      }
    };

    fetchResults();
  }, [query, apiKey, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) return <p className="text-xl text-gray-600 text-center">Loading...</p>;
  if (error) return <p className="text-xl text-red-600 text-center">{error}</p>;
  if (hits.length === 0) return <p className="text-xl text-gray-600 text-center">No results found</p>;

  return (
    <>
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
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}