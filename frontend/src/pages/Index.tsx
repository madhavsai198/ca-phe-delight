import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Coffee, Clock, MapPin, Star, Utensils, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import heroImg from "@/assets/hero-coffee.jpg";
import ambienceImg from "@/assets/ambience.jpg";
import dessertImg from "@/assets/dessert.jpg";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const Index = () => {
  return (
    <>
      <Seo
        title="Ca Phe Bistro — Premium Café in Financial District, Hyderabad"
        description="Slow-crafted coffee, continental plates and a warm modern ambience. Open 9 AM – 10:30 PM in Financial District, Hyderabad."
      />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Latte art served at Ca Phe Bistro"
            className="h-full w-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>

        <div className="relative container min-h-[88vh] flex items-center py-24">
          <div className="max-w-2xl text-white">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] mb-6 border-white/20 text-white/90"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Financial District · Hyderabad
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl leading-[1.05] font-medium"
            >
              Slow-crafted coffee.
              <br />
              <span className="italic text-accent">Quietly perfect</span> moments.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mt-6 text-lg md:text-xl text-white/85 max-w-xl"
            >
              Single-origin espresso, continental comfort food and a softly lit
              corner of the city built for unhurried afternoons.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Button asChild size="lg" className="rounded-full bg-gradient-accent text-white hover:opacity-95 shadow-glow">
                <Link to="/menu">
                  Explore the menu <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur">
                <Link to="/contact">Reserve a table</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mt-12 flex flex-wrap gap-6 text-sm text-white/80"
            >
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-accent" /> 9:00 AM – 10:30 PM</span>
              <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 text-accent" /> ₹900 for two</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-accent" /> Financial District</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* QUICK FEATURES */}
      <section className="container py-20 md:py-28">
        <motion.div {...fadeUp} className="grid md:grid-cols-3 gap-5">
          {[
            { icon: Coffee, title: "Single-origin coffee", desc: "Beans sourced from small estates and roasted weekly for peak character." },
            { icon: Utensils, title: "Continental kitchen", desc: "Wood-fired pizzas, truffle pastas and an all-day breakfast plate." },
            { icon: Sparkles, title: "Quiet, warm space", desc: "Marble counters, soft lighting and seats designed to linger in." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass rounded-2xl p-7 hover:-translate-y-1 transition-transform duration-500 shadow-soft"
            >
              <div className="h-11 w-11 rounded-xl grid place-items-center bg-gradient-accent text-accent-foreground mb-4">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SIGNATURE STORY */}
      <section className="container py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div {...fadeUp} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-elegant">
              <img src={ambienceImg} alt="Café interior" className="w-full h-[480px] object-cover" loading="lazy" width={1600} height={1080} />
            </div>
            <div className="hidden md:block absolute -bottom-8 -right-8 w-48 h-48 rounded-3xl overflow-hidden shadow-elegant border-4 border-background">
              <img src={dessertImg} alt="Tiramisu dessert" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </motion.div>

          <motion.div {...fadeUp}>
            <p className="text-sm uppercase tracking-[0.25em] text-accent mb-3">Our story</p>
            <h2 className="font-serif text-4xl md:text-5xl mb-5 leading-tight">
              A bistro built around the <span className="italic text-gradient">ritual of coffee.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              Ca Phe Bistro began with a simple idea — that a great cup of coffee
              should be an event. We pair it with continental plates, gentle music
              and a room where time moves a little slower.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Whether you're catching up over croissants or working through a long
              afternoon, you'll find a corner that feels like yours.
            </p>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/about">More about us <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="container py-16 md:py-24">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl bg-gradient-accent p-10 md:p-16 text-white shadow-elegant"
        >
          <div className="relative z-10 grid md:grid-cols-[1fr_auto] items-end gap-8">
            <div>
              <h3 className="font-serif text-3xl md:text-5xl leading-tight">
                Drop in for a slow afternoon coffee.
              </h3>
              <p className="mt-3 max-w-xl opacity-90">
                We're a quick walk from the heart of Financial District. No reservation needed — just bring an empty cup.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary" className="rounded-full">
                <Link to="/contact">Get directions</Link>
              </Button>
              <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <a href="tel:+919966983249">Call us</a>
              </Button>
            </div>
          </div>
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" aria-hidden />
        </motion.div>
      </section>
    </>
  );
};

export default Index;
