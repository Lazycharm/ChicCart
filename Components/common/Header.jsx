import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingBag, Heart, User, Menu, X, Mail
} from 'lucide-react';
import { useCart } from '@/components/ui/CartContext';
import { useWishlist } from '@/components/ui/WishlistContext';
import { useAuth } from '@/components/ui/AuthContext';
import { getCategories } from '@/services/categories';
import { useQuery } from '@tanstack/react-query';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount, setIsOpen } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories()
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = createPageUrl('Shop') + `?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* Main Header */}
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left Side */}
            <div className="flex items-center gap-4 flex-1 lg:flex-none">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className={`p-2 rounded-full transition-colors lg:hidden ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'}`}
              >
                <Menu className={`w-6 h-6 ${isScrolled ? 'text-black' : 'text-white'}`} />
              </button>
              <button 
                className={`p-2 rounded-full transition-colors hidden sm:block ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'}`}
              >
                <Mail className={`w-5 h-5 ${isScrolled ? 'text-black' : 'text-white'}`} />
              </button>
              
              {/* Logo - Centered on mobile, left on desktop */}
              <Link to={createPageUrl('Home')} className="absolute left-1/2 -translate-x-1/2 z-10 lg:relative lg:left-0 lg:translate-x-0">
                <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold tracking-widest transition-colors ${isScrolled ? 'text-black' : 'text-white'}`}>
                  LUXE
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation - Center */}
            <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
              <Link 
                to={createPageUrl('Home')}
                className={`text-sm font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-black' : 'text-white hover:text-white/80'}`}
              >
                Home
              </Link>
              <Link 
                to={createPageUrl('Shop')}
                className={`text-sm font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-black' : 'text-white hover:text-white/80'}`}
              >
                Shop
              </Link>
              <Link 
                to={createPageUrl('About')}
                className={`text-sm font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-black' : 'text-white hover:text-white/80'}`}
              >
                About
              </Link>
              <Link 
                to={createPageUrl('Contact')}
                className={`text-sm font-medium transition-colors ${isScrolled ? 'text-gray-700 hover:text-black' : 'text-white hover:text-white/80'}`}
              >
                Contact
              </Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button 
                onClick={() => setSearchOpen(true)}
                className={`p-2 rounded-full transition-colors ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'}`}
              >
                <Search className={`w-5 h-5 ${isScrolled ? 'text-black' : 'text-white'}`} />
              </button>

              {isAuthenticated ? (
                <button 
                  onClick={() => window.location.href = createPageUrl('Orders')}
                  className={`p-2 rounded-full transition-colors ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'}`}
                >
                  <User className={`w-5 h-5 ${isScrolled ? 'text-black' : 'text-white'}`} />
                </button>
              ) : (
                <Link
                  to={createPageUrl('Login')}
                  className={`p-2 rounded-full transition-colors ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'}`}
                >
                  <User className={`w-5 h-5 ${isScrolled ? 'text-black' : 'text-white'}`} />
                </Link>
              )}

              <Link 
                to={createPageUrl('Wishlist')}
                className={`p-2 rounded-full transition-colors relative ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'}`}
              >
                <Heart className={`w-5 h-5 ${isScrolled ? 'text-black' : 'text-white'}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <button 
                onClick={() => setIsOpen(true)}
                className={`p-2 rounded-full transition-colors relative ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'}`}
              >
                <ShoppingBag className={`w-5 h-5 ${isScrolled ? 'text-black' : 'text-white'}`} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fixed Category Navigation */}
      <nav className={`fixed top-16 lg:top-20 left-0 right-0 z-40 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ${
        isScrolled ? 'shadow-md' : ''
      }`}>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-8 px-4 h-12 min-w-max">
            <Link 
              to={createPageUrl('Shop')}
              className="text-white text-sm font-medium hover:text-white/80 transition-colors whitespace-nowrap"
            >
              All
            </Link>
            {categories.map(cat => (
              <Link 
                key={cat.id}
                to={createPageUrl('Shop') + `?category=${cat.slug}`}
                className="text-white text-sm font-medium hover:text-white/80 transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
            <Link 
              to={createPageUrl('Shop') + '?filter=new'}
              className="text-white text-sm font-medium hover:text-white/80 transition-colors whitespace-nowrap"
            >
              New
            </Link>
            <Link 
              to={createPageUrl('Shop') + '?filter=sale'}
              className="text-white text-sm font-medium hover:text-white/80 transition-colors whitespace-nowrap"
            >
              Sale
            </Link>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white w-full max-w-2xl mx-4 rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="flex items-center p-4">
                <Search className="w-6 h-6 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 text-lg outline-none"
                  autoFocus
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
                <h2 className="text-xl font-bold tracking-widest">LUXE</h2>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                <Link 
                  to={createPageUrl('Shop')}
                  className="block py-3 px-4 text-base font-medium hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All
                </Link>
                {categories.map(cat => (
                  <Link 
                    key={cat.id}
                    to={createPageUrl('Shop') + `?category=${cat.slug}`}
                    className="block py-3 px-4 text-base font-medium hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link 
                  to={createPageUrl('Shop') + '?filter=new'}
                  className="block py-3 px-4 text-base font-medium hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  New Arrivals
                </Link>
                <Link 
                  to={createPageUrl('Shop') + '?filter=sale'}
                  className="block py-3 px-4 text-base font-medium text-rose-500 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sale
                </Link>
                <div className="border-t pt-4 mt-4">
                  <Link 
                    to={createPageUrl('About')}
                    className="block py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link 
                    to={createPageUrl('Contact')}
                    className="block py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  {user && (
                    <Link 
                      to={createPageUrl('Orders')}
                      className="block py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                  )}
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}