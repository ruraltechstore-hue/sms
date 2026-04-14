import { motion } from "framer-motion";
import { Users, CalendarDays, CreditCard, Bell } from "lucide-react";
import { StatCard } from "@/components/StatCard";

export default function ParentPortal() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Parent Portal</h2>
        <p className="text-muted-foreground">View your children's academic progress and updates</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Children", value: "2", icon: Users, iconColor: "text-primary" },
          { title: "Avg Attendance", value: "92%", change: "+1.5%", changeType: "positive" as const, icon: CalendarDays, iconColor: "text-success" },
          { title: "Pending Fees", value: "₹25,000", icon: CreditCard, iconColor: "text-warning" },
          { title: "Notifications", value: "5", icon: Bell, iconColor: "text-accent" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Children Overview</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { name: "Arjun Singh", class: "Class 10-A", attendance: "94%", grade: "A+" },
            { name: "Kavya Singh", class: "Class 7-B", attendance: "90%", grade: "A" },
          ].map((child, i) => (
            <div key={i} className="p-4 rounded-xl border bg-secondary/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {child.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm">{child.name}</p>
                  <p className="text-xs text-muted-foreground">{child.class}</p>
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Attendance</p>
                  <p className="font-medium text-success">{child.attendance}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Grade</p>
                  <p className="font-medium">{child.grade}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Recent Notices</h3>
        <div className="space-y-3">
          {[
            { title: "PTM Scheduled - January 20", date: "Jan 15" },
            { title: "Annual Day Celebration - February 5", date: "Jan 14" },
            { title: "Winter Uniform Guidelines", date: "Jan 10" },
          ].map((notice, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
              <p className="text-sm font-medium">{notice.title}</p>
              <span className="text-xs text-muted-foreground">{notice.date}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
