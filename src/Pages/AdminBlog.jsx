import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, getBlogCategories, createBlogCategory, updateBlogCategory, deleteBlogCategory } from '@/services/blog';
import { useAuth } from '@/components/ui/AuthContext';
import AdminLayout from '@/Components/admin/AdminLayout';
import ResponsiveTable from '@/Components/admin/ResponsiveTable';
import { Plus, Edit, Trash2, Loader2, FileText, Tag, Upload } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { uploadFile } from '@/services/storage';
import { format } from 'date-fns';

export default function AdminBlog() {
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [postFormData, setPostFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category_id: '',
    tags: [] as string[],
    is_published: false,
    meta_title: '',
    meta_description: ''
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    description: '',
    display_order: 0
  });
  const [tagInput, setTagInput] = useState('');

  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: () => getBlogPosts({}, '-created_at')
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: () => getBlogCategories('display_order')
  });

  const createPostMutation = useMutation({
    mutationFn: (data) => createBlogPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-blog-posts']);
      queryClient.invalidateQueries(['blog-posts']);
      toast.success('Blog post created!');
      setIsPostDialogOpen(false);
      resetPostForm();
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }) => updateBlogPost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-blog-posts']);
      queryClient.invalidateQueries(['blog-posts']);
      toast.success('Blog post updated!');
      setIsPostDialogOpen(false);
      resetPostForm();
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: (id) => deleteBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-blog-posts']);
      queryClient.invalidateQueries(['blog-posts']);
      toast.success('Blog post deleted!');
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data) => createBlogCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['blog-categories']);
      toast.success('Category created!');
      setIsCategoryDialogOpen(false);
      resetCategoryForm();
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) => updateBlogCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['blog-categories']);
      toast.success('Category updated!');
      setIsCategoryDialogOpen(false);
      resetCategoryForm();
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => deleteBlogCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['blog-categories']);
      toast.success('Category deleted!');
    }
  });

  const resetPostForm = () => {
    setPostFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      category_id: '',
      tags: [],
      is_published: false,
      meta_title: '',
      meta_description: ''
    });
    setEditingPost(null);
    setTagInput('');
  };

  const resetCategoryForm = () => {
    setCategoryFormData({ name: '', slug: '', description: '', display_order: 0 });
    setEditingCategory(null);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setPostFormData({
      title: post.title || '',
      slug: post.slug || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      featured_image: post.featured_image || '',
      category_id: post.category_id || '',
      tags: post.tags || [],
      is_published: post.is_published || false,
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || ''
    });
    setIsPostDialogOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      display_order: category.display_order || 0
    });
    setIsCategoryDialogOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadFile(file, 'blog');
      setPostFormData(prev => ({ ...prev, featured_image: url }));
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Failed to upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !postFormData.tags.includes(tagInput.trim())) {
      setPostFormData({
        ...postFormData,
        tags: [...postFormData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setPostFormData({
      ...postFormData,
      tags: postFormData.tags.filter(t => t !== tag)
    });
  };

  return (
    <AdminLayout
      title="Blog"
      description="Manage blog posts and categories"
      actionButton={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { resetCategoryForm(); setIsCategoryDialogOpen(true); }}>
            <Tag className="w-4 h-4 mr-2" /> Categories
          </Button>
          <Button onClick={() => { resetPostForm(); setIsPostDialogOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> New Post
          </Button>
        </div>
      }
    >
      {/* Blog Posts Table */}
      <ResponsiveTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Title</TableHead>
              <TableHead className="min-w-[120px]">Category</TableHead>
              <TableHead className="min-w-[100px]">Tags</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[120px]">Date</TableHead>
              <TableHead className="text-right min-w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {postsLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-rose-500" />
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No blog posts. Create your first post.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium text-sm lg:text-base text-gray-900">{post.title}</TableCell>
                  <TableCell>
                    {post.category_name ? (
                      <Badge className="text-xs bg-blue-100 text-blue-700">{post.category_name}</Badge>
                    ) : (
                      <span className="text-xs text-gray-400">Uncategorized</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {post.tags?.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                      {post.tags?.length > 2 && <span className="text-xs text-gray-400">+{post.tags.length - 2}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${post.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs lg:text-sm text-gray-600">
                    {post.created_at && format(new Date(post.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 lg:gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9" onClick={() => handleEditPost(post)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 lg:h-9 lg:w-9" onClick={() => {
                        if (confirm('Delete this post?')) {
                          deletePostMutation.mutate(post.id);
                        }
                      }}>
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

      {/* Post Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {editingPost ? 'Edit Blog Post' : 'Create Blog Post'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const data = {
              ...postFormData,
              slug: postFormData.slug || postFormData.title.toLowerCase().replace(/\s+/g, '-'),
              author_id: user?.id,
              author_name: user?.full_name || user?.name,
              published_at: postFormData.is_published && !editingPost ? new Date().toISOString() : undefined
            };
            if (editingPost) {
              updatePostMutation.mutate({ id: editingPost.id, data });
            } else {
              createPostMutation.mutate(data);
            }
          }} className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <Label className="text-sm font-medium">Title *</Label>
                <Input
                  value={postFormData.title}
                  onChange={e => setPostFormData({ ...postFormData, title: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Slug</Label>
                <Input
                  value={postFormData.slug}
                  onChange={e => setPostFormData({ ...postFormData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="auto-generated"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Excerpt</Label>
              <Textarea
                value={postFormData.excerpt}
                onChange={e => setPostFormData({ ...postFormData, excerpt: e.target.value })}
                rows={2}
                className="mt-1"
                placeholder="Short description for preview"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Content *</Label>
              <Textarea
                value={postFormData.content}
                onChange={e => setPostFormData({ ...postFormData, content: e.target.value })}
                rows={12}
                required
                className="mt-1 font-mono text-sm"
                placeholder="Blog post content. HTML and Markdown supported."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <Select
                  value={postFormData.category_id}
                  onValueChange={value => setPostFormData({ ...postFormData, category_id: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Uncategorized</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Featured Image URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={postFormData.featured_image}
                    onChange={e => setPostFormData({ ...postFormData, featured_image: e.target.value })}
                    placeholder="Image URL"
                  />
                  <label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                    <Button type="button" variant="outline" disabled={uploading}>
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    </Button>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Tags</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag and press Enter"
                />
                <Button type="button" onClick={addTag}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {postFormData.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1">×</button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <Label className="text-sm font-medium">Meta Title</Label>
                <Input
                  value={postFormData.meta_title}
                  onChange={e => setPostFormData({ ...postFormData, meta_title: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Meta Description</Label>
                <Input
                  value={postFormData.meta_description}
                  onChange={e => setPostFormData({ ...postFormData, meta_description: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={postFormData.is_published}
                onCheckedChange={checked => setPostFormData({ ...postFormData, is_published: checked })}
              />
              <Label className="text-sm font-medium">Published</Label>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={() => { setIsPostDialogOpen(false); resetPostForm(); }} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" disabled={createPostMutation.isPending || updatePostMutation.isPending} className="w-full sm:w-auto">
                {(createPostMutation.isPending || updatePostMutation.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingPost ? 'Update' : 'Create'} Post
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Manage Categories</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="max-h-64 overflow-y-auto space-y-2">
              {categoriesLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              ) : categories.length === 0 ? (
                <p className="text-center text-gray-500 py-4 text-sm">No categories</p>
              ) : (
                categories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium text-sm">{cat.name}</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditCategory(cat)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                        if (confirm('Delete category?')) {
                          deleteCategoryMutation.mutate(cat.id);
                        }
                      }}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const data = {
                ...categoryFormData,
                slug: categoryFormData.slug || categoryFormData.name.toLowerCase().replace(/\s+/g, '-'),
                display_order: parseInt(categoryFormData.display_order) || 0
              };
              if (editingCategory) {
                updateCategoryMutation.mutate({ id: editingCategory.id, data });
              } else {
                createCategoryMutation.mutate(data);
              }
            }} className="space-y-4 border-t pt-4">
              <div>
                <Label>Category Name *</Label>
                <Input
                  value={categoryFormData.name}
                  onChange={e => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={categoryFormData.slug}
                  onChange={e => setCategoryFormData({ ...categoryFormData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={categoryFormData.description}
                  onChange={e => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  rows={2}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => { setIsCategoryDialogOpen(false); resetCategoryForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}>
                  {editingCategory ? 'Update' : 'Create'} Category
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

