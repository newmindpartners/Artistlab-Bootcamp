/*
  # Create registrations table

  1. New Tables
    - `registrations`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `nom` (text)
      - `prenom` (text)
      - `email` (text)
      - `telephone` (text)
      - `ville` (text)
      - `date` (text)
      - `payment_status` (text)
      - `payment_id` (text)

  2. Security
    - Enable RLS on `registrations` table
    - Add policy for authenticated users to read their own data
    - Add policy for anon users to create registrations
*/

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  nom text NOT NULL,
  prenom text NOT NULL,
  email text NOT NULL,
  telephone text NOT NULL,
  ville text NOT NULL,
  date text NOT NULL,
  payment_status text DEFAULT 'pending',
  payment_id text
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create registrations"
  ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read own registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt()->>'email');