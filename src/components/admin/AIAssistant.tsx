import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Loader2, Sparkles, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

type ContentType = "product_description" | "blog_post" | "seo_meta" | "offer_text";

const contentTypes = [
  { value: "product_description", label: "Product Description", icon: "📦" },
  { value: "blog_post", label: "Blog Post", icon: "📝" },
  { value: "seo_meta", label: "SEO Meta Tags", icon: "🔍" },
  { value: "offer_text", label: "Offer/Promo Text", icon: "🎉" },
];

export const AIAssistant = () => {
  const { toast } = useToast();
  const [contentType, setContentType] = useState<ContentType>("product_description");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({ title: "Please enter a prompt", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const { data, error } = await supabase.functions.invoke("ai-content", {
        body: { type: contentType, prompt: prompt.trim() },
      });

      if (error) throw error;
      setResult(data.content || "No content generated");
    } catch (error) {
      console.error("AI error:", error);
      toast({
        title: "Failed to generate content",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">AI Content Assistant</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Generate product descriptions, blog posts, SEO meta tags, and promotional
          content using AI.
        </p>

        {/* Content Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {contentTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setContentType(type.value as ContentType)}
              className={`p-3 rounded-lg border text-sm text-left transition-all ${
                contentType === type.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <span className="text-lg mr-2">{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>

        {/* Prompt Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {contentType === "product_description" &&
                "Describe your product (name, features, materials)"}
              {contentType === "blog_post" && "What topic should the blog cover?"}
              {contentType === "seo_meta" &&
                "Describe the page content for SEO optimization"}
              {contentType === "offer_text" &&
                "Describe your offer or promotion"}
            </label>
            <Textarea
              placeholder={
                contentType === "product_description"
                  ? "e.g., A modern steel office desk with wooden top, featuring cable management and drawer storage..."
                  : contentType === "blog_post"
                  ? "e.g., Benefits of steel furniture for modern offices..."
                  : contentType === "seo_meta"
                  ? "e.g., Our premium furniture collection page featuring luxury steel furniture..."
                  : "e.g., 20% discount on all premium furniture this Diwali..."
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </div>

          <Button
            variant="gold"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="w-full md:w-auto"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {loading ? "Generating..." : "Generate Content"}
          </Button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Generated Content</h4>
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              {copied ? (
                <Check className="w-4 h-4 mr-1" />
              ) : (
                <Copy className="w-4 h-4 mr-1" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};