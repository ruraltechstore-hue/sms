import { motion } from "framer-motion";
import { MessageSquare, Send, Users, Bell } from "lucide-react";
import { StatCard } from "@/components/StatCard";

export default function Messaging() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Messaging</h2>
        <p className="text-muted-foreground">Broadcast SMS, WhatsApp, and email messages</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Messages Sent", value: "1,245", change: "+15%", changeType: "positive" as const, icon: Send, iconColor: "text-primary" },
          { title: "Campaigns", value: "18", icon: MessageSquare, iconColor: "text-accent" },
          { title: "Recipients", value: "3,420", icon: Users, iconColor: "text-success" },
          { title: "Pending", value: "5", icon: Bell, iconColor: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Recent Messages</h3>
        <div className="space-y-3">
          {[
            { subject: "Fee Reminder - January 2025", recipients: "All Parents", date: "Jan 15", channel: "SMS" },
            { subject: "Annual Day Invitation", recipients: "All Students", date: "Jan 14", channel: "Email" },
            { subject: "PTM Schedule Update", recipients: "Class 10 Parents", date: "Jan 13", channel: "WhatsApp" },
            { subject: "Exam Timetable Published", recipients: "Class 10-12", date: "Jan 12", channel: "SMS" },
          ].map((msg, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
              <div>
                <p className="font-medium text-sm">{msg.subject}</p>
                <p className="text-xs text-muted-foreground mt-1">{msg.recipients} • {msg.date}</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">{msg.channel}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
