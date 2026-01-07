import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTaxRules, createTaxRule, updateTaxRule, deleteTaxRule } from '@/services/taxes';
import { useAuth } from '@/components/ui/AuthContext';
import AdminLayout from '@/Components/admin/AdminLayout';
import ResponsiveTable from '@/Components/admin/ResponsiveTable';
import { Plus, Edit, Trash2, Loader2, Receipt } from 'lucide-react';
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

const countries = ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'NO', 'DK'];
const usStates = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

export default function AdminTaxes() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    rate: 0,
    type: 'percentage',
    applies_to: 'all',
    countries: [],
    states: [],
    is_active: true,
    priority: 0
  });

  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['tax-rules'],
    queryFn: () => getTaxRules('priority')
  });

  const createMutation = useMutation({
    mutationFn: (data) => createTaxRule(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tax-rules']);
      toast.success('Tax rule created!');
      setIsDialogOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateTaxRule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tax-rules']);
      toast.success('Tax rule updated!');
      setIsDialogOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteTaxRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tax-rules']);
      toast.success('Tax rule deleted!');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      rate: 0,
      type: 'percentage',
      applies_to: 'all',
      countries: [],
      states: [],
      is_active: true,
      priority: 0
    });
    setEditingRule(null);
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name || '',
      rate: rule.rate || 0,
      type: rule.type || 'percentage',
      applies_to: rule.applies_to || 'all',
      countries: rule.countries || [],
      states: rule.states || [],
      is_active: rule.is_active !== false,
      priority: rule.priority || 0
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      priority: parseInt(formData.priority) || 0
    };

    if (editingRule) {
      updateMutation.mutate({ id: editingRule.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Delete this tax rule?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout
      title="Tax Rules"
      description="Configure tax rates by region and product type"
      actionButton={
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Tax Rule
        </Button>
      }
    >
      {/* Tax Rules Table */}
      <ResponsiveTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Rule Name</TableHead>
              <TableHead className="min-w-[100px]">Rate</TableHead>
              <TableHead className="min-w-[120px]">Applies To</TableHead>
              <TableHead className="min-w-[150px]">Regions</TableHead>
              <TableHead className="min-w-[80px]">Priority</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="text-right min-w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-rose-500" />
                </TableCell>
              </TableRow>
            ) : rules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No tax rules. Create your first rule.
                </TableCell>
              </TableRow>
            ) : (
              rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium text-sm lg:text-base text-gray-900">{rule.name}</TableCell>
                  <TableCell className="text-sm lg:text-base text-gray-700">
                    {rule.type === 'percentage' ? `${rule.rate}%` : `$${rule.rate}`}
                  </TableCell>
                  <TableCell>
                    <Badge className="text-xs bg-blue-100 text-blue-700">
                      {rule.applies_to}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs lg:text-sm text-gray-600">
                    {rule.countries?.length > 0 ? `${rule.countries.length} countries` : 'All countries'}
                    {rule.states?.length > 0 && `, ${rule.states.length} states`}
                  </TableCell>
                  <TableCell className="text-sm lg:text-base text-gray-700">{rule.priority || 0}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${rule.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 lg:gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9" onClick={() => handleEdit(rule)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9" onClick={() => handleDelete(rule.id)}>
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
              <Receipt className="w-5 h-5" />
              {editingRule ? 'Edit Tax Rule' : 'Create Tax Rule'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <Label className="text-sm font-medium">Rule Name *</Label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Priority</Label>
                <Input
                  type="number"
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Higher priority rules apply first</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
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
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Rate *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.rate}
                  onChange={e => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Applies To *</Label>
              <Select
                value={formData.applies_to}
                onValueChange={value => setFormData({ ...formData, applies_to: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="products">Products Only</SelectItem>
                  <SelectItem value="shipping">Shipping Only</SelectItem>
                  <SelectItem value="both">Products & Shipping</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Countries (leave empty for all)</Label>
              <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto p-2 border rounded">
                {countries.map(country => (
                  <label key={country} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.countries.includes(country)}
                      onChange={e => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            countries: [...formData.countries, country]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            countries: formData.countries.filter(c => c !== country)
                          });
                        }
                      }}
                    />
                    <span className="text-sm">{country}</span>
                  </label>
                ))}
              </div>
            </div>

            {formData.countries.includes('US') && (
              <div>
                <Label className="text-sm font-medium">US States (leave empty for all)</Label>
                <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto p-2 border rounded">
                  {usStates.map(state => (
                    <label key={state} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.states.includes(state)}
                        onChange={e => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              states: [...formData.states, state]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              states: formData.states.filter(s => s !== state)
                            });
                          }
                        }}
                      />
                      <span className="text-sm">{state}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={checked => setFormData({ ...formData, is_active: checked })}
              />
              <Label className="text-sm font-medium">Active</Label>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full sm:w-auto">
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingRule ? 'Update' : 'Create'} Rule
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

