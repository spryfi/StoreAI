import { supabase } from "./client";

export type TrendKeyword = {
  id: string;
  created_at: string;
  keyword: string;
  search_count: number;
  last_searched: string | null;
  is_trending: boolean;
  status: string;
  last_generated: string | null;
};

export type TrendStatus = 'watching' | 'generating' | 'completed';

export async function fetchTrendingKeywords() {
  const { data, error } = await supabase
    .from("trend_keywords")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Failed to fetch trends:", error.message);
    return [];
  }

  return data;
}

export async function createTrendKeyword(keyword: string) {
  const { error } = await supabase
    .from("trend_keywords")
    .insert([{ 
      keyword,
      status: 'watching' 
    }]);

  if (error) {
    console.error("Error adding trend:", error.message);
  }
}

export async function updateKeywordSearchCount(id: string) {
  const { error } = await supabase
    .from("trend_keywords")
    .update({
      search_count: supabase.rpc("increment", { x: 1 }),
      last_searched: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating keyword search count:", error.message);
  }
}

export async function updateKeywordStatus(id: string, status: TrendStatus) {
  const { error } = await supabase
    .from("trend_keywords")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating keyword status:", error.message);
    return false;
  }
  
  return true;
}

export async function markKeywordAsGenerated(id: string) {
  const { error } = await supabase
    .from("trend_keywords")
    .update({ 
      status: 'completed',
      last_generated: new Date().toISOString() 
    })
    .eq("id", id);

  if (error) {
    console.error("Error marking keyword as generated:", error.message);
    return false;
  }
  
  return true;
}

export async function filterKeywordsByStatus(status: TrendStatus) {
  const { data, error } = await supabase
    .from("trend_keywords")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to filter keywords:", error.message);
    return [];
  }

  return data;
}