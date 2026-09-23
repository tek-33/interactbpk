/*
# Create password helper functions

## Overview
Creates two SECURITY DEFINER functions for password verification and hashing,
used by the admin-portal edge function. pgcrypto is installed in the "extensions" schema.

## New Functions
- verify_password(input_password text, stored_hash text) RETURNS boolean
- hash_password(input_password text) RETURNS text

## Security
- SECURITY DEFINER, EXECUTE granted to anon + authenticated
- search_path includes extensions schema where pgcrypto functions live
*/

CREATE OR REPLACE FUNCTION verify_password(input_password text, stored_hash text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = extensions, public
AS $$
  SELECT extensions.crypt(input_password, stored_hash) = stored_hash;
$$;

CREATE OR REPLACE FUNCTION hash_password(input_password text)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = extensions, public
AS $$
  SELECT extensions.crypt(input_password, extensions.gen_salt('bf'));
$$;

GRANT EXECUTE ON FUNCTION verify_password(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION hash_password(text) TO anon, authenticated;
