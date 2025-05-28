'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { products } from '@/data/products';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { ArrowLeft, Heart, ShoppingBag, Check } from 'lucide-react';

export default function ProductDetail() {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const { id } = useParams();
  const router = useRouter();
  const product = products.find(p => p.id === id);

  if (!product) return null;

  const handleAddToCart = async () => {
    if (selectedSize && !isAddingToCart) {
      setIsAddingToCart(true);
      
      // Simulate API call with smooth animation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      addToCart(product, selectedSize);
      setIsAdded(true);
      
      // Reset states after showing success
      setTimeout(() => {
        setIsAddingToCart(false);
        setIsAdded(false);
        setSelectedSize('');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Back Navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => router.back()}
          className="group flex items-center space-x-2 text-gray-600 hover:text-black transition-all duration-300 mb-8"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="text-sm font-medium tracking-wide">BACK</span>
        </button>
      </div>

      {/* Product Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square overflow-hidden bg-gray-50 relative group">
              <img
                src={product.image}
                alt={product.name}
                className={`h-full w-full object-cover transition-all duration-700 ease-out ${
                  isImageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                }`}
                onLoad={() => setIsImageLoaded(true)}
              />
              
              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
              
              {/* Floating heart icon */}
              <button className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-300 group">
                <Heart className="h-5 w-5 text-gray-700 group-hover:text-red-500 transition-colors duration-300" />
              </button>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-8 lg:pl-8">
            
            {/* Category & Title */}
            <div className="space-y-4">
              <Badge 
                variant="secondary" 
                className="text-xs font-medium tracking-widest bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-300"
              >
                {product.category.toUpperCase()}
              </Badge>
              
              <div className="space-y-2">
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight animate-fade-in-up">
                  {product.name}
                </h1>
                <div className="flex items-baseline space-x-4">
                  <p className="text-3xl font-semibold">${product.price}</p>
                  <span className="text-sm text-gray-500 tracking-wide">USD</span>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed text-lg max-w-md">
                {product.description}
              </p>
            </div>
            
            {/* Size Selection */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium tracking-widest mb-4 text-gray-900">
                  SELECT SIZE
                </h3>
                <div className="grid grid-cols-3 gap-3 max-w-xs">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`
                        relative h-14 text-sm font-medium tracking-wide transition-all duration-300 
                        border-2 hover:scale-105 active:scale-95
                        ${selectedSize === size 
                          ? 'border-black bg-black text-white shadow-lg' 
                          : 'border-gray-200 bg-white text-gray-900 hover:border-gray-400 hover:shadow-md'
                        }
                      `}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                      {selectedSize === size && (
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Add to Cart Section */}
            <div className="space-y-6 pt-4">
              <button
                className={`
                  relative w-full h-16 text-base font-medium tracking-widest transition-all duration-500 overflow-hidden
                  ${selectedSize 
                    ? 'bg-black text-white hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98]' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                  ${isAddingToCart ? 'bg-gray-800' : ''}
                  ${isAdded ? 'bg-green-600' : ''}
                `}
                onClick={handleAddToCart}
                disabled={!selectedSize || isAddingToCart}
              >
                <div className={`flex items-center justify-center space-x-3 transition-all duration-500 ${
                  isAddingToCart ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}>
                  {isAdded ? (
                    <>
                      <Check className="h-5 w-5" />
                      <span>ADDED TO CART</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5" />
                      <span>{selectedSize ? 'ADD TO CART' : 'SELECT SIZE'}</span>
                    </>
                  )}
                </div>
                
                {/* Loading animation */}
                {isAddingToCart && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </button>
              
              {/* Size guide hint */}
              {!selectedSize && (
                <p className="text-sm text-gray-500 text-center animate-pulse">
                  Choose your perfect fit above
                </p>
              )}
              
              {selectedSize && !isAddingToCart && !isAdded && (
                <p className="text-sm text-gray-600 text-center">
                  Size <span className="font-medium">{selectedSize}</span> selected
                </p>
              )}
            </div>
            
            {/* Additional Info */}
            <div className="pt-8 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 tracking-wide">SHIPPING</h4>
                  <p className="text-gray-600">Free worldwide shipping</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 tracking-wide">RETURNS</h4>
                  <p className="text-gray-600">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 