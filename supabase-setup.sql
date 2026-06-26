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
-- TEAMS AND TEAM MEMBERS SCHEMAS
-- =========================================================

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT NOT NULL,
  leader_name TEXT NOT NULL,
  leader_email TEXT NOT NULL,
  leader_phone TEXT NOT NULL,
  college_name TEXT NOT NULL,
  events_selected TEXT[] NOT NULL,
  hackathon_problem TEXT,
  shark_tank_problem TEXT,
  registered_at TIMESTAMPTZ DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  member_name TEXT NOT NULL,
  member_email TEXT NOT NULL,
  id_card_url TEXT NOT NULL,
  seat_number TEXT NOT NULL UNIQUE,
  registered_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Add anonymous insert, select, and delete policies for teams
CREATE POLICY "Allow anonymous inserts for teams"
  ON teams FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous selects for teams"
  ON teams FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous deletes for teams"
  ON teams FOR DELETE TO anon USING (true);

-- Add anonymous insert, select, and delete policies for team_members
CREATE POLICY "Allow anonymous inserts for team_members"
  ON team_members FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous selects for team_members"
  ON team_members FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous deletes for team_members"
  ON team_members FOR DELETE TO anon USING (true);

-- Create indexes on teams and team_members
CREATE INDEX IF NOT EXISTS idx_teams_leader_email ON teams (leader_email);
CREATE INDEX IF NOT EXISTS idx_team_members_seat ON team_members (seat_number);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members (team_id);


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
