import type { StaffMember } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin, Calendar, GraduationCap, Briefcase, IndianRupee, BookOpen } from "lucide-react";

interface StaffProfileProps { staff: StaffMember; }

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div><p className="text-muted-foreground text-xs">{label}</p><p className="font-medium">{value}</p></div>
    </div>
  );
}

export function StaffProfile({ staff }: StaffProfileProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
          {staff.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg">{staff.name}</h3>
          <p className="text-muted-foreground text-sm">{staff.designation} — {staff.department}</p>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline" className="capitalize text-xs">{staff.type}</Badge>
            <Badge className={`text-xs capitalize ${staff.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{staff.status.replace("-", " ")}</Badge>
          </div>
        </div>
      </div>
      <Separator />
      <Tabs defaultValue="personal" className="space-y-3">
        <TabsList className="w-full">
          <TabsTrigger value="personal" className="flex-1">Personal</TabsTrigger>
          <TabsTrigger value="professional" className="flex-1">Professional</TabsTrigger>
        </TabsList>
        <TabsContent value="personal" className="space-y-3 text-sm">
          <InfoRow icon={Mail} label="Email" value={staff.email} />
          <InfoRow icon={Phone} label="Phone" value={staff.phone} />
          <InfoRow icon={Calendar} label="Date of Birth" value={staff.dateOfBirth} />
          <InfoRow icon={MapPin} label="Address" value={staff.address} />
        </TabsContent>
        <TabsContent value="professional" className="space-y-3 text-sm">
          <InfoRow icon={GraduationCap} label="Qualification" value={staff.qualification} />
          <InfoRow icon={Briefcase} label="Experience" value={`${staff.experience} years`} />
          <InfoRow icon={Calendar} label="Joined" value={staff.joinDate} />
          <InfoRow icon={IndianRupee} label="Salary" value={`₹${staff.salary.toLocaleString("en-IN")}`} />
          {staff.subjects && <InfoRow icon={BookOpen} label="Subjects" value={staff.subjects.join(", ")} />}
          {staff.classIncharge && <InfoRow icon={GraduationCap} label="Class Incharge" value={staff.classIncharge} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
