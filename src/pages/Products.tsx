import { useState } from "react";
import { useSearchParams } from "react-router-dom";
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

// Fallback products
const fallbackProducts = [
  {
    id: "1",
    name: "Modern Steel Dining Table",
    description: "Elegant steel frame with tempered glass top. Perfect for contemporary dining spaces.",
    category: "furniture",
    image_url: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500&h=500&fit=crop",
    price: 45000,
  },
  {
    id: "2",
    name: "Premium Gate Design",
    description: "Custom steel gate with intricate patterns and durable finish.",
    category: "exterior",
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
    price: 85000,
  },
  {
    id: "3",
    name: "Steel Railing System",
    description: "Modern staircase railing with glass panels for a sleek look.",
    category: "interior",
    image_url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500&h=500&fit=crop",
    price: 35000,
  },
  {
    id: "4",
    name: "Executive Office Chair",
    description: "Premium steel and leather executive chair with ergonomic design.",
    category: "premium",
    image_url: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&h=500&fit=crop",
    price: 28000,
  },
  {
    id: "5",
    name: "Steel Bookshelf Unit",
    description: "Industrial style bookshelf with wooden shelves and steel frame.",
    category: "furniture",
    image_url: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500&h=500&fit=crop",
    price: 32000,
  },
  {
    id: "6",
    name: "Decorative Window Grills",
    description: "Artistic window grills with modern geometric patterns.",
    category: "exterior",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&h=500&fit=crop",
    price: 18000,
  },
  {
    id: "7",
    name: "Steel Console Table",
    description: "Minimalist console table with marble top and gold-finished legs.",
    category: "interior",
    image_url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&h=500&fit=crop",
    price: 42000,
  },
  {
    id: "8",
    name: "Luxury Outdoor Furniture Set",
    description: "Complete outdoor seating with weather-resistant steel construction.",
    category: "premium",
    image_url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=500&h=500&fit=crop",
    price: 125000,
  },
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

      if (activeCategory !== "all" && (activeCategory === "interior" || activeCategory === "exterior" || activeCategory === "furniture" || activeCategory === "premium")) {
        query = query.eq("category", activeCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const displayProducts = products?.length
    ? products
    : fallbackProducts.filter(
        (p) => activeCategory === "all" || p.category === activeCategory
      );

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
      {/* Hero */}
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

      {/* Filters & Products */}
      <section className="section-container">
        {/* Category Filter */}
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

        {/* Products Grid */}
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="group glass-card hover-lift overflow-hidden"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <Button
                      variant="glass"
                      size="sm"
                      asChild
                      className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      <a
                        href={getWhatsAppUrl(product.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        WhatsApp Enquiry
                      </a>
                    </Button>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium uppercase tracking-wider text-primary">
                    {product.category}
                  </span>
                  <h3 className="text-base font-semibold mt-1 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  {product.price && (
                    <p className="text-lg font-bold gold-text">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {displayProducts.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Products;
