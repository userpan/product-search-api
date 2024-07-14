// src/app/product/[id]/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import ClientSideContent from '../../../components/ClientSideContent';

const ProductPage = () => {
  const searchParams = useSearchParams();
  
  const title = searchParams.get('title') || '';
  const description = searchParams.get('description') || '';
  const sku = searchParams.get('sku') || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        <ClientSideContent html={title} />
      </h1>
      <p className="text-gray-600 mb-2">SKU: {sku}</p>
      <div className="text-gray-800">
        <ClientSideContent html={description} />
      </div>
    </div>
  );
}

export default ProductPage;