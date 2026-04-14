import { motion } from "framer-motion";
import { IndianRupee, AlertTriangle, CheckCircle, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/StatCard";
import { FeeStructureTable } from "@/components/fees/FeeStructureTable";
import { PaymentTracker } from "@/components/fees/PaymentTracker";
import { FeeAnalytics } from "@/components/fees/FeeAnalytics";

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
