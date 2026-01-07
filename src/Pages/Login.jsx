import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { signIn, signUp } from '@/services/users';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/ui/AuthContext';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated (but only after auth state is loaded)
  useEffect(() => {
    // Only redirect if we're sure the user is authenticated AND they didn't come here intentionally
    // If they have a 'from' state, they came from a protected route - don't redirect
    // If they navigated here directly (no from state), redirect them away
    if (isAuthenticated && location.pathname === '/login') {
      // Only redirect if there's no 'from' state (meaning they navigated here directly)
      if (!location.state?.from) {
        const timer = setTimeout(() => {
          const returnPath = location.state?.from?.pathname || createPageUrl('Home');
          navigate(returnPath, { replace: true });
        }, 300);
        return () => clearTimeout(timer);
      }
      // If they have 'from' state, they came from a protected route - let them stay to see the login form
      // (This shouldn't happen if they're authenticated, but just in case)
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Client-side validation
    if (!email || !password) {
      toast.error('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    if (isSignUp && !name.trim()) {
      toast.error('Please enter your name.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Try signup without metadata first to isolate the issue
        // Some Supabase projects have issues with metadata
        let result;
        try {
          // First attempt: with metadata if name is provided
          if (name.trim()) {
            const metadata = { name: name.trim() };
            result = await signUp(email, password, metadata);
          } else {
            // No metadata needed
            result = await signUp(email, password);
          }
        } catch (metadataError) {
          // If signup with metadata fails, try without metadata
          console.warn('Signup with metadata failed, trying without metadata:', metadataError);
          result = await signUp(email, password);
        }
        // Check if email confirmation is required
        if (result.user && !result.session) {
          toast.success('Account created! Please check your email to verify your account.');
          setIsSignUp(false);
          setEmail('');
          setPassword('');
          setName('');
        } else {
          toast.success('Account created successfully!');
          // Redirect to intended page or home
          const from = location.state?.from?.pathname || createPageUrl('Home');
          navigate(from, { replace: true });
        }
      } else {
        await signIn(email, password);
        toast.success('Welcome back!');
        // Redirect to intended page or home
        const from = location.state?.from?.pathname || createPageUrl('Home');
        navigate(from, { replace: true });
      }
    } catch (error) {
      // Extract error message from Supabase error object
      const errorObj = error || {};
      let errorMessage = errorObj?.message || errorObj?.error_description || 'An error occurred. Please try again.';
      
      // Log full error for debugging
      console.error('Auth error details:', {
        message: errorObj?.message,
        originalError: errorObj?.originalError,
        status: errorObj?.status,
        fullError: error
      });
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {isSignUp ? 'Create your account' : 'Sign in to your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="font-medium text-rose-500 hover:text-rose-600"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="font-medium text-rose-500 hover:text-rose-600"
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required={isSignUp}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm ${
                    isSignUp ? '' : 'rounded-t-md'
                  }`}
                  placeholder="Email address"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-b-md relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-rose-500 focus:border-rose-500 focus:z-10 sm:text-sm"
                  placeholder={isSignUp ? "Password (min. 6 characters)" : "Password"}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                'Please wait...'
              ) : (
                <>
                  {isSignUp ? 'Create account' : 'Sign in'}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              to={createPageUrl('Home')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

