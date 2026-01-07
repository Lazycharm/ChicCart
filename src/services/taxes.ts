import { supabase } from '@/lib/supabaseClient';

export interface TaxRule {
  id: string;
  name: string;
  rate: number;
  type: 'percentage' | 'fixed';
  applies_to: 'all' | 'products' | 'shipping' | 'both';
  countries?: string[]; // Array of country codes, empty = all countries
  states?: string[]; // Array of state codes, empty = all states
  product_categories?: string[]; // Array of category IDs
  is_active: boolean;
  priority?: number; // Higher priority rules apply first
  created_at?: string;
  updated_at?: string;
}

export async function getTaxRules(orderBy?: string) {
  let query = supabase
    .from('tax_rules')
    .select('*');

  if (orderBy) {
    const ascending = !orderBy.startsWith('-');
    const column = orderBy.replace(/^-/, '');
    query = query.order(column, { ascending });
  } else {
    query = query.order('priority', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getTaxRuleById(id: string) {
  const { data, error } = await supabase
    .from('tax_rules')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createTaxRule(rule: Partial<TaxRule>) {
  const { data, error } = await supabase
    .from('tax_rules')
    .insert([rule])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTaxRule(id: string, updates: Partial<TaxRule>) {
  const { data, error } = await supabase
    .from('tax_rules')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTaxRule(id: string) {
  const { error } = await supabase
    .from('tax_rules')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

