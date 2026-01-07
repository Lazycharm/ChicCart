import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/products';
import { getAllOrders } from '@/services/orders';
import { getUsers } from '@/services/users';
import { getCurrentUser, isAuthenticated } from '@/services/users';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Image,
  TrendingUp, DollarSign, ShoppingBag, Clock, ArrowUp, ArrowDown,
  ChevronRight, Loader2, Settings, LogOut
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const authStatus = await isAuthenticated();
      if (authStatus) {
        const userData = await getCurrentUser();
        setUser(userData);
      } else {
        window.location.href = createPageUrl('Home');
      }
    };
    loadUser();
  }, []);

  const { data: products = [] } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => getProducts()
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => getAllOrders('-created_date', 100)
  });

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => getUsers()
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const recentOrders = orders.slice(0, 5);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: 'AdminDashboard', active: true },
    { icon: Package, label: 'Products', href: 'AdminProducts' },
    { icon: ShoppingCart, label: 'Orders', href: 'AdminOrders' },
    { icon: Users, label: 'Customers', href: 'AdminCustomers' },
    { icon: Tag, label: 'Coupons', href: 'AdminCoupons' },
    { icon: Image, label: 'Banners', href: 'AdminBanners' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white z-40 hidden lg:block">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">LUXE<span className="text-rose-500">.</span> Admin</h1>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.label}
              to={createPageUrl(item.href)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.active ? 'bg-rose-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Link
            to={createPageUrl('Home')}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user.full_name}!</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild className="lg:hidden">
              <Link to={createPageUrl('AdminProducts')}>Products</Link>
            </Button>
            <Button asChild>
              <Link to={createPageUrl('AdminProducts')}>+ Add Product</Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      {stat.trend && (
                        <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                          <ArrowUp className="w-4 h-4" />
                          {stat.trend}
                        </div>
                      )}
                    </div>
                    <div className={`p-3 ${stat.color} text-white rounded-xl`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders & Quick Stats */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button variant="ghost" asChild size="sm">
                  <Link to={createPageUrl('AdminOrders')}>
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{order.order_number}</p>
                          <p className="text-sm text-gray-500">
                            {order.created_date && format(new Date(order.created_date), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${order.total?.toFixed(2)}</p>
                        <Badge className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {recentOrders.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No orders yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to={createPageUrl('AdminProducts')}>
                    <Package className="w-4 h-4 mr-2" />
                    Manage Products
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to={createPageUrl('AdminOrders')}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    View Orders
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link to={createPageUrl('AdminCoupons')}>
                    <Tag className="w-4 h-4 mr-2" />
                    Manage Coupons
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {products.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/40'}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-sm text-gray-500">${product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}