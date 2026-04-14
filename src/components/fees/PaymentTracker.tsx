import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FEE_PAYMENTS, FeePayment } from "@/lib/mock-fees";
import { FeeReceipt } from "./FeeReceipt";

const statusStyles: Record<string, string> = {
  paid: "bg-success/10 text-success",
  partial: "bg-warning/10 text-warning",
  overdue: "bg-destructive/10 text-destructive",
  pending: "bg-muted text-muted-foreground",
};

export function PaymentTracker() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<FeePayment | null>(null);

  const filtered = FEE_PAYMENTS.filter((p) => {
    const matchesSearch = p.studentName.toLowerCase().includes(search.toLowerCase()) || p.receiptNo?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by student or receipt..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Class</th>
                <th className="pb-3 font-medium">Fee Type</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Paid</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="py-3 font-medium">{p.studentName}</td>
                  <td className="py-3 text-muted-foreground">{p.class}-{p.section}</td>
                  <td className="py-3">{p.feeType}</td>
                  <td className="py-3">₹{p.amount.toLocaleString("en-IN")}</td>
                  <td className="py-3 font-semibold">₹{p.paidAmount.toLocaleString("en-IN")}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="py-3 text-muted-foreground">{p.paidDate || "—"}</td>
                  <td className="py-3">
                    {p.status === "paid" || p.status === "partial" ? (
                      <Button variant="ghost" size="sm" onClick={() => setSelectedPayment(p)}>
                        <Eye className="h-4 w-4 mr-1" /> Receipt
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-xs">Unpaid</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No payments found.</p>}
      </motion.div>

      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Payment Receipt</DialogTitle></DialogHeader>
          {selectedPayment && <FeeReceipt payment={selectedPayment} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
