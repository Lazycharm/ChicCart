import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';

export default function ProductCarousel({ 
  title, 
  subtitle, 
  products = [], 
  viewAllLink = '/Shop',
  bgColor = 'bg-white' 
}) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (products.length === 0) return null;

  return (
    <section className={`py-16 lg:py-24 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {subtitle && (
              <span className="text-rose-500 font-medium text-sm tracking-wider">{subtitle}</span>
            )}
            <h2 className="text-3xl lg:text-4xl font-bold mt-1">{title}</h2>
          </motion.div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-2 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <Button variant="outline" asChild className="hidden lg:flex">
              <Link to={createPageUrl('Shop')}>
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Products Carousel */}
        <div 
          ref={scrollRef}
          className="flex gap-4 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="flex-none w-[260px] lg:w-[300px] snap-start"
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center lg:hidden">
          <Button asChild>
            <Link to={createPageUrl('Shop')}>
              View All Products <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}