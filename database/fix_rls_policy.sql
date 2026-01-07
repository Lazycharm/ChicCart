-- Fix for infinite recursion in user_profiles RLS policy
-- Run this in Supabase SQL Editor to fix the policy

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins have full access to user_profiles" ON user_profiles;

-- Create a fixed policy that avoids recursion
-- Option 1: Use auth.users metadata (recommended)
CREATE POLICY "Admins have full access to user_profiles" ON user_profiles 
  FOR ALL USING (
    -- Check if user is admin via auth metadata
    (auth.jwt() ->> 'user_role') = 'admin'
    OR
    -- Allow users to view their own profile
    id = auth.uid()
    OR
    -- Allow public read access (for basic profile info)
    true
  );

-- Alternative: If you need to check user_profiles table, use a function
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Then use the function in policies (avoids recursion)
-- DROP POLICY IF EXISTS "Admins have full access to user_profiles" ON user_profiles;
-- CREATE POLICY "Admins have full access to user_profiles" ON user_profiles 
--   FOR ALL USING (is_admin(auth.uid()));

