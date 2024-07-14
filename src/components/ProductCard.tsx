// src/components/ProductCard.tsx
import React from 'react';
import Link from 'next/link';
import ClientSideContent from './ClientSideContent';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  sku: string;
  // 添加其他可能的属性
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, description, sku }) => {
  return (
    <Link 
      href={{
        pathname: `/product/${id}`,
        query: { title, description, sku }
      }}
      className="block"
    >
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800 h-12 sm:h-14 overflow-hidden">
          <ClientSideContent html={title} maxLength={50} />
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">SKU: {sku}</p>
        <div className="text-sm text-gray-700 h-20 sm:h-24 overflow-hidden">
          <ClientSideContent html={description} maxLength={150} />
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;