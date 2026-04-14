import { useState } from "react";
import { motion } from "framer-motion";
import { Users, CalendarDays, CreditCard, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/StatCard";
import { CHILDREN } from "@/lib/mock-parent";
import { ChildProgress } from "@/components/parent/ChildProgress";
import { FeeStatus } from "@/components/parent/FeeStatus";
import { AttendanceView } from "@/components/parent/AttendanceView";
import { Communication } from "@/components/parent/Communication";

export default function ParentPortal() {
  const [selectedChildId, setSelectedChildId] = useState(CHILDREN[0].id);
  const selectedChild = CHILDREN.find((c) => c.id === selectedChildId) || CHILDREN[0];
  const totalPending = CHILDREN.reduce((a, c) => a + c.pendingFees, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-bold">Parent Portal</h2>
          <p className="text-muted-foreground">View your children's academic progress and updates</p>
        </div>
        <Select value={selectedChildId} onValueChange={setSelectedChildId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CHILDREN.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name} (Class {c.class}-{c.section})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Children", value: String(CHILDREN.length), icon: Users, iconColor: "text-primary" },
          { title: "Attendance", value: `${selectedChild.attendance}%`, change: "+1.5%", changeType: "positive" as const, icon: CalendarDays, iconColor: "text-success" },
          { title: "Pending Fees", value: totalPending > 0 ? `₹${totalPending.toLocaleString("en-IN")}` : "None", icon: CreditCard, iconColor: "text-warning" },
          { title: "Unread Messages", value: "2", icon: Bell, iconColor: "text-accent" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="progress">Academic Progress</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="fees">Fee Status</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="progress"><ChildProgress selectedChild={selectedChild} /></TabsContent>
        <TabsContent value="attendance"><AttendanceView selectedChild={selectedChild} /></TabsContent>
        <TabsContent value="fees"><FeeStatus selectedChild={selectedChild} /></TabsContent>
        <TabsContent value="messages"><Communication /></TabsContent>
      </Tabs>
    </div>
  );
}
