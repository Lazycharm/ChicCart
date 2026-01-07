import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Search, Package, CreditCard, Truck, RotateCcw, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const categories = [
    {
      title: 'Orders & Shipping',
      icon: Truck,
      questions: [
        { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days delivery. International orders may take 10-14 business days.' },
        { q: 'How can I track my order?', a: 'Once your order ships, you\'ll receive an email with tracking information. You can also track your order in the "My Orders" section of your account.' },
        { q: 'Do you offer free shipping?', a: 'Yes! We offer free standard shipping on all orders over $50. Orders under $50 have a flat shipping rate of $9.99.' },
        { q: 'Can I change my shipping address after ordering?', a: 'If your order hasn\'t shipped yet, please contact us immediately and we\'ll try to update the address. Once shipped, address changes aren\'t possible.' },
      ]
    },
    {
      title: 'Returns & Refunds',
      icon: RotateCcw,
      questions: [
        { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery for unworn items with tags attached. Items must be in original condition.' },
        { q: 'How do I start a return?', a: 'Go to "My Orders" in your account, select the order, and click "Return Item." You\'ll receive a prepaid shipping label via email.' },
        { q: 'How long do refunds take?', a: 'Refunds are processed within 5-7 business days after we receive your return. The credit may take an additional 3-5 days to appear on your statement.' },
        { q: 'Can I exchange an item?', a: 'We don\'t offer direct exchanges. Please return the item for a refund and place a new order for the desired item.' },
      ]
    },
    {
      title: 'Payment',
      icon: CreditCard,
      questions: [
        { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Cash on Delivery in select locations.' },
        { q: 'Is my payment information secure?', a: 'Absolutely. We use industry-standard SSL encryption and never store your full card details. All payments are processed through secure payment gateways.' },
        { q: 'Can I use multiple payment methods?', a: 'Currently, we only support one payment method per order. Gift cards can be combined with another payment method.' },
        { q: 'Do you offer payment plans?', a: 'We partner with Klarna and Afterpay to offer buy-now-pay-later options at checkout for eligible orders.' },
      ]
    },
    {
      title: 'Products',
      icon: Package,
      questions: [
        { q: 'How do I find my size?', a: 'Each product page has a "Size Guide" link that provides detailed measurements. If you\'re between sizes, we recommend sizing up.' },
        { q: 'Are product colors accurate?', a: 'We strive to display colors as accurately as possible. However, colors may vary slightly due to monitor settings and lighting.' },
        { q: 'How do I care for my items?', a: 'Care instructions are included on the product tags and in the product description. Generally, we recommend washing in cold water and air drying.' },
        { q: 'Will items be restocked?', a: 'Popular items are often restocked. Sign up for restock notifications on the product page to be alerted when it\'s available.' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-black text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold mb-4"
          >
            How can we help?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 mb-8"
          >
            Find answers to frequently asked questions
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Search for answers..."
              className="pl-12 h-14 text-lg bg-white text-black"
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {categories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.1 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <category.icon className="w-6 h-6 text-rose-500" />
                </div>
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>

              <Accordion type="single" collapsible className="bg-white rounded-2xl shadow-sm">
                {category.questions.map((item, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`${catIndex}-${index}`}
                    className="border-b last:border-b-0"
                  >
                    <AccordionTrigger className="px-6 py-4 text-left font-medium hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-gray-600">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <Button asChild className="bg-black hover:bg-gray-800">
            <Link to={createPageUrl('Contact')}>Contact Support</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}