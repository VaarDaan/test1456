import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "Interior",
    description: "Elegant steel solutions for your indoor spaces",
    href: "/products?category=interior",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
  },
  {
    name: "Exterior",
    description: "Durable outdoor fabrication and structures",
    href: "/products?category=exterior",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop",
  },
  {
    name: "Furniture",
    description: "Modern steel furniture for every room",
    href: "/products?category=furniture",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
  },
  {
    name: "Premium Corner",
    description: "Exclusive luxury collections",
    href: "/products?category=premium",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop",
  },
];

export function CategoriesSection() {
  return (
    <section className="section-container">
      <div className="text-center mb-12">
        <h2 className="section-heading">
          Our <span className="gold-text">Categories</span>
        </h2>
        <p className="section-subheading mx-auto">
          Explore our diverse range of steel fabrication and furniture solutions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <Link
            key={category.name}
            to={category.href}
            className={`group glass-card hover-lift overflow-hidden fade-up fade-up-delay-${index + 1}`}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-display font-semibold group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
