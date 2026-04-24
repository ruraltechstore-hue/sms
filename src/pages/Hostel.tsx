import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Home as HomeIcon, BedDouble, Users, Plus, Pencil, Trash2 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { toast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Room {
  id: string;
  room_number: string;
  block: string | null;
  capacity: number;
  occupancy: number;
  notes: string | null;
}

interface Allocation {
  id: string;
  student_id: string;
  room: string; // room_number
}

interface StudentRow { id: string; name: string }

export default function Hostel() {
  const { user } = useAuth();
  const canManage = user?.role === "hostel_warden" || user?.role === "principal" || user?.role === "sms_admin";

  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);

  const [roomDialog, setRoomDialog] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [roomForm, setRoomForm] = useState({ room_number: "", block: "", capacity: 1, notes: "" });

  const [allocDialog, setAllocDialog] = useState(false);
  const [allocForm, setAllocForm] = useState({ student_id: "", room: "" });

  const load = async () => {
    setLoading(true);
    const [{ data: r }, { data: a }, { data: s }] = await Promise.all([
      supabase.from("hostel_rooms").select("*").order("room_number"),
      supabase.from("hostel").select("id, student_id, room"),
      supabase.from("students").select("id, name").order("name"),
    ]);
    setRooms((r ?? []) as Room[]);
    setAllocations((a ?? []) as Allocation[]);
    setStudents((s ?? []) as StudentRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Sync occupancy from allocations
  const computedOccupancy = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of allocations) m.set(a.room, (m.get(a.room) ?? 0) + 1);
    return m;
  }, [allocations]);

  const stats = useMemo(() => {
    const totalCapacity = rooms.reduce((s, r) => s + r.capacity, 0);
    const occupied = allocations.length;
    const available = Math.max(0, totalCapacity - occupied);
    const fullRooms = rooms.filter((r) => (computedOccupancy.get(r.room_number) ?? 0) >= r.capacity).length;
    return { rooms: rooms.length, totalCapacity, occupied, available, fullRooms };
  }, [rooms, allocations, computedOccupancy]);

  const occupancyPie = [
    { name: "Occupied",  value: stats.occupied,  color: "hsl(var(--primary))" },
    { name: "Available", value: stats.available, color: "hsl(var(--success))" },
  ];

  const openNewRoom = () => {
    setEditing(null);
    setRoomForm({ room_number: "", block: "", capacity: 1, notes: "" });
    setRoomDialog(true);
  };

  const openEditRoom = (r: Room) => {
    setEditing(r);
    setRoomForm({ room_number: r.room_number, block: r.block ?? "", capacity: r.capacity, notes: r.notes ?? "" });
    setRoomDialog(true);
  };

  const saveRoom = async () => {
    if (!roomForm.room_number) return toast({ title: "Room number required", variant: "destructive" });
    if (editing) {
      const { error } = await supabase.from("hostel_rooms").update({
        room_number: roomForm.room_number, block: roomForm.block || null,
        capacity: roomForm.capacity, notes: roomForm.notes || null,
      }).eq("id", editing.id);
      if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
      toast({ title: "Room updated" });
    } else {
      const { error } = await supabase.from("hostel_rooms").insert({
        room_number: roomForm.room_number, block: roomForm.block || null,
        capacity: roomForm.capacity, notes: roomForm.notes || null,
      });
      if (error) return toast({ title: "Add failed", description: error.message, variant: "destructive" });
      toast({ title: "Room added" });
    }
    setRoomDialog(false);
    load();
  };

  const deleteRoom = async (r: Room) => {
    if ((computedOccupancy.get(r.room_number) ?? 0) > 0) {
      return toast({ title: "Room not empty", description: "Re-allocate students before deleting.", variant: "destructive" });
    }
    if (!confirm(`Delete room ${r.room_number}?`)) return;
    const { error } = await supabase.from("hostel_rooms").delete().eq("id", r.id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    toast({ title: "Room deleted" });
    load();
  };

  const allocate = async () => {
    if (!allocForm.student_id || !allocForm.room) return toast({ title: "Pick student & room", variant: "destructive" });
    const room = rooms.find((r) => r.room_number === allocForm.room);
    if (!room) return;
    if ((computedOccupancy.get(room.room_number) ?? 0) >= room.capacity) {
      return toast({ title: "Room full", variant: "destructive" });
    }
    const { error } = await supabase.from("hostel").insert({
      student_id: allocForm.student_id, room: allocForm.room, attendance: [],
    });
    if (error) return toast({ title: "Allocation failed", description: error.message, variant: "destructive" });
    toast({ title: "Student allocated" });
    setAllocDialog(false);
    setAllocForm({ student_id: "", room: "" });
    load();
  };

  const unallocate = async (a: Allocation) => {
    if (!confirm("Remove this allocation?")) return;
    const { error } = await supabase.from("hostel").delete().eq("id", a.id);
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    toast({ title: "Allocation removed" });
    load();
  };

  if (loading) return <LoadingState type="spinner" />;

  const studentName = (id: string) => students.find((s) => s.id === id)?.name ?? id.slice(0, 8) + "…";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Hostel</h2>
        <p className="text-muted-foreground">Manage rooms, allocations and occupancy</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { title: "Rooms",      value: String(stats.rooms),         icon: BedDouble,   iconColor: "text-primary" },
          { title: "Capacity",   value: String(stats.totalCapacity), icon: Users,       iconColor: "text-accent" },
          { title: "Occupied",   value: String(stats.occupied),      icon: HomeIcon,    iconColor: "text-warning" },
          { title: "Vacant",     value: String(stats.available),     icon: HomeIcon,    iconColor: "text-success" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {(stats.totalCapacity > 0) && (
        <div className="rounded-2xl border bg-card p-6 glass">
          <h3 className="font-heading font-semibold mb-4">Occupancy</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={occupancyPie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {occupancyPie.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <Tabs defaultValue="rooms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="allocations">Allocations</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="space-y-4">
          {canManage && (
            <div className="flex justify-end">
              <Button onClick={openNewRoom} className="gap-2"><Plus className="h-4 w-4" /> Add Room</Button>
            </div>
          )}
          <div className="rounded-2xl border bg-card p-6">
            {rooms.length === 0 ? (
              <EmptyState title="No rooms" description={canManage ? "Add rooms to start." : "Rooms will appear here."} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead className="text-right">Capacity</TableHead>
                    <TableHead className="text-right">Occupancy</TableHead>
                    <TableHead>Status</TableHead>
                    {canManage && <TableHead className="w-24"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((r) => {
                    const occ = computedOccupancy.get(r.room_number) ?? 0;
                    const full = occ >= r.capacity;
                    return (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.room_number}</TableCell>
                        <TableCell className="text-muted-foreground">{r.block || "—"}</TableCell>
                        <TableCell className="text-right">{r.capacity}</TableCell>
                        <TableCell className="text-right">{occ}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={full ? "border-destructive/30 text-destructive" : "border-success/30 text-success"}>
                            {full ? "Full" : "Vacancy"}
                          </Badge>
                        </TableCell>
                        {canManage && (
                          <TableCell className="space-x-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditRoom(r)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteRoom(r)}><Trash2 className="h-4 w-4" /></Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="allocations" className="space-y-4">
          {canManage && (
            <div className="flex justify-end">
              <Button onClick={() => setAllocDialog(true)} className="gap-2"><Plus className="h-4 w-4" /> Allocate Student</Button>
            </div>
          )}
          <div className="rounded-2xl border bg-card p-6">
            {allocations.length === 0 ? (
              <EmptyState title="No allocations" description="Student room assignments will appear here." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Room</TableHead>
                    {canManage && <TableHead className="w-24"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocations.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{studentName(a.student_id)}</TableCell>
                      <TableCell className="font-medium">{a.room}</TableCell>
                      {canManage && (
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => unallocate(a)}>
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
      </Tabs>

      {/* Room dialog */}
      <Dialog open={roomDialog} onOpenChange={setRoomDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Room" : "Add Room"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Room Number</Label><Input value={roomForm.room_number} onChange={(e) => setRoomForm((f) => ({ ...f, room_number: e.target.value }))} placeholder="e.g. 101" /></div>
            <div><Label>Block</Label><Input value={roomForm.block} onChange={(e) => setRoomForm((f) => ({ ...f, block: e.target.value }))} placeholder="e.g. A" /></div>
            <div><Label>Capacity</Label><Input type="number" min={1} value={roomForm.capacity} onChange={(e) => setRoomForm((f) => ({ ...f, capacity: Math.max(1, parseInt(e.target.value || "1")) }))} /></div>
            <div><Label>Notes</Label><Input value={roomForm.notes} onChange={(e) => setRoomForm((f) => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoomDialog(false)}>Cancel</Button>
            <Button onClick={saveRoom}>{editing ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Allocate dialog */}
      <Dialog open={allocDialog} onOpenChange={setAllocDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Allocate Student</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Student</Label>
              <Select value={allocForm.student_id} onValueChange={(v) => setAllocForm((f) => ({ ...f, student_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>
                  {students.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Room</Label>
              <Select value={allocForm.room} onValueChange={(v) => setAllocForm((f) => ({ ...f, room: v }))}>
                <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
                <SelectContent>
                  {rooms.filter((r) => (computedOccupancy.get(r.room_number) ?? 0) < r.capacity).map((r) => (
                    <SelectItem key={r.id} value={r.room_number}>
                      {r.room_number} {r.block ? `(${r.block})` : ""} — {r.capacity - (computedOccupancy.get(r.room_number) ?? 0)} left
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAllocDialog(false)}>Cancel</Button>
            <Button onClick={allocate}>Allocate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
