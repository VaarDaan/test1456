import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Fallback products for when database is empty
const fallbackProducts = [
  {
    id: "1",
    name: "Modern Steel Dining Table",
    description: "Elegant steel frame with tempered glass top",
    category: "furniture",
    image_url: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500&h=500&fit=crop",
    price: 45000,
  },
  {
    id: "2",
    name: "Premium Gate Design",
    description: "Custom steel gate with intricate patterns",
    category: "exterior",
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop",
    price: 85000,
  },
  {
    id: "3",
    name: "Steel Railing System",
    description: "Modern staircase railing with glass panels",
    category: "interior",
    image_url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=500&h=500&fit=crop",
    price: 35000,
  },
  {
    id: "4",
    name: "Executive Office Chair",
    description: "Premium steel and leather executive chair",
    category: "premium",
    image_url: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&h=500&fit=crop",
    price: 28000,
  },
];

export function FeaturedProducts() {
  const { data: products } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .eq("is_active", true)
        .limit(4);
      
      if (error) throw error;
      return data;
    },
  });

  const displayProducts = products?.length ? products : fallbackProducts;

  const getWhatsAppUrl = (productName: string) => {
    return `https://wa.me/919382176969?text=${encodeURIComponent(
      `Hi, I am interested in ${productName} from Satarupa Steel Furnitures.`
    )}`;
  };

  return (
    <section className="section-container bg-muted/30">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <h2 className="section-heading">
            Featured <span className="gold-text">Products</span>
          </h2>
          <p className="section-subheading">
            Discover our most popular steel fabrication and furniture pieces
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/products">
            View All Products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayProducts.map((product, index) => (
          <div
            key={product.id}
            className={`group glass-card hover-lift overflow-hidden fade-up fade-up-delay-${index + 1}`}
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
                    Enquire
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
    </section>
  );
}
