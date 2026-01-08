import { supabase } from '@/lib/supabaseClient';

export interface StoreSettings {
  id?: string;
  store_name: string;
  store_email: string;
  store_phone?: string;
  store_address?: string;
  store_city?: string;
  store_state?: string;
  store_zip?: string;
  store_country?: string;
  currency: string;
  currency_symbol: string;
  language: string;
  timezone?: string;
  tax_rate?: number;
  free_shipping_threshold?: number;
  default_shipping_rate?: number;
  social_facebook?: string;
  social_instagram?: string;
  social_twitter?: string;
  social_youtube?: string;
  meta_title?: string;
  meta_description?: string;
  logo_url?: string;
  favicon_url?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getSettings() {
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw error;
  }

  // Return default settings if none exist
  if (!data) {
    return {
      store_name: 'LUXE',
      store_email: 'support@luxe.com',
      currency: 'USD',
      currency_symbol: '$',
      language: 'en',
      tax_rate: 0,
      free_shipping_threshold: 50,
      default_shipping_rate: 9.99,
    } as StoreSettings;
  }

  return data;
}

export async function updateSettings(settings: Partial<StoreSettings>) {
  // Check if any settings exist
  const { data: existing, error: checkError } = await supabase
    .from('store_settings')
    .select('id')
    .limit(1)
    .single();
  
  // If no row exists or error is PGRST116 (no rows), create new
  if (!existing || (checkError && checkError.code === 'PGRST116')) {
    const { data, error } = await supabase
      .from('store_settings')
      .insert([{
        ...settings,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
  
  // Update existing (use first row's id)
  const { data: allSettings } = await supabase
    .from('store_settings')
    .select('id')
    .limit(1);
  
  if (allSettings && allSettings.length > 0) {
    const { data, error } = await supabase
      .from('store_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', allSettings[0].id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
  
  // Fallback: create new
  const { data, error } = await supabase
    .from('store_settings')
    .insert([{
      ...settings,
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

