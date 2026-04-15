import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { staffService } from "@/lib/services/staffService";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { Users, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Department } from "@/lib/types";

export function DepartmentGrid() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => { const d = await staffService.getDepartments(); setDepartments(d); setLoading(false); };
    fetchData();
  }, []);

  if (loading) return <LoadingState rows={4} />;
  if (departments.length === 0) return <EmptyState title="No Departments" description="Department data will appear here." />;

  const academic = departments.filter((d) => d.type === "academic");
  const admin = departments.filter((d) => d.type === "administrative");

  return (
    <div className="space-y-6">
      <Section title="Academic Departments" departments={academic} />
      <Section title="Administrative Departments" departments={admin} />
    </div>
  );
}

function Section({ title, departments }: { title: string; departments: Department[] }) {
  if (departments.length === 0) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h3 className="font-heading font-semibold mb-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {departments.map((dept, i) => (
          <motion.div key={dept.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border bg-card p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Building2 className="h-5 w-5 text-primary" /></div>
              <div><h4 className="font-semibold text-sm">{dept.name}</h4><Badge variant="outline" className="text-[10px] capitalize">{dept.type}</Badge></div>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">HOD</span><span className="font-medium text-xs">{dept.hod}</span></div>
              <div className="flex justify-between items-center"><span className="text-muted-foreground">Staff</span><span className="flex items-center gap-1 font-semibold"><Users className="h-3 w-3" />{dept.staffCount}</span></div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
