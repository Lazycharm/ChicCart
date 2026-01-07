import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { 
  CreditCard, Truck, ShieldCheck, ChevronLeft, 
  Lock, Check, Loader2 
} from 'lucide-react';
import { useCart } from '@/components/ui/CartContext';
import { useAuth } from '@/components/ui/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import { createOrder } from '@/services/orders';
import { useQuery } from '@tanstack/react-query';
import { getEnabledPaymentProviders } from '@/services/payments';
import { getSettings } from '@/services/settings';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');

  // Fetch payment providers and settings
  const { data: paymentProviders = [], isLoading: providersLoading } = useQuery({
    queryKey: ['enabled-payment-providers'],
    queryFn: () => getEnabledPaymentProviders(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: settings } = useQuery({
    queryKey: ['store-settings'],
    queryFn: () => getSettings(),
    staleTime: 5 * 60 * 1000,
  });

  // Set default payment method when providers load
  React.useEffect(() => {
    if (paymentProviders.length > 0 && !paymentMethod) {
      setPaymentMethod(paymentProviders[0].type);
    }
  }, [paymentProviders, paymentMethod]);
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardName: ''
  });

  // Pre-fill email if user is authenticated
  React.useEffect(() => {
    if (isAuthenticated && user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [isAuthenticated, user]);

  const shipping = cartTotal >= 50 ? 0 : 9.99;
  const total = cartTotal + shipping;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      // Use authenticated user's email if available, otherwise use form email
      const customerEmail = isAuthenticated && user?.email ? user.email : formData.email;
      
      // Create order
      const orderNumber = `ORD-${Date.now()}`;
      
      await createOrder({
        order_number: orderNumber,
        customer_email: customerEmail,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        items: cart.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: cartTotal,
        shipping: shipping,
        total: total,
        status: 'pending',
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
        shipping_address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
          phone: formData.phone
        }
      });

      clearCart();
      window.location.href = createPageUrl('OrderConfirmation') + `?order=${orderNumber}`;
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Button asChild>
            <Link to={createPageUrl('Shop')}>Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[95%] xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back Button */}
        <Link 
          to={createPageUrl('Cart')}
          className="inline-flex items-center text-gray-600 hover:text-black mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Cart
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {['Shipping', 'Payment', 'Review'].map((label, idx) => (
            <React.Fragment key={label}>
              <div className={`flex items-center gap-2 ${step > idx + 1 ? 'text-green-600' : step === idx + 1 ? 'text-black' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step > idx + 1 ? 'bg-green-600 border-green-600 text-white' : 
                  step === idx + 1 ? 'border-black' : 'border-gray-300'
                }`}>
                  {step > idx + 1 ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span className="hidden sm:inline font-medium">{label}</span>
              </div>
              {idx < 2 && (
                <div className={`w-12 h-0.5 ${step > idx + 1 ? 'bg-green-600' : 'bg-gray-300'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Shipping */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100"
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Truck className="w-6 h-6" />
                    Shipping Information
                  </h2>
                  
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          name="zip"
                          value={formData.zip}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full mt-6 h-12 bg-black hover:bg-gray-800"
                  >
                    Continue to Payment
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100"
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    Payment Method
                  </h2>

                  {providersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                    </div>
                  ) : paymentProviders.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No payment methods available. Please contact support.</p>
                  ) : (
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                      {paymentProviders.map((provider) => {
                        const getProviderIcon = () => {
                          switch (provider.type) {
                            case 'stripe':
                            case 'card':
                              return <CreditCard className="w-6 h-6" />;
                            case 'paypal':
                              return (
                                <div className="w-6 h-6 flex items-center justify-center bg-blue-500 text-white rounded">
                                  <span className="text-xs font-bold">PP</span>
                                </div>
                              );
                            case 'cash_on_delivery':
                              return (
                                <div className="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded">
                                  <span className="text-xs font-bold">$</span>
                                </div>
                              );
                            default:
                              return <CreditCard className="w-6 h-6" />;
                          }
                        };

                        const getProviderLabel = () => {
                          switch (provider.type) {
                            case 'stripe':
                              return 'Credit/Debit Card';
                            case 'paypal':
                              return 'PayPal';
                            case 'cash_on_delivery':
                              return 'Cash on Delivery';
                            case 'bank_transfer':
                              return 'Bank Transfer';
                            default:
                              return provider.name;
                          }
                        };

                        const getProviderDescription = () => {
                          switch (provider.type) {
                            case 'stripe':
                              return 'Visa, Mastercard, Amex';
                            case 'paypal':
                              return 'Pay with your PayPal account';
                            case 'cash_on_delivery':
                              return 'Pay when you receive';
                            case 'bank_transfer':
                              return 'Direct bank transfer';
                            default:
                              return provider.name;
                          }
                        };

                        return (
                          <label
                            key={provider.id}
                            className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                              paymentMethod === provider.type ? 'border-black bg-gray-50' : 'hover:border-gray-400'
                            }`}
                          >
                            <RadioGroupItem value={provider.type} id={provider.id} />
                            {getProviderIcon()}
                            <div className="flex-1">
                              <p className="font-medium">{getProviderLabel()}</p>
                              <p className="text-sm text-gray-500">{getProviderDescription()}</p>
                              {provider.is_test_mode && (
                                <p className="text-xs text-yellow-600 mt-1">Test Mode</p>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </RadioGroup>
                  )}

                  {(paymentMethod === 'card' || paymentMethod === 'stripe') && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cardExpiry">Expiry Date</Label>
                          <Input
                            id="cardExpiry"
                            name="cardExpiry"
                            placeholder="MM/YY"
                            value={formData.cardExpiry}
                            onChange={handleChange}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardCvc">CVC</Label>
                          <Input
                            id="cardCvc"
                            name="cardCvc"
                            placeholder="123"
                            value={formData.cardCvc}
                            onChange={handleChange}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-12">
                      Back
                    </Button>
                    <Button type="button" onClick={() => setStep(3)} className="flex-1 h-12 bg-black hover:bg-gray-800">
                      Review Order
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100"
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6" />
                    Review Your Order
                  </h2>

                  {/* Shipping Address */}
                  <div className="mb-6 pb-6 border-b">
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <p className="text-gray-600">
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.state} {formData.zip}<br />
                      {formData.country}
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6 pb-6 border-b">
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <p className="text-gray-600">
                      {paymentProviders.find(p => p.type === paymentMethod)?.name || 
                       (paymentMethod === 'stripe' || paymentMethod === 'card' ? 'Credit/Debit Card' : 
                        paymentMethod === 'paypal' ? 'PayPal' : 
                        paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 
                        paymentMethod)}
                    </p>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="font-medium mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={`${item.product_id}-${item.size}-${item.color}`} className="flex gap-4">
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-16 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-gray-500">
                              {item.size && `Size: ${item.size}`}
                              {item.size && item.color && ' | '}
                              {item.color && `Color: ${item.color}`}
                            </p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 h-12">
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-12 bg-black hover:bg-gray-800"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 mr-2" />
                          Place Order
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {cart.slice(0, 3).map((item) => (
                    <div key={`${item.product_id}-${item.size}-${item.color}`} className="flex gap-3">
                      <div className="relative">
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-16 h-20 object-cover rounded-lg"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-2">{item.product_name}</p>
                        <p className="text-xs text-gray-500">{item.size} / {item.color}</p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  {cart.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{cart.length - 3} more items
                    </p>
                  )}
                </div>

                <div className="space-y-3 border-y py-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold mt-4">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Lock className="w-4 h-4" />
                  Secure 256-bit SSL Encryption
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}