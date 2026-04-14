import { motion } from "framer-motion";
import { Users, UserCog, CalendarDays, CreditCard } from "lucide-react";
import { StatCard } from "@/components/StatCard";

export default function Staff() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Staff & HR</h2>
        <p className="text-muted-foreground">Manage staff profiles, payroll, and attendance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Staff", value: "186", change: "+3", changeType: "positive" as const, icon: Users, iconColor: "text-primary" },
          { title: "Teaching Staff", value: "124", icon: UserCog, iconColor: "text-accent" },
          { title: "On Leave Today", value: "8", icon: CalendarDays, iconColor: "text-warning" },
          { title: "Payroll Processed", value: "₹18.5L", icon: CreditCard, iconColor: "text-success" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Staff Directory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Department</th>
                <th className="pb-3 font-medium">Designation</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { name: "Amit Patel", dept: "Mathematics", designation: "Senior Teacher", status: "Active" },
                { name: "Meena Kumari", dept: "Science", designation: "HOD", status: "Active" },
                { name: "Rajiv Menon", dept: "English", designation: "Teacher", status: "On Leave" },
                { name: "Sonia Das", dept: "Administration", designation: "Coordinator", status: "Active" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-secondary/50 transition-colors">
                  <td className="py-3 font-medium">{row.name}</td>
                  <td className="py-3 text-muted-foreground">{row.dept}</td>
                  <td className="py-3 text-muted-foreground">{row.designation}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === "Active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                    }`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
