import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  LogOut,
  Package,
  FileText,
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Upload,
  Moon,
  Sun,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];

const categories = [
  { value: "interior", label: "Interior" },
  { value: "exterior", label: "Exterior" },
  { value: "furniture", label: "Furniture" },
  { value: "premium", label: "Premium" },
] as const;

type CategoryValue = typeof categories[number]["value"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "settings">("products");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<ProductInsert>>({
    name: "",
    description: "",
    category: "furniture",
    price: 0,
    is_active: true,
    is_featured: false,
  });

  useEffect(() => {
    const prefersDark = document.documentElement.classList.contains("dark");
    setIsDark(prefersDark);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin");
        return;
      }

      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", session.user.id)
        .single();

      if (!adminUser) {
        await supabase.auth.signOut();
        navigate("/admin");
      }
    };
    checkAuth();
  }, [navigate]);

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (product: ProductInsert) => {
      const { data, error } = await supabase
        .from("products")
        .insert([product])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Product added successfully!" });
      setIsAddingProduct(false);
      setNewProduct({
        name: "",
        description: "",
        category: "furniture",
        price: 0,
        is_active: true,
        is_featured: false,
      });
    },
    onError: () => {
      toast({ title: "Failed to add product", variant: "destructive" });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async (product: Product) => {
      const { data, error } = await supabase
        .from("products")
        .update(product)
        .eq("id", product.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Product updated successfully!" });
      setEditingProduct(null);
    },
    onError: () => {
      toast({ title: "Failed to update product", variant: "destructive" });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast({ title: "Product deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete product", variant: "destructive" });
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }
    addProductMutation.mutate(newProduct as ProductInsert);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    updateProductMutation.mutate(editingProduct);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-display font-bold gold-text">
                Satarupa Admin
              </h1>
              <p className="text-sm text-muted-foreground">Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={activeTab === "products" ? "default" : "outline"}
            onClick={() => setActiveTab("products")}
          >
            <Package className="w-4 h-4 mr-2" />
            Products
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "outline"}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold">Products</h2>
              <Button variant="gold" onClick={() => setIsAddingProduct(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Add Product Form */}
            {isAddingProduct && (
              <div className="glass-card p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Add New Product</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsAddingProduct(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        category: e.target.value as CategoryValue,
                      })
                    }
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price || ""}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <Input
                    placeholder="Image URL"
                    value={newProduct.image_url || ""}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image_url: e.target.value })
                    }
                  />
                  <Textarea
                    placeholder="Description"
                    className="md:col-span-2"
                    value={newProduct.description || ""}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, description: e.target.value })
                    }
                  />
                  <div className="md:col-span-2 flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newProduct.is_active}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, is_active: e.target.checked })
                        }
                      />
                      Active
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newProduct.is_featured}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, is_featured: e.target.checked })
                        }
                      />
                      Featured
                    </label>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="gold" onClick={handleAddProduct}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Product
                  </Button>
                </div>
              </div>
            )}

            {/* Products List */}
            {productsLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading products...
              </div>
            ) : products?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No products yet. Add your first product!
              </div>
            ) : (
              <div className="grid gap-4">
                {products?.map((product) => (
                  <div
                    key={product.id}
                    className="glass-card p-4 flex items-center gap-4"
                  >
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {product.category} • ₹{product.price?.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          product.is_active
                            ? "bg-green-500/20 text-green-600"
                            : "bg-red-500/20 text-red-600"
                        }`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteProductMutation.mutate(product.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Edit Modal */}
            {editingProduct && (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="glass-card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Edit Product</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingProduct(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4">
                    <Input
                      placeholder="Product Name"
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, name: e.target.value })
                      }
                    />
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          category: e.target.value as CategoryValue,
                        })
                      }
                    >
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      placeholder="Price"
                      value={editingProduct.price || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    <Input
                      placeholder="Image URL"
                      value={editingProduct.image_url || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          image_url: e.target.value,
                        })
                      }
                    />
                    <Textarea
                      placeholder="Description"
                      value={editingProduct.description || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          description: e.target.value,
                        })
                      }
                    />
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingProduct.is_active ?? true}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              is_active: e.target.checked,
                            })
                          }
                        />
                        Active
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={editingProduct.is_featured ?? false}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              is_featured: e.target.checked,
                            })
                          }
                        />
                        Featured
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 gap-2">
                    <Button variant="outline" onClick={() => setEditingProduct(null)}>
                      Cancel
                    </Button>
                    <Button variant="gold" onClick={handleUpdateProduct}>
                      <Save className="w-4 h-4 mr-2" />
                      Update Product
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">Site Settings</h2>
            <div className="glass-card p-6">
              <p className="text-muted-foreground">
                Settings management coming soon. You'll be able to update catalogue URL,
                offer banners, and SEO settings here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
