import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/components/ui/CartContext';
import { Button } from '@/components/ui/button';

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                Your Cart ({cart.length})
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-4">Start shopping to add items to your cart</p>
                  <Button onClick={() => setIsOpen(false)} asChild>
                    <Link to={createPageUrl('Shop')}>Continue Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {cart.map((item, index) => (
                      <motion.div
                        key={`${item.product_id}-${item.size}-${item.color}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 p-3 bg-gray-50 rounded-xl"
                      >
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-20 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-2">{item.product_name}</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && ' | '}
                            {item.color && `Color: ${item.color}`}
                          </p>
                          <p className="font-semibold mt-1">${item.price.toFixed(2)}</p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 bg-white rounded-full border">
                              <button
                                onClick={() => updateQuantity(item.product_id, item.size, item.color, item.quantity - 1)}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product_id, item.size, item.color, item.quantity + 1)}
                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product_id, item.size, item.color)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Shipping & taxes calculated at checkout
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsOpen(false)}
                    asChild
                  >
                    <Link to={createPageUrl('Cart')}>View Cart</Link>
                  </Button>
                  <Button 
                    className="bg-black hover:bg-gray-800"
                    onClick={() => setIsOpen(false)}
                    asChild
                  >
                    <Link to={createPageUrl('Checkout')}>Checkout</Link>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}