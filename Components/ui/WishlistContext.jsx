import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  toggleWishlist: () => {}
});

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('luxe_wishlist');
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('luxe_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(id => id !== productId));
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  const toggleWishlist = (productId) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};