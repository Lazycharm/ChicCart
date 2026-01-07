import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllBanners, createBanner, updateBanner, deleteBanner } from '@/services/banners';
import { useAuth } from '@/components/ui/AuthContext';
import { uploadFile } from '@/services/storage';
import AdminLayout from '@/Components/admin/AdminLayout';
import ResponsiveTable from '@/Components/admin/ResponsiveTable';
import { 
  Image, Plus, Edit, Trash2, Loader2, Upload, ArrowUp, ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { toast } from 'sonner';

export default function AdminBanners() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    link: '',
    cta_text: 'Shop Now',
    position: 'hero',
    is_active: true,
    display_order: 0
  });

  const queryClient = useQueryClient();
  const { user, loading: authLoading } = useAuth();

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => getAllBanners('display_order')
  });

  const createMutation = useMutation({
    mutationFn: (data) => createBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-banners']);
      queryClient.invalidateQueries(['banners']);
      toast.success('Hero slider created successfully!');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to create banner: ' + error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateBanner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-banners']);
      queryClient.invalidateQueries(['banners']);
      toast.success('Hero slider updated successfully!');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to update banner: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-banners']);
      queryClient.invalidateQueries(['banners']);
      toast.success('Hero slider deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete banner: ' + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      link: '',
      cta_text: 'Shop Now',
      position: 'hero',
      is_active: true,
      display_order: banners.length
    });
    setEditingBanner(null);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      image: banner.image || '',
      link: banner.link || '',
      cta_text: banner.cta_text || 'Shop Now',
      position: banner.position || 'hero',
      is_active: banner.is_active !== false,
      display_order: banner.display_order || 0
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
      const url = await uploadFile(file, 'banners');
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
      display_order: parseInt(formData.display_order) || 0
    };

    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Delete this hero slider? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleOrderChange = async (banner, direction) => {
    const currentIndex = banners.findIndex(b => b.id === banner.id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= banners.length) return;

    const targetBanner = banners[newIndex];
    
    try {
      await updateBanner(banner.id, { display_order: targetBanner.display_order });
      await updateBanner(targetBanner.id, { display_order: banner.display_order });
      queryClient.invalidateQueries(['admin-banners']);
      queryClient.invalidateQueries(['banners']);
      toast.success('Order updated!');
    } catch (error) {
      toast.error('Failed to update order: ' + error.message);
    }
  };

  const heroBanners = banners.filter(b => b.position === 'hero');

  return (
    <AdminLayout
      title="Hero Sliders"
      description="Manage hero section sliders on the homepage"
      actionButton={
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-rose-500 hover:bg-rose-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Slider
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        </div>
      ) : heroBanners.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 lg:p-12 text-center">
          <Image className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg lg:text-xl font-semibold mb-2 text-gray-900">No hero sliders yet</h3>
          <p className="text-sm lg:text-base text-gray-600 mb-6">Create your first hero slider to display on the homepage</p>
          <Button onClick={() => { resetForm(); setIsDialogOpen(true); }} className="bg-rose-500 hover:bg-rose-600">
            <Plus className="w-4 h-4 mr-2" />
            Add First Slider
          </Button>
        </div>
      ) : (
        <ResponsiveTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 min-w-[64px]">Order</TableHead>
                <TableHead className="min-w-[100px]">Preview</TableHead>
                <TableHead className="min-w-[150px]">Title</TableHead>
                <TableHead className="min-w-[150px]">Subtitle</TableHead>
                <TableHead className="min-w-[150px]">Link</TableHead>
                <TableHead className="min-w-[100px]">Status</TableHead>
                <TableHead className="text-right min-w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {heroBanners.map((banner, index) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleOrderChange(banner, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOrderChange(banner, 'down')}
                        disabled={index === heroBanners.length - 1}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-16 h-10 lg:w-20 lg:h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                      <img 
                        src={banner.image} 
                        alt={banner.title || 'Banner'} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/200x120?text=No+Image'; }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-sm lg:text-base text-gray-900">{banner.title || '-'}</TableCell>
                  <TableCell className="text-sm lg:text-base text-gray-700">{banner.subtitle || '-'}</TableCell>
                  <TableCell>
                    <a href={banner.link || '#'} target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline text-xs lg:text-sm truncate block max-w-[150px]">
                      {banner.link || '-'}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${banner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {banner.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 lg:gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 lg:h-9 lg:w-9"
                        onClick={() => handleEdit(banner)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 lg:h-9 lg:w-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(banner.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ResponsiveTable>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{editingBanner ? 'Edit Hero Slider' : 'Create Hero Slider'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Summer Collection"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle *</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="e.g., UP TO 50% OFF"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Light fabrics, bold colors, and effortless elegance"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image *</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Image URL or upload file"
                    required
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
                <div className="mt-2 w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-2">
                <Label htmlFor="link" className="text-sm font-medium">Link URL</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="e.g., /shop or /shop?filter=sale"
                  className="mt-1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta_text" className="text-sm font-medium">Button Text</Label>
                <Input
                  id="cta_text"
                  value={formData.cta_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, cta_text: e.target.value }))}
                  placeholder="e.g., Shop Now"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-2">
                <Label htmlFor="display_order" className="text-sm font-medium">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  min="0"
                  className="mt-1"
                />
              </div>
              <div className="flex items-center gap-4 pt-6">
                <Label htmlFor="is_active" className="cursor-pointer text-sm font-medium">Active</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-rose-500 hover:bg-rose-600 w-full sm:w-auto"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  editingBanner ? 'Update Slider' : 'Create Slider'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

