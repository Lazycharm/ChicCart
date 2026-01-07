import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPaymentProviders, createPaymentProvider, updatePaymentProvider, deletePaymentProvider } from '@/services/payments';
import { useAuth } from '@/components/ui/AuthContext';
import AdminLayout from '@/Components/admin/AdminLayout';
import ResponsiveTable from '@/Components/admin/ResponsiveTable';
import { Plus, Edit, Trash2, Loader2, CreditCard, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

const paymentTypes = [
  { value: 'stripe', label: 'Stripe' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'cash_on_delivery', label: 'Cash on Delivery' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'other', label: 'Other' },
];

export default function AdminPayments() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'stripe',
    is_enabled: false,
    is_test_mode: true,
    api_key: '',
    api_secret: '',
    public_key: '',
    webhook_secret: '',
    merchant_id: '',
    display_order: 0
  });

  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: providers = [], isLoading } = useQuery({
    queryKey: ['payment-providers'],
    queryFn: () => getPaymentProviders('display_order')
  });

  const createMutation = useMutation({
    mutationFn: (data) => createPaymentProvider(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['payment-providers']);
      toast.success('Payment provider created successfully!');
      setIsDialogOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updatePaymentProvider(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['payment-providers']);
      toast.success('Payment provider updated successfully!');
      setIsDialogOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deletePaymentProvider(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['payment-providers']);
      toast.success('Payment provider deleted successfully!');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'stripe',
      is_enabled: false,
      is_test_mode: true,
      api_key: '',
      api_secret: '',
      public_key: '',
      webhook_secret: '',
      merchant_id: '',
      display_order: 0
    });
    setEditingProvider(null);
  };

  const handleEdit = (provider) => {
    setEditingProvider(provider);
    setFormData({
      name: provider.name || '',
      type: provider.type || 'stripe',
      is_enabled: provider.is_enabled || false,
      is_test_mode: provider.is_test_mode !== false,
      api_key: provider.api_key || '',
      api_secret: provider.api_secret || '',
      public_key: provider.public_key || '',
      webhook_secret: provider.webhook_secret || '',
      merchant_id: provider.merchant_id || '',
      display_order: provider.display_order || 0
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      display_order: parseInt(formData.display_order) || 0
    };

    if (editingProvider) {
      updateMutation.mutate({ id: editingProvider.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this payment provider?')) {
      deleteMutation.mutate(id);
    }
  };

  const maskSecret = (value) => {
    if (!value) return '';
    return value.length > 8 ? '••••' + value.slice(-4) : '••••';
  };

  return (
    <AdminLayout
      title="Payment Providers"
      description="Configure payment methods for your store"
      actionButton={
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Provider
        </Button>
      }
    >
      {/* Payment Providers Table */}
      <ResponsiveTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Provider</TableHead>
              <TableHead className="min-w-[120px]">Type</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[100px]">Mode</TableHead>
              <TableHead className="min-w-[80px]">Order</TableHead>
              <TableHead className="text-right min-w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-rose-500" />
                </TableCell>
              </TableRow>
            ) : providers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No payment providers configured. Add your first provider.
                </TableCell>
              </TableRow>
            ) : (
              providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium text-sm lg:text-base text-gray-900">{provider.name}</TableCell>
                  <TableCell>
                    <Badge className="text-xs bg-blue-100 text-blue-700">
                      {paymentTypes.find(t => t.value === provider.type)?.label || provider.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${provider.is_enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {provider.is_enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${provider.is_test_mode ? 'bg-yellow-100 text-yellow-700' : 'bg-purple-100 text-purple-700'}`}>
                      {provider.is_test_mode ? 'Test' : 'Live'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm lg:text-base text-gray-700">{provider.display_order || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 lg:gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9" onClick={() => handleEdit(provider)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9" onClick={() => handleDelete(provider.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ResponsiveTable>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              {editingProvider ? 'Edit Payment Provider' : 'Add Payment Provider'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <Label className="text-sm font-medium">Provider Name *</Label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Stripe"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={value => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_enabled}
                  onCheckedChange={checked => setFormData({ ...formData, is_enabled: checked })}
                />
                <Label className="text-sm font-medium">Enabled</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_test_mode}
                  onCheckedChange={checked => setFormData({ ...formData, is_test_mode: checked })}
                />
                <Label className="text-sm font-medium">Test Mode</Label>
              </div>
            </div>

            {(formData.type === 'stripe' || formData.type === 'other') && (
              <>
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    API Key
                  </Label>
                  <Input
                    type="password"
                    value={formData.api_key}
                    onChange={e => setFormData({ ...formData, api_key: e.target.value })}
                    placeholder="pk_test_..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    API Secret
                  </Label>
                  <Input
                    type="password"
                    value={formData.api_secret}
                    onChange={e => setFormData({ ...formData, api_secret: e.target.value })}
                    placeholder="sk_test_..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Public Key</Label>
                  <Input
                    type="password"
                    value={formData.public_key}
                    onChange={e => setFormData({ ...formData, public_key: e.target.value })}
                    placeholder="pk_live_..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Webhook Secret</Label>
                  <Input
                    type="password"
                    value={formData.webhook_secret}
                    onChange={e => setFormData({ ...formData, webhook_secret: e.target.value })}
                    placeholder="whsec_..."
                    className="mt-1"
                  />
                </div>
              </>
            )}

            {formData.type === 'paypal' && (
              <div>
                <Label className="text-sm font-medium">Merchant ID</Label>
                <Input
                  type="password"
                  value={formData.merchant_id}
                  onChange={e => setFormData({ ...formData, merchant_id: e.target.value })}
                  placeholder="PayPal Merchant ID"
                  className="mt-1"
                />
              </div>
            )}

            <div>
              <Label className="text-sm font-medium">Display Order</Label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                min="0"
                className="mt-1"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full sm:w-auto">
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingProvider ? 'Update' : 'Create'} Provider
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

