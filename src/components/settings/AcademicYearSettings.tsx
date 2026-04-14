import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { CalendarDays, Save, Plus, CheckCircle } from "lucide-react";

interface Term {
  name: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

export function AcademicYearSettings() {
  const [academicYear, setAcademicYear] = useState("2024-25");
  const [startMonth, setStartMonth] = useState("April");
  const [gradingSystem, setGradingSystem] = useState("cbse");
  const [terms, setTerms] = useState<Term[]>([
    { name: "Term 1", startDate: "2024-04-01", endDate: "2024-09-30", active: true },
    { name: "Term 2", startDate: "2024-10-01", endDate: "2025-03-31", active: true },
  ]);

  const [holidays, setHolidays] = useState([
    { name: "Republic Day", date: "2025-01-26" },
    { name: "Holi", date: "2025-03-14" },
    { name: "Good Friday", date: "2025-04-18" },
    { name: "Independence Day", date: "2025-08-15" },
    { name: "Gandhi Jayanti", date: "2025-10-02" },
    { name: "Diwali", date: "2025-10-20" },
    { name: "Christmas", date: "2025-12-25" },
  ]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <CalendarDays className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold">Academic Year Configuration</h3>
            <p className="text-xs text-muted-foreground">Set academic calendar and grading</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Current Academic Year</Label>
            <Select value={academicYear} onValueChange={setAcademicYear}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2023-24">2023-24</SelectItem>
                <SelectItem value="2024-25">2024-25</SelectItem>
                <SelectItem value="2025-26">2025-26</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Session Start Month</Label>
            <Select value={startMonth} onValueChange={setStartMonth}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="January">January</SelectItem>
                <SelectItem value="April">April</SelectItem>
                <SelectItem value="June">June</SelectItem>
                <SelectItem value="September">September</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Grading System</Label>
            <Select value={gradingSystem} onValueChange={setGradingSystem}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cbse">CBSE (A+ to F)</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="gpa">GPA (10-point)</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Terms / Semesters</h3>
        <div className="space-y-3">
          {terms.map((term, i) => (
            <div key={i} className="rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle className={`h-5 w-5 ${term.active ? "text-success" : "text-muted-foreground"}`} />
                <div>
                  <p className="font-medium text-sm">{term.name}</p>
                  <p className="text-xs text-muted-foreground">{term.startDate} → {term.endDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={term.active ? "default" : "outline"} className="text-xs">
                  {term.active ? "Active" : "Inactive"}
                </Badge>
                <Switch checked={term.active} onCheckedChange={(v) => {
                  const updated = [...terms];
                  updated[i].active = v;
                  setTerms(updated);
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Holiday Calendar</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {holidays.map((h, i) => (
            <div key={i} className="rounded-xl border bg-secondary/30 p-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{h.name}</p>
                <p className="text-xs text-muted-foreground">{h.date}</p>
              </div>
              <Badge variant="outline" className="text-[10px]">Holiday</Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => toast.success("Academic year settings saved!")} className="gap-2">
          <Save className="h-4 w-4" />Save Changes
        </Button>
      </div>
    </motion.div>
  );
}
