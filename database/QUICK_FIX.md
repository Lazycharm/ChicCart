# Quick Fix for Database Errors

## Issue 1: Missing Import (FIXED)
✅ Added `import { createPageUrl } from '@/utils';` to `Home.jsx`

## Issue 2: Infinite Recursion in RLS Policy (NEEDS DATABASE UPDATE)

The error `infinite recursion detected in policy for relation "user_profiles"` occurs because the RLS policy queries `user_profiles` while checking permissions ON `user_profiles`.

### Solution: Run this SQL in Supabase

1. Go to Supabase Dashboard → SQL Editor
2. Run this script:

```sql
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins have full access to categories" ON categories;
DROP POLICY IF EXISTS "Admins have full access to products" ON products;
DROP POLICY IF EXISTS "Admins have full access to banners" ON banners;
DROP POLICY IF EXISTS "Admins have full access to orders" ON orders;
DROP POLICY IF EXISTS "Admins have full access to coupons" ON coupons;
DROP POLICY IF EXISTS "Admins have full access to user_profiles" ON user_profiles;

-- Create helper function (avoids recursion)
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recreate policies using the function
CREATE POLICY "Admins have full access to categories" ON categories 
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins have full access to products" ON products 
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins have full access to banners" ON banners 
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins have full access to orders" ON orders 
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins have full access to coupons" ON coupons 
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins have full access to user_profiles" ON user_profiles 
  FOR ALL USING (
    is_admin(auth.uid())
    OR
    id = auth.uid()
  );
```

3. After running, refresh your browser - the 500 errors should be gone!

### Why This Works

- The `is_admin()` function uses `SECURITY DEFINER`, which bypasses RLS when checking admin status
- This breaks the recursion cycle
- The function can safely query `user_profiles` without triggering RLS checks

