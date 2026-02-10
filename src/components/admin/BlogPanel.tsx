import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BlogForm } from "./BlogForm";
import type { Database } from "@/integrations/supabase/types";
import { format } from "date-fns";

type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
type BlogInsert = Database["public"]["Tables"]["blog_posts"]["Insert"];

export const BlogPanel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (post: BlogInsert) => {
      const { error } = await supabase.from("blog_posts").insert([post]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast({ title: "Blog post created!" });
      setIsAdding(false);
    },
    onError: () => toast({ title: "Failed to create post", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async (post: BlogPost) => {
      const { error } = await supabase.from("blog_posts").update(post).eq("id", post.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast({ title: "Blog post updated!" });
      setEditing(null);
    },
    onError: () => toast({ title: "Failed to update post", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      toast({ title: "Blog post deleted!" });
    },
    onError: () => toast({ title: "Failed to delete post", variant: "destructive" }),
  });

  const handleSave = (post: BlogInsert | BlogPost) => {
    if ("id" in post) {
      updateMutation.mutate(post as BlogPost);
    } else {
      addMutation.mutate(post as BlogInsert);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold">Blog Posts</h2>
        <Button variant="gold" onClick={() => { setIsAdding(true); setEditing(null); }}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {isAdding && (
        <div className="mb-6">
          <BlogForm onSave={handleSave} onCancel={() => setIsAdding(false)} isLoading={addMutation.isPending} />
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading posts...</div>
      ) : posts?.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No blog posts yet.</div>
      ) : (
        <div className="grid gap-4">
          {posts?.map((post) => (
            <div key={post.id} className="glass-card p-4 flex items-center gap-4">
              {post.image_url && (
                <img src={post.image_url} alt={post.title} className="w-16 h-12 object-cover rounded-lg" />
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{post.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {post.created_at ? format(new Date(post.created_at), "MMM d, yyyy") : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${post.is_published ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {post.is_published ? <Eye className="w-3 h-3 inline mr-1" /> : <EyeOff className="w-3 h-3 inline mr-1" />}
                  {post.is_published ? "Published" : "Draft"}
                </span>
                <Button variant="ghost" size="icon" onClick={() => { setEditing(post); setIsAdding(false); }}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(post.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <BlogForm post={editing} onSave={handleSave} onCancel={() => setEditing(null)} isLoading={updateMutation.isPending} />
          </div>
        </div>
      )}
    </div>
  );
};
