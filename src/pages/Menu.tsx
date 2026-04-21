import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, GlassWater, Cake, UtensilsCrossed, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Seo } from "@/components/Seo";
import { cn } from "@/lib/utils";

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string | null;
  description: string | null;
  sort_order: number;
};

const CATEGORIES = [
  { key: "All", icon: UtensilsCrossed },
  { key: "Coffee", icon: Coffee },
  { key: "Beverages", icon: GlassWater },
  { key: "Desserts", icon: Cake },
  { key: "Continental Food", icon: UtensilsCrossed },
] as const;

const Menu = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>("All");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("id,name,category,price,image_url,description,sort_order")
        .eq("is_active", true)
        .order("category")
        .order("sort_order");
      if (!error && data) setItems(data as MenuItem[]);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(
    () => (active === "All" ? items : items.filter((i) => i.category === active)),
    [items, active]
  );

  return (
    <>
      <Seo
        title="Menu — Ca Phe Bistro | Coffee, Beverages, Desserts & Continental"
        description="Browse our coffee, beverages, desserts and continental dishes. Crafted daily at Ca Phe Bistro, Financial District, Hyderabad."
      />

      <section className="container py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm uppercase tracking-[0.25em] text-accent mb-3">Our menu</p>
          <h1 className="font-serif text-5xl md:text-6xl leading-tight">
            Crafted daily, <span className="italic text-gradient">served warmly.</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">
            From slow-pulled espresso to wood-fired plates — every item is made
            in-house with care.
          </p>
        </div>

        {/* Category tabs */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => {
            const isActive = active === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setActive(c.key)}
                className={cn(
                  "relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "glass hover:bg-secondary"
                )}
              >
                <c.icon className="h-4 w-4" />
                {c.key}
              </button>
            );
          })}
        </div>

        {/* Items */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : (
          <motion.div
            layout
            className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.article
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.4, delay: (i % 9) * 0.04 }}
                  className="group relative rounded-2xl overflow-hidden bg-card border border-border shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all duration-500"
                >
                  <div className="relative h-52 overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary grid place-items-center">
                        <Coffee className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 glass text-xs font-medium px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h3 className="font-serif text-xl font-semibold leading-tight">{item.name}</h3>
                      <span className="font-semibold text-accent whitespace-nowrap">
                        ₹{Number(item.price).toFixed(0)}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-16">No items in this category yet.</p>
        )}
      </section>
    </>
  );
};

export default Menu;
