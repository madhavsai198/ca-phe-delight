import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, GlassWater, Cake, UtensilsCrossed, Loader2, Search, X } from "lucide-react";
import api from "@/lib/api";
import { Seo } from "@/components/Seo";
import { cn } from "@/lib/utils";

type MenuItem = {
  _id?: string;
  id?: string;
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

const HARDCODED_ITEMS: MenuItem[] = [
  // Beverages - Hot
  { id: 'h1', name: 'Cappuccino', category: 'Coffee', price: 190, image_url: 'https://loremflickr.com/600/400/cappuccino,coffee/all', description: null, sort_order: 1 },
  { id: 'h2', name: 'Americano', category: 'Coffee', price: 180, image_url: 'https://loremflickr.com/600/400/americano,coffee/all', description: null, sort_order: 2 },
  { id: 'h3', name: 'Flat White', category: 'Coffee', price: 250, image_url: 'https://loremflickr.com/600/400/flatwhite,coffee/all', description: null, sort_order: 3 },
  { id: 'h4', name: 'Cafe Latte', category: 'Coffee', price: 220, image_url: 'https://loremflickr.com/600/400/latte,coffee/all', description: null, sort_order: 4 },
  { id: 'h5', name: 'Cafe Mocha', category: 'Coffee', price: 250, image_url: 'https://loremflickr.com/600/400/mocha,coffee/all', description: null, sort_order: 5 },
  { id: 'h6', name: 'Espresso', category: 'Coffee', price: 170, image_url: 'https://loremflickr.com/600/400/espresso,coffee/all', description: null, sort_order: 6 },
  { id: 'h7', name: 'Hot Chocolate', category: 'Beverages', price: 220, image_url: 'https://loremflickr.com/600/400/hotchocolate,drink/all', description: null, sort_order: 7 },
  { id: 'h8', name: 'Biscoff Coffee', category: 'Coffee', price: 250, image_url: 'https://loremflickr.com/600/400/biscoff,coffee/all', description: null, sort_order: 8 },
  { id: 'h9', name: 'Matcha Latte', category: 'Coffee', price: 250, image_url: 'https://loremflickr.com/600/400/matcha,latte/all', description: null, sort_order: 9 },

  // Beverages - Iced Coffee
  { id: 'ic1', name: 'Vanilla Matcha Latte', category: 'Coffee', price: 280, image_url: 'https://loremflickr.com/600/400/vanilla,matcha,latte/all', description: null, sort_order: 10 },
  { id: 'ic2', name: 'Cold Coffee', category: 'Coffee', price: 260, image_url: 'https://loremflickr.com/600/400/cold,coffee/all', description: null, sort_order: 11 },
  { id: 'ic3', name: 'Vanilla Iced Latte', category: 'Coffee', price: 260, image_url: 'https://loremflickr.com/600/400/vanilla,iced,latte/all', description: null, sort_order: 12 },
  { id: 'ic4', name: 'Caramel Cold Coffee', category: 'Coffee', price: 270, image_url: 'https://loremflickr.com/600/400/caramel,cold,coffee/all', description: null, sort_order: 13 },
  { id: 'ic5', name: 'Avocado Matcha', category: 'Coffee', price: 300, image_url: 'https://loremflickr.com/600/400/avocado,matcha,drink/all', description: null, sort_order: 14 },
  { id: 'ic6', name: 'Coconut Matcha', category: 'Coffee', price: 280, image_url: 'https://loremflickr.com/600/400/coconut,matcha,drink/all', description: null, sort_order: 15 },
  { id: 'ic7', name: 'Irish Latte', category: 'Coffee', price: 280, image_url: 'https://loremflickr.com/600/400/irish,latte/all', description: null, sort_order: 16 },
  { id: 'ic8', name: 'Hazelnut Latte', category: 'Coffee', price: 270, image_url: 'https://loremflickr.com/600/400/hazelnut,latte/all', description: null, sort_order: 17 },
  { id: 'ic9', name: 'Vanilla Latte', category: 'Coffee', price: 250, image_url: 'https://loremflickr.com/600/400/vanilla,latte/all', description: null, sort_order: 18 },
  { id: 'ic10', name: 'OG Filter Coffee', category: 'Coffee', price: 280, image_url: 'https://loremflickr.com/600/400/filter,coffee/all', description: null, sort_order: 19 },
  { id: 'ic11', name: 'Strawberry Matcha Latte', category: 'Coffee', price: 280, image_url: 'https://loremflickr.com/600/400/strawberry,matcha,latte/all', description: null, sort_order: 20 },
  { id: 'ic12', name: 'Honey Cinnamon Latte', category: 'Coffee', price: 250, image_url: 'https://loremflickr.com/600/400/honey,cinnamon,latte/all', description: null, sort_order: 21 },
  { id: 'ic13', name: 'Spanish Latte', category: 'Coffee', price: 240, image_url: 'https://loremflickr.com/600/400/spanish,latte/all', description: null, sort_order: 22 },
  { id: 'ic14', name: 'Affogato', category: 'Coffee', price: 250, image_url: 'https://loremflickr.com/600/400/affogato,coffee/all', description: null, sort_order: 23 },

  // Beverages - Cold Brews
  { id: 'cb1', name: 'Cinnamon Honey Cold Brew', category: 'Beverages', price: 270, image_url: 'https://loremflickr.com/600/400/cinnamon,honey,coldbrew/all', description: null, sort_order: 24 },
  { id: 'cb2', name: 'Valencia Orange Cold Brew', category: 'Beverages', price: 270, image_url: 'https://loremflickr.com/600/400/orange,coldbrew/all', description: null, sort_order: 25 },
  { id: 'cb3', name: 'Mango Cold Brew', category: 'Beverages', price: 270, image_url: 'https://loremflickr.com/600/400/mango,coldbrew/all', description: null, sort_order: 26 },
  { id: 'cb4', name: 'Mojito Cold Brew', category: 'Beverages', price: 250, image_url: 'https://loremflickr.com/600/400/mojito,coldbrew/all', description: null, sort_order: 27 },
  { id: 'cb5', name: 'Cola Brew', category: 'Beverages', price: 250, image_url: 'https://loremflickr.com/600/400/cola,drink/all', description: null, sort_order: 28 },
  { id: 'cb6', name: 'Cranberry Cold Brew', category: 'Beverages', price: 270, image_url: 'https://loremflickr.com/600/400/cranberry,coldbrew/all', description: null, sort_order: 29 },
  { id: 'cb7', name: 'Lemon & Honey Cold Brew', category: 'Beverages', price: 270, image_url: 'https://loremflickr.com/600/400/lemon,honey,coldbrew/all', description: null, sort_order: 30 },
  { id: 'cb8', name: 'Apple Whiskey Brew', category: 'Beverages', price: 280, image_url: 'https://loremflickr.com/600/400/apple,whiskey,drink/all', description: null, sort_order: 31 },

  // Beverages - Green Tea
  { id: 'gt1', name: 'Chamomile Tea', category: 'Beverages', price: 190, image_url: 'https://loremflickr.com/600/400/chamomile,tea/all', description: null, sort_order: 32 },
  { id: 'gt2', name: 'Blue Pea', category: 'Beverages', price: 210, image_url: 'https://loremflickr.com/600/400/bluepea,tea/all', description: null, sort_order: 33 },
  { id: 'gt3', name: 'Rosalang Tea', category: 'Beverages', price: 210, image_url: 'https://loremflickr.com/600/400/tea,drink/all', description: null, sort_order: 34 },
  { id: 'gt4', name: 'Lavender Tea', category: 'Beverages', price: 210, image_url: 'https://loremflickr.com/600/400/lavender,tea/all', description: null, sort_order: 35 },
  { id: 'gt5', name: 'Kashmiri Kahwa', category: 'Beverages', price: 210, image_url: 'https://loremflickr.com/600/400/kahwa,tea/all', description: null, sort_order: 36 },

  // Food Menu
  { id: 'f1', name: 'Bombay Sandwich', category: 'Continental Food', price: 200, image_url: 'https://loremflickr.com/600/400/bombay,sandwich/all', description: null, sort_order: 37 },
  { id: 'f2', name: 'Paneer Sandwich', category: 'Continental Food', price: 250, image_url: 'https://loremflickr.com/600/400/paneer,sandwich/all', description: null, sort_order: 38 },
  { id: 'f3', name: 'Veg. Club Sandwich', category: 'Continental Food', price: 200, image_url: 'https://loremflickr.com/600/400/club,sandwich/all', description: null, sort_order: 39 },
  { id: 'f4', name: 'Corn And Spinach Sandwich', category: 'Continental Food', price: 200, image_url: 'https://loremflickr.com/600/400/corn,spinach,sandwich/all', description: null, sort_order: 40 },
  { id: 'f5', name: 'Chicken Sandwich', category: 'Continental Food', price: 250, image_url: 'https://loremflickr.com/600/400/chicken,sandwich/all', description: null, sort_order: 41 },
  { id: 'f6', name: 'Veg. Burger', category: 'Continental Food', price: 250, image_url: 'https://loremflickr.com/600/400/veg,burger/all', description: null, sort_order: 42 },
  { id: 'f7', name: 'Butter Chicken Burger', category: 'Continental Food', price: 350, image_url: 'https://loremflickr.com/600/400/butterchicken,burger/all', description: null, sort_order: 43 },
  { id: 'f8', name: 'Crispy Chicken Burger', category: 'Continental Food', price: 350, image_url: 'https://loremflickr.com/600/400/crispy,chicken,burger/all', description: null, sort_order: 44 },
  { id: 'f9', name: 'Veg. Pasta', category: 'Continental Food', price: 350, image_url: 'https://loremflickr.com/600/400/veg,pasta/all', description: null, sort_order: 45 },
  { id: 'f10', name: 'Chicken Pasta', category: 'Continental Food', price: 390, image_url: 'https://loremflickr.com/600/400/chicken,pasta/all', description: null, sort_order: 46 },
  { id: 'f11', name: 'Mac n Cheese', category: 'Continental Food', price: 300, image_url: 'https://loremflickr.com/600/400/macncheese,food/all', description: null, sort_order: 47 },
  { id: 'f12', name: 'Garden Pizza', category: 'Continental Food', price: 330, image_url: 'https://loremflickr.com/600/400/garden,pizza/all', description: null, sort_order: 48 },
  { id: 'f13', name: 'Margherita Pizza', category: 'Continental Food', price: 330, image_url: 'https://loremflickr.com/600/400/margherita,pizza/all', description: null, sort_order: 49 },
  { id: 'f14', name: 'Paneer Tikka Pizza', category: 'Continental Food', price: 350, image_url: 'https://loremflickr.com/600/400/paneer,pizza/all', description: null, sort_order: 50 },
  { id: 'f15', name: 'Tandoori Chicken Pizza', category: 'Continental Food', price: 360, image_url: 'https://loremflickr.com/600/400/tandoori,chicken,pizza/all', description: null, sort_order: 51 },
  { id: 'f16', name: 'Chicken Pizza', category: 'Continental Food', price: 360, image_url: 'https://loremflickr.com/600/400/chicken,pizza/all', description: null, sort_order: 52 },
  { id: 'f17', name: 'French Fries', category: 'Continental Food', price: 250, image_url: 'https://loremflickr.com/600/400/frenchfries,food/all', description: 'Peri Peri/ Manchuria/ Truffle', sort_order: 53 },
  { id: 'f18', name: 'French Toast', category: 'Continental Food', price: 350, image_url: 'https://loremflickr.com/600/400/frenchtoast,food/all', description: null, sort_order: 54 },
  { id: 'f19', name: 'Egg Toast', category: 'Continental Food', price: 350, image_url: 'https://loremflickr.com/600/400/egg,toast/all', description: null, sort_order: 55 },
  { id: 'f20', name: 'Fish And Chips', category: 'Continental Food', price: 350, image_url: 'https://loremflickr.com/600/400/fishandchips,food/all', description: null, sort_order: 56 },
  { id: 'f21', name: 'Hash Brown', category: 'Continental Food', price: 180, image_url: 'https://loremflickr.com/600/400/hashbrown,food/all', description: null, sort_order: 57 },
  { id: 'f22', name: 'Chicken Popcorn', category: 'Continental Food', price: 280, image_url: 'https://loremflickr.com/600/400/chickenpopcorn,food/all', description: null, sort_order: 58 },
  { id: 'f23', name: 'Cheese Balls', category: 'Continental Food', price: 250, image_url: 'https://loremflickr.com/600/400/cheeseballs,food/all', description: null, sort_order: 59 },
  { id: 'f24', name: 'Potato Wedges', category: 'Continental Food', price: 220, image_url: 'https://loremflickr.com/600/400/potatowedges,food/all', description: null, sort_order: 60 },
  { id: 'f25', name: 'Waffles', category: 'Desserts', price: 290, image_url: 'https://loremflickr.com/600/400/waffles,dessert/all', description: null, sort_order: 61 },
  { id: 'f26', name: 'Watermelon with Feta Cheese', category: 'Continental Food', price: 230, image_url: 'https://loremflickr.com/600/400/watermelon,feta,salad/all', description: null, sort_order: 62 },
  { id: 'f27', name: 'Burrito Bowl', category: 'Continental Food', price: 250, image_url: 'https://loremflickr.com/600/400/burritobowl,food/all', description: 'Veg. / Non-veg.', sort_order: 63 },
  { id: 'f28', name: 'Chicken Keema Bun', category: 'Continental Food', price: 260, image_url: 'https://loremflickr.com/600/400/chicken,keema,bun/all', description: null, sort_order: 64 },
  { id: 'f29', name: 'Grilled Chicken', category: 'Continental Food', price: 360, image_url: 'https://loremflickr.com/600/400/grilledchicken,food/all', description: 'with Mashed Potatoes & Veggies', sort_order: 65 },
  { id: 'f30', name: 'Fruits Bowl', category: 'Desserts', price: 250, image_url: 'https://loremflickr.com/600/400/fruitsbowl,dessert/all', description: null, sort_order: 66 },
  { id: 'f31', name: 'Nutty Bowl', category: 'Desserts', price: 280, image_url: 'https://loremflickr.com/600/400/nuts,bowl,dessert/all', description: null, sort_order: 67 }
];

// Set this to true to use the hardcoded items without hitting the Supabase database.
// This allows you to run the website as a pure frontend application if needed.
const USE_FRONTEND_ONLY = false;

const Menu = () => {
  const [items, setItems] = useState<MenuItem[]>(USE_FRONTEND_ONLY ? HARDCODED_ITEMS : []);
  const [loading, setLoading] = useState(!USE_FRONTEND_ONLY);
  const [active, setActive] = useState<string>("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (USE_FRONTEND_ONLY) {
      return; // Skip Supabase fetch if running frontend only
    }

    (async () => {
      try {
        const { data } = await api.get('/menu');
        setItems(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = active === "All" ? items : items.filter((i) => i.category === active);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q));
    }
    return list;
  }, [items, active, query]);

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

        {/* Search bar */}
        <div className="mt-6 max-w-md mx-auto relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search menu items…"
            className="w-full rounded-full border border-border bg-card pl-10 pr-10 py-2.5 text-sm shadow-soft outline-none focus:ring-2 focus:ring-accent/40 transition-all placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
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
                  key={item._id || item.id}
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
          <p className="text-center text-muted-foreground py-16">
            {query ? `No results for "${query}"` : 'No items in this category yet.'}
          </p>
        )}
      </section>
    </>
  );
};

export default Menu;
