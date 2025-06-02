'use client';

import { Product } from '@/types/product';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import SizeSelectorModal from './SizeSelectorModal';
import Toast from './Toast';
import numeral from 'numeral';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState<{ product: Product; size: string } | null>(null);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setShowSizeModal(true);
  };

  const handleSizeModalSuccess = (product: Product, size: string) => {
    setShowSuccess(true);
    setToastData({ product, size });
    setShowToast(true);
    
    // Reset success state after animation
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const handleToastClose = () => {
    setShowToast(false);
    setToastData(null);
  };

  return (
    <>
      <div 
        className="group cursor-pointer transition-all duration-500 ease-out relative overflow-hidden hover:scale-[1.02] transform-gpu"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-0">
          <div className="aspect-square overflow-hidden bg-gray-50 relative">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`
                absolute bottom-3 right-3 
                bg-white/90 backdrop-blur-sm 
                p-2.5 
                border border-gray-200
                transition-all duration-300 ease-out
                hover:bg-pink-50 hover:border-pink-200 hover:scale-110
                active:scale-95
                opacity-100 translate-y-0
                md:opacity-0 md:translate-y-2
                ${isHovered ? 'md:translate-y-0 md:opacity-100' : ''}
                ${showSuccess ? 'bg-green-100 border-green-300' : ''}
              `}
            >
              {showSuccess ? (
                <Check className="h-4 w-4 text-green-600 animate-pulse" />
              ) : (
                <ShoppingCart className="h-4 w-4 text-gray-700 group-hover:text-pink-600 transition-colors" />
              )}
            </button>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-sm tracking-wide mb-1">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{product.category.toUpperCase()}</p>
            <p className="font-semibold">₵{numeral(product.price).format('0,0')}</p>
          </div>
        </div>
      </div>

      {/* Size Selector Modal */}
      <SizeSelectorModal
        product={product}
        isOpen={showSizeModal}
        onClose={() => setShowSizeModal(false)}
        onSuccess={handleSizeModalSuccess}
      />

      {/* Toast Notification */}
      <Toast
        isVisible={showToast}
        product={toastData?.product || null}
        size={toastData?.size || ''}
        onClose={handleToastClose}
      />
    </>
  );
} 