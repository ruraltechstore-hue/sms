import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, FileText, Upload, Users, Plus } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdmissionForm } from "@/components/admissions/AdmissionForm";
import { StudentTable } from "@/components/admissions/StudentTable";
import { StudentProfile } from "@/components/admissions/StudentProfile";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { studentService } from "@/lib/services/studentService";
import { useAuth } from "@/lib/auth-context";
import type { Student } from "@/lib/types";

const ROLES_THAT_CAN_CREATE: ReadonlyArray<string> = ["principal", "sms_admin", "front_desk"];

export default function Admissions() {
  const { user } = useAuth();
  const canCreate = user ? ROLES_THAT_CAN_CREATE.includes(user.role) : false;
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await studentService.getAll();
        setStudents(data);
      } catch {
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (selectedStudent) {
    return <StudentProfile student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold">Student & Admissions</h2>
          <p className="text-muted-foreground">Manage students, applications, and enrollment</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-gradient-primary text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> New Admission
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Students", value: String(students.length), icon: Users, iconColor: "text-primary" },
          { title: "Applications", value: "0", icon: FileText, iconColor: "text-accent" },
          { title: "Approved", value: "0", icon: GraduationCap, iconColor: "text-success" },
          { title: "Pending Review", value: "0", icon: Upload, iconColor: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="students">All Students</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          {loading ? (
            <div className="rounded-2xl border bg-card p-6"><LoadingState rows={6} /></div>
          ) : (
            <StudentTable students={students} onViewStudent={setSelectedStudent} />
          )}
        </TabsContent>

        <TabsContent value="applications">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border bg-card p-6">
            <h3 className="font-heading font-semibold mb-4">Recent Applications</h3>
            <EmptyState title="No Applications" description="Applications will appear here when connected to the backend." />
          </motion.div>
        </TabsContent>
      </Tabs>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">New Admission Application</DialogTitle>
          </DialogHeader>
          <AdmissionForm onClose={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
