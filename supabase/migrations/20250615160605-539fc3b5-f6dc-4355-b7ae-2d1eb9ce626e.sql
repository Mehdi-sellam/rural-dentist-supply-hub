
-- Clear cart data first (due to foreign key dependencies)
DELETE FROM public.cart_bundles;
DELETE FROM public.cart_items;

-- Clear order data (order_items and order_bundles first, then orders)
DELETE FROM public.order_items;
DELETE FROM public.order_bundles;
DELETE FROM public.orders;

-- Clear payment notifications
DELETE FROM public.payment_notifications;

-- Clear user profiles (this will also clear any remaining cart/order data due to CASCADE)
-- Note: This will remove all user accounts except admin accounts
DELETE FROM public.profiles WHERE is_admin = false;

-- Optional: If you want to clear ALL user data including admins, uncomment the line below
-- DELETE FROM public.profiles;

-- Reset any auto-increment sequences if needed
-- (UUID tables don't need this, but included for completeness)
