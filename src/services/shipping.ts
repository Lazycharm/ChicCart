import { supabase } from '@/lib/supabaseClient';

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[]; // Array of country codes
  is_active: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ShippingRate {
  id: string;
  zone_id: string;
  name: string;
  carrier?: string;
  method: 'flat' | 'weight' | 'price' | 'free';
  rate: number;
  min_order_value?: number;
  max_order_value?: number;
  min_weight?: number;
  max_weight?: number;
  estimated_days?: number;
  is_active: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export async function getShippingZones(orderBy?: string) {
  let query = supabase
    .from('shipping_zones')
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

export async function getShippingRates(zoneId?: string) {
  let query = supabase
    .from('shipping_rates')
    .select('*');

  if (zoneId) {
    query = query.eq('zone_id', zoneId);
  }

  query = query.order('display_order', { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createShippingZone(zone: Partial<ShippingZone>) {
  const { data, error } = await supabase
    .from('shipping_zones')
    .insert([zone])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateShippingZone(id: string, updates: Partial<ShippingZone>) {
  const { data, error } = await supabase
    .from('shipping_zones')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteShippingZone(id: string) {
  const { error } = await supabase
    .from('shipping_zones')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function createShippingRate(rate: Partial<ShippingRate>) {
  const { data, error } = await supabase
    .from('shipping_rates')
    .insert([rate])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateShippingRate(id: string, updates: Partial<ShippingRate>) {
  const { data, error } = await supabase
    .from('shipping_rates')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteShippingRate(id: string) {
  const { error } = await supabase
    .from('shipping_rates')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

