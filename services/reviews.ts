import { supabase } from '@/lib/supabaseClient';

export interface Review {
  id: string;
  product_id: string;
  user_name: string;
  user_email?: string;
  rating: number;
  comment?: string;
  created_at?: string;
}

export async function getReviews(filters?: Record<string, any>) {
  let query = supabase
    .from('reviews')
    .select('*');

  // Apply filters
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data || [];
}

export async function createReview(review: Partial<Review>) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateReview(id: string, updates: Partial<Review>) {
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteReview(id: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

