import React from 'react';
import { Toaster } from "sonner";
import { CartProvider } from '@/components/ui/CartContext';
import { WishlistProvider } from '@/components/ui/WishlistContext';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import CartDrawer from '@/components/common/CartDrawer';
import BottomNav from '@/components/common/BottomNav';

export default function Layout({ children, currentPageName }) {
  const isAdminPage = currentPageName?.startsWith('Admin');

  if (isAdminPage) {
    return (
      <CartProvider>
        <WishlistProvider>
          {children}
          <Toaster position="top-center" richColors />
        </WishlistProvider>
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      <WishlistProvider>
        <div className="min-h-screen flex flex-col pb-16 lg:pb-0">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <BottomNav />
          <Toaster position="top-center" richColors />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}