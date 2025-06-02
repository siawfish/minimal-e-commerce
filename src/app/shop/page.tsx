'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PRODUCTS_PER_PAGE = 8;

export default function Shop() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const { products, loading, error } = useProducts();
  const router = useRouter();
  
  // Get available categories from products
  const availableCategories = useMemo(() => {
    const categories = Array.from(new Set(products.map(product => product.category)));
    return categories.sort();
  }, [products]);
  
  // Set initial filter based on URL parameter
  useEffect(() => {
    const category = searchParams.get('category');
    if (category && (category === 'all' || availableCategories.includes(category))) {
      setFilter(category);
    }
  }, [searchParams, availableCategories]);

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    return filter === 'all' 
      ? products 
      : products.filter(product => product.category === filter);
  }, [filter, products]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of products section
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Filters and Products */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        {/* Filter Section */}
        {!loading && !error && (
          <ProductFilters
            filter={filter}
            onFilterChange={handleFilterChange}
            totalProducts={filteredProducts.length}
            currentRange={{
              start: startIndex + 1,
              end: Math.min(endIndex, filteredProducts.length)
            }}
            products={products}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-8">
            <div className="h-16 bg-gray-200 animate-pulse rounded"></div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-200 animate-pulse rounded-lg aspect-square"
                />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Failed to load products</p>
            <p className="text-gray-600">Please try again later</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => router.push(`/shop/${product.id}`)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {/* No products message */}
        {!loading && !error && currentProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
} 