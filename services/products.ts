import { supabase } from '@/lib/supabaseClient';

export interface Product {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  sale_price?: number;
  category?: string;
  stock?: number;
  images?: string[];
  sizes?: string[];
  colors?: Array<{ name: string; hex: string }>;
  featured?: boolean;
  is_new?: boolean;
  is_flash_deal?: boolean;
  rating?: number;
  reviews_count?: number;
  created_at?: string;
  created_date?: string;
  meta_title?: string;
  meta_description?: string;
}

export async function getProducts(limit?: number, orderBy?: string) {
  let query = supabase
    .from('products')
    .select('*');

  // Handle ordering
  if (orderBy) {
    const ascending = !orderBy.startsWith('-');
    const column = orderBy.replace(/^-/, '');
    // Map Base44 field names to Supabase column names
    const mappedColumn = column === 'created_date' ? 'created_at' : column;
    query = query.order(mappedColumn, { ascending });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  // Map created_at to created_date for compatibility
  return (data || []).map(item => ({
    ...item,
    created_date: item.created_at
  }));
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data ? {
    ...data,
    created_date: data.created_at
  } : null;
}

export async function filterProducts(filters: Record<string, any>) {
  let query = supabase
    .from('products')
    .select('*');

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query = query.eq(key, value);
    }
  });

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    created_date: item.created_at
  }));
}

export async function createProduct(product: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    created_date: data.created_at
  };
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return {
    ...data,
    created_date: data.created_at
  };
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

