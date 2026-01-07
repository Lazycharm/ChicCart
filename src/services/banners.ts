import { supabase } from '@/lib/supabaseClient';

export interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image: string;
  link?: string;
  cta_text?: string;
  position?: string;
  is_active?: boolean;
  display_order?: number;
  created_at?: string;
}

export async function getBanners(filters?: Record<string, any>, orderBy?: string) {
  let query = supabase
    .from('banners')
    .select('*');

  // Apply filters
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
  }

  // Handle ordering
  if (orderBy) {
    const ascending = !orderBy.startsWith('-');
    const column = orderBy.replace(/^-/, '');
    query = query.order(column, { ascending });
  } else {
    query = query.order('display_order', { ascending: true });
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getAllBanners(orderBy?: string) {
  let query = supabase
    .from('banners')
    .select('*');

  if (orderBy) {
    const ascending = !orderBy.startsWith('-');
    const column = orderBy.replace(/^-/, '');
    query = query.order(column, { ascending });
  } else {
    query = query.order('display_order', { ascending: true });
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data || [];
}

export async function createBanner(banner: Partial<Banner>) {
  const { data, error } = await supabase
    .from('banners')
    .insert([banner])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateBanner(id: string, updates: Partial<Banner>) {
  const { data, error } = await supabase
    .from('banners')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteBanner(id: string) {
  const { error } = await supabase
    .from('banners')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

