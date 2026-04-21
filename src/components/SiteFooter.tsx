import { Link } from "react-router-dom";
import { Coffee, Instagram, MapPin, Phone, Clock } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="container py-14 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="grid place-items-center h-9 w-9 rounded-full bg-gradient-accent">
              <Coffee className="h-4 w-4 text-accent-foreground" />
            </span>
            <span className="font-serif text-xl font-semibold">Ca Phe Bistro</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            A premium café in the Financial District of Hyderabad. Slow-crafted coffee, continental plates, all-day comfort.
          </p>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-3">Visit</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-accent" /> Financial District, Hyderabad</li>
            <li className="flex items-start gap-2"><Clock className="h-4 w-4 mt-0.5 text-accent" /> 9:00 AM – 10:30 PM, daily</li>
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-accent" /> <a href="tel:+919966983249" className="hover:text-accent">+91 99669 83249</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/menu" className="text-muted-foreground hover:text-accent">Menu</Link></li>
            <li><Link to="/about" className="text-muted-foreground hover:text-accent">About</Link></li>
            <li><Link to="/gallery" className="text-muted-foreground hover:text-accent">Gallery</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-accent">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-3">Order & follow</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="https://www.zomato.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent">Zomato</a></li>
            <li><a href="https://www.swiggy.com/dineout" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-accent">Swiggy Dineout</a></li>
            <li>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent">
                <Instagram className="h-4 w-4" /> Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Ca Phe Bistro. Brewed with care.</p>
          <Link to="/auth" className="hover:text-accent">Staff login</Link>
        </div>
      </div>
    </footer>
  );
}
