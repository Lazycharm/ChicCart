import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Minus, Plus, Trash2, ShoppingBag, ArrowRight, 
  Tag, Truck, Shield, RotateCcw 
} from 'lucide-react';
import { useCart } from '@/components/ui/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { getCoupons } from '@/services/coupons';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const { data: coupons = [] } = useQuery({
    queryKey: ['coupons'],
    queryFn: () => getCoupons({ is_active: true })
  });

  const handleApplyCoupon = () => {
    const coupon = coupons.find(c => 
      c.code.toLowerCase() === couponCode.toLowerCase() &&
      (!c.expires_at || new Date(c.expires_at) > new Date()) &&
      (!c.max_uses || c.used_count < c.max_uses)
    );

    if (coupon) {
      if (coupon.min_order && cartTotal < coupon.min_order) {
        toast.error(`Minimum order amount is $${coupon.min_order}`);
        return;
      }
      setAppliedCoupon(coupon);
      toast.success(`Coupon "${coupon.code}" applied!`);
    } else {
      toast.error('Invalid or expired coupon code');
    }
    setCouponCode('');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  const discount = appliedCoupon 
    ? appliedCoupon.type === 'percentage' 
      ? cartTotal * (appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0;

  const shipping = cartTotal >= 50 ? 0 : 9.99;
  const total = cartTotal - discount + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-3">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet</p>
          <Button size="lg" asChild>
            <Link to={createPageUrl('Shop')}>
              Start Shopping <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl lg:text-4xl font-bold mb-8"
        >
          Shopping Cart ({cart.length} items)
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.div
                  key={`${item.product_id}-${item.size}-${item.color}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm flex gap-4 lg:gap-6"
                >
                  {/* Product Image */}
                  <Link 
                    to={createPageUrl('ProductDetail') + `?id=${item.product_id}`}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-24 h-28 lg:w-32 lg:h-40 object-cover rounded-xl"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col">
                    <Link 
                      to={createPageUrl('ProductDetail') + `?id=${item.product_id}`}
                      className="font-semibold text-lg hover:text-rose-500 transition-colors line-clamp-2"
                    >
                      {item.product_name}
                    </Link>
                    
                    <div className="text-sm text-gray-500 mt-1 space-y-1">
                      {item.size && <p>Size: {item.size}</p>}
                      {item.color && <p>Color: {item.color}</p>}
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.size, item.color, item.quantity - 1)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.size, item.color, item.quantity + 1)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product_id, item.size, item.color)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-600 block mb-2">
                  Promo Code
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-700">{appliedCoupon.code}</span>
                    </div>
                    <button 
                      onClick={removeCoupon}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="Enter code"
                    />
                    <Button onClick={handleApplyCoupon} variant="outline">
                      Apply
                    </Button>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-y py-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              {/* Free Shipping Progress */}
              {cartTotal < 50 && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Add ${(50 - cartTotal).toFixed(2)} for free shipping</span>
                    <span>{Math.round((cartTotal / 50) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-500 rounded-full transition-all"
                      style={{ width: `${Math.min((cartTotal / 50) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <Button 
                className="w-full h-14 text-lg bg-black hover:bg-gray-800"
                asChild
              >
                <Link to={createPageUrl('Checkout')}>
                  Proceed to Checkout
                </Link>
              </Button>

              <Link 
                to={createPageUrl('Shop')}
                className="block text-center text-gray-500 hover:text-black mt-4 text-sm"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t">
                <div className="flex flex-col items-center text-center">
                  <Truck className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Free Ship</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Secure</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <RotateCcw className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Easy Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}