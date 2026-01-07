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
      const scrollAmount = direction === 'left' ? -240 : 240;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Show section even with no products for better UX
  if (products.length === 0) {
    return (
      <section className={`py-20 lg:py-28 ${bgColor}`}>
        <div className="max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products available at the moment. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 lg:py-16 ${bgColor}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            {subtitle && (
              <span className="inline-block text-rose-500 font-semibold text-xs tracking-wider uppercase mb-1.5">
                {subtitle}
              </span>
            )}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
              {title}
            </h2>
          </motion.div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-3 border-2 border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-3 border-2 border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            <Link to={viewAllLink || createPageUrl('Shop')} className="hidden lg:flex">
              <Button variant="outline" className="border-2 font-semibold px-6 py-3 hover:bg-gray-50">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Products Carousel */}
        <div 
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {products.map((product, index) => (
            <motion.div 
              key={product.id} 
              className="flex-none w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] snap-start"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} index={index} />
            </motion.div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-6 text-center lg:hidden">
          <Link to={viewAllLink || createPageUrl('Shop')}>
            <Button className="font-medium px-6 py-2 text-sm">
              View All Products <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}