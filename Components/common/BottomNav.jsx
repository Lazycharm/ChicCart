import React from 'react';
<<<<<<< HEAD
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Grid3X3, TrendingUp, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/components/ui/CartContext';
import { useAuth } from '@/components/ui/AuthContext';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { isAuthenticated } = useAuth();

  const isActive = (path) => {
    const currentPath = location.pathname;
    const queryPath = path.split('?')[0];
    
    if (path.includes('?filter=new')) {
      return currentPath === queryPath && location.search.includes('filter=new');
    }
    if (path.includes('?category=')) {
      return currentPath === queryPath && location.search.includes('category=');
    }
    return currentPath === queryPath || (queryPath === '/' && currentPath === '/');
  };

  const handleTrendsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(createPageUrl('Shop') + '?filter=new');
  };

  // Handle Me button click - use onClick to ensure proper navigation
  const handleMeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAuthenticated) {
      // User is authenticated - go to Orders
      navigate('/orders', { replace: false });
    } else {
      // User is not authenticated - go to Login with current location as state
      navigate('/login', { 
        state: { from: { pathname: location.pathname, search: location.search } },
        replace: false 
      });
    }
  };

  // Determine Me button active state
  const isMeActive = (isAuthenticated && location.pathname === '/orders') ||
                     (!isAuthenticated && location.pathname === '/login');

  const navItems = [
    { 
      icon: Home, 
      label: 'Home', 
      path: createPageUrl('Home'),
      exact: true
    },
    { 
      icon: Grid3X3, 
      label: 'Shop', 
      path: createPageUrl('Shop')
    },
    { 
      icon: TrendingUp, 
      label: 'Trends', 
      path: createPageUrl('Shop') + '?filter=new',
      onClick: handleTrendsClick
    },
    { 
      icon: ShoppingBag, 
      label: 'Cart', 
      path: createPageUrl('Cart'), 
      badge: cartCount
    },
    { 
      icon: User, 
      label: 'Me', 
      path: isAuthenticated ? '/orders' : '/login',
      onClick: handleMeClick,
      isActive: isMeActive
    }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive !== undefined ? item.isActive : isActive(item.path);
          
          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                type="button"
                className="flex flex-col items-center justify-center flex-1 h-full relative min-w-0 px-1 py-2 transition-colors hover:bg-gray-50 active:bg-gray-100 rounded-lg cursor-pointer"
              >
                <div className="relative flex-shrink-0">
                  <Icon 
                    className={`w-5 h-5 transition-colors ${
                      active ? 'text-rose-500' : 'text-gray-600'
                    }`} 
                  />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-0.5 transition-colors truncate w-full text-center ${
                  active ? 'text-rose-500 font-semibold' : 'text-gray-600 font-medium'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }
=======
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Home, Grid3X3, TrendingUp, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/components/ui/CartContext';

export default function BottomNav() {
  const location = useLocation();
  const { cartCount } = useCart();

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  const navItems = [
    { icon: Home, label: 'Shop', path: createPageUrl('Home') },
    { icon: Grid3X3, label: 'Category', path: createPageUrl('Shop') },
    { icon: TrendingUp, label: 'Trends', path: createPageUrl('Shop') + '?filter=new' },
    { icon: ShoppingBag, label: 'Cart', path: createPageUrl('Cart'), badge: cartCount },
    { icon: User, label: 'Me', path: createPageUrl('Orders') }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path.split('?')[0]);
>>>>>>> 9901c3343fbf53127d38adce4f907328a8221168
          
          return (
            <Link
              key={item.label}
              to={item.path}
<<<<<<< HEAD
              className="flex flex-col items-center justify-center flex-1 h-full relative min-w-0 px-1 py-2 transition-colors hover:bg-gray-50 active:bg-gray-100 rounded-lg"
            >
              <div className="relative flex-shrink-0">
                <Icon 
                  className={`w-5 h-5 transition-colors ${
                    active ? 'text-rose-500' : 'text-gray-600'
                  }`} 
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 transition-colors truncate w-full text-center ${
                active ? 'text-rose-500 font-semibold' : 'text-gray-600 font-medium'
=======
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 transition-colors ${
                    active ? 'text-rose-500' : 'text-gray-600'
                  }`} 
                />
                {item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 transition-colors ${
                active ? 'text-rose-500 font-medium' : 'text-gray-600'
>>>>>>> 9901c3343fbf53127d38adce4f907328a8221168
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}