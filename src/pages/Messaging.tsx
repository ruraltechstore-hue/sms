import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, Users, Bell, Megaphone } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnnouncementCenter } from "@/components/messaging/AnnouncementCenter";
import { GroupMessaging } from "@/components/messaging/GroupMessaging";
import { NotificationCenter } from "@/components/messaging/NotificationCenter";
import { LoadingState } from "@/components/LoadingState";
import { useAuth } from "@/lib/auth-context";
import { isReadOnlyRole } from "@/lib/rbac";

export default function Messaging() {
  const { user } = useAuth();
  const readOnly = user ? isReadOnlyRole(user.role) : true;
  // Per spec: parent role does not see Announcements feature.
  const showAnnouncements = !readOnly;

  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(false); }, []);
  if (loading) return <LoadingState type="spinner" />;

  const stats = showAnnouncements
    ? [
        { title: "Announcements", value: "0", icon: Megaphone, iconColor: "text-primary" },
        { title: "Group Chats",   value: "0", icon: Users,     iconColor: "text-accent" },
        { title: "Messages Sent", value: "0", icon: Send,      iconColor: "text-success" },
        { title: "Unread",        value: "0", icon: Bell,      iconColor: "text-warning" },
      ]
    : [
        { title: "Group Chats",   value: "0", icon: Users, iconColor: "text-accent" },
        { title: "Messages",      value: "0", icon: Send,  iconColor: "text-success" },
        { title: "Unread",        value: "0", icon: Bell,  iconColor: "text-warning" },
      ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Messaging</h2>
        <p className="text-muted-foreground">
          {showAnnouncements ? "Announcements, group messaging & notifications" : "Group messaging & notifications"}
        </p>
      </div>
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${showAnnouncements ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4`}>
        {stats.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Tabs defaultValue={showAnnouncements ? "announcements" : "groups"} className="space-y-4">
          <TabsList className={`grid w-full ${showAnnouncements ? "grid-cols-3" : "grid-cols-2"}`}>
            {showAnnouncements && (
              <TabsTrigger value="announcements" className="gap-2"><Megaphone className="h-4 w-4" /> Announcements</TabsTrigger>
            )}
            <TabsTrigger value="groups" className="gap-2"><MessageSquare className="h-4 w-4" /> Groups</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
          </TabsList>
          {showAnnouncements && (
            <TabsContent value="announcements"><AnnouncementCenter /></TabsContent>
          )}
          <TabsContent value="groups"><GroupMessaging /></TabsContent>
          <TabsContent value="notifications"><NotificationCenter /></TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
