import { motion } from "framer-motion";
import { Coffee, Heart, Leaf, Award } from "lucide-react";
import { Seo } from "@/components/Seo";
import ambienceImg from "@/assets/ambience.jpg";

const values = [
  { icon: Coffee, title: "Craft first", desc: "Every drink is dialed in fresh, every plate built to order." },
  { icon: Heart, title: "Warm hospitality", desc: "We notice the regulars and welcome the first-timers." },
  { icon: Leaf, title: "Thoughtful sourcing", desc: "Single-origin coffee and seasonal produce, where possible." },
  { icon: Award, title: "Quietly premium", desc: "Considered design without the pretense — comfort always wins." },
];

const About = () => (
  <>
    <Seo
      title="About — Ca Phe Bistro | Our Story & Craft"
      description="Learn about Ca Phe Bistro: a craft café in Financial District, Hyderabad serving single-origin coffee and continental plates in a quietly premium space."
    />

    <section className="container py-16 md:py-24">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.25em] text-accent mb-3">About us</p>
        <h1 className="font-serif text-5xl md:text-6xl leading-tight">
          A bistro built on the small things <span className="italic text-gradient">done well.</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          Ca Phe Bistro sits in the Financial District of Hyderabad — a calm corner
          designed for slow mornings, working afternoons and unhurried evenings.
          We pair single-origin coffee with continental food, in a space that feels
          warm the moment you step in.
        </p>
      </div>
    </section>

    <section className="container pb-16 md:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="rounded-3xl overflow-hidden shadow-elegant"
      >
        <img src={ambienceImg} alt="Inside Ca Phe Bistro" loading="lazy" className="w-full h-[420px] md:h-[560px] object-cover" />
      </motion.div>
    </section>

    <section className="container pb-24">
      <div className="grid md:grid-cols-2 gap-4">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass rounded-2xl p-7 flex gap-5 items-start hover:-translate-y-1 transition-transform duration-500"
          >
            <div className="shrink-0 h-12 w-12 rounded-xl bg-gradient-accent text-accent-foreground grid place-items-center">
              <v.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-2xl mb-1">{v.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  </>
);

export default About;
