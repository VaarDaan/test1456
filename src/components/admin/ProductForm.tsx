import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, X, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
type Product = Database["public"]["Tables"]["products"]["Row"];

const categories = [
  { value: "interior", label: "Interior" },
  { value: "exterior", label: "Exterior" },
  { value: "furniture", label: "Furniture" },
  { value: "premium", label: "Premium" },
] as const;

type CategoryValue = typeof categories[number]["value"];

interface ProductFormProps {
  product?: Product | null;
  onSave: (product: ProductInsert | Product) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const ProductForm = ({ product, onSave, onCancel, isLoading }: ProductFormProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<ProductInsert>>({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || "furniture",
    price: product?.price || 0,
    image_url: product?.image_url || "",
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    meta_title: product?.meta_title || "",
    meta_description: product?.meta_description || "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image must be less than 5MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("products")
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(data.path);

      setFormData({ ...formData, image_url: urlData.publicUrl });
      toast({ title: "Image uploaded successfully!" });
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Failed to upload image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }

    if (product) {
      onSave({ ...product, ...formData } as Product);
    } else {
      onSave(formData as ProductInsert);
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {product ? "Edit Product" : "Add New Product"}
        </h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Product Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value as CategoryValue })
          }
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <Input
          type="number"
          placeholder="Price"
          value={formData.price || ""}
          onChange={(e) =>
            setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
          }
        />

        <div className="flex gap-2">
          <Input
            placeholder="Image URL"
            value={formData.image_url || ""}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="flex-1"
          />
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={uploading}
              asChild
            >
              <span>
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </span>
            </Button>
          </label>
        </div>

        {formData.image_url && (
          <div className="md:col-span-2">
            <img
              src={formData.image_url}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg border"
            />
          </div>
        )}

        <Textarea
          placeholder="Description"
          className="md:col-span-2"
          value={formData.description || ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <Input
          placeholder="Meta Title (SEO)"
          value={formData.meta_title || ""}
          onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
        />

        <Input
          placeholder="Meta Description (SEO)"
          value={formData.meta_description || ""}
          onChange={(e) =>
            setFormData({ ...formData, meta_description: e.target.value })
          }
        />

        <div className="md:col-span-2 flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
            />
            Active
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) =>
                setFormData({ ...formData, is_featured: e.target.checked })
              }
            />
            Featured
          </label>
        </div>
      </div>

      <div className="flex justify-end mt-4 gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="gold" onClick={handleSubmit} disabled={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {product ? "Update" : "Save"} Product
        </Button>
      </div>
    </div>
  );
};