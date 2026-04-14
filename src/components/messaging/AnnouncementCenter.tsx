import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ANNOUNCEMENTS, Announcement } from "@/lib/mock-messaging";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Megaphone, Plus, Search, Send, Clock, FileEdit, Filter } from "lucide-react";
import { toast } from "sonner";

const priorityStyles: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-muted text-muted-foreground border-border",
};

const statusStyles: Record<string, { icon: React.ElementType; style: string }> = {
  sent: { icon: Send, style: "text-success" },
  scheduled: { icon: Clock, style: "text-primary" },
  draft: { icon: FileEdit, style: "text-muted-foreground" },
};

const channelLabels: Record<string, string> = { sms: "SMS", email: "Email", whatsapp: "WhatsApp", all: "All Channels" };

export function AnnouncementCenter() {
  const [announcements] = useState(ANNOUNCEMENTS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCompose, setShowCompose] = useState(false);
  const [selected, setSelected] = useState<Announcement | null>(null);

  const filtered = announcements.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.message.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSend = () => {
    setShowCompose(false);
    toast.success("Announcement created successfully");
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search announcements..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowCompose(true)} className="gap-2">
            <Plus className="h-4 w-4" /> New Announcement
          </Button>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((a, i) => {
              const StatusIcon = statusStyles[a.status].icon;
              return (
                <motion.div
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(a)}
                  className="rounded-xl border bg-card p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Megaphone className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm truncate">{a.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{a.author} • {a.date}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{a.message}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <Badge variant="outline" className={priorityStyles[a.priority]}>{a.priority}</Badge>
                      <div className="flex items-center gap-1 text-xs">
                        <StatusIcon className={`h-3 w-3 ${statusStyles[a.status].style}`} />
                        <span className="text-muted-foreground capitalize">{a.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="secondary" className="text-[10px]">{channelLabels[a.channel]}</Badge>
                    <span className="text-[10px] text-muted-foreground">→ {a.audience}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* View Announcement */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{selected.author}</span>
                <span className="text-muted-foreground">{selected.date}</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className={priorityStyles[selected.priority]}>{selected.priority}</Badge>
                <Badge variant="secondary">{channelLabels[selected.channel]}</Badge>
              </div>
              <div className="rounded-xl bg-secondary/50 p-4">
                <p className="text-sm leading-relaxed">{selected.message}</p>
              </div>
              <p className="text-xs text-muted-foreground">Audience: {selected.audience}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Compose Announcement */}
      <Dialog open={showCompose} onOpenChange={setShowCompose}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New Announcement</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Announcement title" />
            <Textarea placeholder="Write your message..." rows={4} />
            <div className="grid grid-cols-2 gap-3">
              <Select defaultValue="all">
                <SelectTrigger><SelectValue placeholder="Channel" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="medium">
                <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input placeholder="Target audience (e.g., All Parents, Class 10)" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompose(false)}>Save Draft</Button>
            <Button onClick={handleSend} className="gap-2"><Send className="h-4 w-4" /> Send Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
