import { motion } from "framer-motion";
import type { ChildProfile } from "@/lib/types";
import { EmptyState } from "@/components/EmptyState";
import { IndianRupee, CheckCircle, AlertTriangle, Clock } from "lucide-react";

const statusConfig: Record<string, { icon: React.ElementType; style: string }> = {
  paid: { icon: CheckCircle, style: "bg-success/10 text-success" },
  partial: { icon: Clock, style: "bg-warning/10 text-warning" },
  overdue: { icon: AlertTriangle, style: "bg-destructive/10 text-destructive" },
  pending: { icon: Clock, style: "bg-muted text-muted-foreground" },
};

interface Props { selectedChild: ChildProfile; }

export function FeeStatus({ selectedChild }: Props) {
  const child = selectedChild;
  const totalDue = child.feeHistory.reduce((a, f) => a + (f.amount - f.paidAmount), 0);
  const totalPaid = child.feeHistory.reduce((a, f) => a + f.paidAmount, 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4 text-center"><IndianRupee className="h-5 w-5 mx-auto text-success mb-1" /><p className="text-xs text-muted-foreground">Total Paid</p><p className="font-bold text-lg text-success">₹{totalPaid.toLocaleString("en-IN")}</p></div>
        <div className="rounded-xl border bg-card p-4 text-center"><AlertTriangle className="h-5 w-5 mx-auto text-warning mb-1" /><p className="text-xs text-muted-foreground">Outstanding</p><p className="font-bold text-lg text-warning">₹{totalDue.toLocaleString("en-IN")}</p></div>
        <div className="rounded-xl border bg-card p-4 text-center"><CheckCircle className="h-5 w-5 mx-auto text-primary mb-1" /><p className="text-xs text-muted-foreground">Fee Status</p><p className={`font-bold text-lg capitalize ${child.feeStatus === "paid" ? "text-success" : "text-warning"}`}>{child.feeStatus}</p></div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Fee History — {child.name}</h3>
        {child.feeHistory.length === 0 ? (
          <EmptyState title="No Fee History" description="Fee records will appear here." />
        ) : (
          <div className="space-y-3">
            {child.feeHistory.map((fee) => {
              const cfg = statusConfig[fee.status];
              const Icon = cfg.icon;
              return (
                <div key={fee.id} className="rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${cfg.style}`}><Icon className="h-4 w-4" /></div>
                    <div><p className="font-medium text-sm">{fee.type}</p><p className="text-xs text-muted-foreground">Due: {fee.dueDate}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">₹{fee.amount.toLocaleString("en-IN")}</p>
                      {fee.paidAmount > 0 && fee.paidAmount < fee.amount && <p className="text-xs text-muted-foreground">Paid: ₹{fee.paidAmount.toLocaleString("en-IN")}</p>}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${cfg.style}`}>{fee.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
