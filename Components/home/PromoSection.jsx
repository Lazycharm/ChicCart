import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PromoSection() {
  return (
    <section className="py-16 lg:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* First Promo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden group"
          >
            <img
              src="https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=800"
              alt="Summer Collection"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
              <span className="inline-block px-4 py-2 bg-rose-500 text-white text-sm font-medium rounded-full mb-4">
                NEW COLLECTION
              </span>
              <h3 className="text-white text-3xl lg:text-4xl font-bold mb-4">
                Summer Essentials
              </h3>
              <p className="text-white/80 mb-6 max-w-sm">
                Light, breathable fabrics perfect for sunny days
              </p>
              <Button asChild variant="outline" className="bg-white text-black hover:bg-gray-100 border-0">
                <Link to={createPageUrl('Shop')}>
                  Explore Collection <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Second Promo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden group"
          >
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800"
              alt="Accessories"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
              <span className="inline-block px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-full mb-4">
                UP TO 50% OFF
              </span>
              <h3 className="text-white text-3xl lg:text-4xl font-bold mb-4">
                Accessories Sale
              </h3>
              <p className="text-white/80 mb-6 max-w-sm">
                Complete your look with our stunning accessories
              </p>
              <Button asChild variant="outline" className="bg-white text-black hover:bg-gray-100 border-0">
                <Link to={createPageUrl('Shop') + '?category=accessories'}>
                  Shop Now <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}