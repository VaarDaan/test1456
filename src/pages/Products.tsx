import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { MessageCircle, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  { value: "all", label: "All Products" },
  { value: "interior", label: "Interior" },
  { value: "exterior", label: "Exterior" },
  { value: "furniture", label: "Furniture" },
  { value: "premium", label: "Premium Corner" },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", activeCategory],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (activeCategory !== "all" && ["interior", "exterior", "furniture", "premium"].includes(activeCategory)) {
        query = query.eq("category", activeCategory as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const getWhatsAppUrl = (productName: string) => {
    return `https://wa.me/919382176969?text=${encodeURIComponent(
      `Hi, I am interested in ${productName} from Satarupa Steel Furnitures.`
    )}`;
  };

  const handleCategoryChange = (category: string) => {
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <Layout>
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider bg-primary/10 text-primary mb-4">
              Our Collection
            </span>
            <h1 className="section-heading">
              Explore Our <span className="gold-text">Products</span>
            </h1>
            <p className="section-subheading">
              Discover premium steel fabrication and furniture solutions crafted with precision
            </p>
          </div>
        </div>
      </section>

      <section className="section-container">
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={activeCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(category.value)}
              className="flex-shrink-0"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-5 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : !products?.length ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group glass-card hover-lift overflow-hidden">
                <Link to={`/products/${product.id}`}>
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </Link>
                <div className="p-5">
                  <span className="text-xs font-medium uppercase tracking-wider text-primary">
                    {product.category}
                  </span>
                  <Link to={`/products/${product.id}`}>
                    <h3 className="text-base font-semibold mt-1 mb-2 line-clamp-1 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  {product.price && (
                    <p className="text-lg font-bold gold-text mb-3">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>
                  )}
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <a href={getWhatsAppUrl(product.name)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      WhatsApp Enquiry
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Products;
