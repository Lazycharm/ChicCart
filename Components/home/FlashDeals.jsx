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

  if (products.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-rose-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <div className="p-3 bg-rose-500 rounded-2xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold">Flash Deals</h2>
              <p className="text-gray-600">Limited time offers - Don't miss out!</p>
            </div>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <span className="text-gray-600 font-medium">Ends in:</span>
            <div className="flex gap-2">
              {[
                { value: timeLeft.hours, label: 'HRS' },
                { value: timeLeft.minutes, label: 'MIN' },
                { value: timeLeft.seconds, label: 'SEC' }
              ].map((item, i) => (
                <React.Fragment key={item.label}>
                  <div className="bg-black text-white px-4 py-3 rounded-xl text-center min-w-[60px]">
                    <div className="text-2xl font-bold">{String(item.value).padStart(2, '0')}</div>
                    <div className="text-xs text-gray-400">{item.label}</div>
                  </div>
                  {i < 2 && <span className="text-2xl font-bold self-center">:</span>}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.slice(0, 4).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-10 text-center">
          <Button size="lg" className="bg-rose-500 hover:bg-rose-600" asChild>
            <Link to={createPageUrl('Shop') + '?filter=sale'}>
              View All Deals <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}