import { useQuery } from "@tanstack/react-query";
import { BarChart3, Users, Eye, TrendingUp, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PageView {
  page_path: string;
  created_at: string;
}

interface Product {
  id: string;
}

interface ContactSubmission {
  id: string;
  is_read: boolean | null;
}

export const AnalyticsPanel = () => {
  const { data: pageViews } = useQuery({
    queryKey: ["admin-page-views"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_views")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);
      if (error) throw error;
      return data as PageView[];
    },
  });

  const { data: products } = useQuery({
    queryKey: ["admin-products-count"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("id");
      if (error) throw error;
      return data as Product[];
    },
  });

  const { data: contacts } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("id, is_read");
      if (error) throw error;
      return data as ContactSubmission[];
    },
  });

  // Calculate stats
  const totalViews = pageViews?.length || 0;
  const todayViews =
    pageViews?.filter((v) => {
      const today = new Date().toDateString();
      return new Date(v.created_at).toDateString() === today;
    }).length || 0;

  const totalProducts = products?.length || 0;
  const totalContacts = contacts?.length || 0;
  const unreadContacts = contacts?.filter((c) => !c.is_read).length || 0;

  // Page breakdown
  const pageBreakdown = pageViews?.reduce(
    (acc: Record<string, number>, view) => {
      const path = view.page_path || "/";
      acc[path] = (acc[path] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const sortedPages = Object.entries(pageBreakdown || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Page Views</p>
              <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today's Views</p>
              <p className="text-2xl font-bold">{todayViews.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Users className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact Enquiries</p>
              <p className="text-2xl font-bold">
                {totalContacts}
                {unreadContacts > 0 && (
                  <span className="text-sm font-normal text-orange-500 ml-2">
                    ({unreadContacts} unread)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Top Pages</h3>
        </div>
        {sortedPages.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No page views recorded yet. Analytics will appear once visitors start
            browsing your site.
          </p>
        ) : (
          <div className="space-y-3">
            {sortedPages.map(([page, count]) => (
              <div key={page} className="flex items-center justify-between">
                <span className="text-sm truncate flex-1">{page}</span>
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 bg-primary/30 rounded"
                    style={{
                      width: `${Math.max(20, (count / totalViews) * 200)}px`,
                    }}
                  />
                  <span className="text-sm font-medium w-12 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Submissions */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Recent Contact Enquiries</h3>
        </div>
        <ContactList />
      </div>
    </div>
  );
};

const ContactList = () => {
  const { data: contacts, isLoading } = useQuery({
    queryKey: ["admin-contact-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading...</p>;
  }

  if (!contacts || contacts.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No contact submissions yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className={`p-3 rounded-lg border ${
            contact.is_read ? "bg-background/50" : "bg-primary/5 border-primary/20"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium">{contact.name}</span>
                {!contact.is_read && (
                  <span className="text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                    New
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {contact.email}
              </p>
              <p className="text-sm mt-1 line-clamp-2">{contact.message}</p>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {new Date(contact.created_at || "").toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};