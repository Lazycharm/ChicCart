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
      {/* Main Header - Fixed on scroll */}
      <header 
        className={`fixed top-0 left-0 right-0 bg-white transition-all duration-300 ${
          isScrolled ? 'shadow-md' : 'shadow-sm'
        }`}
        style={{ zIndex: 9999, position: 'fixed' }}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left: Logo */}
            <div className="flex items-center gap-4">
              <div className="lg:hidden mobile-menu-container relative">
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-full transition-colors hover:bg-gray-100"
                >
                  <Menu className="w-6 h-6 text-black" />
                </button>
              </div>
              
              <Link to={createPageUrl('Home')} className="flex-shrink-0">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-widest text-black">
                  LUXE
                </h1>
              </Link>
            </div>

            {/* Center: Category Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1 justify-center px-4">
              <Link 
                to={createPageUrl('Shop')}
                className="text-sm font-medium transition-colors whitespace-nowrap text-gray-700 hover:text-black"
              >
                All
              </Link>
              {categories.map(cat => (
                <Link 
                  key={cat.id}
                  to={createPageUrl('Shop') + `?category=${cat.slug}`}
                  className="text-sm font-medium transition-colors whitespace-nowrap text-gray-700 hover:text-black"
                >
                  {cat.name}
                </Link>
              ))}
              <Link 
                to={createPageUrl('Shop') + '?filter=new'}
                className="text-sm font-medium transition-colors whitespace-nowrap text-gray-700 hover:text-black"
              >
                New
              </Link>
              <Link 
                to={createPageUrl('Shop') + '?filter=sale'}
                className="text-sm font-medium transition-colors whitespace-nowrap text-gray-700 hover:text-black"
              >
                Sale
              </Link>
            </nav>

            {/* Right: Search, Favorites, Cart, Menu */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button 
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full transition-colors hover:bg-gray-100"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-black" />
              </button>

              <Link 
                to={createPageUrl('Wishlist')}
                className="p-2 rounded-full transition-colors relative hover:bg-gray-100"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 text-black" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <button 
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-full transition-colors relative hover:bg-gray-100"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5 text-black" />
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
                  className="p-2 rounded-full transition-colors flex items-center gap-1 hover:bg-gray-100 text-black"
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
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2"
                      style={{ zIndex: 10000 }}
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

                      {/* Admin Section */}
                      {user?.role === 'admin' && (
                        <>
                          <div className="border-t border-gray-200 my-2"></div>
                          <div className="px-4 py-2">
                            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Admin</h4>
                            <div className="space-y-1">
                              <Link
                                to={createPageUrl('AdminDashboard')}
                                className="block px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-md transition-colors font-medium"
                                onClick={() => setDesktopMenuOpen(false)}
                              >
                                Admin Dashboard
                              </Link>
                            </div>
                          </div>
                        </>
                      )}
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
            className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20"
            style={{ zIndex: 9997 }}
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

      {/* Mobile Menu Dropdown */}
      <div className="lg:hidden mobile-menu-container relative">
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50"
                style={{ zIndex: 9998 }}
                onClick={() => setMobileMenuOpen(false)}
              />
              {/* Dropdown Menu */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'tween', duration: 0.2 }}
                className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 max-h-[80vh] overflow-y-auto"
                style={{ zIndex: 10000 }}
                onClick={e => e.stopPropagation()}
              >
                {/* Quick Links */}
                <div className="px-4 py-2">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Quick Links</h4>
                  <div className="space-y-1">
                    <Link
                      to={createPageUrl('Shop')}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Shop All
                    </Link>
                    <Link
                      to={createPageUrl('Shop') + '?filter=new'}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      New Arrivals
                    </Link>
                    <Link
                      to={createPageUrl('Shop') + '?filter=sale'}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sale
                    </Link>
                    <Link
                      to={createPageUrl('About')}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About Us
                    </Link>
                    <Link
                      to={createPageUrl('Contact')}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
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
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      FAQ
                    </Link>
                    <Link
                      to={createPageUrl('Returns')}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Returns & Refunds
                    </Link>
                    <Link
                      to={createPageUrl('Privacy')}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      to={createPageUrl('Terms')}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Terms & Conditions
                    </Link>
                    {isAuthenticated && (
                      <Link
                        to={createPageUrl('Orders')}
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Track Order
                      </Link>
                    )}
                  </div>
                </div>

                {/* Admin Section */}
                {user?.role === 'admin' && (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="px-4 py-2">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Admin</h4>
                      <div className="space-y-1">
                        <Link
                          to={createPageUrl('AdminDashboard')}
                          className="block px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-md transition-colors font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}