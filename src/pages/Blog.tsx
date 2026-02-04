import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Calendar, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

// Fallback blog posts
const fallbackPosts = [
  {
    id: "1",
    title: "The Art of Steel Furniture Design",
    slug: "art-of-steel-furniture-design",
    excerpt: "Discover how modern steel furniture combines durability with elegant design principles.",
    image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=500&fit=crop",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Interior Design Trends 2024",
    slug: "interior-design-trends-2024",
    excerpt: "Explore the latest trends in steel and metal interior design for the modern home.",
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Choosing the Perfect Steel Gate",
    slug: "choosing-perfect-steel-gate",
    excerpt: "A comprehensive guide to selecting the right gate design for your property.",
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop",
    created_at: new Date().toISOString(),
  },
];

const Blog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const displayPosts = posts?.length ? posts : fallbackPosts;

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider bg-primary/10 text-primary mb-4">
              Our Blog
            </span>
            <h1 className="section-heading">
              News & <span className="gold-text">Updates</span>
            </h1>
            <p className="section-subheading">
              Stay updated with our latest projects, industry insights, and company news.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-container">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card animate-pulse">
                <div className="aspect-[16/10] bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group glass-card hover-lift overflow-hidden"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image_url || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(post.created_at), "MMM d, yyyy")}
                  </div>
                  <h3 className="text-lg font-display font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {displayPosts.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No blog posts available yet.</p>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Blog;
