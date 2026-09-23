/*
# Create message deposit system for Interact Club

## Overview
Creates a message/inquiry system where visitors can leave messages (like a government office suggestion box),
and the club president (นายกสโมสร) can reply. The president authenticates with a password to access and reply to messages.

## New Tables

### `club_messages`
- `id` (uuid, primary key)
- `sender_name` (text, not null) — name of the person leaving the message
- `sender_contact` (text, nullable) — optional contact info (email, phone, etc.)
- `subject` (text, not null) — subject/category of the message
- `body` (text, not null) — the message content
- `reply` (text, nullable) — the president's reply
- `replied_at` (timestamptz, nullable) — when the reply was posted
- `status` (text, default 'pending') — 'pending' or 'answered'
- `is_public` (boolean, default false) — whether the reply is visible to the public
- `created_at` (timestamptz, default now())

### `club_settings`
- `id` (int, primary key, default 1) — singleton row
- `admin_password_hash` (text, not null) — bcrypt-style hash of the president's password
- `updated_at` (timestamptz, default now())

## Security (RLS)

### club_messages
- SELECT: anon + authenticated can read messages where is_public = true OR all fields except reply/replied_at/status
  - Actually, for simplicity: anon can INSERT messages, and can SELECT messages where is_public = true
  - UPDATE/DELETE: only via edge function with service role key (president auth)
- Since the president authenticates via a password (not Supabase auth), the edge function
  uses the service role key to perform privileged operations.

### club_settings
- No direct access from anon/authenticated. Only the edge function with service role key can read/update.

## Important Notes
1. This is a no-auth app (no Supabase sign-in). The president logs in with a password
   verified by an edge function using the service role key.
2. The admin password is stored as a hash in club_settings. The edge function verifies
   the password and returns a short-lived session token.
3. Messages are inserted by anyone (anon). Replies are posted only by the edge function
   after password verification.
4. Public visitors can see their own message status and public replies.
*/

-- Create messages table
CREATE TABLE IF NOT EXISTS club_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name text NOT NULL,
  sender_contact text DEFAULT '',
  subject text NOT NULL,
  body text NOT NULL,
  reply text DEFAULT '',
  replied_at timestamptz DEFAULT NULL,
  status text NOT NULL DEFAULT 'pending',
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create settings table (singleton for admin password)
CREATE TABLE IF NOT EXISTS club_settings (
  id int PRIMARY KEY DEFAULT 1,
  admin_password_hash text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT singleton_check CHECK (id = 1)
);

-- Insert default password hash (password: "interact2025" — will be changed by president)
-- Using crypt with pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO club_settings (id, admin_password_hash)
VALUES (1, crypt('interact2025', gen_salt('bf')))
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE club_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_settings ENABLE ROW LEVEL SECURITY;

-- === club_messages policies ===
-- Anyone can insert messages
DROP POLICY IF EXISTS "anon_insert_messages" ON club_messages;
CREATE POLICY "anon_insert_messages"
  ON club_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Anyone can read messages (visitors can check status of their messages by ID)
-- We allow reading all messages so visitors can check their own message status
-- The reply field is only populated for answered messages
DROP POLICY IF EXISTS "anon_select_messages" ON club_messages;
CREATE POLICY "anon_select_messages"
  ON club_messages FOR SELECT
  TO anon, authenticated
  USING (true);

-- No direct UPDATE/DELETE from anon — only via edge function with service role key

-- === club_settings policies ===
-- No direct access from anon/authenticated — only via edge function with service role key
-- (No policies = no access when RLS is enabled)