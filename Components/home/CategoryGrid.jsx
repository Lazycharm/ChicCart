import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const defaultCategories = [
  { name: 'Women', slug: 'women', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600' },
  { name: 'Men', slug: 'men', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600' },
  { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600' },
  { name: 'Shoes', slug: 'shoes', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600' },
];

export default function CategoryGrid({ categories = [] }) {
  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="py-16 lg:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-rose-500 font-medium text-sm tracking-wider">BROWSE BY</span>
          <h2 className="text-3xl lg:text-4xl font-bold mt-2">Shop by Category</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {displayCategories.slice(0, 4).map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={createPageUrl('Shop') + `?category=${category.slug}`}
                className="group relative block aspect-[3/4] rounded-2xl overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white text-xl lg:text-2xl font-bold mb-2">{category.name}</h3>
                  <span className="inline-flex items-center gap-2 text-white/80 text-sm group-hover:text-white transition-colors">
                    Shop Now 
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}