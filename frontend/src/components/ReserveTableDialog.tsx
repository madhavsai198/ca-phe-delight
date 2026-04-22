import { useState } from "react";
import { Loader2, CalendarClock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/api";
import { toast } from "sonner";

export function ReserveTableDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    specialRequests: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.date || !formData.time) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    const messageContent = `RESERVATION REQUEST
Date: ${formData.date}
Time: ${formData.time}
Guests: ${formData.guests}
Special Requests: ${formData.specialRequests || 'None'}`;

    try {
      await api.post("/messages", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        message: messageContent,
      });

      toast.success("Reservation request sent! We will contact you shortly to confirm.");
      setOpen(false);
      setFormData({ name: "", email: "", phone: "", date: "", time: "", guests: "2", specialRequests: "" });
    } catch (error) {
      toast.error("Failed to send reservation request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="hidden md:inline-flex rounded-full shadow-soft border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors">
          <CalendarClock className="w-4 h-4 mr-2" />
          Reserve Table
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-strong">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Reserve a Table</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="guests">Guests</Label>
              <Input id="guests" name="guests" type="number" min="1" max="20" required value={formData.guests} onChange={handleChange} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date *</Label>
              <Input id="date" name="date" type="date" required value={formData.date} onChange={handleChange} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="time">Time *</Label>
              <Input id="time" name="time" type="time" required value={formData.time} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+91..." />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea id="specialRequests" name="specialRequests" value={formData.specialRequests} onChange={handleChange} placeholder="Allergies, seating preference, etc." rows={2} />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gradient-accent text-accent-foreground rounded-full hover:opacity-90 shadow-soft transition-opacity mt-4">
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Request Reservation
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
