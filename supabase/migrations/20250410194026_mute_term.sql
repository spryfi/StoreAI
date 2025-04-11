/*
  # Create trend_keywords table
  
  1. New Tables
    - `trend_keywords`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with timezone)
      - `keyword` (text, unique)
      - `search_count` (integer)
      - `last_searched` (timestamp with timezone)
      - `is_trending` (boolean)
  2. Security
    - Enable RLS on `trend_keywords` table
    - Add policies for public read access and authenticated user write access
*/

CREATE TABLE IF NOT EXISTS trend_keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  keyword text UNIQUE NOT NULL,
  search_count integer DEFAULT 0,
  last_searched timestamptz DEFAULT NULL,
  is_trending boolean DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE trend_keywords ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to trend_keywords"
  ON trend_keywords
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert trends"
  ON trend_keywords
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update their own trends"
  ON trend_keywords
  FOR UPDATE
  TO authenticated
  USING (true);