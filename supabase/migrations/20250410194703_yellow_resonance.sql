/*
  # Add status tracking to trend keywords

  1. Changes
     - Add `status` column to track keyword monitoring status (watching, generating, completed)
     - Add `last_generated` timestamp to track when products were last generated
  
  2. Purpose
     - Allow users to track the status of each keyword
     - Enable filtering of keywords by their current status
     - Provide history of when products were last generated
*/

-- Add status column with default 'watching'
ALTER TABLE IF EXISTS trend_keywords ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'watching';

-- Add last_generated timestamp to track when products were generated
ALTER TABLE IF EXISTS trend_keywords ADD COLUMN IF NOT EXISTS last_generated TIMESTAMPTZ DEFAULT NULL;