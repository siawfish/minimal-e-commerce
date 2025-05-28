'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, Minus, Plus, X, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CartPage() {
  const { state, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Checkout functionality would be implemented here');
    setIsCheckingOut(false);
  };

  const handleRemoveItem = async (productId: string, size: string) => {
    const itemKey = `${productId}-${size}`;
    setRemovingItems(prev => new Set(prev).add(itemKey));
    
    setTimeout(() => {
      removeFromCart(productId, size);
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl" style={{ minHeight: 'calc(100vh - 120px)' }}>
        {/* Simple Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Cart</h1>
            <p className="text-sm text-gray-500">{totalItems} items</p>
          </div>
        </div>

        {state.items.length === 0 ? (
          /* Simple Empty State */
          <div className="text-center py-16">
            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some items to get started</p>
            <Button 
              onClick={() => router.push('/shop')}
              className="bg-black text-white hover:bg-gray-800"
            >
              Shop Now
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Simple Order Summary - Mobile First */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-4">Summary</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${state.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${(state.total * 0.08).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${(state.total * 1.08).toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-black text-white hover:bg-gray-800"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? 'Processing...' : 'Checkout'}
                </Button>
              </div>
              
              {/* Shipping Information */}
              <div className="border border-gray-200 p-6 mt-4">
                <h3 className="font-medium text-gray-900 mb-4">Shipping Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Standard Delivery</p>
                      <p className="text-xs text-gray-500">5-7 business days</p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Express Delivery</p>
                      <p className="text-xs text-gray-500">2-3 business days</p>
                    </div>
                    <span className="text-sm text-gray-900">$9.99</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Next Day Delivery</p>
                      <p className="text-xs text-gray-500">Order by 2PM</p>
                    </div>
                    <span className="text-sm text-gray-900">$19.99</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Free shipping on orders over $50. Delivery times may vary during peak seasons.
                  </p>
                </div>
              </div>
            </div>

            {/* Cart Items */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.items.map((item) => {
                  const itemKey = `${item.product.id}-${item.size}`;
                  const isRemoving = removingItems.has(itemKey);
                  
                  return (
                    <div 
                      key={itemKey} 
                      className={`bg-white border border-gray-200 p-4 transition-opacity ${
                        isRemoving ? 'opacity-50' : ''
                      }`}
                    >
                      {/* Product Image */}
                      <div className="relative mb-4">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-48 object-cover bg-gray-100"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product.id, item.size)}
                          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 bg-white/80 backdrop-blur-sm h-8 w-8 p-0"
                          disabled={isRemoving}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Product Details */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                            {item.product.name}
                          </h3>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Size: {item.size}</span>
                            <span className="font-semibold text-gray-900">
                              ${item.product.price}
                            </span>
                          </div>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Qty:</span>
                            <div className="flex items-center border border-gray-300">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                                className="h-7 w-7 p-0 hover:bg-gray-100"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-2 py-1 text-sm font-medium">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                                className="h-7 w-7 p-0 hover:bg-gray-100"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <span className="text-lg font-bold text-gray-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Clear Cart */}
              {state.items.length > 0 && (
                <div className="pt-6 border-t mt-6">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Clear Cart
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
} 