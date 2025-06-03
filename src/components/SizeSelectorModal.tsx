'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Check } from 'lucide-react';

interface SizeSelectorModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (product: Product, size: string) => void;
}

export default function SizeSelectorModal({ 
  product, 
  isOpen, 
  onClose, 
  onSuccess 
}: SizeSelectorModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (!product || !selectedSize || isAdding) return;

    setIsAdding(true);
    
    // Simulate API call with smooth animation
    await new Promise(resolve => setTimeout(resolve, 600));
    
    addToCart(product, selectedSize);
    setIsAdded(true);
    
    // Show success state briefly
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(false);
      const sizeToPass = selectedSize; // Store before reset
      setSelectedSize('');
      onClose();
      onSuccess?.(product, sizeToPass);
    }, 1200);
  };

  const handleClose = () => {
    if (isAdding) return; // Prevent closing while adding
    setSelectedSize('');
    setIsAdded(false);
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md [&>button]:top-3 [&>button]:right-3 [&>button]:sm:top-4 [&>button]:sm:right-4 [&>button]:p-2 [&>button]:sm:p-1 [&>button]:rounded-full [&>button]:sm:rounded-xs [&>button]:bg-gray-100 [&>button]:hover:bg-gray-200 [&>button]:transition-colors [&>button>svg]:!size-5 [&>button>svg]:sm:!size-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-wide">
            SELECT SIZE
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex items-center space-x-4">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-16 w-16 object-cover rounded-lg bg-gray-50"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{product.category}</p>
              <p className="text-lg font-semibold text-gray-900">${product.price}</p>
            </div>
          </div>
          
          {/* Size Selection */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Choose your size:</h4>
            <div className="grid grid-cols-3 gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`
                    relative h-12 text-sm font-medium tracking-wide transition-all duration-200 
                    border-2 hover:scale-105 active:scale-95
                    ${selectedSize === size 
                      ? 'border-black bg-black text-white shadow-lg' 
                      : 'border-gray-200 bg-white text-gray-900 hover:border-gray-400 hover:shadow-md'
                    }
                  `}
                  onClick={() => setSelectedSize(size)}
                  disabled={isAdding}
                >
                  {size}
                  {selectedSize === size && (
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <div className="space-y-4">
            <Button
              onClick={handleAddToCart}
              disabled={!selectedSize || isAdding}
              className={`
                relative w-full h-12 text-sm font-medium tracking-widest transition-all duration-500 overflow-hidden
                ${selectedSize 
                  ? 'bg-black text-white hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
                ${isAdding ? 'bg-gray-800' : ''}
                ${isAdded ? 'bg-green-600' : ''}
              `}
            >
              <div className={`flex items-center justify-center space-x-3 transition-all duration-500 ${
                isAdding ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
              }`}>
                {isAdded ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>ADDED TO CART</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    <span>{selectedSize ? 'ADD TO CART' : 'SELECT SIZE'}</span>
                  </>
                )}
              </div>
              
              {/* Loading animation */}
              {isAdding && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </Button>
            
            {/* Size guide hint */}
            {!selectedSize && (
              <p className="text-xs text-gray-500 text-center">
                Please select a size to continue
              </p>
            )}
            
            {selectedSize && !isAdding && !isAdded && (
              <p className="text-xs text-gray-600 text-center">
                Size <span className="font-medium">{selectedSize}</span> selected
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 