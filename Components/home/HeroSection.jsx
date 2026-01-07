import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
<<<<<<< HEAD

// Import slider images
import slider1 from '/src/sliders/slider (1).jpg';
import slider2 from '/src/sliders/slider (2).jpg';
import slider3 from '/src/sliders/slider (3).jpg';

const defaultSlides = [
  {
    title: "Summer Collection",
    subtitle: "UP TO 40% OFF",
    description: "Light fabrics, bold colors, and effortless elegance",
    image: slider1,
    cta_text: "Shop Now",
    link: "/Shop"
  },
  {
    title: "New Season Arrivals",
    subtitle: "UP TO 40% OFF",
    description: "Discover the latest trends in fashion with our exclusive collection",
    image: slider2,
=======
import { Button } from '@/components/ui/button';

const defaultSlides = [
  {
    title: "New Season Arrivals",
    subtitle: "UP TO 40% OFF",
    description: "Discover the latest trends in fashion with our exclusive collection",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&q=80",
>>>>>>> 9901c3343fbf53127d38adce4f907328a8221168
    cta_text: "Shop Now",
    link: "/Shop?filter=new"
  },
  {
<<<<<<< HEAD
    title: "Flash Sale",
    subtitle: "LIMITED TIME",
    description: "Get up to 60% off on selected items",
    image: slider3,
    cta_text: "Shop Now",
=======
    title: "Summer Collection",
    subtitle: "FRESH STYLES",
    description: "Light fabrics, bold colors, and effortless elegance",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80",
    cta_text: "Explore",
    link: "/Shop"
  },
  {
    title: "Flash Sale",
    subtitle: "LIMITED TIME",
    description: "Get up to 60% off on selected items",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80",
    cta_text: "Shop Sale",
>>>>>>> 9901c3343fbf53127d38adce4f907328a8221168
    link: "/Shop?filter=sale"
  }
];

export default function HeroSection({ banners = [] }) {
  const slides = banners.length > 0 
    ? banners.map(b => ({
        title: b.title,
        subtitle: b.subtitle,
        description: b.description || '',
        image: b.image,
        cta_text: b.cta_text || 'Shop Now',
        link: b.link || '/Shop'
      }))
    : defaultSlides;

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  return (
<<<<<<< HEAD
    <section className="relative h-[60vh] min-h-[500px] lg:h-[70vh] lg:min-h-[600px] overflow-hidden bg-gray-900 mt-28">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
=======
    <section className="relative h-[70vh] lg:h-[85vh] overflow-hidden bg-gray-900 mt-28">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7 }}
>>>>>>> 9901c3343fbf53127d38adce4f907328a8221168
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
<<<<<<< HEAD
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="max-w-xl text-white"
          >
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
=======
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl text-white"
          >
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
>>>>>>> 9901c3343fbf53127d38adce4f907328a8221168
              className="inline-block px-4 py-2 bg-rose-500 text-sm font-bold rounded-full mb-4"
            >
              {slides[currentSlide].subtitle}
            </motion.span>
            
            <motion.h1
<<<<<<< HEAD
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight"
=======
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
>>>>>>> 9901c3343fbf53127d38adce4f907328a8221168
            >
              {slides[currentSlide].title}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-base md:text-lg text-gray-200 mb-6 max-w-lg"
=======
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-gray-200 mb-8"
>>>>>>> 9901c3343fbf53127d38adce4f907328a8221168
            >
              {slides[currentSlide].description}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
<<<<<<< HEAD
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link to={slides[currentSlide].link || createPageUrl('Shop')}>
                <button
                  className="inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 text-base font-semibold px-6 py-3 rounded-full group shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  {slides[currentSlide].cta_text}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
=======
              transition={{ delay: 0.6 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-6 rounded-full group"
              >
                <Link to={createPageUrl('Shop')}>
                  {slides[currentSlide].cta_text}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
>>>>>>> 9901c3343fbf53127d38adce4f907328a8221168
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-1/2 left-4 right-4 translate-y-1/2 flex justify-between pointer-events-none">
        <button
          onClick={prevSlide}
          className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors pointer-events-auto"
<<<<<<< HEAD
          aria-label="Previous slide"
=======
>>>>>>> 9901c3343fbf53127d38adce4f907328a8221168
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors pointer-events-auto"
<<<<<<< HEAD
          aria-label="Next slide"
=======
>>>>>>> 9901c3343fbf53127d38adce4f907328a8221168
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
<<<<<<< HEAD
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-8' 
                : 'bg-white/40 hover:bg-white/60 w-3'
            } h-3`}
            aria-label={`Go to slide ${index + 1}`}
=======
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-8' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
>>>>>>> 9901c3343fbf53127d38adce4f907328a8221168
          />
        ))}
      </div>
    </section>
  );
}