import { Link } from "react-router-dom";
import { Phone, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gold-gradient opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-card p-8 md:p-12 lg:p-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Get in touch with us today to discuss your project requirements. 
            Download our catalogue or call us directly for a free consultation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gold" size="xl" asChild>
              <a href="tel:+919382176969">
                <Phone className="w-5 h-5 mr-2" />
                Call +91 93821 76969
              </a>
            </Button>
            <Button variant="glass" size="xl" asChild>
              <Link to="/catalogue">
                <Download className="w-5 h-5 mr-2" />
                Download Catalogue
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/contact">
                Contact Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
