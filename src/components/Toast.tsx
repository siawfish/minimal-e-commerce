'use client';

import { useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { Product } from '@/types/product';

interface ToastProps {
  isVisible: boolean;
  product: Product | null;
  size: string;
  onClose: () => void;
}

export default function Toast({ isVisible, product, size, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto close after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible || !product) return null;

  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2 duration-200">
      <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl p-4 min-w-[200px]">
        <div className="flex items-center space-x-8">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 mb-1">Added to cart</p>
            <div className="flex items-center space-x-2">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-8 h-8 object-cover rounded-lg bg-gray-50 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700 truncate font-medium">{product.name}</p>
                <p className="text-xs text-gray-500">{size} • ${product.price}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
} 