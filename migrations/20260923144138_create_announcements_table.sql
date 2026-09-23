/*
# Create announcements table

## Overview
Creates a table for club announcements that the president can post and visitors can see.

## New Tables
### `club_announcements`
- `id` (uuid, primary key)
- `title` (text, not null) — announcement title
- `body` (text, not null) — announcement content
- `is_pinned` (boolean, default false) — pinned to top
- `is_active` (boolean, default true) — visible or hidden
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

## Security (RLS)
- SELECT: anon + authenticated can read active announcements (is_active = true)
- INSERT/UPDATE/DELETE: only via edge function with service role key
*/

CREATE TABLE IF NOT EXISTS club_announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  is_pinned boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE club_announcements ENABLE ROW LEVEL SECURITY;

-- Anyone can read active announcements
DROP POLICY IF EXISTS "anon_select_announcements" ON club_announcements;
CREATE POLICY "anon_select_announcements"
  ON club_announcements FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- No direct INSERT/UPDATE/DELETE from anon — only via edge function
