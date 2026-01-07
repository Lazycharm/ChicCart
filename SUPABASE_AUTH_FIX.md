# Supabase Authentication Signup Issue Fix

## Problem
Supabase is rejecting valid emails (e.g., "admin@gmail.com") with error: "Email address is invalid"

## Root Cause
This is typically a **Supabase project configuration issue**, not a code issue.

## Solutions

### 1. Check Supabase Dashboard Settings

Go to your Supabase Dashboard → **Authentication** → **Settings**

#### A. URL Configuration (CRITICAL - Check This First!)
Navigate to **Authentication** → **URL Configuration** (or **Settings** → **URL Configuration**)

**Site URL**: Should be set to:
- `http://localhost:5173` (for development)
- Your production URL when deployed

**Redirect URLs**: Add these URLs (one per line):
```
http://localhost:5173
http://localhost:5173/**
http://localhost:5173/auth/callback
```

**Important**: If redirect URLs are not configured, Supabase may reject signup requests!

#### B. Email Confirmation Settings
In **Authentication** → **Settings** → **Email**:
- **Enable email confirmations**: 
  - If **ON**: Users must verify email before signing in (redirect URLs must be configured)
  - If **OFF**: Users can sign in immediately after signup (easier for testing)
  
**For testing, you can temporarily disable email confirmations** to see if that's the issue.

#### C. Email Templates
Check **Authentication** → **Email Templates**:
- Ensure email templates are properly configured
- Check if there are any validation rules in the templates

#### D. Email Provider Settings (You've Already Checked This ✅)
Based on your settings screenshot:
- ✅ **Enable Email provider**: ON (correct)
- ✅ **Minimum password length**: 6 (matches our code)
- ✅ **Password Requirements**: No required characters (default - fine)

#### E. Additional Checks
- Check **Rate limiting** settings - might be blocking requests
- Verify **SMTP settings** if using custom email provider
- Check if there are any **email domain restrictions** in other settings

### 2. Quick Fix: Check URL Configuration First! ⚠️

**Most likely cause**: Missing or incorrect URL Configuration

1. Go to **Authentication** → **URL Configuration** (or **Settings** → **URL Configuration**)
2. Set **Site URL** to: `http://localhost:5173`
3. Add to **Redirect URLs**:
   ```
   http://localhost:5173
   http://localhost:5173/**
   ```
4. **Save** the settings
5. Try signing up again

### 3. Alternative Quick Fix: Disable Email Confirmation (Development)

If URL Configuration doesn't fix it, temporarily disable email confirmation:

1. Go to **Authentication** → **Settings** → **Email**
2. Find **"Enable email confirmations"** (might be in a different section)
3. **Disable** it temporarily for testing
4. Try signing up again

### 3. Check Project Status

- Ensure your Supabase project is **active** and not paused
- Check if you've hit any **usage limits**
- Verify your **API keys** are correct in `.env.local`

### 4. Test with Different Email

Try signing up with:
- A different email domain (not gmail.com)
- A different email format
- Check if the issue is specific to certain emails

### 5. Check Supabase Logs

1. Go to **Logs** → **Auth Logs** in Supabase Dashboard
2. Look for the failed signup attempt
3. Check the detailed error message

### 6. Verify Environment Variables

Make sure your `.env.local` has:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Alternative: Use Supabase Auth UI

If the issue persists, you can use Supabase's built-in Auth UI component instead of custom forms.

## Still Having Issues?

### Critical: Check Supabase Auth Logs

1. Go to **Logs** → **Auth Logs** in Supabase Dashboard
2. Find the failed signup attempt
3. Click on it to see the **detailed error message**
4. The detailed error will show the **actual reason** Supabase is rejecting the email

### Test: Create User Manually

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click **"Add user"** button
3. Try creating a user with email `admin@gmail.com` manually
4. If this also fails, it confirms it's a Supabase project configuration issue
5. If this works, there might be an issue with the API call format

### Check for Email Domain Restrictions

1. Go to **Authentication** → **Policies** (or check all settings)
2. Look for any **email domain restrictions** or **validation rules**
3. Check if there are any **custom validation functions**

### Possible Causes

Based on the consistent error, this could be:
- **Email domain blacklist**: Gmail.com might be blocked
- **Custom validation function**: A database function validating emails
- **Project-level restriction**: Some setting in Supabase project
- **API key permissions**: The anon key might have restrictions

### Next Steps

1. **Check Auth Logs** (most important - will show exact error)
2. **Try creating user manually** in dashboard
3. **Try a different email** (not gmail.com) to test if it's domain-specific
4. **Contact Supabase Support** if logs don't reveal the issue

### Resources

1. Check Supabase Status: https://status.supabase.com
2. Review Supabase Auth Documentation: https://supabase.com/docs/guides/auth
3. Check Supabase Community: https://github.com/supabase/supabase/discussions
4. Supabase Support: https://supabase.com/support

