import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPageBySlug, getPages } from '@/services/pages';
import { getSettings } from '@/services/settings';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const { data: page } = useQuery({
    queryKey: ['page', 'contact'],
    queryFn: () => getPageBySlug('contact'),
    staleTime: 5 * 60 * 1000,
  });

  const { data: settings } = useQuery({
    queryKey: ['store-settings'],
    queryFn: () => getSettings(),
    staleTime: 5 * 60 * 1000,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call - in production, this would send to your backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    { 
      icon: Mail, 
      label: 'Email', 
      value: settings?.store_email || 'support@luxe.com', 
      href: `mailto:${settings?.store_email || 'support@luxe.com'}` 
    },
    { 
      icon: Phone, 
      label: 'Phone', 
      value: settings?.store_phone || '+1 (555) 123-4567', 
      href: `tel:${settings?.store_phone?.replace(/\D/g, '') || '15551234567'}` 
    },
    { 
      icon: MapPin, 
      label: 'Address', 
      value: settings?.store_address 
        ? `${settings.store_address}, ${settings.store_city || ''}, ${settings.store_state || ''} ${settings.store_zip || ''}`
        : '123 Fashion Street, NY 10001', 
      href: '#' 
    },
    { 
      icon: Clock, 
      label: 'Hours', 
      value: 'Mon-Fri: 9AM-6PM EST', 
      href: '#' 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-black text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold mb-4"
          >
            {page?.title || 'Get in Touch'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            {page?.excerpt || "We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
          </motion.p>
        </div>
      </section>

      {/* Page Content (if exists) */}
      {page?.content && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          </div>
        </section>
      )}

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
                <p className="text-gray-600">Reach out to us through any of these channels</p>
              </div>

              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-3 bg-rose-100 rounded-lg">
                    <item.icon className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-gray-600">{item.value}</p>
                  </div>
                </motion.a>
              ))}

              {/* Social Links */}
              {(settings?.social_facebook || settings?.social_instagram || settings?.social_twitter) && (
                <div className="pt-6">
                  <p className="font-medium mb-4">Follow Us</p>
                  <div className="flex gap-3">
                    {settings.social_facebook && (
                      <a
                        href={settings.social_facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white rounded-full text-sm font-medium hover:bg-black hover:text-white transition-colors"
                      >
                        Facebook
                      </a>
                    )}
                    {settings.social_instagram && (
                      <a
                        href={settings.social_instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white rounded-full text-sm font-medium hover:bg-black hover:text-white transition-colors"
                      >
                        Instagram
                      </a>
                    )}
                    {settings.social_twitter && (
                      <a
                        href={settings.social_twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white rounded-full text-sm font-medium hover:bg-black hover:text-white transition-colors"
                      >
                        Twitter
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-black hover:bg-gray-800"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-16 px-4 bg-rose-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Looking for Quick Answers?</h2>
          <p className="text-gray-600 mb-6">
            Check out our FAQ section for instant answers to common questions.
          </p>
          <Button variant="outline" asChild>
            <a href={createPageUrl('FAQ')}>View FAQ</a>
          </Button>
        </div>
      </section>
    </div>
  );
}
