import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  if (!products?.length) return null;

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
        {products.map((product, index) => (
          <div
            key={product.id}
            className={`group glass-card hover-lift overflow-hidden fade-up fade-up-delay-${index + 1}`}
          >
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
                  Enquire
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
