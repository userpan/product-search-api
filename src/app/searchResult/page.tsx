"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchBar from '../../components/SearchBar';
import ProductCard from '../../components/ProductCard';
import { useApiKey } from '../../contexts/ApiKeyContext';
import Pagination from '@/src/components/Pagination';

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

const SearchResultPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { apiKey } = useApiKey();

  useEffect(() => {
    const fetchResults = async () => {
      if (query && apiKey) {
        try {
          setIsLoading(true);
          const { results, pagination, error } = await searchProducts(query, apiKey, page);
          if (error) {
            setError(error);
            setHits([]);
          } else if (results && pagination) {
            setHits(results);
            setPagination(pagination);
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
  }, [query, apiKey, page]);

  const handlePageChange = (newPage: number) => {
    router.push(`/searchResult?q=${encodeURIComponent(query)}&page=${newPage}`);
  };

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
          <div className="text-xl text-red-600 text-center">
            <p>{error}</p>
            {error === '已超过每日使用限制' && (
              <p className="mt-2">You have exceeded your daily search limit. Please try again tomorrow or upgrade your plan.</p>
            )}
          </div>
        ) : hits.length === 0 ? (
          <p className="text-xl text-gray-600 text-center">No results found</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
        )}
      </div>
    </div>
  );
}

export default SearchResultPage;
