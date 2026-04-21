import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Coffee } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Seo } from "@/components/Seo";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate("/admin", { replace: true });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handle = async (mode: "in" | "up") => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    if (mode === "up") {
      const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. You're signed in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      setLoading(false);
      if (error) return toast.error(error.message);
    }
  };

  return (
    <>
      <Seo title="Staff login — Ca Phe Bistro" description="Sign in to manage menu items and contact messages." />
      <div className="min-h-[calc(100vh-5rem)] grid place-items-center px-4 py-16 bg-gradient-warm">
        <div className="w-full max-w-md rounded-3xl bg-card border border-border shadow-elegant p-8">
          <div className="flex items-center gap-2 justify-center mb-6">
            <span className="h-10 w-10 rounded-full bg-gradient-accent grid place-items-center">
              <Coffee className="h-5 w-5 text-accent-foreground" />
            </span>
            <span className="font-serif text-2xl font-semibold">Ca Phe Bistro</span>
          </div>
          <h1 className="font-serif text-3xl text-center mb-1">Staff portal</h1>
          <p className="text-center text-muted-foreground text-sm mb-6">
            Sign in to manage the menu and view messages.
          </p>

          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            {(["signin", "signup"] as const).map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor={`email-${tab}`}>Email</Label>
                  <Input
                    id={`email-${tab}`}
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@cafe.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`pass-${tab}`}>Password</Label>
                  <Input
                    id={`pass-${tab}`}
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
                <Button
                  className="w-full rounded-full bg-gradient-accent text-accent-foreground hover:opacity-95"
                  disabled={loading}
                  onClick={() => handle(tab === "signin" ? "in" : "up")}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {tab === "signin" ? "Sign in" : "Create account"}
                </Button>
                {tab === "signup" && (
                  <p className="text-xs text-center text-muted-foreground">
                    The first account created automatically becomes the admin.
                  </p>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Auth;
