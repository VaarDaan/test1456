import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Catalogue = () => {
  const { data: catalogueUrl } = useQuery({
    queryKey: ["catalogue-url"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "catalogue_url")
        .single();
      return data?.value || null;
    },
  });

  return (
    <Layout>
      <section className="min-h-[70vh] flex items-center justify-center py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card max-w-2xl mx-auto p-8 md:p-12 text-center">
            <div className="glass-card w-20 h-20 rounded-2xl inline-flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-primary" />
            </div>

            <h1 className="section-heading mb-4">
              Product <span className="gold-text">Catalogue</span>
            </h1>

            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Download our comprehensive product catalogue to explore our complete range 
              of steel fabrication and furniture solutions.
            </p>

            {catalogueUrl ? (
              <Button variant="gold" size="xl" asChild>
                <a href={catalogueUrl} target="_blank" rel="noopener noreferrer" download>
                  <Download className="w-5 h-5 mr-2" />
                  Download Catalogue (PDF)
                </a>
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The catalogue is currently being updated. Please check back soon or contact us directly.
                </p>
                <Button variant="outline" size="lg" asChild>
                  <a href="tel:+919382176969">
                    Call for Catalogue: +91 93821 76969
                  </a>
                </Button>
              </div>
            )}

            <div className="mt-10 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                For custom requirements or bulk orders, please{" "}
                <a href="/contact" className="text-primary hover:underline">
                  contact us
                </a>{" "}
                directly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Catalogue;
