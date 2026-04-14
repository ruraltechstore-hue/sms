import { useState } from "react";
import { motion } from "framer-motion";
import { LEAVE_RECORDS } from "@/lib/mock-staff";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const statusConfig: Record<string, { icon: React.ElementType; style: string }> = {
  approved: { icon: CheckCircle, style: "bg-success/10 text-success" },
  pending: { icon: Clock, style: "bg-warning/10 text-warning" },
  rejected: { icon: XCircle, style: "bg-destructive/10 text-destructive" },
};

const leaveTypeStyles: Record<string, string> = {
  casual: "bg-accent/10 text-accent",
  sick: "bg-destructive/10 text-destructive",
  earned: "bg-primary/10 text-primary",
  maternity: "bg-warning/10 text-warning",
  unpaid: "bg-muted text-muted-foreground",
};

export function LeaveTracker() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = LEAVE_RECORDS.filter((l) => statusFilter === "all" || l.status === statusFilter);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h3 className="font-heading font-semibold">Leave Requests</h3>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((leave, i) => {
          const config = statusConfig[leave.status];
          const StatusIcon = config.icon;
          return (
            <motion.div
              key={leave.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border p-4 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {leave.staffName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{leave.staffName}</h4>
                    <p className="text-xs text-muted-foreground">{leave.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${leaveTypeStyles[leave.leaveType]}`}>
                    {leave.leaveType}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize flex items-center gap-1 ${config.style}`}>
                    <StatusIcon className="h-3 w-3" />{leave.status}
                  </span>
                </div>
              </div>
              <div className="mt-2 ml-13 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div><span className="text-muted-foreground">From:</span> <span className="font-medium">{leave.fromDate}</span></div>
                <div><span className="text-muted-foreground">To:</span> <span className="font-medium">{leave.toDate}</span></div>
                <div><span className="text-muted-foreground">Days:</span> <span className="font-medium">{leave.days}</span></div>
                <div><span className="text-muted-foreground">Applied:</span> <span className="font-medium">{leave.appliedOn}</span></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 ml-13">Reason: {leave.reason}</p>
              {leave.status === "pending" && (
                <div className="flex gap-2 mt-3 ml-13">
                  <Button size="sm" variant="outline" className="text-success border-success/30 hover:bg-success/10 h-7 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10 h-7 text-xs">
                    <XCircle className="h-3 w-3 mr-1" />Reject
                  </Button>
                </div>
              )}
            </motion.div>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">No leave records found.</p>}
      </div>
    </motion.div>
  );
}
