/*
  # Performance Optimization - Add Database Indexes

  1. Indexes for better query performance
    - Add index on registrations.email for faster lookups
    - Add index on registrations.payment_status for filtering
    - Add index on registrations.created_at for sorting
    - Add composite index for common query patterns

  2. Optimize existing queries
    - Improve webhook registration lookups
    - Speed up payment status filtering
*/

-- Add index on email for faster customer lookups
CREATE INDEX IF NOT EXISTS idx_registrations_email 
ON registrations(email);

-- Add index on payment_status for filtering
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status 
ON registrations(payment_status);

-- Add index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_registrations_created_at 
ON registrations(created_at DESC);

-- Add composite index for webhook queries (email + payment_status)
CREATE INDEX IF NOT EXISTS idx_registrations_email_payment_status 
ON registrations(email, payment_status);

-- Add composite index for recent pending registrations
CREATE INDEX IF NOT EXISTS idx_registrations_pending_recent 
ON registrations(payment_status, created_at DESC) 
WHERE payment_status = 'pending';

-- Add index on stripe_customers for faster user lookups
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id 
ON stripe_customers(user_id) 
WHERE deleted_at IS NULL;

-- Add index on stripe_subscriptions for customer lookups
CREATE INDEX IF NOT EXISTS idx_stripe_subscriptions_customer_id 
ON stripe_subscriptions(customer_id) 
WHERE deleted_at IS NULL;

-- Add index on stripe_orders for customer lookups
CREATE INDEX IF NOT EXISTS idx_stripe_orders_customer_id 
ON stripe_orders(customer_id) 
WHERE deleted_at IS NULL;

-- Analyze tables to update statistics
ANALYZE registrations;
ANALYZE stripe_customers;
ANALYZE stripe_subscriptions;
ANALYZE stripe_orders;