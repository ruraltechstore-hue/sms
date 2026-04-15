import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, UserCog, CalendarDays, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/StatCard";
import { StaffDirectory } from "@/components/staff/StaffDirectory";
import { DepartmentGrid } from "@/components/staff/DepartmentGrid";
import { LeaveTracker } from "@/components/staff/LeaveTracker";
import { LoadingState } from "@/components/LoadingState";

export default function Staff() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(false); }, []);
  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Staff & HR</h2>
        <p className="text-muted-foreground">Manage staff profiles, departments, and leave tracking</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Staff", value: "0", icon: Users, iconColor: "text-primary" },
          { title: "Teaching Staff", value: "0", icon: UserCog, iconColor: "text-accent" },
          { title: "On Leave Today", value: "0", icon: CalendarDays, iconColor: "text-warning" },
          { title: "Payroll Processed", value: "₹0", icon: CreditCard, iconColor: "text-success" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>
      <Tabs defaultValue="directory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="directory">Staff Directory</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="leaves">Leave Tracker</TabsTrigger>
        </TabsList>
        <TabsContent value="directory"><StaffDirectory /></TabsContent>
        <TabsContent value="departments"><DepartmentGrid /></TabsContent>
        <TabsContent value="leaves"><LeaveTracker /></TabsContent>
      </Tabs>
    </div>
  );
}
