import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Check if already logged in as admin
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: adminUser } = await supabase
          .from("admin_users")
          .select("id")
          .eq("user_id", session.user.id)
          .single();
        
        if (adminUser) {
          navigate("/admin/dashboard");
        }
      }
    };
    checkAdmin();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters");
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
          },
        });

        if (error) throw error;

        if (data.user) {
          // Add user to admin_users table
          const { error: adminError } = await supabase
            .from("admin_users")
            .insert([{ user_id: data.user.id }]);

          if (adminError) {
            console.error("Failed to add admin user:", adminError);
          }
        }

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account, then log in.",
        });
        setIsSignUp(false);
        setPassword("");
        setConfirmPassword("");
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is admin
      const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", data.user.id)
        .single();

      if (adminError || !adminUser) {
        await supabase.auth.signOut();
        throw new Error("You do not have admin access.");
      }

      toast({
        title: "Welcome back!",
        description: "Successfully logged in to admin panel.",
      });

      navigate("/admin/dashboard");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Invalid credentials";
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="min-h-[70vh] flex items-center justify-center py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card max-w-md mx-auto p-8">
            <div className="text-center mb-8">
              <div className="glass-card w-16 h-16 rounded-2xl inline-flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-display font-bold">Admin Login</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Sign in to access the admin dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="pl-10 bg-background/50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 bg-background/50"
                  />
                </div>
              </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-10 bg-background/50"
                  />
                </div>
              </div>
            )}

              <Button
                type="submit"
                variant="gold"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
              {isLoading ? (isSignUp ? "Creating account..." : "Signing in...") : (isSignUp ? "Create Account" : "Sign In")}
              </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-sm text-primary hover:underline"
              >
                {isSignUp ? "Already have an account? Sign in" : "Need an admin account? Sign up"}
              </button>
            </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminLogin;
