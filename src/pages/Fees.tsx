import { motion } from "framer-motion";
import { CreditCard, IndianRupee, AlertTriangle, CheckCircle } from "lucide-react";
import { StatCard } from "@/components/StatCard";

export default function Fees() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Fee Management</h2>
        <p className="text-muted-foreground">Track payments, dues, and financial reports</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Collected", value: "₹24.5L", change: "+8%", changeType: "positive" as const, icon: IndianRupee, iconColor: "text-success" },
          { title: "Pending Dues", value: "₹3.2L", icon: AlertTriangle, iconColor: "text-warning" },
          { title: "This Month", value: "₹4.8L", change: "+12%", changeType: "positive" as const, icon: CreditCard, iconColor: "text-primary" },
          { title: "Paid Students", value: "2,412", icon: CheckCircle, iconColor: "text-accent" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { name: "Arjun Singh", amount: "₹15,000", date: "Jan 15, 2025", status: "Paid" },
                { name: "Priya Verma", amount: "₹12,500", date: "Jan 14, 2025", status: "Paid" },
                { name: "Rahul Sharma", amount: "₹18,000", date: "Jan 13, 2025", status: "Overdue" },
                { name: "Ananya Gupta", amount: "₹15,000", date: "Jan 12, 2025", status: "Paid" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-secondary/50 transition-colors">
                  <td className="py-3 font-medium">{row.name}</td>
                  <td className="py-3">{row.amount}</td>
                  <td className="py-3 text-muted-foreground">{row.date}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === "Paid" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
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
