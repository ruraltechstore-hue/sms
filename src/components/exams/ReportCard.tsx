import type { StudentGrade } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Award } from "lucide-react";

interface ReportCardProps {
  student: StudentGrade;
}

const gradeColors: Record<string, string> = {
  "A+": "text-success", A: "text-success", "B+": "text-primary", B: "text-primary",
  C: "text-warning", D: "text-warning", F: "text-destructive",
};

export function ReportCard({ student }: ReportCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 space-y-4 text-sm">
      <div className="text-center space-y-1">
        <h3 className="font-heading font-bold text-lg">School ERP</h3>
        <p className="text-muted-foreground text-xs">Examination Report Card</p>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{student.studentName}</span></div>
        <div><span className="text-muted-foreground">ID:</span> <span className="font-medium">{student.studentId}</span></div>
        <div><span className="text-muted-foreground">Class:</span> <span className="font-medium">{student.class}-{student.section}</span></div>
        <div><span className="text-muted-foreground">Roll No:</span> <span className="font-medium">{student.rollNumber}</span></div>
      </div>

      <Separator />

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="pb-2 font-medium">Subject</th>
            <th className="pb-2 font-medium text-center">Max</th>
            <th className="pb-2 font-medium text-center">Obtained</th>
            <th className="pb-2 font-medium text-center">Grade</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {student.subjects.map((sub) => (
            <tr key={sub.subject}>
              <td className="py-2">{sub.subject}</td>
              <td className="py-2 text-center text-muted-foreground">{sub.maxMarks}</td>
              <td className="py-2 text-center font-semibold">{sub.obtained}</td>
              <td className={`py-2 text-center font-bold ${gradeColors[sub.grade] || ""}`}>{sub.grade}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t font-semibold">
            <td className="pt-2">Total</td>
            <td className="pt-2 text-center">{student.maxTotal}</td>
            <td className="pt-2 text-center">{student.totalMarks}</td>
            <td className={`pt-2 text-center font-bold ${gradeColors[student.grade] || ""}`}>{student.grade}</td>
          </tr>
        </tfoot>
      </table>

      <Separator />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-xs">Percentage</p>
          <p className="font-bold text-lg">{student.percentage}%</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-xs">Rank</p>
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4 text-warning" />
            <p className="font-bold text-lg">#{student.rank}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground text-xs">Overall Grade</p>
          <p className={`font-bold text-2xl ${gradeColors[student.grade] || ""}`}>{student.grade}</p>
        </div>
      </div>

      <Separator />

      <p className="text-center text-xs text-muted-foreground italic">
        This is a computer-generated report card. For official copies, contact the school office.
      </p>
    </div>
  );
}
