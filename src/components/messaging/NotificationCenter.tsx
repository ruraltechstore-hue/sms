import { useState } from "react";
import { motion } from "framer-motion";
import { NOTIFICATIONS, Notification } from "@/lib/mock-messaging";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, Info, AlertTriangle, CheckCircle2, XCircle, Trash2 } from "lucide-react";

const typeConfig: Record<string, { icon: React.ElementType; style: string; bg: string }> = {
  info: { icon: Info, style: "text-primary", bg: "bg-primary/10" },
  warning: { icon: AlertTriangle, style: "text-warning", bg: "bg-warning/10" },
  success: { icon: CheckCircle2, style: "text-success", bg: "bg-success/10" },
  error: { icon: XCircle, style: "text-destructive", bg: "bg-destructive/10" },
};

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const toggleRead = (id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  const removeNotification = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayed = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border overflow-hidden">
            <button onClick={() => setFilter("all")} className={`px-3 py-1.5 text-xs font-medium transition-colors ${filter === "all" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary/50"}`}>
              All ({notifications.length})
            </button>
            <button onClick={() => setFilter("unread")} className={`px-3 py-1.5 text-xs font-medium transition-colors ${filter === "unread" ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary/50"}`}>
              Unread ({unreadCount})
            </button>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead} className="gap-2 text-xs">
            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {displayed.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No {filter === "unread" ? "unread " : ""}notifications</p>
          </div>
        ) : (
          displayed.map((n, i) => {
            const cfg = typeConfig[n.type];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`rounded-xl border p-4 transition-colors ${!n.read ? "border-primary/20 bg-primary/5" : "bg-card hover:bg-secondary/20"}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
                    <Icon className={`h-4 w-4 ${cfg.style}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm truncate">{n.title}</h4>
                          {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleRead(n.id)} title={n.read ? "Mark unread" : "Mark read"}>
                          <CheckCheck className={`h-3.5 w-3.5 ${!n.read ? "text-primary" : "text-muted-foreground"}`} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeNotification(n.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-[10px]">{n.module}</Badge>
                      <span className="text-[10px] text-muted-foreground">{n.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
