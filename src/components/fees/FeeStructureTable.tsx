import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { FEE_STRUCTURES } from "@/lib/mock-fees";

const categoryColors: Record<string, string> = {
  tuition: "bg-primary/10 text-primary",
  transport: "bg-accent/10 text-accent",
  lab: "bg-warning/10 text-warning",
  library: "bg-success/10 text-success",
  sports: "bg-destructive/10 text-destructive",
  exam: "bg-secondary text-secondary-foreground",
  misc: "bg-muted text-muted-foreground",
};

export function FeeStructureTable() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6">
      <h3 className="font-heading font-semibold mb-4">Fee Structures</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="pb-3 font-medium">Fee Name</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Applicable</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Frequency</th>
              <th className="pb-3 font-medium">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {FEE_STRUCTURES.map((fee) => (
              <tr key={fee.id} className="hover:bg-secondary/50 transition-colors">
                <td className="py-3 font-medium">{fee.name}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${categoryColors[fee.category]}`}>
                    {fee.category}
                  </span>
                </td>
                <td className="py-3 text-muted-foreground">Class {fee.class}</td>
                <td className="py-3 font-semibold">₹{fee.amount.toLocaleString("en-IN")}</td>
                <td className="py-3">
                  <Badge variant="outline" className="capitalize">{fee.frequency}</Badge>
                </td>
                <td className="py-3 text-muted-foreground">{fee.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
