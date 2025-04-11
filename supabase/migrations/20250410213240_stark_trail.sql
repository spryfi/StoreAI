/*
  # Create products table and related functionality

  1. New Tables
    - `generated_products`
      - `id` (uuid, primary key)
      - `keyword_id` (uuid, foreign key to trend_keywords.id)
      - `keyword` (text, the keyword used to generate the product)
      - `sku` (text, unique product identifier)
      - `product_url` (text, URL to the generated product)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `generated_products` table
    - Add policy for public read access
    - Add policy for authenticated users to insert products
*/

CREATE TABLE IF NOT EXISTS generated_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_id uuid REFERENCES trend_keywords(id) ON DELETE CASCADE,
  keyword text NOT NULL,
  sku text NOT NULL,
  product_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE generated_products ENABLE ROW LEVEL SECURITY;

-- Allow public access to read generated products
CREATE POLICY "Allow public read access to generated_products"
  ON generated_products
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert generated products
CREATE POLICY "Allow authenticated users to insert products"
  ON generated_products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);