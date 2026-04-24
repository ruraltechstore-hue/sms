import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bus, MapPin, Truck } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Row {
  id: string;
  route: string;
  vehicle: string;
  pickup_point: string | null;
  student_id: string;
}

export default function Transport() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("transport").select("id, route, vehicle, pickup_point, student_id");
      setRows((data ?? []) as Row[]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  const routes = new Set(rows.map((r) => r.route)).size;
  const vehicles = new Set(rows.map((r) => r.vehicle)).size;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Transport</h2>
        <p className="text-muted-foreground">Manage routes, vehicles, and student assignments</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Assignments", value: String(rows.length), icon: Bus,    iconColor: "text-primary" },
          { title: "Routes",      value: String(routes),      icon: MapPin, iconColor: "text-success" },
          { title: "Vehicles",    value: String(vehicles),    icon: Truck,  iconColor: "text-accent" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Transport Assignments</h3>
        {rows.length === 0 ? (
          <EmptyState title="No transport assignments" description="Assigned routes will appear here." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Pickup Point</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.route}</TableCell>
                  <TableCell>{r.vehicle}</TableCell>
                  <TableCell className="text-muted-foreground">{r.pickup_point || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
