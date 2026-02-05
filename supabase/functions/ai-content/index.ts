import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, prompt } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    switch (type) {
      case "product_description":
        systemPrompt = `You are a professional copywriter for Satarupa Steel Furnitures, a premium steel fabrication and furniture company in India. Write compelling, SEO-friendly product descriptions. Include benefits, materials, and use cases. Keep it professional yet engaging. Use Indian English. Format with proper paragraphs.`;
        break;
      case "blog_post":
        systemPrompt = `You are a content writer for Satarupa Steel Furnitures, specializing in steel furniture and fabrication. Write informative, engaging blog posts about furniture, interior design, and steel products. Use Indian English, include practical tips, and maintain a professional tone. Format with headings and paragraphs.`;
        break;
      case "seo_meta":
        systemPrompt = `You are an SEO specialist for Satarupa Steel Furnitures. Generate optimized meta titles (under 60 characters) and meta descriptions (under 160 characters) for web pages. Focus on relevant keywords for steel furniture, fabrication, and home/office solutions in India. Format as:
Meta Title: [title]
Meta Description: [description]`;
        break;
      case "offer_text":
        systemPrompt = `You are a marketing copywriter for Satarupa Steel Furnitures. Create compelling, concise promotional text for offers and discounts. Use action words, create urgency, and highlight value. Keep it brief and punchy. Use Indian English.`;
        break;
      default:
        systemPrompt = `You are a helpful assistant for Satarupa Steel Furnitures. Provide clear, professional responses.`;
    }

    console.log("Calling AI gateway with type:", type);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No content generated";

    console.log("AI content generated successfully");

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI content error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});