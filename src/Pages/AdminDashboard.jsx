import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/products';
import { getAllOrders } from '@/services/orders';
import { getUsers } from '@/services/users';
import { useAuth } from '@/components/ui/AuthContext';
import AdminLayout from '@/Components/admin/AdminLayout';
import { motion } from 'framer-motion';
import { 
  Package, ShoppingCart, Tag,
  DollarSign, ShoppingBag, Clock, ArrowUp,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
};

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => getProducts()
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => getAllOrders('-created_date', 100)
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const recentOrders = orders.slice(0, 5);

  return (
    <AdminLayout
      title="Dashboard"
      description={`Welcome back, ${user?.full_name || 'Admin'}!`}
      actionButton={
        <Button asChild>
          <Link to={createPageUrl('AdminProducts')}>
            + Add Product
          </Link>
        </Button>
      }
    >

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[
            { title: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-green-500', trend: '+12%' },
            { title: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'bg-blue-500', trend: '+8%' },
            { title: 'Pending Orders', value: pendingOrders, icon: Clock, color: 'bg-yellow-500' },
            { title: 'Total Products', value: products.length, icon: Package, color: 'bg-purple-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs lg:text-sm text-gray-600 font-medium">{stat.title}</p>
                      <p className="text-xl lg:text-2xl font-bold mt-1 text-gray-900">{stat.value}</p>
                      {stat.trend && (
                        <div className="flex items-center gap-1 mt-2 text-green-600 text-xs lg:text-sm">
                          <ArrowUp className="w-3 h-3 lg:w-4 lg:h-4" />
                          {stat.trend}
                        </div>
                      )}
                    </div>
                    <div className={`p-2 lg:p-3 ${stat.color} text-white rounded-lg lg:rounded-xl flex-shrink-0`}>
                      <stat.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

      {/* Recent Orders & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between px-4 lg:px-6 py-4 lg:py-6 border-b border-gray-200">
              <CardTitle className="text-lg lg:text-xl font-semibold">Recent Orders</CardTitle>
              <Button variant="ghost" asChild size="sm" className="h-8 lg:h-9">
                <Link to={createPageUrl('AdminOrders')}>
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <div className="space-y-3 lg:space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg lg:rounded-xl">
                    <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm lg:text-base text-gray-900 truncate">{order.order_number}</p>
                        <p className="text-xs lg:text-sm text-gray-600">
                          {order.created_date && format(new Date(order.created_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-bold text-sm lg:text-base text-gray-900">${order.total?.toFixed(2)}</p>
                      <Badge className={`${statusColors[order.status]} text-xs mt-1`}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <p className="text-center text-gray-500 py-8 text-sm lg:text-base">No orders yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4 lg:space-y-6">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="px-4 lg:px-6 py-4 lg:py-6 border-b border-gray-200">
              <CardTitle className="text-lg lg:text-xl font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 space-y-2 lg:space-y-3">
              <Button asChild variant="outline" className="w-full justify-start h-10 lg:h-11">
                <Link to={createPageUrl('AdminProducts')}>
                  <Package className="w-4 h-4 mr-2" />
                  Manage Products
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start h-10 lg:h-11">
                <Link to={createPageUrl('AdminOrders')}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View Orders
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start h-10 lg:h-11">
                <Link to={createPageUrl('AdminCoupons')}>
                  <Tag className="w-4 h-4 mr-2" />
                  Manage Coupons
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="px-4 lg:px-6 py-4 lg:py-6 border-b border-gray-200">
              <CardTitle className="text-lg lg:text-xl font-semibold">Top Products</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <div className="space-y-3">
                {products.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/40'}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm lg:text-base text-gray-900 truncate">{product.name}</p>
                      <p className="text-xs lg:text-sm text-gray-600">${product.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}