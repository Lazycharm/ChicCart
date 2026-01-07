import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/services/coupons';
import { getCurrentUser, isAuthenticated } from '@/services/users';
import { 
  Package, Plus, Edit, Trash2, LayoutDashboard, ShoppingCart, 
  Users, Tag, Image, LogOut, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { format } from 'date-fns';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: 'AdminDashboard' },
  { icon: Package, label: 'Products', href: 'AdminProducts' },
  { icon: ShoppingCart, label: 'Orders', href: 'AdminOrders' },
  { icon: Users, label: 'Customers', href: 'AdminCustomers' },
  { icon: Tag, label: 'Coupons', href: 'AdminCoupons', active: true },
  { icon: Image, label: 'Banners', href: 'AdminBanners' },
];

export default function AdminCoupons() {
  const [user, setUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '', type: 'percentage', value: '', min_order: '',
    max_uses: '', expires_at: '', is_active: true
  });

  const queryClient = useQueryClient();

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

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => getAllCoupons('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-coupons']);
      toast.success('Coupon created!');
      setIsDialogOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-coupons']);
      toast.success('Coupon updated!');
      setIsDialogOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-coupons']);
      toast.success('Coupon deleted!');
    }
  });

  const resetForm = () => {
    setFormData({
      code: '', type: 'percentage', value: '', min_order: '',
      max_uses: '', expires_at: '', is_active: true
    });
    setEditingCoupon(null);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code || '',
      type: coupon.type || 'percentage',
      value: coupon.value?.toString() || '',
      min_order: coupon.min_order?.toString() || '',
      max_uses: coupon.max_uses?.toString() || '',
      expires_at: coupon.expires_at || '',
      is_active: coupon.is_active !== false
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      code: formData.code.toUpperCase(),
      value: parseFloat(formData.value) || 0,
      min_order: formData.min_order ? parseFloat(formData.min_order) : null,
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : null
    };

    if (editingCoupon) {
      updateMutation.mutate({ id: editingCoupon.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Delete this coupon?')) {
      deleteMutation.mutate(id);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Coupons</h1>
            <p className="text-gray-500">{coupons.length} coupons</p>
          </div>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Coupon
          </Button>
        </div>

        {/* Coupons Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Min Order</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No coupons yet
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                    <TableCell>
                      {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                    </TableCell>
                    <TableCell>
                      {coupon.min_order ? `$${coupon.min_order}` : '-'}
                    </TableCell>
                    <TableCell>
                      {coupon.used_count || 0} / {coupon.max_uses || '∞'}
                    </TableCell>
                    <TableCell>
                      {coupon.expires_at ? format(new Date(coupon.expires_at), 'MMM d, yyyy') : 'Never'}
                    </TableCell>
                    <TableCell>
                      <Badge className={coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                        {coupon.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(coupon)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Coupon Code *</Label>
                <Input
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="SUMMER20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={value => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Value *</Label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={e => setFormData({ ...formData, value: e.target.value })}
                    placeholder={formData.type === 'percentage' ? '20' : '10'}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Minimum Order</Label>
                  <Input
                    type="number"
                    value={formData.min_order}
                    onChange={e => setFormData({ ...formData, min_order: e.target.value })}
                    placeholder="50"
                  />
                </div>
                <div>
                  <Label>Max Uses</Label>
                  <Input
                    type="number"
                    value={formData.max_uses}
                    onChange={e => setFormData({ ...formData, max_uses: e.target.value })}
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div>
                <Label>Expires At</Label>
                <Input
                  type="date"
                  value={formData.expires_at}
                  onChange={e => setFormData({ ...formData, expires_at: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={checked => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingCoupon ? 'Update' : 'Create'} Coupon
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}