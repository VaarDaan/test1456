import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, X, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type BlogInsert = Database["public"]["Tables"]["blog_posts"]["Insert"];
type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];

interface BlogFormProps {
  post?: BlogPost | null;
  onSave: (post: BlogInsert | BlogPost) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const BlogForm = ({ post, onSave, onCancel, isLoading }: BlogFormProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<BlogInsert>>({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    image_url: post?.image_url || "",
    is_published: post?.is_published ?? false,
    meta_title: post?.meta_title || "",
    meta_description: post?.meta_description || "",
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image must be less than 5MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `blog-${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("products")
        .upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("products").getPublicUrl(data.path);
      setFormData({ ...formData, image_url: urlData.publicUrl });
      toast({ title: "Image uploaded!" });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.slug) {
      toast({ title: "Title and slug are required", variant: "destructive" });
      return;
    }
    if (post) {
      onSave({ ...post, ...formData } as BlogPost);
    } else {
      onSave(formData as BlogInsert);
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{post ? "Edit Blog Post" : "New Blog Post"}</h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Title *"
          value={formData.title}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: e.target.value,
              slug: post ? formData.slug : generateSlug(e.target.value),
            })
          }
        />
        <Input
          placeholder="Slug *"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
        />
        <Textarea
          placeholder="Excerpt (short summary)"
          className="md:col-span-2"
          value={formData.excerpt || ""}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
        />
        <Textarea
          placeholder="Content (full blog post)"
          className="md:col-span-2 min-h-[200px]"
          value={formData.content || ""}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        />
        <div className="flex gap-2">
          <Input
            placeholder="Cover Image URL"
            value={formData.image_url || ""}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="flex-1"
          />
          <label className="cursor-pointer">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
            <Button type="button" variant="outline" size="icon" disabled={uploading} asChild>
              <span>{uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}</span>
            </Button>
          </label>
        </div>
        {formData.image_url && (
          <img src={formData.image_url} alt="Preview" className="w-24 h-16 object-cover rounded-lg border" />
        )}
        <Input
          placeholder="Meta Title (SEO)"
          value={formData.meta_title || ""}
          onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
        />
        <Input
          placeholder="Meta Description (SEO)"
          value={formData.meta_description || ""}
          onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
        />
        <label className="flex items-center gap-2 md:col-span-2">
          <input
            type="checkbox"
            checked={formData.is_published ?? false}
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
          />
          Published
        </label>
      </div>
      <div className="flex justify-end mt-4 gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button variant="gold" onClick={handleSubmit} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {post ? "Update" : "Publish"} Post
        </Button>
      </div>
    </div>
  );
};
