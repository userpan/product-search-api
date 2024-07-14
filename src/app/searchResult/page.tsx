import React, { Suspense } from 'react';
import SearchResults from '../../components/SearchResults';

export default function SearchResultPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<p className="text-xl text-gray-600 text-center">Loading...</p>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}