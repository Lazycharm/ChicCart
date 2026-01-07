import { supabase } from '@/lib/supabaseClient';

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export async function getPages(orderBy?: string) {
  let query = supabase
    .from('pages')
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

export async function getPageBySlug(slug: string) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

export async function getPageById(id: string) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createPage(page: Partial<Page>) {
  const { data, error } = await supabase
    .from('pages')
    .insert([page])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePage(id: string, updates: Partial<Page>) {
  const { data, error } = await supabase
    .from('pages')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePage(id: string) {
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

