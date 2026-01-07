import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useAuth } from '@/components/ui/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Image,
  Menu, X, LogOut, Loader2, Settings, FileText, CreditCard,
  Truck, Receipt, BookOpen, BarChart3, FolderTree
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: 'AdminDashboard', path: '/admin' },
  { icon: BarChart3, label: 'Analytics', href: 'AdminAnalytics', path: '/admin/analytics' },
  { icon: Package, label: 'Products', href: 'AdminProducts', path: '/admin/products' },
  { icon: FolderTree, label: 'Categories', href: 'AdminCategories', path: '/admin/categories' },
  { icon: ShoppingCart, label: 'Orders', href: 'AdminOrders', path: '/admin/orders' },
  { icon: Users, label: 'Customers', href: 'AdminCustomers', path: '/admin/customers' },
  { icon: Tag, label: 'Coupons', href: 'AdminCoupons', path: '/admin/coupons' },
  { icon: Image, label: 'Banners', href: 'AdminBanners', path: '/admin/banners' },
  { icon: BookOpen, label: 'Blog', href: 'AdminBlog', path: '/admin/blog' },
  { icon: FileText, label: 'Pages', href: 'AdminPages', path: '/admin/pages' },
  { icon: CreditCard, label: 'Payments', href: 'AdminPayments', path: '/admin/payments' },
  { icon: Truck, label: 'Shipping', href: 'AdminShipping', path: '/admin/shipping' },
  { icon: Receipt, label: 'Taxes', href: 'AdminTaxes', path: '/admin/taxes' },
  { icon: Settings, label: 'Settings', href: 'AdminSettings', path: '/admin/settings' },
];

export default function AdminLayout({ children, title, description, actionButton }) {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu-container') && !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const isActive = (item) => {
    if (item.path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="mobile-menu-button p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <Link to={createPageUrl('AdminDashboard')} className="flex-shrink-0">
            <h1 className="text-lg font-bold text-gray-900">
              LUXE<span className="text-rose-500">.</span> Admin
            </h1>
          </Link>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="mobile-menu-container fixed left-0 top-0 h-full w-72 bg-white shadow-xl z-[70] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
                <h2 className="text-lg font-bold text-gray-900">
                  LUXE<span className="text-rose-500">.</span> Admin
                </h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map(item => {
                  const active = isActive(item);
                  return (
                    <Link
                      key={item.label}
                      to={createPageUrl(item.href)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        active 
                          ? 'bg-rose-500 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <Link
                    to={createPageUrl('Home')}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Back to Store</span>
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex-col z-40">
        <div className="p-6 border-b border-gray-200">
          <Link to={createPageUrl('AdminDashboard')}>
            <h1 className="text-xl font-bold text-gray-900">
              LUXE<span className="text-rose-500">.</span> Admin
            </h1>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const active = isActive(item);
            return (
              <Link
                key={item.label}
                to={createPageUrl(item.href)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active 
                    ? 'bg-rose-500 text-white shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link
            to={createPageUrl('Home')}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Back to Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Page Header */}
          {(title || actionButton) && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
              <div>
                {title && (
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-sm sm:text-base text-gray-600">
                    {description}
                  </p>
                )}
              </div>
              {actionButton && (
                <div className="flex-shrink-0">
                  {actionButton}
                </div>
              )}
            </div>
          )}
          
          {/* Page Content */}
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

