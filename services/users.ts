import { supabase } from '@/lib/supabaseClient';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  created_at?: string;
}

export async function getUsers(orderBy?: string) {
  let query = supabase
    .from('users')
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

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    return null;
  }

  // Get user profile from users table if it exists
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile || {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || user.email,
    role: user.user_metadata?.role || 'user'
  };
}

export async function isAuthenticated() {
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signUp(email: string, password: string, metadata?: Record<string, any>) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });

  if (error) {
    throw error;
  }

  return data;
}

// Helper function to redirect to login (for compatibility with Base44 pattern)
export function redirectToLogin() {
  // You can implement your own login redirect logic here
  // For now, we'll just redirect to a login page if it exists
  window.location.href = '/login';
}

