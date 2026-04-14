import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, FileText, Upload, Users, Plus } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdmissionForm } from "@/components/admissions/AdmissionForm";
import { StudentTable } from "@/components/admissions/StudentTable";
import { StudentProfile } from "@/components/admissions/StudentProfile";
import type { Student } from "@/lib/mock-students";

export default function Admissions() {
  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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
          { title: "Total Students", value: "2,847", change: "+12%", changeType: "positive" as const, icon: Users, iconColor: "text-primary" },
          { title: "Applications", value: "342", change: "+28", changeType: "positive" as const, icon: FileText, iconColor: "text-accent" },
          { title: "Approved", value: "256", change: "+18", changeType: "positive" as const, icon: GraduationCap, iconColor: "text-success" },
          { title: "Pending Review", value: "64", icon: Upload, iconColor: "text-warning" },
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
          <StudentTable onViewStudent={setSelectedStudent} />
        </TabsContent>

        <TabsContent value="applications">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border bg-card p-6">
            <h3 className="font-heading font-semibold mb-4">Recent Applications</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Class</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { name: "Priya Sharma", class: "10-A", date: "Jan 15, 2025", status: "Approved" },
                    { name: "Rahul Verma", class: "8-B", date: "Jan 14, 2025", status: "Pending" },
                    { name: "Ananya Gupta", class: "6-C", date: "Jan 13, 2025", status: "Under Review" },
                    { name: "Vikram Joshi", class: "9-A", date: "Jan 12, 2025", status: "Approved" },
                    { name: "Sneha Patel", class: "11-A", date: "Jan 11, 2025", status: "Pending" },
                    { name: "Karan Mehra", class: "12-B", date: "Jan 10, 2025", status: "Approved" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-secondary/50 transition-colors">
                      <td className="py-3 font-medium">{row.name}</td>
                      <td className="py-3 text-muted-foreground">{row.class}</td>
                      <td className="py-3 text-muted-foreground">{row.date}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.status === "Approved" ? "bg-success/10 text-success" :
                          row.status === "Pending" ? "bg-warning/10 text-warning" :
                          "bg-primary/10 text-primary"
                        }`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Admission Form Dialog */}
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
