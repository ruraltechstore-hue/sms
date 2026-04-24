import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home as HomeIcon, BedDouble, Users } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Row {
  id: string;
  student_id: string;
  room: string;
  attendance: any;
}

export default function Hostel() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("hostel").select("id, student_id, room, attendance");
      setRows((data ?? []) as Row[]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  const rooms = new Set(rows.map((r) => r.room)).size;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Hostel</h2>
        <p className="text-muted-foreground">Allocate rooms, track hostel attendance and welfare</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Hostel Students", value: String(rows.length), icon: Users,     iconColor: "text-primary" },
          { title: "Rooms",           value: String(rooms),       icon: BedDouble, iconColor: "text-accent" },
          { title: "Occupancy",       value: rows.length ? `${Math.round((rows.length / Math.max(rooms*4,1))*100)}%` : "0%", icon: HomeIcon, iconColor: "text-success" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Room Allocations</h3>
        {rows.length === 0 ? (
          <EmptyState title="No hostel allocations" description="Room assignments will appear here." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Room</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.student_id.slice(0, 8)}…</TableCell>
                  <TableCell className="font-medium">{r.room}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
