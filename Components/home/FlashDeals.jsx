import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';

export default function FlashDeals({ products = [] }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-rose-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="p-2.5 bg-rose-500 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Flash Deals</h2>
              <p className="text-sm text-gray-600">Limited time offers - Don't miss out!</p>
            </div>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <span className="text-gray-700 font-semibold text-sm whitespace-nowrap">Ends in:</span>
            <div className="flex gap-1.5 sm:gap-2 items-center">
              {[
                { value: timeLeft.hours, label: 'HRS' },
                { value: timeLeft.minutes, label: 'MIN' },
                { value: timeLeft.seconds, label: 'SEC' }
              ].map((item, i) => (
                <React.Fragment key={item.label}>
                  <div className="bg-black text-white px-3 sm:px-4 py-2 rounded-md text-center min-w-[55px] sm:min-w-[60px] shadow-sm">
                    <div className="text-lg sm:text-xl font-bold leading-tight">{String(item.value).padStart(2, '0')}</div>
                    <div className="text-[9px] sm:text-[10px] text-gray-400 uppercase mt-0.5">{item.label}</div>
                  </div>
                  {i < 2 && <span className="text-lg sm:text-xl font-bold text-gray-800 self-center">:</span>}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {products.slice(0, 4).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No flash deals available at the moment. Check back soon!</p>
          </div>
        )}

        {/* View All Button */}
        <div className="mt-12 lg:mt-16 text-center">
          <Link to={createPageUrl('Shop') + '?filter=sale'}>
            <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-md px-6 py-2.5 text-sm font-medium">
              View All Deals <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}