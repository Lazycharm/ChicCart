import { supabase } from '@/lib/supabaseClient';
import { createPageUrl } from '@/utils';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  created_at?: string;
}

export async function getUsers(orderBy?: string) {
  let query = supabase
    .from('user_profiles')
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

  // Get user profile from user_profiles table if it exists
  const { data: profile } = await supabase
    .from('user_profiles')
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
  // Validate inputs
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const normalizedEmail = email.trim().toLowerCase();
  
  if (!emailRegex.test(normalizedEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  try {
    // Try signup with the most minimal configuration first
    // Some Supabase projects have issues with metadata or options
    console.log('Attempting signup with:', { 
      email: normalizedEmail, 
      emailLength: normalizedEmail.length,
      hasMetadata: !!metadata,
      metadataKeys: metadata ? Object.keys(metadata) : []
    });
    
    // First, try without any options at all
    let signUpOptions = {
      email: normalizedEmail,
      password
    };
    
    // Only add options if metadata exists and is not empty
    if (metadata && Object.keys(metadata).length > 0) {
      signUpOptions.options = {
        data: metadata
      };
    }
    
    // Add redirect URL for email confirmation if needed
    const redirectUrl = window.location.origin + '/auth/callback';
    if (!signUpOptions.options) {
      signUpOptions.options = {};
    }
    signUpOptions.options.emailRedirectTo = redirectUrl;
    
    console.log('Signup options being sent:', JSON.stringify(signUpOptions, null, 2));
    
    const { data, error } = await supabase.auth.signUp(signUpOptions);

    if (error) {
      // Log the full error for debugging
      console.error('Supabase signup error:', {
        message: error.message,
        status: error.status,
        name: error.name,
        fullError: error,
        email: normalizedEmail,
        redirectUrl: redirectUrl
      });

      // Provide more user-friendly error messages
      let errorMessage = error.message;
      
      // Handle specific Supabase error codes and messages
      if (error.status === 400) {
        if (error.message?.toLowerCase().includes('already registered') || 
            error.message?.toLowerCase().includes('already been registered') ||
            error.message?.toLowerCase().includes('user already registered')) {
          errorMessage = 'This email is already registered. Please sign in instead.';
        } else if (error.message?.toLowerCase().includes('invalid email') || 
                   (error.message?.toLowerCase().includes('email address') && error.message?.toLowerCase().includes('invalid'))) {
          // Check if it's really an invalid email or a configuration issue
          if (emailRegex.test(normalizedEmail)) {
            // Show more helpful error with actual Supabase message
            console.error('Configuration issue detected. Actual Supabase error:', error.message);
            errorMessage = `Unable to create account: ${error.message}. This might be a Supabase configuration issue. Please check: 1) URL Configuration in Supabase Dashboard, 2) Redirect URLs are set correctly, 3) Email confirmation settings.`;
          } else {
            errorMessage = 'Please enter a valid email address. Make sure it includes @ and a domain (e.g., example@email.com).';
          }
        } else if (error.message?.toLowerCase().includes('password')) {
          errorMessage = 'Password does not meet requirements. Please use at least 6 characters.';
        } else if (error.message?.toLowerCase().includes('rate limit')) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else {
          // For other 400 errors, show the actual message
          errorMessage = error.message || 'Unable to create account. Please check your information and try again.';
        }
      } else if (error.status === 422) {
        errorMessage = 'Invalid email or password format. Please check your input.';
      } else {
        // For any other error, show the actual message
        errorMessage = error.message || 'An error occurred during signup. Please try again.';
      }
      
      const authError = new Error(errorMessage);
      (authError as any).originalError = error;
      (authError as any).status = error.status;
      throw authError;
    }

    console.log('Signup successful:', data);
    return data;
  } catch (err: any) {
    // Re-throw our custom errors
    if (err.message && !err.originalError) {
      throw err;
    }
    // Handle unexpected errors
    console.error('Unexpected signup error:', err);
    throw new Error(err.message || 'An unexpected error occurred. Please try again.');
  }
}

// Helper function to redirect to login (for compatibility with Base44 pattern)
export function redirectToLogin() {
  // You can implement your own login redirect logic here
  // For now, we'll just redirect to a login page if it exists
  window.location.href = '/login';
}

