import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingBag, Heart, User, Menu, X, Mail, ChevronDown
} from 'lucide-react';
import { useCart } from '@/components/ui/CartContext';
import { useWishlist } from '@/components/ui/WishlistContext';
import { useAuth } from '@/components/ui/AuthContext';
import { getCategories } from '@/services/categories';
import { useQuery } from '@tanstack/react-query';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
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

  // Close desktop menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (desktopMenuOpen && !event.target.closest('.desktop-menu-container')) {
        setDesktopMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [desktopMenuOpen]);

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
            {/* Left: Logo */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className={`p-2 rounded-full transition-colors lg:hidden ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'}`}
              >
                <Menu className={`w-6 h-6 ${isScrolled ? 'text-black' : 'text-white'}`} />
              </button>
              
              <Link to={createPageUrl('Home')} className="flex-shrink-0">
                <h1 className={`text-2xl md:text-3xl lg:text-4xl font-bold tracking-widest transition-colors ${isScrolled ? 'text-black' : 'text-white'}`}>
                  LUXE
                </h1>
              </Link>
            </div>

            {/* Center: Category Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center px-4">
              <Link 
                to={createPageUrl('Shop')}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${isScrolled ? 'text-gray-700 hover:text-black' : 'text-white hover:text-white/80'}`}
              >
                All
              </Link>
              {categories.map(cat => (
                <Link 
                  key={cat.id}
                  to={createPageUrl('Shop') + `?category=${cat.slug}`}
                  className={`text-sm font-medium transition-colors whitespace-nowrap ${isScrolled ? 'text-gray-700 hover:text-black' : 'text-white hover:text-white/80'}`}
                >
                  {cat.name}
                </Link>
              ))}
              <Link 
                to={createPageUrl('Shop') + '?filter=new'}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${isScrolled ? 'text-gray-700 hover:text-black' : 'text-white hover:text-white/80'}`}
              >
                New
              </Link>
              <Link 
                to={createPageUrl('Shop') + '?filter=sale'}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${isScrolled ? 'text-gray-700 hover:text-black' : 'text-white hover:text-white/80'}`}
              >
                Sale
              </Link>
            </nav>

            {/* Right: Search, User, Favorites, Cart */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button 
                onClick={() => setSearchOpen(true)}
                className={`p-2 rounded-full transition-colors ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'}`}
                aria-label="Search"
              >
                <Search className={`w-5 h-5 ${isScrolled ? 'text-black' : 'text-white'}`} />
              </button>

              {isAuthenticated ? (
                <button 
                  onClick={() => window.location.href = createPageUrl('Orders')}
                  className={`p-2 rounded-full transition-colors ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'}`}
                  aria-label="Account"
                >
                  <User className={`w-5 h-5 ${isScrolled ? 'text-black' : 'text-white'}`} />
                </button>
              ) : (
                <Link
                  to={createPageUrl('Login')}
                  className={`p-2 rounded-full transition-colors ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'}`}
                  aria-label="Login"
                >
                  <User className={`w-5 h-5 ${isScrolled ? 'text-black' : 'text-white'}`} />
                </Link>
              )}

              <Link 
                to={createPageUrl('Wishlist')}
                className={`p-2 rounded-full transition-colors relative ${isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'}`}
                aria-label="Wishlist"
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
                aria-label="Cart"
              >
                <ShoppingBag className={`w-5 h-5 ${isScrolled ? 'text-black' : 'text-white'}`} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Desktop Menu Dropdown */}
              <div className="hidden lg:block desktop-menu-container relative">
                <button
                  onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
                  className={`p-2 rounded-full transition-colors flex items-center gap-1 ${isScrolled ? 'hover:bg-gray-100 text-black' : 'hover:bg-white/20 text-white'}`}
                  aria-label="Menu"
                >
                  <Menu className="w-5 h-5" />
                  <ChevronDown className={`w-4 h-4 transition-transform ${desktopMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {desktopMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                    >
                      {/* Quick Links */}
                      <div className="px-4 py-2">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Quick Links</h4>
                        <div className="space-y-1">
                          <Link
                            to={createPageUrl('Shop')}
                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setDesktopMenuOpen(false)}
                          >
                            Shop All
                          </Link>
                          <Link
                            to={createPageUrl('Shop') + '?filter=new'}
                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setDesktopMenuOpen(false)}
                          >
                            New Arrivals
                          </Link>
                          <Link
                            to={createPageUrl('Shop') + '?filter=sale'}
                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setDesktopMenuOpen(false)}
                          >
                            Sale
                          </Link>
                          <Link
                            to={createPageUrl('About')}
                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setDesktopMenuOpen(false)}
                          >
                            About Us
                          </Link>
                          <Link
                            to={createPageUrl('Contact')}
                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setDesktopMenuOpen(false)}
                          >
                            Contact
                          </Link>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-200 my-2"></div>

                      {/* Customer Service */}
                      <div className="px-4 py-2">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Customer Service</h4>
                        <div className="space-y-1">
                          <Link
                            to={createPageUrl('FAQ')}
                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setDesktopMenuOpen(false)}
                          >
                            FAQ
                          </Link>
                          <Link
                            to={createPageUrl('Returns')}
                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setDesktopMenuOpen(false)}
                          >
                            Returns & Refunds
                          </Link>
                          <Link
                            to={createPageUrl('Privacy')}
                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setDesktopMenuOpen(false)}
                          >
                            Privacy Policy
                          </Link>
                          <Link
                            to={createPageUrl('Terms')}
                            className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => setDesktopMenuOpen(false)}
                          >
                            Terms & Conditions
                          </Link>
                          {isAuthenticated && (
                            <Link
                              to={createPageUrl('Orders')}
                              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                              onClick={() => setDesktopMenuOpen(false)}
                            >
                              Track Order
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

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
                {/* Categories */}
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-4">Categories</h3>
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
                </div>

                {/* Quick Links */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-4">Quick Links</h3>
                  <Link 
                    to={createPageUrl('About')}
                    className="block py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link 
                    to={createPageUrl('Contact')}
                    className="block py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>

                {/* Customer Service */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-4">Customer Service</h3>
                  <Link 
                    to={createPageUrl('FAQ')}
                    className="block py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                  <Link 
                    to={createPageUrl('Returns')}
                    className="block py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Returns & Refunds
                  </Link>
                  <Link 
                    to={createPageUrl('Privacy')}
                    className="block py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Privacy Policy
                  </Link>
                  <Link 
                    to={createPageUrl('Terms')}
                    className="block py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Terms & Conditions
                  </Link>
                  {isAuthenticated && (
                    <Link 
                      to={createPageUrl('Orders')}
                      className="block py-3 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Track Order
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