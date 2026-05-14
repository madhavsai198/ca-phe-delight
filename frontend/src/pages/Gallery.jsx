import { motion } from "framer-motion";
import { Seo } from "@/components/Seo";
import ambienceImg from "@/assets/ambience.jpg";
import dessertImg from "@/assets/dessert.jpg";
import heroImg from "@/assets/hero-coffee.jpg";

const photos = [
  { src: heroImg, alt: "Latte art on marble", className: "md:col-span-2 md:row-span-2 h-[420px] md:h-auto" },
  { src: ambienceImg, alt: "Café interior at golden hour", className: "h-[260px]" },
  { src: dessertImg, alt: "Tiramisu and espresso", className: "h-[260px]" },
  { src: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200&q=80", alt: "Wooden coffee bar", className: "h-[260px]" },
  { src: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=1200&q=80", alt: "Pour over coffee", className: "h-[260px]" },
  { src: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=1200&q=80&sat=-20", alt: "Bookshelf nook", className: "h-[260px]" },
  { src: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1200&q=80", alt: "Continental brunch plate", className: "h-[260px]" },
  { src: "https://images.unsplash.com/photo-1525193612562-0ec53b0e5d7c?w=1200&q=80", alt: "Pizza on wooden board", className: "h-[260px]" },
  { src: "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=1200&q=80", alt: "Cold brew with citrus", className: "h-[260px]" },
];

const Gallery = () => (
  <>
    <Seo
      title="Gallery — Ca Phe Bistro | Ambience & Food"
      description="Inside Ca Phe Bistro: warm interiors, signature plates and slow-crafted drinks photographed in the Financial District, Hyderabad."
    />

    <section className="container py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-sm uppercase tracking-[0.25em] text-accent mb-3">Gallery</p>
        <h1 className="font-serif text-5xl md:text-6xl leading-tight">
          A look <span className="italic text-gradient">inside.</span>
        </h1>
        <p className="mt-4 text-muted-foreground text-lg">
          Moments from our space, our plates and the people who make Ca Phe Bistro tick.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:auto-rows-[260px]">
        {photos.map((p, i) => (
          <motion.figure
            key={i}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
            className={`relative overflow-hidden rounded-2xl shadow-soft group ${p.className ?? ""}`}
          >
            <img
              src={p.src}
              alt={p.alt}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.figure>
        ))}
      </div>
    </section>
  </>
);

export default Gallery;
