import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, Pencil, Trash2, LogOut, Coffee, Mail, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
};

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

const CATEGORIES = ["Coffee", "Beverages", "Desserts", "Continental Food"];

const empty = {
  id: "",
  name: "",
  category: "Coffee",
  price: "",
  image_url: "",
  description: "",
  is_active: true,
  sort_order: 0,
};

const Admin = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<typeof empty | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        navigate("/auth", { replace: true });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", sess.session.user.id);
      if (cancelled) return;
      const admin = roles?.some((r) => r.role === "admin") ?? false;
      setIsAdmin(admin);
      setChecking(false);
      if (admin) await refresh();
    };
    init();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/auth", { replace: true });
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = async () => {
    setLoading(true);
    const [m, c] = await Promise.all([
      supabase.from("menu_items").select("*").order("category").order("sort_order"),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    ]);
    if (m.data) setItems(m.data as MenuItem[]);
    if (c.data) setMessages(c.data as Message[]);
    setLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/", { replace: true });
  };

  const openCreate = () => setEditing({ ...empty });
  const openEdit = (it: MenuItem) =>
    setEditing({
      id: it.id,
      name: it.name,
      category: it.category,
      price: String(it.price),
      image_url: it.image_url ?? "",
      description: it.description ?? "",
      is_active: it.is_active,
      sort_order: it.sort_order,
    });

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.category || !editing.price) {
      toast.error("Name, category and price are required.");
      return;
    }
    const price = Number(editing.price);
    if (Number.isNaN(price) || price < 0) {
      toast.error("Price must be a positive number.");
      return;
    }
    setSaving(true);
    const payload = {
      name: editing.name.trim(),
      category: editing.category,
      price,
      image_url: editing.image_url.trim() || null,
      description: editing.description.trim() || null,
      is_active: editing.is_active,
      sort_order: editing.sort_order,
    };
    const op = editing.id
      ? supabase.from("menu_items").update(payload).eq("id", editing.id)
      : supabase.from("menu_items").insert(payload);
    const { error } = await op;
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Updated" : "Created");
    setEditing(null);
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    refresh();
  };

  const markRead = async (id: string, is_read: boolean) => {
    const { error } = await supabase.from("contact_messages").update({ is_read }).eq("id", id);
    if (!error) refresh();
  };

  const removeMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  if (checking) {
    return (
      <div className="min-h-[calc(100vh-5rem)] grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[calc(100vh-5rem)] grid place-items-center px-4">
        <div className="text-center max-w-md">
          <h1 className="font-serif text-3xl mb-2">No admin access</h1>
          <p className="text-muted-foreground mb-6">
            Your account doesn't have admin rights. Ask the first admin to grant you access.
          </p>
          <Button onClick={signOut} variant="outline">Sign out</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo title="Admin — Ca Phe Bistro" description="Manage menu items and contact messages." />
      <div className="bg-gradient-warm min-h-[calc(100vh-5rem)]">
        <div className="container py-10">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-full bg-gradient-accent grid place-items-center">
                <Coffee className="h-5 w-5 text-accent-foreground" />
              </span>
              <div>
                <h1 className="font-serif text-3xl leading-tight">Admin dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage your menu and messages.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="rounded-full"><Link to="/">View site</Link></Button>
              <Button onClick={signOut} variant="ghost" className="rounded-full"><LogOut className="h-4 w-4 mr-1" />Sign out</Button>
            </div>
          </div>

          <Tabs defaultValue="menu">
            <TabsList>
              <TabsTrigger value="menu">Menu items ({items.length})</TabsTrigger>
              <TabsTrigger value="messages">
                Messages ({messages.filter((m) => !m.is_read).length} new)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="menu" className="mt-6">
              <div className="flex justify-end mb-4">
                <Button onClick={openCreate} className="rounded-full bg-gradient-accent text-accent-foreground">
                  <Plus className="h-4 w-4 mr-1" /> New item
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((it) => (
                    <div key={it.id} className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
                      <div className="h-40 bg-secondary overflow-hidden">
                        {it.image_url ? (
                          <img src={it.image_url} alt={it.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="grid place-items-center h-full text-muted-foreground"><Coffee className="h-6 w-6" /></div>
                        )}
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between gap-2">
                          <div>
                            <h3 className="font-serif text-lg leading-tight">{it.name}</h3>
                            <Badge variant="secondary" className="mt-1">{it.category}</Badge>
                          </div>
                          <span className="font-semibold text-accent">₹{Number(it.price).toFixed(0)}</span>
                        </div>
                        {it.description && <p className="text-xs text-muted-foreground line-clamp-2">{it.description}</p>}
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" onClick={() => openEdit(it)} className="flex-1"><Pencil className="h-3.5 w-3.5 mr-1" />Edit</Button>
                          <Button size="sm" variant="ghost" onClick={() => remove(it.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="messages" className="mt-6">
              {loading ? (
                <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
              ) : messages.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Mail className="h-8 w-8 mx-auto mb-3 opacity-60" />
                  No messages yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`rounded-2xl bg-card border p-5 shadow-soft ${m.is_read ? "border-border" : "border-accent/40"}`}
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{m.name}</h3>
                            {!m.is_read && <Badge className="bg-accent text-accent-foreground">New</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            <a href={`mailto:${m.email}`} className="hover:text-accent">{m.email}</a>
                            {m.phone && <> · <a href={`tel:${m.phone}`} className="hover:text-accent">{m.phone}</a></>}
                            <> · {new Date(m.created_at).toLocaleString()}</>
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => markRead(m.id, !m.is_read)}>
                            <Eye className="h-3.5 w-3.5 mr-1" /> Mark {m.is_read ? "unread" : "read"}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => removeMessage(m.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <p className="mt-3 text-sm whitespace-pre-wrap leading-relaxed">{m.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit item" : "New menu item"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Price (₹)</Label>
                  <Input type="number" min="0" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Image URL</Label>
                <Input value={editing.image_url} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://…" />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving} className="bg-gradient-accent text-accent-foreground">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Admin;
