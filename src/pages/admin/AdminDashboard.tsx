import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  LogOut, Package, Settings, Plus, Trash2, Edit, Moon, Sun,
  BarChart3, Bot, FileText, MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { ProductForm } from "@/components/admin/ProductForm";
import { SettingsPanel } from "@/components/admin/SettingsPanel";
import { AnalyticsPanel } from "@/components/admin/AnalyticsPanel";
import { AIAssistant } from "@/components/admin/AIAssistant";
import { BlogPanel } from "@/components/admin/BlogPanel";
import { ContactPanel } from "@/components/admin/ContactPanel";

type Product = Database["public"]["Tables"]["products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];

type TabType = "products" | "blog" | "contacts" | "settings" | "analytics" | "ai";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/admin"); return; }
      const { data: adminUser } = await supabase.from("admin_users").select("id").eq("user_id", session.user.id).single();
      if (!adminUser) { await supabase.auth.signOut(); navigate("/admin"); }
    };
    checkAuth();
  }, [navigate]);

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addProductMutation = useMutation({
    mutationFn: async (product: ProductInsert) => {
      const { error } = await supabase.from("products").insert([product]);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-products"] }); toast({ title: "Product added!" }); setIsAddingProduct(false); },
    onError: () => toast({ title: "Failed to add product", variant: "destructive" }),
  });

  const updateProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      const { error } = await supabase.from("products").update(product).eq("id", product.id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-products"] }); toast({ title: "Product updated!" }); setEditingProduct(null); },
    onError: () => toast({ title: "Failed to update product", variant: "destructive" }),
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-products"] }); toast({ title: "Product deleted!" }); },
    onError: () => toast({ title: "Failed to delete product", variant: "destructive" }),
  });

  const handleLogout = async () => { await supabase.auth.signOut(); navigate("/admin"); };

  const handleSaveProduct = (product: ProductInsert | Product) => {
    if ("id" in product) updateProductMutation.mutate(product as Product);
    else addProductMutation.mutate(product as ProductInsert);
  };

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: "products", label: "Products", icon: <Package className="w-4 h-4" /> },
    { key: "blog", label: "Blog", icon: <FileText className="w-4 h-4" /> },
    { key: "contacts", label: "Enquiries", icon: <MessageSquare className="w-4 h-4" /> },
    { key: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
    { key: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { key: "ai", label: "AI", icon: <Bot className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-display font-bold gold-text">Satarupa Admin</h1>
              <p className="text-sm text-muted-foreground">Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <Button key={tab.key} variant={activeTab === tab.key ? "default" : "outline"} size="sm" onClick={() => setActiveTab(tab.key)} className="flex-shrink-0">
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </Button>
          ))}
        </div>

        {activeTab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold">Products</h2>
              <Button variant="gold" onClick={() => { setIsAddingProduct(true); setEditingProduct(null); }}>
                <Plus className="w-4 h-4 mr-2" />Add Product
              </Button>
            </div>
            {isAddingProduct && (
              <div className="mb-6">
                <ProductForm onSave={handleSaveProduct} onCancel={() => setIsAddingProduct(false)} isLoading={addProductMutation.isPending} />
              </div>
            )}
            {productsLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading products...</div>
            ) : products?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No products yet. Add your first product!</div>
            ) : (
              <div className="grid gap-4">
                {products?.map((product) => (
                  <div key={product.id} className="glass-card p-4 flex items-center gap-4">
                    {product.image_url && <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.category} • ₹{product.price?.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${product.is_active ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"}`}>
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                      {product.is_featured && <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">Featured</span>}
                      <Button variant="ghost" size="icon" onClick={() => { setEditingProduct(product); setIsAddingProduct(false); }}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteProductMutation.mutate(product.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {editingProduct && (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
                  <ProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={() => setEditingProduct(null)} isLoading={updateProductMutation.isPending} />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "blog" && <BlogPanel />}
        {activeTab === "contacts" && <ContactPanel />}
        {activeTab === "settings" && <SettingsPanel />}
        {activeTab === "analytics" && <AnalyticsPanel />}
        {activeTab === "ai" && <AIAssistant />}
      </div>
    </div>
  );
};

export default AdminDashboard;
