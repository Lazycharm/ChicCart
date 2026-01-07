import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/services/categories';

export default function CategoryNav() {
  const location = useLocation();
  const scrollRef = React.useRef(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories('display_order')
  });

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  React.useEffect(() => {
    checkScroll();
    const element = scrollRef.current;
    if (element) {
      element.addEventListener('scroll', checkScroll);
      return () => element.removeEventListener('scroll', checkScroll);
    }
  }, [categories]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.search.includes(path);
  };

  return (
    <section className="fixed top-16 lg:top-20 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-40">
      <div className="max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-r from-white via-white/90 to-transparent flex items-center justify-start pl-3 group"
            aria-label="Scroll left"
          >
            <div className="p-2 bg-white rounded-full shadow-md border border-gray-200 group-hover:shadow-lg group-hover:scale-110 transition-all">
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </div>
          </button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-l from-white via-white/90 to-transparent flex items-center justify-end pr-3 group"
            aria-label="Scroll right"
          >
            <div className="p-2 bg-white rounded-full shadow-md border border-gray-200 group-hover:shadow-lg group-hover:scale-110 transition-all">
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </div>
          </button>
        )}

        {/* Navigation Links */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3 lg:gap-4 overflow-x-auto scrollbar-hide py-4 lg:py-5 scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <Link
            to={createPageUrl('Shop')}
            className={`flex-shrink-0 px-5 lg:px-7 py-2.5 lg:py-3 rounded-full text-sm lg:text-base font-semibold transition-all duration-200 whitespace-nowrap ${
              isActive('/shop') && !location.search
                ? 'bg-black text-white shadow-md hover:bg-gray-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={createPageUrl('Shop') + `?category=${cat.slug}`}
              className={`flex-shrink-0 px-5 lg:px-7 py-2.5 lg:py-3 rounded-full text-sm lg:text-base font-semibold transition-all duration-200 whitespace-nowrap ${
                isActive(`category=${cat.slug}`)
                  ? 'bg-black text-white shadow-md hover:bg-gray-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
              }`}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            to={createPageUrl('Shop') + '?filter=new'}
            className={`flex-shrink-0 px-5 lg:px-7 py-2.5 lg:py-3 rounded-full text-sm lg:text-base font-semibold transition-all duration-200 whitespace-nowrap ${
              isActive('filter=new')
                ? 'bg-black text-white shadow-md hover:bg-gray-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
            }`}
          >
            New
          </Link>
          <Link
            to={createPageUrl('Shop') + '?filter=sale'}
            className={`flex-shrink-0 px-5 lg:px-7 py-2.5 lg:py-3 rounded-full text-sm lg:text-base font-semibold transition-all duration-200 whitespace-nowrap ${
              isActive('filter=sale')
                ? 'bg-rose-500 text-white shadow-md hover:bg-rose-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
            }`}
          >
            Sale
          </Link>
        </div>
      </div>
    </section>
  );
}

