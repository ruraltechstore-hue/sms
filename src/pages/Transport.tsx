import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bus, MapPin, Truck, User, Plus, Pencil, Trash2 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface RouteRow {
  id: string;
  route: string;
  vehicle: string;
  pickup_point: string | null;
  student_id: string;
}

interface Driver {
  id: string;
  name: string;
  phone: string | null;
  license_no: string | null;
  vehicle: string | null;
}

interface StudentRow { id: string; name: string }

const PALETTE = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))"];

export default function Transport() {
  const { user } = useAuth();
  const canManage = user?.role === "transport_manager" || user?.role === "principal" || user?.role === "sms_admin";

  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<RouteRow[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);

  // Driver dialog
  const [driverDialog, setDriverDialog] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [driverForm, setDriverForm] = useState({ name: "", phone: "", license_no: "", vehicle: "" });

  // Assignment dialog
  const [assignDialog, setAssignDialog] = useState(false);
  const [assignForm, setAssignForm] = useState({ student_id: "", route: "", vehicle: "", pickup_point: "" });

  const load = async () => {
    setLoading(true);
    const [{ data: t }, { data: d }, { data: s }] = await Promise.all([
      supabase.from("transport").select("id, route, vehicle, pickup_point, student_id"),
      supabase.from("drivers").select("*").order("name"),
      supabase.from("students").select("id, name").order("name"),
    ]);
    setRows((t ?? []) as RouteRow[]);
    setDrivers((d ?? []) as Driver[]);
    setStudents((s ?? []) as StudentRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const routes = new Set(rows.map((r) => r.route)).size;
    const vehicles = new Set(rows.map((r) => r.vehicle)).size;
    return { assignments: rows.length, routes, vehicles, drivers: drivers.length };
  }, [rows, drivers]);

  const routePie = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of rows) m.set(r.route, (m.get(r.route) ?? 0) + 1);
    return [...m.entries()].map(([name, value], i) => ({ name, value, color: PALETTE[i % PALETTE.length] }));
  }, [rows]);

  const studentName = (id: string) => students.find((s) => s.id === id)?.name ?? id.slice(0, 8) + "…";

  // Drivers
  const openNewDriver = () => { setEditingDriver(null); setDriverForm({ name: "", phone: "", license_no: "", vehicle: "" }); setDriverDialog(true); };
  const openEditDriver = (d: Driver) => { setEditingDriver(d); setDriverForm({ name: d.name, phone: d.phone ?? "", license_no: d.license_no ?? "", vehicle: d.vehicle ?? "" }); setDriverDialog(true); };
  const saveDriver = async () => {
    if (!driverForm.name) return toast({ title: "Name required", variant: "destructive" });
    if (editingDriver) {
      const { error } = await supabase.from("drivers").update({
        name: driverForm.name, phone: driverForm.phone || null, license_no: driverForm.license_no || null, vehicle: driverForm.vehicle || null,
      }).eq("id", editingDriver.id);
      if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
      toast({ title: "Driver updated" });
    } else {
      const { error } = await supabase.from("drivers").insert({
        name: driverForm.name, phone: driverForm.phone || null, license_no: driverForm.license_no || null, vehicle: driverForm.vehicle || null,
      });
      if (error) return toast({ title: "Add failed", description: error.message, variant: "destructive" });
      toast({ title: "Driver added" });
    }
    setDriverDialog(false); load();
  };
  const deleteDriver = async (id: string) => {
    if (!confirm("Delete this driver?")) return;
    const { error } = await supabase.from("drivers").delete().eq("id", id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    toast({ title: "Driver deleted" }); load();
  };

  // Assignments
  const saveAssignment = async () => {
    if (!assignForm.student_id || !assignForm.route || !assignForm.vehicle) {
      return toast({ title: "Student, route and vehicle required", variant: "destructive" });
    }
    const { error } = await supabase.from("transport").insert({
      student_id: assignForm.student_id, route: assignForm.route, vehicle: assignForm.vehicle,
      pickup_point: assignForm.pickup_point || null,
    });
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Student assigned" });
    setAssignDialog(false);
    setAssignForm({ student_id: "", route: "", vehicle: "", pickup_point: "" });
    load();
  };
  const removeAssignment = async (id: string) => {
    if (!confirm("Remove this assignment?")) return;
    const { error } = await supabase.from("transport").delete().eq("id", id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Removed" }); load();
  };

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Transport</h2>
        <p className="text-muted-foreground">Routes, vehicles, drivers and student transport mapping</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { title: "Routes",      value: String(stats.routes),      icon: MapPin, iconColor: "text-success" },
          { title: "Vehicles",    value: String(stats.vehicles),    icon: Truck,  iconColor: "text-accent" },
          { title: "Drivers",     value: String(stats.drivers),     icon: User,   iconColor: "text-warning" },
          { title: "Students",    value: String(stats.assignments), icon: Bus,    iconColor: "text-primary" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {routePie.length > 0 && (
        <div className="rounded-2xl border bg-card p-6 glass">
          <h3 className="font-heading font-semibold mb-4">Students per Route</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={routePie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {routePie.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <Tabs defaultValue="routes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="routes">Route Assignments</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-4">
          {canManage && (
            <div className="flex justify-end">
              <Button onClick={() => setAssignDialog(true)} className="gap-2"><Plus className="h-4 w-4" /> Assign Student</Button>
            </div>
          )}
          <div className="rounded-2xl border bg-card p-6">
            {rows.length === 0 ? (
              <EmptyState title="No transport assignments" description="Assigned routes will appear here." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Pickup</TableHead>
                    {canManage && <TableHead className="w-12"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{studentName(r.student_id)}</TableCell>
                      <TableCell className="font-medium">{r.route}</TableCell>
                      <TableCell>{r.vehicle}</TableCell>
                      <TableCell className="text-muted-foreground">{r.pickup_point || "—"}</TableCell>
                      {canManage && (
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeAssignment(r.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-4">
          {canManage && (
            <div className="flex justify-end">
              <Button onClick={openNewDriver} className="gap-2"><Plus className="h-4 w-4" /> Add Driver</Button>
            </div>
          )}
          <div className="rounded-2xl border bg-card p-6">
            {drivers.length === 0 ? (
              <EmptyState title="No drivers" description={canManage ? "Add a driver to start." : "Drivers will appear here."} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Vehicle</TableHead>
                    {canManage && <TableHead className="w-24"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drivers.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell className="text-muted-foreground">{d.phone || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{d.license_no || "—"}</TableCell>
                      <TableCell>{d.vehicle || "—"}</TableCell>
                      {canManage && (
                        <TableCell className="space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDriver(d)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteDriver(d.id)}><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Driver dialog */}
      <Dialog open={driverDialog} onOpenChange={setDriverDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editingDriver ? "Edit Driver" : "Add Driver"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Name</Label><Input value={driverForm.name} onChange={(e) => setDriverForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Phone</Label><Input value={driverForm.phone} onChange={(e) => setDriverForm((f) => ({ ...f, phone: e.target.value }))} /></div>
            <div><Label>License No.</Label><Input value={driverForm.license_no} onChange={(e) => setDriverForm((f) => ({ ...f, license_no: e.target.value }))} /></div>
            <div><Label>Assigned Vehicle</Label><Input value={driverForm.vehicle} onChange={(e) => setDriverForm((f) => ({ ...f, vehicle: e.target.value }))} placeholder="e.g. KA-01-AB-1234" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDriverDialog(false)}>Cancel</Button>
            <Button onClick={saveDriver}>{editingDriver ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assignment dialog */}
      <Dialog open={assignDialog} onOpenChange={setAssignDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Assign Student to Route</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Student</Label>
              <Select value={assignForm.student_id} onValueChange={(v) => setAssignForm((f) => ({ ...f, student_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>
                  {students.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Route</Label><Input value={assignForm.route} onChange={(e) => setAssignForm((f) => ({ ...f, route: e.target.value }))} placeholder="e.g. Route 5 - North" /></div>
            <div>
              <Label>Vehicle</Label>
              {drivers.filter((d) => d.vehicle).length > 0 ? (
                <Select value={assignForm.vehicle} onValueChange={(v) => setAssignForm((f) => ({ ...f, vehicle: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                  <SelectContent>
                    {drivers.filter((d) => d.vehicle).map((d) => (
                      <SelectItem key={d.id} value={d.vehicle!}>{d.vehicle} ({d.name})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input value={assignForm.vehicle} onChange={(e) => setAssignForm((f) => ({ ...f, vehicle: e.target.value }))} placeholder="Vehicle number" />
              )}
            </div>
            <div><Label>Pickup Point</Label><Input value={assignForm.pickup_point} onChange={(e) => setAssignForm((f) => ({ ...f, pickup_point: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialog(false)}>Cancel</Button>
            <Button onClick={saveAssignment}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
