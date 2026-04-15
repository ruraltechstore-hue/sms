import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, AlertCircle, Search, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { attendanceService } from "@/lib/services/attendanceService";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import type { StudentAttendance } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusConfig = {
  present: { icon: CheckCircle, label: "Present", color: "text-success", bg: "bg-success/10 border-success/30" },
  absent: { icon: XCircle, label: "Absent", color: "text-destructive", bg: "bg-destructive/10 border-destructive/30" },
  late: { icon: Clock, label: "Late", color: "text-warning", bg: "bg-warning/10 border-warning/30" },
  excused: { icon: AlertCircle, label: "Excused", color: "text-muted-foreground", bg: "bg-muted border-muted-foreground/30" },
};

export function AttendanceMarking() {
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      const data = await attendanceService.getClasses();
      setClasses(data);
      if (data.length > 0) setSelectedClass(data[0]);
      setLoading(false);
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    const fetchStudents = async () => {
      const data = await attendanceService.getClassStudents(selectedClass);
      setStudents(data);
    };
    fetchStudents();
  }, [selectedClass]);

  const handleClassChange = (cls: string) => {
    setSelectedClass(cls);
    setSearch("");
  };

  const toggleStatus = (id: string, status: StudentAttendance["status"]) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const markAll = (status: StudentAttendance["status"]) => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  const filtered = useMemo(() => {
    if (!search) return students;
    const q = search.toLowerCase();
    return students.filter(s => s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q));
  }, [students, search]);

  const stats = useMemo(() => {
    const counts = { present: 0, absent: 0, late: 0, excused: 0 };
    students.forEach(s => counts[s.status]++);
    return counts;
  }, [students]);

  const handleSave = async () => {
    await attendanceService.saveAttendance(selectedClass, students);
    toast.success(`Attendance saved for ${selectedClass}`, {
      description: `${stats.present} present, ${stats.absent} absent, ${stats.late} late, ${stats.excused} excused`,
    });
  };

  if (loading) return <LoadingState type="spinner" />;

  if (classes.length === 0) {
    return <EmptyState title="No Classes Available" description="Classes will appear here once connected to the backend." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={selectedClass} onValueChange={handleClassChange}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={() => markAll("present")}>
            <CheckCircle className="h-4 w-4 mr-1 text-success" /> All Present
          </Button>
          <Button variant="outline" size="sm" onClick={() => markAll("absent")}>
            <XCircle className="h-4 w-4 mr-1 text-destructive" /> All Absent
          </Button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map(key => {
          const cfg = statusConfig[key];
          return (
            <Badge key={key} variant="outline" className={cn("text-xs px-3 py-1.5 gap-1.5", cfg.bg)}>
              <cfg.icon className={cn("h-3.5 w-3.5", cfg.color)} />
              <span className={cfg.color}>{stats[key]}</span> {cfg.label}
            </Badge>
          );
        })}
        <Badge variant="outline" className="text-xs px-3 py-1.5 ml-auto">
          Total: {students.length}
        </Badge>
      </div>

      {students.length === 0 ? (
        <EmptyState title="No Students" description="Student data for this class will appear here." />
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto] gap-0 text-sm">
            <div className="contents font-medium text-muted-foreground bg-secondary/50 text-xs uppercase tracking-wider">
              <div className="p-3 border-b">Roll</div>
              <div className="p-3 border-b">Student Name</div>
              <div className="p-3 border-b text-center">Status</div>
            </div>
            {filtered.map((student, i) => (
              <motion.div key={student.id} className="contents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01 }}>
                <div className="p-3 border-b border-border/50 text-muted-foreground font-mono text-xs flex items-center">{student.rollNo}</div>
                <div className="p-3 border-b border-border/50 font-medium flex items-center">{student.name}</div>
                <div className="p-3 border-b border-border/50 flex items-center justify-center gap-1">
                  {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map(status => {
                    const cfg = statusConfig[status];
                    const active = student.status === status;
                    return (
                      <button key={status} onClick={() => toggleStatus(student.id, status)}
                        className={cn("p-1.5 rounded-lg transition-all", active ? cfg.bg + " border shadow-sm scale-110" : "hover:bg-secondary/80 opacity-40 hover:opacity-70")}
                        title={cfg.label}>
                        <cfg.icon className={cn("h-4 w-4", active ? cfg.color : "text-muted-foreground")} />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2" disabled={students.length === 0}>
          <Save className="h-4 w-4" /> Save Attendance
        </Button>
      </div>
    </div>
  );
}
