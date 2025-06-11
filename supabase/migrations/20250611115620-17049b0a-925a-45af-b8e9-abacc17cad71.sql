
-- Fix infinite recursion in RLS policies by creating security definer functions
-- and updating the policies to avoid circular references

-- First, create a security definer function to safely check if user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop existing problematic policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage bundles" ON public.bundles;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage all order bundles" ON public.order_bundles;

-- Create new safe policies for profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles 
FOR SELECT USING (public.is_current_user_admin());

-- Make categories, products, and bundles publicly readable for authenticated users
-- This fixes the main issue preventing basic data access
CREATE POLICY "Authenticated users can view categories" ON public.categories 
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view products" ON public.products 
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view bundles" ON public.bundles 
FOR SELECT TO authenticated USING (true);

-- Admin policies for managing data
CREATE POLICY "Admins can manage categories" ON public.categories 
FOR ALL USING (public.is_current_user_admin());

CREATE POLICY "Admins can manage products" ON public.products 
FOR ALL USING (public.is_current_user_admin());

CREATE POLICY "Admins can manage bundles" ON public.bundles 
FOR ALL USING (public.is_current_user_admin());

-- Orders policies with safe admin check
CREATE POLICY "Admins can view all orders" ON public.orders 
FOR SELECT USING (public.is_current_user_admin());

CREATE POLICY "Admins can update all orders" ON public.orders 
FOR UPDATE USING (public.is_current_user_admin());

CREATE POLICY "Admins can delete all orders" ON public.orders 
FOR DELETE USING (public.is_current_user_admin());

-- Order items policies
CREATE POLICY "Admins can manage all order items" ON public.order_items 
FOR ALL USING (public.is_current_user_admin());

-- Order bundles policies
CREATE POLICY "Admins can manage all order bundles" ON public.order_bundles 
FOR ALL USING (public.is_current_user_admin());

-- Also allow anonymous access for public catalog viewing (categories, products, bundles)
-- This ensures the website works even without authentication
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Anyone can view bundles" ON public.bundles;

CREATE POLICY "Public can view categories" ON public.categories 
FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public can view products" ON public.products 
FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public can view bundles" ON public.bundles 
FOR SELECT TO anon, authenticated USING (true);
