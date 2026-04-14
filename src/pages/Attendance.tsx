import { motion } from "framer-motion";
import { CalendarDays, CheckCircle, XCircle, Clock } from "lucide-react";
import { StatCard } from "@/components/StatCard";

export default function Attendance() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Attendance</h2>
        <p className="text-muted-foreground">Track and manage daily attendance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Present Today", value: "2,456", icon: CheckCircle, iconColor: "text-success" },
          { title: "Absent Today", value: "142", icon: XCircle, iconColor: "text-destructive" as any },
          { title: "Late Arrivals", value: "38", icon: Clock, iconColor: "text-warning" },
          { title: "Overall Rate", value: "96.4%", change: "+0.8%", changeType: "positive" as const, icon: CalendarDays, iconColor: "text-primary" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Today's Attendance by Class</h3>
        <div className="space-y-3">
          {[
            { class: "Class 10-A", present: 42, absent: 3, total: 45 },
            { class: "Class 10-B", present: 40, absent: 4, total: 44 },
            { class: "Class 9-A", present: 38, absent: 2, total: 40 },
            { class: "Class 9-B", present: 41, absent: 1, total: 42 },
            { class: "Class 8-A", present: 39, absent: 3, total: 42 },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
              <span className="font-medium text-sm">{row.class}</span>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-success">{row.present} Present</span>
                <span className="text-destructive">{row.absent} Absent</span>
                <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-success" style={{ width: `${(row.present / row.total) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
