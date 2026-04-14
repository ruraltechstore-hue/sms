import { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Bell, Mail, MessageSquare, AlertTriangle, Save } from "lucide-react";

interface NotifSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  email: boolean;
  push: boolean;
  sms: boolean;
}

export function NotificationPreferences() {
  const [settings, setSettings] = useState<NotifSetting[]>([
    { id: "attendance", label: "Attendance Alerts", description: "Notify when student is marked absent or late", icon: AlertTriangle, email: true, push: true, sms: false },
    { id: "fees", label: "Fee Reminders", description: "Payment due dates and overdue notifications", icon: Mail, email: true, push: true, sms: true },
    { id: "exams", label: "Exam Notifications", description: "Schedule updates, results published", icon: Bell, email: true, push: true, sms: false },
    { id: "messages", label: "Parent Messages", description: "New messages from parents or teachers", icon: MessageSquare, email: false, push: true, sms: false },
    { id: "leaves", label: "Leave Approvals", description: "Staff leave requests and approvals", icon: Bell, email: true, push: false, sms: false },
    { id: "announcements", label: "School Announcements", description: "General school-wide notices", icon: Bell, email: true, push: true, sms: false },
  ]);

  const [digestFreq, setDigestFreq] = useState("daily");

  const toggle = (idx: number, channel: "email" | "push" | "sms") => {
    const updated = [...settings];
    updated[idx][channel] = !updated[idx][channel];
    setSettings(updated);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="rounded-2xl border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bell className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold">Notification Channels</h3>
            <p className="text-xs text-muted-foreground">Choose how you want to receive alerts</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="pb-3 font-medium">Notification</th>
                <th className="pb-3 font-medium text-center">Email</th>
                <th className="pb-3 font-medium text-center">Push</th>
                <th className="pb-3 font-medium text-center">SMS</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {settings.map((s, i) => {
                const Icon = s.icon;
                return (
                  <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div>
                          <p className="font-medium">{s.label}</p>
                          <p className="text-xs text-muted-foreground">{s.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center"><Switch checked={s.email} onCheckedChange={() => toggle(i, "email")} /></td>
                    <td className="py-4 text-center"><Switch checked={s.push} onCheckedChange={() => toggle(i, "push")} /></td>
                    <td className="py-4 text-center"><Switch checked={s.sms} onCheckedChange={() => toggle(i, "sms")} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Digest Settings</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Email Digest Frequency</p>
            <p className="text-xs text-muted-foreground">How often to receive summary emails</p>
          </div>
          <Select value={digestFreq} onValueChange={setDigestFreq}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="realtime">Real-time</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="off">Off</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => toast.success("Notification preferences saved!")} className="gap-2">
          <Save className="h-4 w-4" />Save Preferences
        </Button>
      </div>
    </motion.div>
  );
}
