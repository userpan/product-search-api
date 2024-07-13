import React from 'react';
import ClientSideContent from './ClientSideContent';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  sku: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, description, sku }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">
        <ClientSideContent html={title} />
      </h2>
      <p className="text-sm text-gray-600 mb-3">SKU: {sku}</p>
      <div className="text-gray-700 text-sm">
        <ClientSideContent html={description} />
      </div>
    </div>
  );
};

export default ProductCard;