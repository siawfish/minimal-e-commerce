'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useTrendingProducts } from '@/hooks/useProducts';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { products: trendingProducts, loading, error } = useTrendingProducts(4);
  const router = useRouter();

  if (error) {
    console.error('Error loading trending products:', error);
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <HeroCarousel />

      {/* Trending Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            TRENDING NOW
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Discover our most popular pieces that define contemporary minimalism
          </p>
        </div>

        {/* Trending Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-200 animate-pulse rounded-lg aspect-square"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Failed to load trending products</p>
            <p className="text-gray-600">Please try again later</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {trendingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => router.push(`/shop/${product.id}`)}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link href="/shop">
            <Button variant="outline" size="lg" className="px-8 py-3 text-base">
              VIEW ALL PRODUCTS
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
