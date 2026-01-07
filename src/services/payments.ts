import { supabase } from '@/lib/supabaseClient';

export interface PaymentProvider {
  id: string;
  name: string;
  type: 'stripe' | 'paypal' | 'cash_on_delivery' | 'bank_transfer' | 'other';
  is_enabled: boolean;
  is_test_mode: boolean;
  api_key?: string;
  api_secret?: string;
  webhook_secret?: string;
  public_key?: string;
  merchant_id?: string;
  additional_config?: Record<string, any>;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export async function getPaymentProviders(orderBy?: string) {
  let query = supabase
    .from('payment_providers')
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

export async function getEnabledPaymentProviders() {
  const { data, error } = await supabase
    .from('payment_providers')
    .select('*')
    .eq('is_enabled', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createPaymentProvider(provider: Partial<PaymentProvider>) {
  const { data, error } = await supabase
    .from('payment_providers')
    .insert([provider])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePaymentProvider(id: string, updates: Partial<PaymentProvider>) {
  const { data, error } = await supabase
    .from('payment_providers')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePaymentProvider(id: string) {
  const { error } = await supabase
    .from('payment_providers')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

