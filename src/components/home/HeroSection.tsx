import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

export function HeroSection() {
  const whatsappUrl = `https://wa.me/919382176969?text=${encodeURIComponent(
    "Hi, I am interested in your products from Satarupa Steel Furnitures."
  )}`;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Premium steel furniture showroom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl">
          <span className="inline-block px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider bg-primary/10 text-primary mb-6 fade-up">
            Premium Fabrication & Furniture
          </span>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 fade-up fade-up-delay-1">
            Crafting{" "}
            <span className="gold-text">Excellence</span>
            <br />
            in Steel
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg fade-up fade-up-delay-2">
            Transform your space with premium steel fabrication and modern furniture 
            solutions. Quality craftsmanship meets contemporary design.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 fade-up fade-up-delay-3">
            <Button variant="gold" size="xl" asChild>
              <Link to="/products">
                Explore Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button variant="glass" size="xl" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex items-center gap-8 fade-up fade-up-delay-4">
            <div>
              <p className="text-3xl font-bold gold-text">500+</p>
              <p className="text-sm text-muted-foreground">Projects Completed</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <p className="text-3xl font-bold gold-text">15+</p>
              <p className="text-sm text-muted-foreground">Years Experience</p>
            </div>
            <div className="w-px h-12 bg-border hidden sm:block" />
            <div className="hidden sm:block">
              <p className="text-3xl font-bold gold-text">100%</p>
              <p className="text-sm text-muted-foreground">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
