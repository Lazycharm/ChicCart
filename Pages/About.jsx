import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Leaf, Users, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

export default function About() {
  const values = [
    { icon: Heart, title: 'Customer First', description: 'We prioritize your satisfaction above all else, ensuring every interaction exceeds expectations.' },
    { icon: Leaf, title: 'Sustainability', description: 'Committed to eco-friendly practices and sustainable fashion that cares for our planet.' },
    { icon: Users, title: 'Inclusivity', description: 'Fashion for everyone, celebrating diversity in all sizes, styles, and preferences.' },
    { icon: Award, title: 'Quality', description: 'Premium materials and craftsmanship in every piece we create and curate.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600)' }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center text-white px-4"
        >
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">Our Story</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Redefining fashion with style, sustainability, and soul since 2020
          </p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <span className="text-rose-500 font-medium">WHO WE ARE</span>
              <h2 className="text-3xl font-bold mt-2 mb-6">More Than Just a Fashion Brand</h2>
              <p className="text-gray-600 mb-4">
                LUXE was born from a simple belief: everyone deserves access to premium fashion that makes them feel confident and beautiful. What started as a small online boutique has grown into a global community of fashion enthusiasts.
              </p>
              <p className="text-gray-600 mb-4">
                We work directly with designers and manufacturers who share our commitment to quality and ethical practices. Every piece in our collection is carefully curated to bring you the latest trends without compromising on craftsmanship.
              </p>
              <p className="text-gray-600">
                Our mission is to make luxury fashion accessible, sustainable, and inclusive. We believe that great style should be within everyone's reach.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"
                alt="Our team"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-rose-500 text-white p-6 rounded-xl shadow-lg">
                <p className="text-3xl font-bold">4+</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-rose-500 font-medium">OUR VALUES</span>
            <h2 className="text-3xl font-bold mt-2">What Drives Us</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-rose-500" />
                </div>
                <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-black text-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '200+', label: 'Products' },
              { value: '25+', label: 'Countries' },
              { value: '4.9', label: 'Average Rating' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-4xl lg:text-5xl font-bold text-rose-500">{stat.value}</p>
                <p className="text-gray-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Style?</h2>
            <p className="text-gray-600 mb-8">
              Discover our latest collections and find pieces that speak to you.
            </p>
            <Button size="lg" asChild className="bg-black hover:bg-gray-800">
              <Link to={createPageUrl('Shop')}>
                Shop Now <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}