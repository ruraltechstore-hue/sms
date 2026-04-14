import { motion } from "framer-motion";
import { EXAMS } from "@/lib/mock-exams";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useState } from "react";

const statusStyles: Record<string, string> = {
  ongoing: "bg-success/10 text-success",
  upcoming: "bg-warning/10 text-warning",
  scheduled: "bg-primary/10 text-primary",
  completed: "bg-muted text-muted-foreground",
};

export function ExamSchedule() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {EXAMS.map((exam, i) => (
        <motion.div
          key={exam.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="rounded-2xl border bg-card overflow-hidden"
        >
          <div
            onClick={() => setExpanded(expanded === exam.id ? null : exam.id)}
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-secondary/30 transition-colors"
          >
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{exam.name}</h4>
                <Badge variant="outline" className="capitalize text-[10px]">{exam.type.replace("-", " ")}</Badge>
              </div>
              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{exam.startDate} → {exam.endDate}</span>
                <span>Class {exam.classes}</span>
                <span>{exam.subjects.length} subjects</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[exam.status]}`}>
              {exam.status}
            </span>
          </div>

          {expanded === exam.id && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="border-t">
              <div className="p-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-2 font-medium">Subject</th>
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium">Time</th>
                      <th className="pb-2 font-medium">Duration</th>
                      <th className="pb-2 font-medium">Max Marks</th>
                      {exam.subjects[0]?.room && <th className="pb-2 font-medium">Room</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {exam.subjects.map((sub) => (
                      <tr key={sub.name} className="hover:bg-secondary/30 transition-colors">
                        <td className="py-2.5 font-medium">{sub.name}</td>
                        <td className="py-2.5 text-muted-foreground">{sub.date}</td>
                        <td className="py-2.5 flex items-center gap-1"><Clock className="h-3 w-3 text-muted-foreground" />{sub.time}</td>
                        <td className="py-2.5">{sub.duration}</td>
                        <td className="py-2.5 font-semibold">{sub.maxMarks}</td>
                        {sub.room && <td className="py-2.5 flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" />{sub.room}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
