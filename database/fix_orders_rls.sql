-- FIX ORDERS RLS POLICY
-- The current policy incorrectly compares auth.uid()::text with customer_email
-- This fix ensures orders are matched by the authenticated user's email

-- Drop the incorrect policy
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;

-- Create correct policy that matches user's email from auth.users
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT 
  USING (
    customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Also allow admins to view all orders (using the is_admin function)
-- Note: This assumes the is_admin function exists from fix_rls_recursion.sql
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT 
  USING (is_admin(auth.uid()));

