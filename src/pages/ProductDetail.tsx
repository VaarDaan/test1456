import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowLeft, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [currentImage, setCurrentImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id!)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const getWhatsAppUrl = (productName: string) => {
    return `https://wa.me/919382176969?text=${encodeURIComponent(
      `Hi, I am interested in ${productName} from Satarupa Steel Furnitures.`
    )}`;
  };

  // Use main image as gallery (single image for now, expandable later)
  const images = product?.image_url ? [product.image_url] : ["/placeholder.svg"];

  if (isLoading) {
    return (
      <Layout>
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
            <div className="aspect-square bg-muted rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-1/3" />
              <div className="h-10 bg-muted rounded w-2/3" />
              <div className="h-6 bg-muted rounded w-1/4" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="section-container text-center py-20">
          <h2 className="text-2xl font-display font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">This product doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="section-container">
        {/* Breadcrumb */}
        <Link
          to="/products"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-2xl glass-card relative group">
              <img
                src={images[currentImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 glass-button p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 glass-button p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-colors ${
                      i === currentImage ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wider text-primary mb-2">
              {product.category}
            </span>

            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {product.name}
            </h1>

            {product.price && (
              <p className="text-3xl font-bold gold-text mb-6">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
            )}

            <p className="text-muted-foreground leading-relaxed mb-8">
              {product.description || "No description available."}
            </p>

            {/* Enquiry Button */}
            <Button variant="gold" size="lg" asChild className="w-full sm:w-auto mb-8">
              <a
                href={getWhatsAppUrl(product.name)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Enquiry
              </a>
            </Button>

            {/* Ratings placeholder */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-3">Ratings & Reviews</h3>
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-primary text-primary" />
                ))}
                <span className="text-sm text-muted-foreground ml-2">5.0 (Premium Quality)</span>
              </div>
              <p className="text-sm text-muted-foreground">
                All our products are crafted with premium materials and come with quality assurance.
                Contact us for detailed specifications and custom requirements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
