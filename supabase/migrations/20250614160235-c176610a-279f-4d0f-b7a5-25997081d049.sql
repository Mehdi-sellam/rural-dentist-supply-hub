
-- Add missing fields to products table
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS stock_status boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS image_url text DEFAULT NULL;

-- Update the existing image column to be more descriptive
COMMENT ON COLUMN public.products.image IS 'Legacy image field - use image_url for new uploads';
COMMENT ON COLUMN public.products.image_url IS 'URL to uploaded image in Supabase Storage';

-- Add missing fields to bundles table
ALTER TABLE public.bundles 
ADD COLUMN IF NOT EXISTS badge text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS sub_description text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS calculated_savings numeric DEFAULT NULL;

-- Add missing fields to categories table  
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS icon_url text DEFAULT NULL;

COMMENT ON COLUMN public.categories.icon_url IS 'URL to uploaded icon image in Supabase Storage';

-- Add missing fields to orders table (excluding remaining_balance since it's already a generated column)
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS preferred_delivery_date date DEFAULT NULL,
ADD COLUMN IF NOT EXISTS partial_payment_history jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.orders.partial_payment_history IS 'Array of payment records: [{amount: number, date: timestamp, method: string}]';

-- Create payment_notifications table for client payment triggers
CREATE TABLE IF NOT EXISTS public.payment_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  payment_method text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'rejected')),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  processed_at timestamp with time zone DEFAULT NULL,
  processed_by uuid REFERENCES public.profiles(id) DEFAULT NULL
);

-- Enable RLS on payment_notifications
ALTER TABLE public.payment_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for payment_notifications
CREATE POLICY "Users can view their own payment notifications" 
  ON public.payment_notifications 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own payment notifications" 
  ON public.payment_notifications 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all payment notifications" 
  ON public.payment_notifications 
  FOR ALL 
  USING (public.is_current_user_admin());

-- Create Storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('category-icons', 'category-icons', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product-images bucket
CREATE POLICY "Public can view product images" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'product-images' 
    AND public.is_current_user_admin()
  );

CREATE POLICY "Admins can update product images" 
  ON storage.objects 
  FOR UPDATE 
  USING (
    bucket_id = 'product-images' 
    AND public.is_current_user_admin()
  );

CREATE POLICY "Admins can delete product images" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'product-images' 
    AND public.is_current_user_admin()
  );

-- Storage policies for category-icons bucket
CREATE POLICY "Public can view category icons" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'category-icons');

CREATE POLICY "Admins can upload category icons" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'category-icons' 
    AND public.is_current_user_admin()
  );

CREATE POLICY "Admins can update category icons" 
  ON storage.objects 
  FOR UPDATE 
  USING (
    bucket_id = 'category-icons' 
    AND public.is_current_user_admin()
  );

CREATE POLICY "Admins can delete category icons" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'category-icons' 
    AND public.is_current_user_admin()
  );

-- Function to automatically calculate bundle savings
CREATE OR REPLACE FUNCTION public.calculate_bundle_savings()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate savings as original_price - bundle_price (removing currency symbols)
  IF NEW.original_price IS NOT NULL AND NEW.bundle_price IS NOT NULL THEN
    NEW.calculated_savings := 
      (regexp_replace(NEW.original_price, '[^0-9.]', '', 'g'))::numeric - 
      (regexp_replace(NEW.bundle_price, '[^0-9.]', '', 'g'))::numeric;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate savings on bundle insert/update
DROP TRIGGER IF EXISTS calculate_savings_trigger ON public.bundles;
CREATE TRIGGER calculate_savings_trigger
  BEFORE INSERT OR UPDATE ON public.bundles
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_bundle_savings();

-- Update existing bundles to calculate savings
UPDATE public.bundles 
SET calculated_savings = 
  (regexp_replace(original_price, '[^0-9.]', '', 'g'))::numeric - 
  (regexp_replace(bundle_price, '[^0-9.]', '', 'g'))::numeric
WHERE original_price IS NOT NULL AND bundle_price IS NOT NULL;

-- Function to auto-update payment status based on amount_paid (since remaining_balance is generated)
CREATE OR REPLACE FUNCTION public.update_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-update payment status based on amounts
  IF NEW.amount_paid >= NEW.total_amount THEN
    NEW.payment_status := 'paid';
  ELSIF NEW.amount_paid > 0 THEN
    NEW.payment_status := 'partial';
  ELSE
    NEW.payment_status := 'pending';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update payment status on order changes
DROP TRIGGER IF EXISTS update_payment_status_trigger ON public.orders;
CREATE TRIGGER update_payment_status_trigger
  BEFORE INSERT OR UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_payment_status();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_notifications_order_id ON public.payment_notifications(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_notifications_user_id ON public.payment_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_notifications_status ON public.payment_notifications(status);
CREATE INDEX IF NOT EXISTS idx_orders_preferred_delivery_date ON public.orders(preferred_delivery_date);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
