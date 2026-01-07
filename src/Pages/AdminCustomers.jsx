import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/users';
import { getAllOrders } from '@/services/orders';
import { useAuth } from '@/components/ui/AuthContext';
import { 
  Package, Search, LayoutDashboard, ShoppingCart, 
  Users, Tag, Image, LogOut, Loader2, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: 'AdminDashboard' },
  { icon: Package, label: 'Products', href: 'AdminProducts' },
  { icon: ShoppingCart, label: 'Orders', href: 'AdminOrders' },
  { icon: Users, label: 'Customers', href: 'AdminCustomers', active: true },
  { icon: Tag, label: 'Coupons', href: 'AdminCoupons' },
  { icon: Image, label: 'Banners', href: 'AdminBanners' },
];

export default function AdminCustomers() {
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => getUsers('-created_date')
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders-stats'],
    queryFn: () => getAllOrders()
  });

  const getCustomerStats = (email) => {
    const customerOrders = orders.filter(o => o.customer_email === email);
    const totalSpent = customerOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    return { orderCount: customerOrders.length, totalSpent };
  };

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // ProtectedRoute already handles auth check, but double-check for safety
  if (!user || user.role !== 'admin') {
    return null; // ProtectedRoute will handle redirect
  }

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
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold">Customers</h1>
          <p className="text-gray-500">{users.length} registered users</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((customer) => {
                  const stats = getCustomerStats(customer.email);
                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                            <span className="text-rose-600 font-medium">
                              {customer.full_name?.[0]?.toUpperCase() || customer.email?.[0]?.toUpperCase()}
                            </span>
                          </div>
                          <p className="font-medium">{customer.full_name || 'No name'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {customer.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={customer.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}>
                          {customer.role || 'user'}
                        </Badge>
                      </TableCell>
                      <TableCell>{stats.orderCount}</TableCell>
                      <TableCell className="font-medium">${stats.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>
                        {customer.created_date && format(new Date(customer.created_date), 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}