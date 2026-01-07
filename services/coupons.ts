import { supabase } from '@/lib/supabaseClient';

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order?: number;
  max_uses?: number;
  used_count?: number;
  expires_at?: string;
  is_active?: boolean;
  created_at?: string;
}

export async function getCoupons(filters?: Record<string, any>, orderBy?: string) {
  let query = supabase
    .from('coupons')
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
    const mappedColumn = column === 'created_date' ? 'created_at' : column;
    query = query.order(mappedColumn, { ascending });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getAllCoupons(orderBy?: string) {
  let query = supabase
    .from('coupons')
    .select('*');

  if (orderBy) {
    const ascending = !orderBy.startsWith('-');
    const column = orderBy.replace(/^-/, '');
    const mappedColumn = column === 'created_date' ? 'created_at' : column;
    query = query.order(mappedColumn, { ascending });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data || [];
}

export async function createCoupon(coupon: Partial<Coupon>) {
  const { data, error } = await supabase
    .from('coupons')
    .insert([coupon])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCoupon(id: string, updates: Partial<Coupon>) {
  const { data, error } = await supabase
    .from('coupons')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteCoupon(id: string) {
  const { error } = await supabase
    .from('coupons')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

