-- =========================================================
-- TECH SPECTRA - Supabase Database Setup
-- =========================================================
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- =========================================================

-- 1. Create the registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  college_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  id_card_url TEXT NOT NULL,
  events_selected TEXT[] NOT NULL,
  seat_number TEXT NOT NULL UNIQUE,
  hackathon_problem TEXT,
  shark_tank_problem TEXT,
  registered_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous inserts (public registration form)
CREATE POLICY "Allow anonymous inserts"
  ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 4. Allow anonymous selects (for checking seat availability)
CREATE POLICY "Allow anonymous selects"
  ON registrations
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous deletes (for admin dashboard management)
CREATE POLICY "Allow anonymous deletes"
  ON registrations
  FOR DELETE
  TO anon
  USING (true);

-- 5. Create index on seat_number for fast lookups
CREATE INDEX IF NOT EXISTS idx_registrations_seat
  ON registrations (seat_number);

-- 6. Create index on email for dedup checks
CREATE INDEX IF NOT EXISTS idx_registrations_email
  ON registrations (email);

-- =========================================================
-- STORAGE: Create id-cards bucket
-- =========================================================
-- Run this part separately in:
-- Dashboard > Storage > Create bucket
-- Bucket name: id-cards
-- Make it public (for public URL access)

-- Then run this to set the bucket policy:
INSERT INTO storage.buckets (id, name, public)
VALUES ('id-cards', 'id-cards', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anonymous uploads to id-cards bucket
CREATE POLICY "Allow anonymous uploads"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'id-cards');

-- Allow anonymous reads from id-cards bucket
CREATE POLICY "Allow anonymous reads"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'id-cards');
