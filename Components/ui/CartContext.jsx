import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartTotal: 0,
  cartCount: 0,
  isOpen: false,
  setIsOpen: () => {}
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('luxe_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('luxe_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(
        i => i.product_id === item.product_id && 
             i.size === item.size && 
             i.color === item.color
      );
      if (existing) {
        return prev.map(i => 
          i.product_id === item.product_id && 
          i.size === item.size && 
          i.color === item.color
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (product_id, size, color) => {
    setCart(prev => prev.filter(
      i => !(i.product_id === product_id && i.size === size && i.color === color)
    ));
  };

  const updateQuantity = (product_id, size, color, quantity) => {
    if (quantity < 1) {
      removeFromCart(product_id, size, color);
      return;
    }
    setCart(prev => prev.map(i => 
      i.product_id === product_id && i.size === size && i.color === color
        ? { ...i, quantity }
        : i
    ));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart,
      cartTotal, cartCount, isOpen, setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};