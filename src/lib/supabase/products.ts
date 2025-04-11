import { supabase } from "./client";

export type GeneratedProduct = {
  id: string;
  keyword_id: string;
  keyword: string;
  sku: string;
  product_url: string;
  created_at: string;
};

export async function fetchGeneratedProducts() {
  const { data, error } = await supabase
    .from("generated_products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Failed to fetch products:", error.message);
    return [];
  }

  return data;
}

export async function createGeneratedProduct(product: Omit<GeneratedProduct, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from("generated_products")
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error.message);
    throw error;
  }

  return data;
}

export async function getProductsByKeywordId(keywordId: string) {
  const { data, error } = await supabase
    .from("generated_products")
    .select("*")
    .eq("keyword_id", keywordId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch products by keyword:", error.message);
    return [];
  }

  return data;
}