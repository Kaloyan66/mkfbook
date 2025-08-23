/*
  # Create payments table for tracking e-book purchases

  1. New Tables
    - `payments`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `payment_status` (text)
      - `created_at` (timestamp)
      - `stripe_session_id` (text)

  2. Security
    - Enable RLS on `payments` table
    - Add policy for authenticated users to read their own data
    - Add policy for service role to create payments
*/

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  stripe_session_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Service role can create payments"
  ON payments
  FOR INSERT
  TO service_role
  WITH CHECK (true);