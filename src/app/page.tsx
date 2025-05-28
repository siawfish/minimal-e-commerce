'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { useRouter } from 'next/navigation';

export default function Home() {
  // Show only first 4 products as trending items
  const trendingProducts = products.slice(0, 4);
  const router = useRouter();

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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trendingProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => router.push(`/shop/${product.id}`)}
            />
          ))}
        </div>

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
