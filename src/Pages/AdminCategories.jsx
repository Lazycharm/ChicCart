import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/services/categories';
import { useAuth } from '@/components/ui/AuthContext';
import AdminLayout from '@/Components/admin/AdminLayout';
import ResponsiveTable from '@/Components/admin/ResponsiveTable';
import { Plus, Edit, Trash2, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { toast } from 'sonner';
import { uploadFile } from '@/services/storage';

export default function AdminCategories() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    display_order: 0
  });

  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories('display_order')
  });

  const createMutation = useMutation({
    mutationFn: (data) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category created successfully!');
      setIsDialogOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category updated successfully!');
      setIsDialogOpen(false);
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category deleted successfully!');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      display_order: 0
    });
    setEditingCategory(null);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      image: category.image || '',
      display_order: category.display_order || 0
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadFile(file, 'categories');
      setFormData(prev => ({ ...prev, image: url }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      display_order: parseInt(formData.display_order) || 0
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this category? Products in this category will need to be reassigned.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout
      title="Categories"
      description={`${categories.length} product categories`}
      actionButton={
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      }
    >
      {/* Categories Table */}
      <ResponsiveTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[80px]">Image</TableHead>
              <TableHead className="min-w-[150px]">Name</TableHead>
              <TableHead className="min-w-[150px]">Slug</TableHead>
              <TableHead className="min-w-[200px]">Description</TableHead>
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
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No categories yet. Create your first category.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No image</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-sm lg:text-base text-gray-900">{category.name}</TableCell>
                  <TableCell className="font-mono text-xs lg:text-sm text-gray-600">{category.slug}</TableCell>
                  <TableCell className="text-sm lg:text-base text-gray-700 line-clamp-2">{category.description || '-'}</TableCell>
                  <TableCell className="text-sm lg:text-base text-gray-700">{category.display_order || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 lg:gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9" onClick={() => handleEdit(category)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9" onClick={() => handleDelete(category.id)}>
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
            <DialogTitle className="text-xl font-semibold">{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <Label className="text-sm font-medium">Name *</Label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="auto-generated if empty"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Image</Label>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex-1">
                  <Input
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Image URL or upload file"
                  />
                </div>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  <Button type="button" variant="outline" disabled={uploading}>
                    {uploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Upload
                  </Button>
                </label>
              </div>
              {formData.image && (
                <div className="mt-2 w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

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
                {editingCategory ? 'Update' : 'Create'} Category
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

