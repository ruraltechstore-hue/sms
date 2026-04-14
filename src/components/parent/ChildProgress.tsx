import { useState } from "react";
import { motion } from "framer-motion";
import { CHILDREN, ChildProfile } from "@/lib/mock-parent";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, TrendingUp, GraduationCap } from "lucide-react";

const gradeColors: Record<string, string> = {
  "A+": "text-success", A: "text-success", "B+": "text-primary", B: "text-primary",
  C: "text-warning", D: "text-warning", F: "text-destructive",
};

interface Props { selectedChild: ChildProfile; }

export function ChildProgress({ selectedChild }: Props) {
  const child = selectedChild;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
            {child.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg">{child.name}</h3>
            <p className="text-sm text-muted-foreground">Class {child.class}-{child.section} • Roll #{child.rollNumber}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-secondary/50 p-3 text-center">
            <GraduationCap className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-xs text-muted-foreground">CGPA</p>
            <p className="font-bold text-lg">{child.cgpa}</p>
          </div>
          <div className="rounded-xl bg-secondary/50 p-3 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-success mb-1" />
            <p className="text-xs text-muted-foreground">Attendance</p>
            <p className="font-bold text-lg">{child.attendance}%</p>
          </div>
          <div className="rounded-xl bg-secondary/50 p-3 text-center">
            <BookOpen className="h-5 w-5 mx-auto text-accent mb-1" />
            <p className="text-xs text-muted-foreground">Grade</p>
            <p className={`font-bold text-lg ${gradeColors[child.grade]}`}>{child.grade}</p>
          </div>
        </div>
      </motion.div>

      {/* Subject-wise Performance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Subject-wise Performance</h3>
        <div className="space-y-4">
          {child.subjects.map((sub) => {
            const pct = Math.round((sub.marks / sub.maxMarks) * 100);
            return (
              <div key={sub.name}>
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="font-medium text-sm">{sub.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">({sub.teacher})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{sub.marks}/{sub.maxMarks}</span>
                    <span className={`text-xs font-bold ${gradeColors[sub.grade]}`}>{sub.grade}</span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`h-full rounded-full ${pct >= 80 ? "bg-success" : pct >= 60 ? "bg-primary" : "bg-warning"}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
