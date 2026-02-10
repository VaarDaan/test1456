import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Check, Trash2, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export const ContactPanel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_submissions").update({ is_read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
      toast({ title: "Marked as read" });
    },
  });

  const unreadCount = submissions?.filter((s) => !s.is_read).length || 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold">
          Contact Enquiries
          {unreadCount > 0 && (
            <span className="ml-2 text-sm bg-primary text-primary-foreground px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </h2>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading...</div>
      ) : !submissions?.length ? (
        <div className="text-center py-8 text-muted-foreground">No enquiries yet.</div>
      ) : (
        <div className="grid gap-4">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className={`glass-card p-5 ${!sub.is_read ? "border-l-4 border-l-primary" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold">{sub.name}</h4>
                    {!sub.is_read && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">New</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <a href={`mailto:${sub.email}`} className="flex items-center gap-1 hover:text-primary">
                      <Mail className="w-3 h-3" />{sub.email}
                    </a>
                    {sub.phone && (
                      <a href={`tel:${sub.phone}`} className="flex items-center gap-1 hover:text-primary">
                        <Phone className="w-3 h-3" />{sub.phone}
                      </a>
                    )}
                    <span>{sub.created_at ? format(new Date(sub.created_at), "MMM d, yyyy h:mm a") : ""}</span>
                  </div>
                  <p className="text-sm">{sub.message}</p>
                </div>
                <div className="flex gap-2">
                  {!sub.is_read && (
                    <Button variant="outline" size="sm" onClick={() => markReadMutation.mutate(sub.id)}>
                      <Check className="w-4 h-4 mr-1" />Read
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
