import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IndianRupee, AlertTriangle, CheckCircle, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/StatCard";
import { FeeStructureTable } from "@/components/fees/FeeStructureTable";
import { PaymentTracker } from "@/components/fees/PaymentTracker";
import { FeeAnalytics } from "@/components/fees/FeeAnalytics";
import { LoadingState } from "@/components/LoadingState";
import { useIsReadOnly } from "@/lib/auth-context";

export default function Fees() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCollected: "₹0", pendingDues: "₹0", thisMonth: "₹0", paidStudents: "0" });
  const readOnly = useIsReadOnly();

  useEffect(() => {
    // TODO: fetch fee stats from API
    setLoading(false);
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Fee Management</h2>
        <p className="text-muted-foreground">Track payments, dues, and financial reports</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Collected", value: stats.totalCollected, icon: IndianRupee, iconColor: "text-success" },
          { title: "Pending Dues", value: stats.pendingDues, icon: AlertTriangle, iconColor: "text-warning" },
          { title: "This Month", value: stats.thisMonth, icon: CreditCard, iconColor: "text-primary" },
          { title: "Paid Students", value: stats.paidStudents, icon: CheckCircle, iconColor: "text-accent" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Payment Tracker</TabsTrigger>
          <TabsTrigger value="structures">Fee Structures</TabsTrigger>
          <TabsTrigger value="analytics">Analytics & Dues</TabsTrigger>
        </TabsList>

        <TabsContent value="payments"><PaymentTracker /></TabsContent>
        <TabsContent value="structures"><FeeStructureTable /></TabsContent>
        <TabsContent value="analytics"><FeeAnalytics /></TabsContent>
      </Tabs>
    </div>
  );
}
