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

// Map database categories to display format
const mapCategory = (cat) => ({
  name: cat.name,
  slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
  image: cat.image || defaultCategories.find(d => d.name.toLowerCase() === cat.name.toLowerCase())?.image || defaultCategories[0].image
});

export default function CategoryGrid({ categories = [] }) {
  const displayCategories = categories.length > 0 
    ? categories.map(mapCategory).slice(0, 4)
    : defaultCategories;

  return (
    <section className="py-12 lg:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-rose-500 font-semibold text-xs tracking-wider uppercase">BROWSE BY</span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2">Shop by Category</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
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
                className="group relative block aspect-[4/5] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 z-10">
                  <h3 className="text-white text-lg lg:text-xl font-bold mb-2">{category.name}</h3>
                  <span className="inline-flex items-center gap-1.5 text-white text-xs font-medium group-hover:text-white transition-colors">
                    Shop Now 
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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