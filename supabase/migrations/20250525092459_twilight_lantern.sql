/*
  # Add authenticated users registration policy

  1. Security Changes
    - Add RLS policy allowing authenticated users to create registrations
    - This complements the existing policy for anonymous users
    
  2. Notes
    - Maintains existing policies
    - Ensures both anonymous and authenticated users can register
*/

CREATE POLICY "Authenticated users can create registrations"
  ON registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);