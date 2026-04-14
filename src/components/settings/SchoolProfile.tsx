import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Building2, MapPin, Phone, Mail, Globe, Save } from "lucide-react";

export function SchoolProfile() {
  const [form, setForm] = useState({
    name: "Vidyalaya School",
    tagline: "Nurturing Excellence, Building Futures",
    email: "info@vidyalaya.edu.in",
    phone: "+91 98765 43210",
    website: "www.vidyalaya.edu.in",
    address: "123 Education Lane, Knowledge City",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    board: "CBSE",
    establishedYear: "1995",
    principalName: "Dr. Ramesh Gupta",
    motto: "Knowledge is Power",
  });

  const update = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold">School Information</h3>
            <p className="text-xs text-muted-foreground">Basic details about your institution</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label>School Name</Label>
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Tagline</Label>
            <Input value={form.tagline} onChange={(e) => update("tagline", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Principal Name</Label>
            <Input value={form.principalName} onChange={(e) => update("principalName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Board / Affiliation</Label>
            <Select value={form.board} onValueChange={(v) => update("board", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="CBSE">CBSE</SelectItem>
                <SelectItem value="ICSE">ICSE</SelectItem>
                <SelectItem value="State Board">State Board</SelectItem>
                <SelectItem value="IB">IB</SelectItem>
                <SelectItem value="IGCSE">IGCSE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Established Year</Label>
            <Input value={form.establishedYear} onChange={(e) => update("establishedYear", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>School Motto</Label>
            <Input value={form.motto} onChange={(e) => update("motto", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
            <MapPin className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h3 className="font-heading font-semibold">Contact & Address</h3>
            <p className="text-xs text-muted-foreground">How parents and visitors can reach you</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Mail className="h-3 w-3" />Email</Label>
            <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Phone className="h-3 w-3" />Phone</Label>
            <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Globe className="h-3 w-3" />Website</Label>
            <Input value={form.website} onChange={(e) => update("website", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Pincode</Label>
            <Input value={form.pincode} onChange={(e) => update("pincode", e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Address</Label>
            <Textarea value={form.address} onChange={(e) => update("address", e.target.value)} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input value={form.city} onChange={(e) => update("city", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Input value={form.state} onChange={(e) => update("state", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => toast.success("School profile updated successfully!")} className="gap-2">
          <Save className="h-4 w-4" />Save Changes
        </Button>
      </div>
    </motion.div>
  );
}
