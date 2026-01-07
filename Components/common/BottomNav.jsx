import React from 'react';
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
          
          return (
            <Link
              key={item.label}
              to={item.path}
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