-- FIX FOR INFINITE RECURSION IN RLS POLICIES
-- Run this in Supabase SQL Editor to fix the 500 errors

-- Step 1: Drop all existing admin policies
DROP POLICY IF EXISTS "Admins have full access to categories" ON categories;
DROP POLICY IF EXISTS "Admins have full access to products" ON products;
DROP POLICY IF EXISTS "Admins have full access to banners" ON banners;
DROP POLICY IF EXISTS "Admins have full access to orders" ON orders;
DROP POLICY IF EXISTS "Admins have full access to coupons" ON coupons;
DROP POLICY IF EXISTS "Admins have full access to user_profiles" ON user_profiles;

-- Step 2: Create helper function (SECURITY DEFINER bypasses RLS, avoiding recursion)
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Step 3: Recreate all policies using the helper function
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

-- Step 4: Fix user_profiles policy (allow users to view their own profile)
CREATE POLICY "Admins have full access to user_profiles" ON user_profiles 
  FOR ALL USING (
    is_admin(auth.uid())
    OR
    id = auth.uid()
  );

-- Verify: Test that policies work
-- SELECT is_admin(auth.uid());

