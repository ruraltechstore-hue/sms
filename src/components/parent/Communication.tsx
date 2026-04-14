import { useState } from "react";
import { motion } from "framer-motion";
import { PARENT_MESSAGES, ParentMessage } from "@/lib/mock-parent";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, MailOpen, Bell, AlertTriangle, MessageSquare } from "lucide-react";

const typeConfig: Record<string, { icon: React.ElementType; style: string }> = {
  notice: { icon: Bell, style: "bg-primary/10 text-primary" },
  message: { icon: MessageSquare, style: "bg-accent/10 text-accent" },
  alert: { icon: AlertTriangle, style: "bg-warning/10 text-warning" },
};

export function Communication() {
  const [selected, setSelected] = useState<ParentMessage | null>(null);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Messages & Notices</h3>
        <div className="space-y-2">
          {PARENT_MESSAGES.map((msg, i) => {
            const cfg = typeConfig[msg.type];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(msg)}
                className={`rounded-xl border p-4 cursor-pointer hover:bg-secondary/30 transition-colors ${!msg.read ? "border-primary/30 bg-primary/5" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.style}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-sm truncate">{msg.subject}</h4>
                      {!msg.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{msg.from} • {msg.role}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{msg.message}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{msg.date}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{selected?.subject}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{selected.from}</p>
                  <p className="text-xs text-muted-foreground">{selected.role}</p>
                </div>
                <span className="text-xs text-muted-foreground">{selected.date}</span>
              </div>
              <div className="rounded-xl bg-secondary/50 p-4">
                <p className="text-sm leading-relaxed">{selected.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
