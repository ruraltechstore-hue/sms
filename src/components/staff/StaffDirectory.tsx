import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { staffService } from "@/lib/services/staffService";
import { StaffProfile } from "./StaffProfile";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import type { StaffMember, Department } from "@/lib/types";

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success",
  "on-leave": "bg-warning/10 text-warning",
  resigned: "bg-destructive/10 text-destructive",
};

export function StaffDirectory() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [s, d] = await Promise.all([staffService.getAll(), staffService.getDepartments()]);
      setStaff(s); setDepartments(d); setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = staff.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "all" || s.department === deptFilter;
    const matchesType = typeFilter === "all" || s.type === typeFilter;
    return matchesSearch && matchesDept && matchesType;
  });

  if (loading) return <div className="rounded-2xl border bg-card p-6"><LoadingState rows={6} /></div>;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="teaching">Teaching</SelectItem>
              <SelectItem value="non-teaching">Non-Teaching</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No Staff Found" description={staff.length === 0 ? "Staff data will appear here once connected to the backend." : "No staff match your filters."} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedStaff(s)} className="rounded-xl border bg-card p-4 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                    {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold truncate">{s.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize whitespace-nowrap ${statusStyles[s.status]}`}>{s.status.replace("-", " ")}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.designation}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.department}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{s.email}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
      <Dialog open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Staff Profile</DialogTitle></DialogHeader>
          {selectedStaff && <StaffProfile staff={selectedStaff} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
