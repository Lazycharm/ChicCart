import React, { useState } from 'react';
import { createPageUrl } from '@/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/services/products';
import { getCategories } from '@/services/categories';
import { useAuth } from '@/components/ui/AuthContext';
import { uploadFile } from '@/services/storage';
import AdminLayout from '@/Components/admin/AdminLayout';
import ResponsiveTable from '@/Components/admin/ResponsiveTable';
import { 
  Plus, Search, Edit, Trash2, X, Upload, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function AdminProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', slug: '', description: '', price: '', sale_price: '',
    category: '', stock: '', images: [], sizes: [], colors: [],
    featured: false, is_new: false, is_flash_deal: false,
    meta_title: '', meta_description: ''
  });

  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => getProducts(undefined, '-created_date')
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories()
  });

  const createMutation = useMutation({
    mutationFn: (data) => createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product created successfully!');
      setIsDialogOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product updated successfully!');
      setIsDialogOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product deleted successfully!');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '', slug: '', description: '', price: '', sale_price: '',
      category: '', stock: '', images: [], sizes: [], colors: [],
      featured: false, is_new: false, is_flash_deal: false,
      meta_title: '', meta_description: ''
    });
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      sale_price: product.sale_price?.toString() || '',
      category: product.category || '',
      stock: product.stock?.toString() || '',
      images: product.images || [],
      sizes: product.sizes || [],
      colors: product.colors || [],
      featured: product.featured || false,
      is_new: product.is_new || false,
      is_flash_deal: product.is_flash_deal || false,
      meta_title: product.meta_title || '',
      meta_description: product.meta_description || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
      stock: parseInt(formData.stock) || 0,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      const result = await uploadFile(file, 'products');
      const imageUrl = result.file_url || result;
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image: ' + error.message);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout
      title="Products"
      description={`${products.length} total products`}
      actionButton={
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      }
    >
      {/* Search */}
      <div className="relative mb-4 lg:mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10 bg-white border-gray-200"
        />
      </div>

      {/* Products Table */}
      <ResponsiveTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Product</TableHead>
              <TableHead className="min-w-[120px]">Category</TableHead>
              <TableHead className="min-w-[100px]">Price</TableHead>
              <TableHead className="min-w-[80px]">Stock</TableHead>
              <TableHead className="min-w-[120px]">Status</TableHead>
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
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/40'}
                        alt={product.name}
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-sm lg:text-base text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs lg:text-sm text-gray-500 truncate">{product.slug}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm lg:text-base text-gray-700">{product.category}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm lg:text-base text-gray-900">${product.sale_price || product.price}</p>
                      {product.sale_price && (
                        <p className="text-xs text-gray-400 line-through">${product.price}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 0 ? 'default' : 'destructive'} className="text-xs">
                      {product.stock || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.featured && <Badge className="bg-amber-100 text-amber-700 text-xs">Featured</Badge>}
                      {product.is_new && <Badge className="bg-green-100 text-green-700 text-xs">New</Badge>}
                      {product.is_flash_deal && <Badge className="bg-rose-100 text-rose-700 text-xs">Flash</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 lg:gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9" onClick={() => handleEdit(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9" onClick={() => handleDelete(product.id)}>
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
            <DialogTitle className="text-xl font-semibold">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Product Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated if empty"
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Price *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Sale Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.sale_price}
                    onChange={e => setFormData({ ...formData, sale_price: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={value => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Images</Label>
                <div className="flex flex-wrap gap-3 mt-2">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => setFormData({ 
                          ...formData, 
                          images: formData.images.filter((_, i) => i !== idx) 
                        })}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                    <Upload className="w-6 h-6 text-gray-400" />
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
              </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Sizes (comma separated)</Label>
                  <Input
                    value={formData.sizes.join(', ')}
                    onChange={e => setFormData({ ...formData, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="XS, S, M, L, XL"
                  />
                </div>
                <div>
                  <Label>Colors (name:hex, comma separated)</Label>
                  <Input
                    value={formData.colors.map(c => `${c.name}:${c.hex}`).join(', ')}
                    onChange={e => {
                      const colors = e.target.value.split(',').map(c => {
                        const [name, hex] = c.split(':').map(s => s.trim());
                        return name && hex ? { name, hex } : null;
                      }).filter(Boolean);
                      setFormData({ ...formData, colors });
                    }}
                    placeholder="Black:#000, White:#FFF"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={checked => setFormData({ ...formData, featured: checked })}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_new}
                    onCheckedChange={checked => setFormData({ ...formData, is_new: checked })}
                  />
                  New Arrival
                </label>
                <label className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_flash_deal}
                    onCheckedChange={checked => setFormData({ ...formData, is_flash_deal: checked })}
                  />
                  Flash Deal
                </label>
              </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full sm:w-auto">
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingProduct ? 'Update' : 'Create'} Product
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}