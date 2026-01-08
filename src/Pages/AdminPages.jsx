import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPages, createPage, updatePage, deletePage, getPageById } from '@/services/pages';
import { useAuth } from '@/components/ui/AuthContext';
import AdminLayout from '@/Components/admin/AdminLayout';
import ResponsiveTable from '@/Components/admin/ResponsiveTable';
import { Plus, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
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

const defaultPages = [
  { slug: 'about', title: 'About Us' },
  { slug: 'contact', title: 'Contact' },
  { slug: 'faq', title: 'FAQ' },
  { slug: 'privacy', title: 'Privacy Policy' },
  { slug: 'terms', title: 'Terms & Conditions' },
  { slug: 'returns', title: 'Returns & Refunds' },
];

export default function AdminPages() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    meta_title: '',
    meta_description: '',
    is_published: true,
    display_order: 0
  });

  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['admin-pages'],
    queryFn: () => getPages('display_order')
  });

  const createMutation = useMutation({
    mutationFn: (data) => createPage(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-pages']);
      queryClient.invalidateQueries(['pages']);
      toast.success('Page created successfully!');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to create page: ' + error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updatePage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-pages']);
      queryClient.invalidateQueries(['pages']);
      toast.success('Page updated successfully!');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to update page: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deletePage(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-pages']);
      queryClient.invalidateQueries(['pages']);
      toast.success('Page deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete page: ' + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      content: '',
      meta_title: '',
      meta_description: '',
      is_published: true,
      display_order: 0
    });
    setEditingPage(null);
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug || '',
      title: page.title || '',
      content: page.content || '',
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      is_published: page.is_published !== false,
      display_order: page.display_order || 0
    });
    setIsDialogOpen(true);
  };

  const handleCreateDefault = async (defaultPage) => {
    const existing = pages.find(p => p.slug === defaultPage.slug);
    if (existing) {
      handleEdit(existing);
      return;
    }

    setFormData({
      slug: defaultPage.slug,
      title: defaultPage.title,
      content: `# ${defaultPage.title}\n\nContent for ${defaultPage.title} page.`,
      meta_title: defaultPage.title,
      meta_description: `Learn more about ${defaultPage.title}`,
      is_published: true,
      display_order: pages.length
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      display_order: parseInt(formData.display_order) || 0
    };

    if (editingPage) {
      updateMutation.mutate({ id: editingPage.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <AdminLayout
      title="Pages"
      description="Manage static pages (About, Contact, FAQ, etc.)"
      actionButton={
        <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Page
        </Button>
      }
    >
      {/* Default Pages Quick Create */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Create Default Pages</h3>
        <div className="flex flex-wrap gap-2">
          {defaultPages.map(page => {
            const exists = pages.some(p => p.slug === page.slug);
            return (
              <Button
                key={page.slug}
                variant={exists ? "outline" : "default"}
                size="sm"
                onClick={() => handleCreateDefault(page)}
              >
                {exists ? <Eye className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {page.title}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Pages Table */}
      <ResponsiveTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Page</TableHead>
              <TableHead className="min-w-[200px]">Title</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[80px]">Order</TableHead>
              <TableHead className="text-right min-w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-rose-500" />
                </TableCell>
              </TableRow>
            ) : pages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No pages yet. Create your first page or use quick create above.
                </TableCell>
              </TableRow>
            ) : (
              pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>
                    <div className="font-mono text-sm lg:text-base text-gray-900">/{page.slug}</div>
                  </TableCell>
                  <TableCell className="font-medium text-sm lg:text-base text-gray-900">{page.title}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${page.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {page.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm lg:text-base text-gray-700">{page.display_order || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 lg:gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9" onClick={() => handleEdit(page)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9" onClick={() => handleDelete(page.id)}>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{editingPage ? 'Edit Page' : 'Create Page'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <Label className="text-sm font-medium">Slug *</Label>
                <Input
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="about-us"
                  required
                  className="mt-1"
                  disabled={!!editingPage}
                />
                <p className="text-xs text-gray-500 mt-1">URL-friendly identifier (cannot be changed after creation)</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Display Order</Label>
                <Input
                  type="number"
                  value={formData.display_order}
                  onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Title *</Label>
              <Input
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Content *</Label>
              <Textarea
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                required
                className="mt-1 font-mono text-sm"
                placeholder="Enter page content. HTML and Markdown supported."
              />
              <p className="text-xs text-gray-500 mt-1">Supports HTML and Markdown formatting</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <Label className="text-sm font-medium">Meta Title</Label>
                <Input
                  value={formData.meta_title}
                  onChange={e => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="SEO title"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Meta Description</Label>
                <Input
                  value={formData.meta_description}
                  onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="SEO description"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={formData.is_published}
                onCheckedChange={checked => setFormData({ ...formData, is_published: checked })}
              />
              <Label className="text-sm font-medium">Published</Label>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full sm:w-auto">
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingPage ? 'Update' : 'Create'} Page
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

