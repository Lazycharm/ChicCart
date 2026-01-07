import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllOrders } from '@/services/orders';
import { getProducts } from '@/services/products';
import { getUsers } from '@/services/users';
import { useAuth } from '@/components/ui/AuthContext';
import AdminLayout from '@/Components/admin/AdminLayout';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, 
  Package, Clock, Loader2, BarChart3, ArrowUp, ArrowDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export default function AdminAnalytics() {
  const { user } = useAuth();

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders-analytics'],
    queryFn: () => getAllOrders('-created_date', 1000)
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products-analytics'],
    queryFn: () => getProducts(1000)
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users-analytics'],
    queryFn: () => getUsers()
  });

  const isLoading = ordersLoading || productsLoading || usersLoading;

  // Calculate metrics
  const today = new Date();
  const yesterday = subDays(today, 1);
  const last7Days = subDays(today, 7);
  const last30Days = subDays(today, 30);

  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.created_date || o.created_at);
    return orderDate >= startOfDay(today) && orderDate <= endOfDay(today);
  });

  const yesterdayOrders = orders.filter(o => {
    const orderDate = new Date(o.created_date || o.created_at);
    return orderDate >= startOfDay(yesterday) && orderDate <= endOfDay(yesterday);
  });

  const last7DaysOrders = orders.filter(o => {
    const orderDate = new Date(o.created_date || o.created_at);
    return orderDate >= startOfDay(last7Days);
  });

  const last30DaysOrders = orders.filter(o => {
    const orderDate = new Date(o.created_date || o.created_at);
    return orderDate >= startOfDay(last30Days);
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const last7DaysRevenue = last7DaysOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const last30DaysRevenue = last30DaysOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const revenueChange = yesterdayRevenue > 0 
    ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1)
    : todayRevenue > 0 ? '100' : '0';

  const ordersChange = yesterdayOrders.length > 0
    ? ((todayOrders.length - yesterdayOrders.length) / yesterdayOrders.length * 100).toFixed(1)
    : todayOrders.length > 0 ? '100' : '0';

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

  const topProducts = products
    .filter(p => p.rating && p.reviews_count)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  const recentCustomers = users
    .filter(u => u.created_at)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <AdminLayout title="Analytics">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Analytics Dashboard"
      description="Store performance metrics and insights"
    >
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm text-gray-600 font-medium">Total Revenue</p>
                <p className="text-xl lg:text-2xl font-bold mt-1 text-gray-900">${totalRevenue.toFixed(2)}</p>
                <div className="flex items-center gap-1 mt-2">
                  {parseFloat(revenueChange) >= 0 ? (
                    <>
                      <ArrowUp className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
                      <span className="text-xs lg:text-sm text-green-600">{revenueChange}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="w-3 h-3 lg:w-4 lg:h-4 text-red-600" />
                      <span className="text-xs lg:text-sm text-red-600">{Math.abs(parseFloat(revenueChange))}%</span>
                    </>
                  )}
                  <span className="text-xs text-gray-500 ml-1">vs yesterday</span>
                </div>
              </div>
              <div className="p-2 lg:p-3 bg-green-500 text-white rounded-lg lg:rounded-xl flex-shrink-0">
                <DollarSign className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm text-gray-600 font-medium">Total Orders</p>
                <p className="text-xl lg:text-2xl font-bold mt-1 text-gray-900">{orders.length}</p>
                <div className="flex items-center gap-1 mt-2">
                  {parseFloat(ordersChange) >= 0 ? (
                    <>
                      <ArrowUp className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
                      <span className="text-xs lg:text-sm text-green-600">{ordersChange}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="w-3 h-3 lg:w-4 lg:h-4 text-red-600" />
                      <span className="text-xs lg:text-sm text-red-600">{Math.abs(parseFloat(ordersChange))}%</span>
                    </>
                  )}
                  <span className="text-xs text-gray-500 ml-1">vs yesterday</span>
                </div>
              </div>
              <div className="p-2 lg:p-3 bg-blue-500 text-white rounded-lg lg:rounded-xl flex-shrink-0">
                <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm text-gray-600 font-medium">Total Customers</p>
                <p className="text-xl lg:text-2xl font-bold mt-1 text-gray-900">{users.length}</p>
                <p className="text-xs text-gray-500 mt-2">Registered users</p>
              </div>
              <div className="p-2 lg:p-3 bg-purple-500 text-white rounded-lg lg:rounded-xl flex-shrink-0">
                <Users className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm text-gray-600 font-medium">Total Products</p>
                <p className="text-xl lg:text-2xl font-bold mt-1 text-gray-900">{products.length}</p>
                <p className="text-xs text-gray-500 mt-2">In catalog</p>
              </div>
              <div className="p-2 lg:p-3 bg-amber-500 text-white rounded-lg lg:rounded-xl flex-shrink-0">
                <Package className="w-5 h-5 lg:w-6 lg:h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Today</span>
              <span className="font-medium text-sm lg:text-base">${todayRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last 7 Days</span>
              <span className="font-medium text-sm lg:text-base">${last7DaysRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last 30 Days</span>
              <span className="font-medium text-sm lg:text-base">${last30DaysRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-sm font-medium text-gray-900">Average Order Value</span>
              <span className="font-bold text-sm lg:text-base">${avgOrderValue.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-100 text-yellow-700 text-xs">Pending</Badge>
              </div>
              <span className="font-medium text-sm lg:text-base">{pendingOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-700 text-xs">Processing</Badge>
              </div>
              <span className="font-medium text-sm lg:text-base">{processingOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-700 text-xs">Shipped</Badge>
              </div>
              <span className="font-medium text-sm lg:text-base">{shippedOrders}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-700 text-xs">Delivered</Badge>
              </div>
              <span className="font-medium text-sm lg:text-base">{deliveredOrders}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Recent Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Top Rated Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.length === 0 ? (
                <p className="text-center text-gray-500 py-4 text-sm">No rated products yet</p>
              ) : (
                topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-rose-600 font-bold text-xs">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm lg:text-base text-gray-900 truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-600">Rating: {product.rating?.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600">{product.reviews_count} reviews</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCustomers.length === 0 ? (
                <p className="text-center text-gray-500 py-4 text-sm">No customers yet</p>
              ) : (
                recentCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-rose-600 font-medium text-sm">
                        {customer.full_name?.[0]?.toUpperCase() || customer.email?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm lg:text-base text-gray-900 truncate">
                        {customer.full_name || customer.name || 'No name'}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-600 truncate">{customer.email}</p>
                    </div>
                    {customer.created_at && (
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {format(new Date(customer.created_at), 'MMM d')}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

