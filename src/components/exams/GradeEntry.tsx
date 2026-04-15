import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, FileText, Trophy, Medal } from "lucide-react";
import { ReportCard } from "./ReportCard";
import { examService } from "@/lib/services/examService";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import type { StudentGrade } from "@/lib/types";

const gradeColors: Record<string, string> = {
  "A+": "text-success", A: "text-success", "B+": "text-primary", B: "text-primary",
  C: "text-warning", D: "text-warning", F: "text-destructive",
};

export function GradeEntry() {
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<StudentGrade | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await examService.getStudentGrades();
      setGrades(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = grades.filter((s) => {
    const matchSearch = s.studentName.toLowerCase().includes(search.toLowerCase()) || s.studentId.toLowerCase().includes(search.toLowerCase());
    const matchClass = classFilter === "all" || s.class === classFilter;
    return matchSearch && matchClass;
  });

  if (loading) return <div className="rounded-2xl border bg-card p-6"><LoadingState rows={6} /></div>;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search student..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {["5", "6", "7", "8", "9", "10", "11", "12"].map((c) => (
                <SelectItem key={c} value={c}>Class {c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No Grades Found" description={grades.length === 0 ? "Student grades will appear here once connected to the backend." : "No results match your search."} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Rank</th>
                  <th className="pb-3 font-medium">Student</th>
                  <th className="pb-3 font-medium">Class</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Percentage</th>
                  <th className="pb-3 font-medium">Grade</th>
                  <th className="pb-3 font-medium">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((s) => (
                  <tr key={s.studentId} className="hover:bg-secondary/50 transition-colors">
                    <td className="py-3">
                      <span className="flex items-center gap-1">
                        {s.rank <= 3 ? (
                          <span className={s.rank === 1 ? "text-warning" : s.rank === 2 ? "text-muted-foreground" : "text-accent"}>
                            {s.rank === 1 ? <Trophy className="h-4 w-4" /> : <Medal className="h-4 w-4" />}
                          </span>
                        ) : s.rank}
                      </span>
                    </td>
                    <td className="py-3">
                      <div>
                        <p className="font-medium">{s.studentName}</p>
                        <p className="text-xs text-muted-foreground">{s.studentId}</p>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{s.class}-{s.section}</td>
                    <td className="py-3 font-semibold">{s.totalMarks}/{s.maxTotal}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${s.percentage}%` }} />
                        </div>
                        <span className="text-xs font-medium">{s.percentage}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`font-bold ${gradeColors[s.grade] || ""}`}>{s.grade}</span>
                    </td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(s)}>
                        <FileText className="h-4 w-4 mr-1" />View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Report Card</DialogTitle></DialogHeader>
          {selectedStudent && <ReportCard student={selectedStudent} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
