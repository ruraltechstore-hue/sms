import { motion } from "framer-motion";
import type { ChildProfile } from "@/lib/types";
import { EmptyState } from "@/components/EmptyState";
import { CheckCircle, XCircle, Clock, Sun } from "lucide-react";

const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  present: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  absent: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  late: { icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  holiday: { icon: Sun, color: "text-muted-foreground", bg: "bg-muted" },
};

interface Props { selectedChild: ChildProfile; }

export function AttendanceView({ selectedChild }: Props) {
  const child = selectedChild;
  const att = child.recentAttendance;

  if (att.length === 0) return <EmptyState title="No Attendance Data" description="Attendance data will appear here." />;

  const present = att.filter((a) => a.status === "present").length;
  const absent = att.filter((a) => a.status === "absent").length;
  const late = att.filter((a) => a.status === "late").length;
  const holidays = att.filter((a) => a.status === "holiday").length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Present", count: present, ...statusConfig.present },
          { label: "Absent", count: absent, ...statusConfig.absent },
          { label: "Late", count: late, ...statusConfig.late },
          { label: "Holidays", count: holidays, ...statusConfig.holiday },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-4 text-center">
            <s.icon className={`h-5 w-5 mx-auto mb-1 ${s.color}`} /><p className="text-xs text-muted-foreground">{s.label}</p><p className="font-bold text-lg">{s.count}</p>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Recent Attendance — {child.name}</h3>
        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
          {att.map((day, i) => {
            const cfg = statusConfig[day.status];
            const Icon = cfg.icon;
            const dateObj = new Date(day.date);
            return (
              <motion.div key={day.date} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                className={`rounded-lg p-2 text-center ${cfg.bg} cursor-default`} title={`${day.date} — ${day.status}`}>
                <p className="text-[10px] text-muted-foreground">{dateObj.toLocaleDateString("en", { weekday: "short" })}</p>
                <p className="font-semibold text-sm">{dateObj.getDate()}</p>
                <Icon className={`h-3.5 w-3.5 mx-auto mt-0.5 ${cfg.color}`} />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-2">Overall Attendance</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1"><div className="h-3 bg-muted rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${child.attendance}%` }} transition={{ duration: 0.8 }} className="h-full bg-success rounded-full" /></div></div>
          <span className="font-bold text-lg text-success">{child.attendance}%</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Minimum required: 75%</p>
      </motion.div>
    </div>
  );
}
