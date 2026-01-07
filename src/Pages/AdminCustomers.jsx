import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/services/users';
import { getAllOrders } from '@/services/orders';
import { useAuth } from '@/components/ui/AuthContext';
import AdminLayout from '@/Components/admin/AdminLayout';
import ResponsiveTable from '@/Components/admin/ResponsiveTable';
import { Search, Loader2, Mail } from 'lucide-react';
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

  return (
    <AdminLayout
      title="Customers"
      description={`${users.length} registered users`}
    >
      {/* Search */}
      <div className="relative mb-4 lg:mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10 bg-white border-gray-200"
        />
      </div>

      {/* Users Table */}
      <ResponsiveTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[180px]">Customer</TableHead>
              <TableHead className="min-w-[200px]">Email</TableHead>
              <TableHead className="min-w-[100px]">Role</TableHead>
              <TableHead className="min-w-[80px]">Orders</TableHead>
              <TableHead className="min-w-[120px]">Total Spent</TableHead>
              <TableHead className="min-w-[120px]">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-rose-500" />
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
                        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-rose-600 font-medium text-sm">
                            {customer.full_name?.[0]?.toUpperCase() || customer.email?.[0]?.toUpperCase()}
                          </span>
                        </div>
                        <p className="font-medium text-sm lg:text-base text-gray-900 truncate">{customer.full_name || 'No name'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm lg:text-base text-gray-700 truncate">{customer.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${customer.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                        {customer.role || 'user'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm lg:text-base text-gray-700">{stats.orderCount}</TableCell>
                    <TableCell className="font-medium text-sm lg:text-base text-gray-900">${stats.totalSpent.toFixed(2)}</TableCell>
                    <TableCell className="text-sm lg:text-base text-gray-700">
                      {customer.created_date && format(new Date(customer.created_date), 'MMM d, yyyy')}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </ResponsiveTable>
    </AdminLayout>
  );
}