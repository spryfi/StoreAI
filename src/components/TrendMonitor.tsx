import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Loader2, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  RefreshCw 
} from "lucide-react";
import { 
  createTrendKeyword, 
  fetchTrendingKeywords, 
  filterKeywordsByStatus, 
  TrendKeyword, 
  updateKeywordSearchCount, 
  markKeywordAsGenerated,
  TrendStatus,
  updateKeywordStatus
} from "@/lib/supabase/trends";
import { createGeneratedProduct } from "@/lib/supabase/products";
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow } from "date-fns";

export default function TrendMonitor() {
  const [keyword, setKeyword] = useState("");
  const [trends, setTrends] = useState<TrendKeyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TrendStatus>("watching");
  const { toast } = useToast();

  useEffect(() => {
    loadTrends(activeTab);
  }, [activeTab]);

  const loadTrends = async (status?: TrendStatus) => {
    setLoading(true);
    let result;
    
    if (status && status !== "watching") {
      result = await filterKeywordsByStatus(status);
    } else {
      result = await fetchTrendingKeywords();
    }
    
    setTrends(result || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!keyword.trim()) {
      toast({
        title: "Error",
        description: "Please enter a keyword",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    await createTrendKeyword(keyword.trim());
    
    toast({
      title: "Trend Added",
      description: `"${keyword}" has been added to your trends.`,
    });
    
    setKeyword("");
    await loadTrends(activeTab);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as TrendStatus);
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'generating':
        return 'outline';
      case 'completed':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'generating':
        return <RefreshCw className="w-3 h-3 mr-1 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="w-3 h-3 mr-1" />;
      default:
        return <Sparkles className="w-3 h-3 mr-1" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    
    try {
      return {
        formatted: format(date, 'PPP'),
        relative: formatDistanceToNow(date, { addSuffix: true })
      };
    } catch (error) {
      return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="e.g. horror movie svg"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button onClick={handleAdd} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <PlusCircle className="w-4 h-4 mr-1" />}
          Add Trend
        </Button>
      </div>

      <Tabs defaultValue="watching" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4 grid w-full grid-cols-3">
          <TabsTrigger value="watching">Watching</TabsTrigger>
          <TabsTrigger value="generating">Generating</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">
                {activeTab === "watching" ? "Trends to Watch" : 
                 activeTab === "generating" ? "Currently Generating" : "Completed Products"}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => loadTrends(activeTab)}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex flex-wrap gap-2">
            {loading && trends.length === 0 ? (
              <div className="w-full flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : trends.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2 w-full text-center">
                {activeTab === "watching" ? "No trends tracked yet. Add your first keyword above." :
                 activeTab === "generating" ? "No keywords currently generating." : 
                 "No completed generations yet."}
              </p>
            ) : (
              trends.map((trend) => (
                <Badge 
                  key={trend.id} 
                  variant={getBadgeVariant(trend.status)}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleGenerate(trend)}
                >
                  {getStatusIcon(trend.status)}
                  {trend.keyword}
                  {trend.search_count > 0 && (
                    <span className="ml-1 text-xs bg-muted-foreground/20 px-1 rounded-sm">
                      {trend.search_count}
                    </span>
                  )}
                  {trend.last_generated && trend.status === 'completed' && (
                    <span 
                      className="ml-1 text-xs flex items-center gap-1"
                      title={formatDate(trend.last_generated)?.formatted || ""}
                    >
                      <Clock className="w-2.5 h-2.5" />
                      {formatDate(trend.last_generated)?.relative}
                    </span>
                  )}
                </Badge>
              ))
            )}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );

  async function handleGenerate(trend: TrendKeyword) {
    toast({
      title: "Generating Product",
      description: `Starting generation for "${trend.keyword}"...`,
    });
    
    // Update search count and status
    if (trend.id) {
      await updateKeywordSearchCount(trend.id);
      await updateKeywordStatus(trend.id, 'generating');
      
      // Update the local state to reflect changes
      setTrends(prev => prev.map(t => 
        t.id === trend.id 
          ? {
              ...t, 
              search_count: (t.search_count || 0) + 1, 
              last_searched: new Date().toISOString(),
              status: 'generating'
            } 
          : t
      ));
      
      // Make API call to generate product
      try {
        // For demonstration, generate a mock product
        // In production, this would be an API call to the backend service
        const mockProduct = {
          sku: `SKU-${Math.floor(Math.random() * 10000)}`,
          product_url: `https://example.com/product/${trend.keyword.replace(/\s+/g, '-').toLowerCase()}`,
        };
        
        // Create the product in Supabase
        const result = await createGeneratedProduct({
          keyword_id: trend.id,
          keyword: trend.keyword,
          sku: mockProduct.sku,
          product_url: mockProduct.product_url
        });
        
        // Save to localStorage for now
        const current = JSON.parse(localStorage.getItem("autostore_products") || "[]");
        localStorage.setItem("autostore_products", JSON.stringify([...current, result]));
        
        // Mark as completed with generation timestamp
        await markKeywordAsGenerated(trend.id);
        
        toast({
          title: "Product Generated",
          description: (
            <div>
              Successfully generated product for "{trend.keyword}"!
              <br />
              SKU: {mockProduct.sku}
              <br />
              <a 
                href={mockProduct.product_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                View Product
              </a>
            </div>
          ),
        });
        
        // Reload trends if we're on the generating tab to update UI
        if (activeTab === 'generating') {
          loadTrends(activeTab);
        }
      } catch (err) {
        console.error(err);
        
        // Update status back to watching on failure
        await updateKeywordStatus(trend.id, 'watching');
        
        toast({
          title: "Generation Failed",
          description: `Failed to generate product for "${trend.keyword}". Please try again.`,
          variant: "destructive",
        });
        
        // Update local state to reflect error
        setTrends(prev => prev.map(t => 
          t.id === trend.id ? {...t, status: 'watching'} : t
        ));
      }
    }
  }
}