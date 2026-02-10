import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Upload, Loader2, FileText, Globe, Tag, Megaphone, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SiteSetting {
  key: string;
  value: string | null;
}

export const SettingsPanel = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({
    catalogue_url: "",
    offer_banner_text: "",
    offer_banner_link: "",
    site_meta_title: "Satarupa Steel Furnitures - Premium Fabrication & Furniture Solutions",
    site_meta_description: "Premium quality steel furniture and fabrication solutions for home and office.",
    home_hero_title: "Crafting Excellence in Steel",
    home_hero_subtitle: "Premium fabrication and modern furniture solutions for your dream spaces",
    social_facebook: "",
    social_instagram: "",
    social_youtube: "",
    social_twitter: "",
  });

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) throw error;
      if (data) {
        const settingsMap: Record<string, string> = {};
        data.forEach((setting: SiteSetting) => { settingsMap[setting.key] = setting.value || ""; });
        setSettings((prev) => ({ ...prev, ...settingsMap }));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (key: string, value: string) => {
    const { data: existing } = await supabase.from("site_settings").select("id").eq("key", key).single();
    if (existing) {
      await supabase.from("site_settings").update({ value }).eq("key", key);
    } else {
      await supabase.from("site_settings").insert([{ key, value }]);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await saveSetting(key, value);
      }
      toast({ title: "Settings saved successfully!" });
    } catch {
      toast({ title: "Failed to save settings", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleCatalogueUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { toast({ title: "Please select a PDF file", variant: "destructive" }); return; }
    if (file.size > 50 * 1024 * 1024) { toast({ title: "PDF must be less than 50MB", variant: "destructive" }); return; }
    setUploading(true);
    try {
      const fileName = `catalogue-${Date.now()}.pdf`;
      const { data, error } = await supabase.storage.from("catalogue").upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("catalogue").getPublicUrl(data.path);
      setSettings({ ...settings, catalogue_url: urlData.publicUrl });
      await saveSetting("catalogue_url", urlData.publicUrl);
      toast({ title: "Catalogue uploaded successfully!" });
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Failed to upload catalogue", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading settings...</div>;

  return (
    <div className="space-y-6">
      {/* Catalogue */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">PDF Catalogue</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Upload your product catalogue PDF.</p>
        <div className="flex gap-3 items-center">
          <Input placeholder="Catalogue URL" value={settings.catalogue_url} onChange={(e) => setSettings({ ...settings, catalogue_url: e.target.value })} className="flex-1" />
          <label className="cursor-pointer">
            <input type="file" accept=".pdf" onChange={handleCatalogueUpload} className="hidden" disabled={uploading} />
            <Button variant="outline" disabled={uploading} asChild>
              <span>{uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}Upload PDF</span>
            </Button>
          </label>
        </div>
        {settings.catalogue_url && <a href={settings.catalogue_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-2 inline-block">View current catalogue →</a>}
      </div>

      {/* Offer Banner */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Offer Banner</h3>
        </div>
        <div className="grid gap-4">
          <Input placeholder="Offer text (e.g., '20% Off!')" value={settings.offer_banner_text} onChange={(e) => setSettings({ ...settings, offer_banner_text: e.target.value })} />
          <Input placeholder="Offer link (optional)" value={settings.offer_banner_link} onChange={(e) => setSettings({ ...settings, offer_banner_link: e.target.value })} />
        </div>
      </div>

      {/* Social Media */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Social Media Links</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Add your social media profile URLs. They'll appear in the website footer.</p>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Facebook</label>
            <Input placeholder="https://facebook.com/yourpage" value={settings.social_facebook} onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instagram</label>
            <Input placeholder="https://instagram.com/yourpage" value={settings.social_instagram} onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">YouTube</label>
            <Input placeholder="https://youtube.com/yourchannel" value={settings.social_youtube} onChange={(e) => setSettings({ ...settings, social_youtube: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Twitter / X</label>
            <Input placeholder="https://x.com/yourhandle" value={settings.social_twitter} onChange={(e) => setSettings({ ...settings, social_twitter: e.target.value })} />
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">SEO Settings</h3>
        </div>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Site Title</label>
            <Input value={settings.site_meta_title} onChange={(e) => setSettings({ ...settings, site_meta_title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Site Description</label>
            <Textarea value={settings.site_meta_description} onChange={(e) => setSettings({ ...settings, site_meta_description: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Homepage Content */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Homepage Content</h3>
        </div>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Hero Title</label>
            <Input value={settings.home_hero_title} onChange={(e) => setSettings({ ...settings, home_hero_title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
            <Textarea value={settings.home_hero_subtitle} onChange={(e) => setSettings({ ...settings, home_hero_subtitle: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="gold" onClick={handleSaveAll} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save All Settings
        </Button>
      </div>
    </div>
  );
};
