import { supabase } from '@/lib/supabaseClient';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author_id?: string;
  author_name?: string;
  category_id?: string;
  category_name?: string;
  tags?: string[]; // Array of tag names
  is_published: boolean;
  published_at?: string;
  views?: number;
  meta_title?: string;
  meta_description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  display_order?: number;
  created_at?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export async function getBlogPosts(filters?: Record<string, any>, orderBy?: string, limit?: number) {
  let query = supabase
    .from('blog_posts')
    .select('*');

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'is_published') {
          query = query.eq(key, value);
        } else if (key === 'category_id') {
          query = query.eq(key, value);
        } else if (key === 'tags') {
          query = query.contains('tags', [value]);
        } else {
          query = query.ilike(key, `%${value}%`);
        }
      }
    });
  }

  if (orderBy) {
    const ascending = !orderBy.startsWith('-');
    const column = orderBy.replace(/^-/, '');
    query = query.order(column, { ascending });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  
  // Fetch categories and merge category names
  const posts = data || [];
  if (posts.length > 0) {
    const categoryIds = [...new Set(posts.map(p => p.category_id).filter(Boolean))];
    if (categoryIds.length > 0) {
      const { data: categories } = await supabase
        .from('blog_categories')
        .select('id, name, slug')
        .in('id', categoryIds);
      
      const categoryMap = new Map((categories || []).map(cat => [cat.id, cat]));
      
      return posts.map(post => ({
        ...post,
        category_name: post.category_id ? categoryMap.get(post.category_id)?.name : null,
        category_slug: post.category_id ? categoryMap.get(post.category_id)?.slug : null,
      }));
    }
  }
  
  return posts.map(post => ({
    ...post,
    category_name: null,
    category_slug: null,
  }));
}

export async function getPublishedBlogPosts(limit?: number) {
  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

export async function getBlogPostById(id: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createBlogPost(post: Partial<BlogPost>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBlogPost(id: string) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getBlogCategories(orderBy?: string) {
  let query = supabase
    .from('blog_categories')
    .select('*');

  if (orderBy) {
    const ascending = !orderBy.startsWith('-');
    const column = orderBy.replace(/^-/, '');
    query = query.order(column, { ascending });
  } else {
    query = query.order('display_order', { ascending: true });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createBlogCategory(category: Partial<BlogCategory>) {
  const { data, error } = await supabase
    .from('blog_categories')
    .insert([category])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBlogCategory(id: string, updates: Partial<BlogCategory>) {
  const { data, error } = await supabase
    .from('blog_categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBlogCategory(id: string) {
  const { error } = await supabase
    .from('blog_categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

