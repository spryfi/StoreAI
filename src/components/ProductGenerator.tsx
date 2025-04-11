import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";
import { fetchGeneratedProducts, GeneratedProduct } from "@/lib/supabase/products";

export default function ProductGenerator() {
  const [products, setProducts] = useState<GeneratedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const data = await fetchGeneratedProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                No products yet. Click a trend keyword to generate one.
              </p>
            </CardContent>
          </Card>
        ) : (
          products.map((prod) => (
            <Card key={prod.id}>
              <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <div className="text-sm text-muted-foreground">Keyword</div>
                  <div className="font-semibold">{prod.keyword}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">SKU</div>
                  <Badge className="bg-primary">
                    <Sparkles className="w-3 h-3 mr-1" /> {prod.sku}
                  </Badge>
                </div>
                <a
                  href={prod.product_url}
                  className="text-blue-600 hover:underline text-sm mt-2 md:mt-0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Product
                </a>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}