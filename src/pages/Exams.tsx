import { motion } from "framer-motion";
import { ClipboardCheck, FileText, Award, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";

export default function Exams() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Examinations</h2>
        <p className="text-muted-foreground">Manage exams, marks entry, and results</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Upcoming Exams", value: "3", icon: ClipboardCheck, iconColor: "text-primary" },
          { title: "Results Published", value: "12", icon: FileText, iconColor: "text-success" },
          { title: "Toppers", value: "45", icon: Award, iconColor: "text-warning" },
          { title: "Avg Score", value: "78.5%", change: "+2.3%", changeType: "positive" as const, icon: TrendingUp, iconColor: "text-accent" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Exam Schedule</h3>
        <div className="space-y-3">
          {[
            { name: "Mid-Term Examination", classes: "Class 6-12", start: "Feb 10", end: "Feb 20", status: "Upcoming" },
            { name: "Unit Test 3", classes: "Class 6-10", start: "Jan 25", end: "Jan 28", status: "Ongoing" },
            { name: "Pre-Board Examination", classes: "Class 10, 12", start: "Mar 1", end: "Mar 15", status: "Scheduled" },
          ].map((exam, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
              <div>
                <p className="font-medium text-sm">{exam.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{exam.classes} • {exam.start} - {exam.end}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                exam.status === "Ongoing" ? "bg-success/10 text-success" :
                exam.status === "Upcoming" ? "bg-warning/10 text-warning" :
                "bg-primary/10 text-primary"
              }`}>{exam.status}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
