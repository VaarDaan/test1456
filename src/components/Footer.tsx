import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const footerLinks = {
  products: [
    { name: "Interior", href: "/products?category=interior" },
    { name: "Exterior", href: "/products?category=exterior" },
    { name: "Furniture", href: "/products?category=furniture" },
    { name: "Premium Corner", href: "/products?category=premium" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
    { name: "Catalogue", href: "/catalogue" },
  ],
};

export function Footer() {
  const whatsappUrl = `https://wa.me/919382176969?text=${encodeURIComponent(
    "Hi, I am interested in your products from Satarupa Steel Furnitures."
  )}`;

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-display font-bold gold-text">
                Satarupa
              </span>
              <p className="text-sm text-muted-foreground">Steel Furnitures</p>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Premium fabrication and modern furniture solutions. Crafting excellence since establishment.
            </p>
            <div className="flex gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button p-3 rounded-full hover:text-primary transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="tel:+919382176969"
                className="glass-button p-3 rounded-full hover:text-primary transition-colors"
                aria-label="Call"
              >
                <Phone className="w-5 h-5" />
              </a>
              <a
                href="mailto:bidyutbera.mpd@gmail.com"
                className="glass-button p-3 rounded-full hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Products
            </h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+919382176969"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  +91 93821 76969
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:bidyutbera.mpd@gmail.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  bidyutbera.mpd@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  West Bengal, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Satarupa Steel Furnitures. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            CEO: <span className="text-foreground">Bidyut Kumar Bera</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
