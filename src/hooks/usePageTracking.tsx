import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await supabase.from("page_views").insert([
          {
            page_path: location.pathname,
            user_agent: navigator.userAgent,
            referrer: document.referrer || null,
          },
        ]);
      } catch (error) {
        // Silently fail - analytics shouldn't break the app
        console.debug("Page tracking error:", error);
      }
    };

    trackPageView();
  }, [location.pathname]);
};