import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Package, RotateCcw, Clock, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Returns() {
  const steps = [
    { step: 1, title: 'Initiate Return', description: 'Go to My Orders, select the item, and click "Return"' },
    { step: 2, title: 'Print Label', description: 'Receive a prepaid shipping label via email' },
    { step: 3, title: 'Pack & Ship', description: 'Pack the item securely and drop it off at any carrier location' },
    { step: 4, title: 'Get Refund', description: 'Receive your refund within 5-7 business days of receipt' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-black text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <RotateCcw className="w-8 h-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold mb-4"
          >
            Returns & Refunds
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Easy returns within 30 days - no questions asked
          </motion.p>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-center mb-12"
          >
            How Returns Work
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm text-center relative"
              >
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-rose-500">{item.step}</span>
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-300" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Policy Details */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Eligible */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Eligible for Return</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Items purchased within the last 30 days',
                  'Unworn items with original tags attached',
                  'Items in original packaging',
                  'Defective or damaged items (report within 48 hours)',
                  'Wrong item received',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Not Eligible */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold">Not Eligible for Return</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Items worn, washed, or altered',
                  'Items without original tags',
                  'Intimate apparel and swimwear',
                  'Final sale or clearance items',
                  'Gift cards',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Refund Info */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-8 lg:p-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <Clock className="w-8 h-8 text-rose-500" />
              <h2 className="text-2xl font-bold">Refund Timeline</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-xl">
                <p className="text-3xl font-bold text-rose-500">1-3</p>
                <p className="text-gray-600">days for us to receive your return</p>
              </div>
              <div className="bg-white p-4 rounded-xl">
                <p className="text-3xl font-bold text-rose-500">5-7</p>
                <p className="text-gray-600">business days to process refund</p>
              </div>
              <div className="bg-white p-4 rounded-xl">
                <p className="text-3xl font-bold text-rose-500">3-5</p>
                <p className="text-gray-600">days for bank to credit your account</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Package className="w-16 h-16 text-gray-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Ready to Start a Return?</h2>
          <p className="text-gray-400 mb-6">
            Log in to your account and go to My Orders to initiate your return.
          </p>
          <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200">
            <Link to={createPageUrl('Orders')}>Go to My Orders</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}