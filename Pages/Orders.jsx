import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Truck, CheckCircle2, Clock, XCircle, 
  ChevronRight, Search, Loader2 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/services/orders';
import { getCurrentUser, isAuthenticated } from '@/services/users';
import { redirectToLogin } from '@/services/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from 'date-fns';

const statusConfig = {
  pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
  processing: { icon: Package, color: 'bg-blue-100 text-blue-700', label: 'Processing' },
  shipped: { icon: Truck, color: 'bg-purple-100 text-purple-700', label: 'Shipped' },
  delivered: { icon: CheckCircle2, color: 'bg-green-100 text-green-700', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Cancelled' }
};

export default function Orders() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const authStatus = await isAuthenticated();
      if (authStatus) {
        const userData = await getCurrentUser();
        setUser(userData);
      }
    };
    loadUser();
  }, []);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders', user?.email],
    queryFn: () => getOrders({ customer_email: user.email }, '-created_date'),
    enabled: !!user?.email
  });

  const filteredOrders = orders.filter(order => 
    order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items?.some(item => item.product_name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your orders</h1>
          <Button onClick={() => redirectToLogin()}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-3">No orders yet</h1>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <Button size="lg" asChild>
            <Link to={createPageUrl('Shop')}>
              Start Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl lg:text-4xl font-bold mb-2"
        >
          My Orders
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 mb-8"
        >
          Track and manage your orders
        </motion.p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Orders List */}
        <Accordion type="single" collapsible className="space-y-4">
          <AnimatePresence>
            {filteredOrders.map((order, index) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem value={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border-0">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline">
                      <div className="flex flex-wrap items-center gap-4 text-left w-full">
                        <div className="flex-1 min-w-[200px]">
                          <p className="font-semibold">{order.order_number}</p>
                          <p className="text-sm text-gray-500">
                            {order.created_date && format(new Date(order.created_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <Badge className={status.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                        <p className="font-bold">${order.total?.toFixed(2)}</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      {/* Order Items */}
                      <div className="space-y-4 mb-6">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex gap-4">
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

                      {/* Shipping Address */}
                      {order.shipping_address && (
                        <div className="border-t pt-4">
                          <h4 className="font-medium mb-2">Shipping Address</h4>
                          <p className="text-gray-600 text-sm">
                            {order.shipping_address.street}<br />
                            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}<br />
                            {order.shipping_address.country}
                          </p>
                        </div>
                      )}

                      {/* Tracking */}
                      {order.tracking_number && (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-medium mb-2">Tracking Number</h4>
                          <p className="text-gray-600">{order.tracking_number}</p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Accordion>
      </div>
    </div>
  );
}