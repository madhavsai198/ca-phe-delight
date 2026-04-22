import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Phone, MapPin, Clock, Mail, Loader2, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/api";
import { Seo } from "@/components/Seo";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().min(5, "Message is too short").max(2000),
});

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/messages", {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        message: parsed.data.message,
      });
      toast.success("Thanks! We'll get back to you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Couldn't send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="Contact Ca Phe Bistro — Visit, Call or Message Us"
        description="Find Ca Phe Bistro in Financial District, Hyderabad. Open 9 AM – 10:30 PM. Call +91 99669 83249 or send us a message."
      />

      <section className="container py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm uppercase tracking-[0.25em] text-accent mb-3">Contact</p>
          <h1 className="font-serif text-5xl md:text-6xl leading-tight">
            Come say <span className="italic text-gradient">hello.</span>
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Reservations, events, or just a question — we'd love to hear from you.
          </p>
        </div>

        <div className="mt-14 grid lg:grid-cols-[1fr_1.2fr] gap-8">
          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-8 md:p-10 shadow-soft space-y-6 self-start"
          >
            <div>
              <h2 className="font-serif text-3xl mb-1">Visit the bistro</h2>
              <p className="text-muted-foreground">A short walk inside Financial District.</p>
            </div>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="h-9 w-9 rounded-xl bg-gradient-accent text-accent-foreground grid place-items-center shrink-0">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium">Financial District</p>
                  <p className="text-muted-foreground">Nanakramguda, Hyderabad, Telangana</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-9 w-9 rounded-xl bg-gradient-accent text-accent-foreground grid place-items-center shrink-0">
                  <Clock className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium">Open daily</p>
                  <p className="text-muted-foreground">9:00 AM – 10:30 PM · ₹900 for two</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-9 w-9 rounded-xl bg-gradient-accent text-accent-foreground grid place-items-center shrink-0">
                  <Phone className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium">Call us</p>
                  <a href="tel:+919966983249" className="text-muted-foreground hover:text-accent">+91 99669 83249</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-9 w-9 rounded-xl bg-gradient-accent text-accent-foreground grid place-items-center shrink-0">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-medium">Order online</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground text-sm">
                    <a href="https://www.zomato.com/hyderabad/ca-phe-bistro-nanakramguda" target="_blank" rel="noopener noreferrer" className="hover:text-accent">Zomato</a>
                    <span>·</span>
                    <a href="https://www.swiggy.com/dineout" target="_blank" rel="noopener noreferrer" className="hover:text-accent">Swiggy Dineout</a>
                    <span>·</span>
                    <a href="https://www.instagram.com/caphe_bistro/" target="_blank" rel="noopener noreferrer" className="hover:text-accent inline-flex items-center gap-1"><Instagram className="h-3.5 w-3.5" />Instagram</a>
                  </div>
                </div>
              </li>
            </ul>

            <div className="rounded-2xl overflow-hidden border border-border shadow-soft">
              <iframe
                title="Ca Phe Bistro location"
                src="https://www.google.com/maps?q=Financial+District+Hyderabad&output=embed"
                className="w-full h-64 border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={onSubmit}
            className="rounded-3xl bg-card border border-border shadow-elegant p-8 md:p-10 space-y-5"
          >
            <h2 className="font-serif text-3xl">Send a message</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91" />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" />
              {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
            </div>
            <Button
              type="submit"
              disabled={submitting}
              size="lg"
              className="rounded-full w-full sm:w-auto bg-gradient-accent text-accent-foreground hover:opacity-95 shadow-soft"
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send message
            </Button>
          </motion.form>
        </div>
      </section>
    </>
  );
};

export default Contact;
