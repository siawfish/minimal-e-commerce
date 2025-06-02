'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useCategories } from '@/hooks/useProducts';
import { Menu, ShoppingBag } from 'lucide-react';
import Logo from './Logo';

export default function Header() {
  const { state } = useCart();
  const { categories, loading: categoriesLoading } = useCategories();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  // Limit categories to first 3
  const displayCategories = categories.slice(0, 3);

  // Helper function to determine if a link is active
  const isActiveLink = (href: string, category?: string) => {
    if (href === '/shop') {
      if (category) {
        return pathname === '/shop' && searchParams.get('category') === category;
      }
      return pathname === '/shop' && !searchParams.get('category');
    }
    return pathname === href;
  };

  // Helper function to format category names for display
  const formatCategoryName = (category: string) => {
    return category.toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[60px] md:h-[100px] items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/shop" 
              className={`relative text-sm font-medium transition-all duration-300 group ${
                isActiveLink('/shop') 
                  ? 'text-black' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <span className="relative z-10">ALL PRODUCTS</span>
              {isActiveLink('/shop') ? (
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-black to-transparent animate-in slide-in-from-bottom-1 duration-300"></div>
              ) : (
                <div className="absolute -bottom-2 left-1/2 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full group-hover:left-0"></div>
              )}
            </Link>
            
            {/* Dynamic category links - limited to 3 */}
            {!categoriesLoading && displayCategories.map((category) => (
              <Link 
                key={category}
                href={`/shop?category=${category}`} 
                className={`relative text-sm font-medium transition-all duration-300 group ${
                  isActiveLink('/shop', category) 
                    ? 'text-black' 
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <span className="relative z-10">{formatCategoryName(category)}</span>
                {isActiveLink('/shop', category) ? (
                  <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-black to-transparent animate-in slide-in-from-bottom-1 duration-300"></div>
                ) : (
                  <div className="absolute -bottom-2 left-1/2 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full group-hover:left-0"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Cart */}
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge 
                    variant="default" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="flex flex-col space-y-6 mt-8">
                  <Link 
                    href="/shop" 
                    className={`relative text-lg font-medium transition-all duration-300 group ${
                      isActiveLink('/shop') 
                        ? 'text-black' 
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    <span className="relative z-10 block py-2">ALL PRODUCTS</span>
                    {isActiveLink('/shop') ? (
                      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-black via-gray-600 to-black animate-in slide-in-from-left-1 duration-300"></div>
                    ) : (
                      <div className="absolute left-0 top-1/2 w-1 h-0 bg-black transition-all duration-300 group-hover:h-full group-hover:top-0"></div>
                    )}
                    <div className={`absolute left-4 top-0 w-full h-full bg-gradient-to-r from-gray-50/50 to-transparent transition-all duration-300 ${
                      isActiveLink('/shop') ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                    }`}></div>
                  </Link>
                  
                  {/* Dynamic category links for mobile - limited to 3 */}
                  {!categoriesLoading && displayCategories.map((category) => (
                    <Link 
                      key={category}
                      href={`/shop?category=${category}`} 
                      className={`relative text-lg font-medium transition-all duration-300 group ${
                        isActiveLink('/shop', category) 
                          ? 'text-black' 
                          : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      <span className="relative z-10 block py-2">{formatCategoryName(category)}</span>
                      {isActiveLink('/shop', category) ? (
                        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-black via-gray-600 to-black animate-in slide-in-from-left-1 duration-300"></div>
                      ) : (
                        <div className="absolute left-0 top-1/2 w-1 h-0 bg-black transition-all duration-300 group-hover:h-full group-hover:top-0"></div>
                      )}
                      <div className={`absolute left-4 top-0 w-full h-full bg-gradient-to-r from-gray-50/50 to-transparent transition-all duration-300 ${
                        isActiveLink('/shop', category) ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                      }`}></div>
                    </Link>
                  ))}
                  
                  {/* Cart link in mobile menu */}
                  <Link 
                    href="/cart" 
                    className={`relative text-lg font-medium transition-all duration-300 group ${
                      pathname === '/cart' 
                        ? 'text-black' 
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    <span className="relative z-10 block py-2 flex items-center space-x-2">
                      <ShoppingBag className="h-5 w-5" />
                      <span>CART ({totalItems})</span>
                    </span>
                    {pathname === '/cart' ? (
                      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-black via-gray-600 to-black animate-in slide-in-from-left-1 duration-300"></div>
                    ) : (
                      <div className="absolute left-0 top-1/2 w-1 h-0 bg-black transition-all duration-300 group-hover:h-full group-hover:top-0"></div>
                    )}
                    <div className={`absolute left-4 top-0 w-full h-full bg-gradient-to-r from-gray-50/50 to-transparent transition-all duration-300 ${
                      pathname === '/cart' ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                    }`}></div>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
} 