import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Heart, BookOpen, Users, CreditCard, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Student } from "@/lib/mock-students";
import { cn } from "@/lib/utils";

interface StudentProfileProps {
  student: Student;
  onBack: () => void;
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}

export function StudentProfile({ student, onBack }: StudentProfileProps) {
  const statusColor = student.status === "active" ? "bg-success/10 text-success border-success/20" :
    student.status === "inactive" ? "bg-destructive/10 text-destructive border-destructive/20" :
    "bg-muted text-muted-foreground border-border";

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-heading font-bold">Student Profile</h2>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="h-20 w-20 rounded-2xl bg-gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold shrink-0">
            {student.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-2xl font-heading font-bold">{student.name}</h3>
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border", statusColor)}>
                {student.status}
              </span>
            </div>
            <p className="text-muted-foreground mt-1">Class {student.class}-{student.section} • Roll #{student.rollNumber}</p>
            <p className="text-xs text-muted-foreground font-mono mt-1">{student.id}</p>
          </div>
          <div className="flex gap-3">
            <div className="text-center p-3 rounded-xl bg-secondary/50">
              <p className="text-lg font-bold text-success">{student.attendance}%</p>
              <p className="text-xs text-muted-foreground">Attendance</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-secondary/50">
              <p className="text-lg font-bold text-primary">{student.cgpa}</p>
              <p className="text-xs text-muted-foreground">CGPA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="guardian">Guardian</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <div className="rounded-2xl border bg-card p-6">
            <h4 className="font-heading font-semibold mb-4">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InfoRow icon={Mail} label="Email" value={student.email} />
              <InfoRow icon={Phone} label="Phone" value={student.phone} />
              <InfoRow icon={Calendar} label="Date of Birth" value={student.dateOfBirth} />
              <InfoRow icon={Heart} label="Blood Group" value={student.bloodGroup} />
              <InfoRow icon={Users} label="Gender" value={student.gender} />
              <InfoRow icon={MapPin} label="Address" value={student.address} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="academic">
          <div className="rounded-2xl border bg-card p-6">
            <h4 className="font-heading font-semibold mb-4">Academic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InfoRow icon={BookOpen} label="Class & Section" value={`Class ${student.class}-${student.section}`} />
              <InfoRow icon={TrendingUp} label="Roll Number" value={student.rollNumber} />
              <InfoRow icon={Calendar} label="Admission Date" value={student.admissionDate} />
              <InfoRow icon={BookOpen} label="Previous School" value={student.previousSchool} />
              <InfoRow icon={TrendingUp} label="CGPA" value={String(student.cgpa)} />
              <InfoRow icon={Calendar} label="Attendance" value={`${student.attendance}%`} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="guardian">
          <div className="rounded-2xl border bg-card p-6">
            <h4 className="font-heading font-semibold mb-4">Guardian Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <InfoRow icon={Users} label="Father's Name" value={student.fatherName} />
              <InfoRow icon={Users} label="Mother's Name" value={student.motherName} />
              <InfoRow icon={Phone} label="Guardian Phone" value={student.guardianPhone} />
              <InfoRow icon={Mail} label="Guardian Email" value={student.guardianEmail} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fees">
          <div className="rounded-2xl border bg-card p-6">
            <h4 className="font-heading font-semibold mb-4">Fee Status</h4>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
              <CreditCard className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium capitalize">Fee Status: {student.feeStatus}</p>
                <p className="text-sm text-muted-foreground">Academic Year 2024-25</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
