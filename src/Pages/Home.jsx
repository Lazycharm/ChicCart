import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { getProducts } from '@/services/products';
import { getCategories } from '@/services/categories';
import { getBanners } from '@/services/banners';
import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductCarousel from '@/components/home/ProductCarousel';
import FlashDeals from '@/components/home/FlashDeals';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import PromoSection from '@/components/home/PromoSection';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(50, '-created_date')
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories('display_order')
  });

  const { data: banners = [] } = useQuery({
    queryKey: ['banners'],
    queryFn: () => getBanners({ is_active: true, position: 'hero' }, 'display_order')
  });

  const featuredProducts = products.filter(p => p.featured);
  const newArrivals = products.filter(p => p.is_new);
  const flashDeals = products.filter(p => p.is_flash_deal);
  const bestSellers = products.filter(p => (p.reviews_count || 0) > 0).sort((a, b) => (b.rating || 0) - (a.rating || 0));

  if (productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <HeroSection banners={banners} />
      
      {/* Shop by Category */}
      <CategoryGrid categories={categories} />

      {/* Flash Deals */}
      <FlashDeals products={flashDeals.length > 0 ? flashDeals.slice(0, 4) : products.slice(0, 4)} />

      {/* New Arrivals */}
      <ProductCarousel 
        title="New Arrivals" 
        subtitle="JUST IN"
        products={newArrivals.length > 0 ? newArrivals.slice(0, 8) : products.slice(0, 8)}
        viewAllLink={createPageUrl('Shop') + '?filter=new'}
      />

      {/* Promotional Banners */}
      <PromoSection />

      {/* Best Sellers */}
      <ProductCarousel 
        title="Best Sellers" 
        subtitle="TOP RATED"
        products={bestSellers.length > 0 ? bestSellers.slice(0, 8) : products.slice(0, 8)}
        bgColor="bg-gray-50"
        viewAllLink={createPageUrl('Shop') + '?sort=rating'}
      />

      {/* Featured Products */}
      <ProductCarousel 
        title="Featured Products" 
        subtitle="HAND PICKED"
        products={featuredProducts.length > 0 ? featuredProducts.slice(0, 8) : products.slice(0, 8)}
        viewAllLink={createPageUrl('Shop') + '?filter=featured'}
      />

      {/* Testimonials */}
      <TestimonialsSection />
    </div>
  );
}