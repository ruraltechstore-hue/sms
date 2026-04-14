import { motion } from "framer-motion";
import { MessageSquare, Send, Users, Bell, Megaphone } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnnouncementCenter } from "@/components/messaging/AnnouncementCenter";
import { GroupMessaging } from "@/components/messaging/GroupMessaging";
import { NotificationCenter } from "@/components/messaging/NotificationCenter";
import { ANNOUNCEMENTS, GROUP_CHATS, NOTIFICATIONS } from "@/lib/mock-messaging";

export default function Messaging() {
  const unreadNotifications = NOTIFICATIONS.filter((n) => !n.read).length;
  const totalUnread = GROUP_CHATS.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Messaging</h2>
        <p className="text-muted-foreground">Announcements, group messaging & notifications</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Announcements", value: String(ANNOUNCEMENTS.length), icon: Megaphone, iconColor: "text-primary" },
          { title: "Group Chats", value: String(GROUP_CHATS.length), icon: Users, iconColor: "text-accent" },
          { title: "Messages Sent", value: "1,245", change: "+15%", changeType: "positive" as const, icon: Send, iconColor: "text-success" },
          { title: "Unread", value: String(unreadNotifications + totalUnread), icon: Bell, iconColor: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Tabs defaultValue="announcements" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="announcements" className="gap-2"><Megaphone className="h-4 w-4" /> Announcements</TabsTrigger>
            <TabsTrigger value="groups" className="gap-2"><MessageSquare className="h-4 w-4" /> Groups</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="announcements"><AnnouncementCenter /></TabsContent>
          <TabsContent value="groups"><GroupMessaging /></TabsContent>
          <TabsContent value="notifications"><NotificationCenter /></TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
