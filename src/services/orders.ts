import { supabase } from '@/lib/supabaseClient';

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method?: string;
  payment_status?: string;
  shipping_address?: ShippingAddress;
  tracking_number?: string;
  created_at?: string;
  created_date?: string;
}

export async function getOrders(filters?: Record<string, any>, orderBy?: string, limit?: number) {
  let query = supabase
    .from('orders')
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

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    created_date: item.created_at
  }));
}

export async function getAllOrders(orderBy?: string, limit?: number) {
  let query = supabase
    .from('orders')
    .select('*');

  if (orderBy) {
    const ascending = !orderBy.startsWith('-');
    const column = orderBy.replace(/^-/, '');
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

  return (data || []).map(item => ({
    ...item,
    created_date: item.created_at
  }));
}

export async function createOrder(order: Partial<Order>) {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
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

export async function updateOrder(id: string, updates: Partial<Order>) {
  const { data, error } = await supabase
    .from('orders')
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

export async function deleteOrder(id: string) {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

