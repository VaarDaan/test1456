-- Add INSERT policy for admin_users (for first-time admin setup)
CREATE POLICY "Service role can insert admin users"
ON public.admin_users FOR INSERT
WITH CHECK (true);

-- Create page_views table for analytics
CREATE TABLE IF NOT EXISTS public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  user_agent text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on page_views
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert page views (for tracking)
CREATE POLICY "Anyone can insert page views"
ON public.page_views FOR INSERT
WITH CHECK (true);

-- Only admins can view analytics
CREATE POLICY "Admins can view page views"
ON public.page_views FOR SELECT
USING (is_admin(auth.uid()));