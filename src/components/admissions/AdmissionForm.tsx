import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, BookOpen, Users, FileText, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CLASS_OPTIONS, SECTION_OPTIONS } from "@/lib/types";
import { studentService } from "@/lib/services/studentService";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Academic", icon: BookOpen },
  { id: 3, label: "Guardian", icon: Users },
  { id: 4, label: "Documents", icon: FileText },
];

interface AdmissionFormProps {
  onClose: () => void;
}

export function AdmissionForm({ onClose }: AdmissionFormProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", dateOfBirth: "", gender: "", bloodGroup: "",
    address: "", class: "", section: "", previousSchool: "", previousPercentage: "",
    fatherName: "", motherName: "", guardianPhone: "", guardianEmail: "", guardianOccupation: "",
    guardianAddress: "",
  });

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await studentService.create(form as any);
      toast({ title: "Application Submitted", description: `${form.name}'s admission application has been submitted successfully.` });
      onClose();
    } catch {
      toast({ title: "Error", description: "Failed to submit application. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const canNext = () => {
    if (step === 1) return form.name && form.dateOfBirth && form.gender;
    if (step === 2) return form.class && form.section;
    if (step === 3) return form.fatherName && form.guardianPhone;
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center transition-all text-sm font-semibold",
                step > s.id ? "bg-success text-success-foreground" :
                step === s.id ? "bg-primary text-primary-foreground shadow-glow" :
                "bg-secondary text-muted-foreground"
              )}>
                {step > s.id ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
              </div>
              <span className={cn("text-xs font-medium", step === s.id ? "text-foreground" : "text-muted-foreground")}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("h-0.5 flex-1 mx-2 rounded-full transition-colors -mt-5", step > s.id ? "bg-success" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Full Name *</Label>
                <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Enter student's full name" className="mt-1.5" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="student@email.com" className="mt-1.5" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="9876543210" className="mt-1.5" />
              </div>
              <div>
                <Label>Date of Birth *</Label>
                <Input type="date" value={form.dateOfBirth} onChange={(e) => update("dateOfBirth", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Gender *</Label>
                <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Blood Group</Label>
                <Select value={form.bloodGroup} onValueChange={(v) => update("bloodGroup", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Address</Label>
                <Textarea value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Full residential address" className="mt-1.5" rows={2} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Class *</Label>
                <Select value={form.class} onValueChange={(v) => update("class", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    {CLASS_OPTIONS.map((c) => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Section *</Label>
                <Select value={form.section} onValueChange={(v) => update("section", v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select section" /></SelectTrigger>
                  <SelectContent>
                    {SECTION_OPTIONS.map((s) => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Previous School</Label>
                <Input value={form.previousSchool} onChange={(e) => update("previousSchool", e.target.value)} placeholder="Name of previous school" className="mt-1.5" />
              </div>
              <div>
                <Label>Previous Percentage</Label>
                <Input value={form.previousPercentage} onChange={(e) => update("previousPercentage", e.target.value)} placeholder="e.g. 85.5" className="mt-1.5" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Father's Name *</Label>
                <Input value={form.fatherName} onChange={(e) => update("fatherName", e.target.value)} placeholder="Father's full name" className="mt-1.5" />
              </div>
              <div>
                <Label>Mother's Name</Label>
                <Input value={form.motherName} onChange={(e) => update("motherName", e.target.value)} placeholder="Mother's full name" className="mt-1.5" />
              </div>
              <div>
                <Label>Guardian Phone *</Label>
                <Input value={form.guardianPhone} onChange={(e) => update("guardianPhone", e.target.value)} placeholder="9876543210" className="mt-1.5" />
              </div>
              <div>
                <Label>Guardian Email</Label>
                <Input type="email" value={form.guardianEmail} onChange={(e) => update("guardianEmail", e.target.value)} placeholder="guardian@email.com" className="mt-1.5" />
              </div>
              <div>
                <Label>Occupation</Label>
                <Input value={form.guardianOccupation} onChange={(e) => update("guardianOccupation", e.target.value)} placeholder="Guardian's occupation" className="mt-1.5" />
              </div>
              <div>
                <Label>Guardian Address</Label>
                <Input value={form.guardianAddress} onChange={(e) => update("guardianAddress", e.target.value)} placeholder="If different from student" className="mt-1.5" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Upload required documents</p>
              {["Birth Certificate", "Previous School TC", "Report Card", "Passport Photo", "Aadhaar Card"].map((doc) => (
                <div key={doc} className="flex items-center justify-between p-4 rounded-xl border bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{doc}</span>
                  </div>
                  <Button variant="outline" size="sm">Upload</Button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={() => step === 1 ? onClose() : setStep(step - 1)}>
          <ChevronLeft className="h-4 w-4 mr-1" />{step === 1 ? "Cancel" : "Back"}
        </Button>
        {step < 4 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canNext()} className="bg-gradient-primary text-primary-foreground">
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting} className="bg-gradient-primary text-primary-foreground">
            <Check className="h-4 w-4 mr-1" /> {submitting ? "Submitting..." : "Submit Application"}
          </Button>
        )}
      </div>
    </div>
  );
}
