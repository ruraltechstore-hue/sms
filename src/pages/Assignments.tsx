import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Plus, CheckCircle2, Clock, AlertCircle, Trash2, Paperclip, FileText, Image as ImageIcon, Video, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/lib/auth-context";
import { isReadOnlyRole } from "@/lib/rbac";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, Tooltip as RTooltip, Legend, ResponsiveContainer } from "recharts";

type Kind = "assignment" | "homework" | "task";

interface Assignment {
  id: string;
  class_id: string;
  teacher_id: string | null;
  title: string;
  description: string | null;
  subject: string | null;
  kind: Kind;
  due_date: string | null;
  created_at: string;
  attachment_url: string | null;
  attachment_type: string | null;
  attachment_name: string | null;
}

interface ClassRow { id: string; name: string; section: string | null }

interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  status: "pending" | "submitted" | "late" | "graded";
}

const KIND_BADGE: Record<Kind, string> = {
  assignment: "bg-primary/15 text-primary border-primary/30",
  homework:   "bg-accent/15 text-accent border-accent/30",
  task:       "bg-success/15 text-success border-success/30",
};

const STATUS_COLORS: Record<string, string> = {
  pending:   "hsl(var(--warning))",
  submitted: "hsl(var(--primary))",
  late:      "hsl(var(--destructive))",
  graded:    "hsl(var(--success))",
};

export default function Assignments() {
  const { user } = useAuth();
  const readOnly = user ? isReadOnlyRole(user.role) : true;
  const canCreate = !!user && (user.role === "class_teacher" || user.role === "teacher" || user.role === "principal" || user.role === "sms_admin");

  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", subject: "", class_id: "", kind: "assignment" as Kind, due_date: "",
  });

  const load = async () => {
    setLoading(true);
    const [{ data: a }, { data: c }, { data: s }] = await Promise.all([
      supabase.from("assignments").select("*").order("due_date", { ascending: true, nullsFirst: false }),
      supabase.from("classes").select("id, name, section"),
      supabase.from("assignment_submissions").select("id, assignment_id, student_id, status"),
    ]);
    setAssignments((a ?? []) as Assignment[]);
    setClasses((c ?? []) as ClassRow[]);
    setSubmissions((s ?? []) as Submission[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const className = (id: string) => {
    const c = classes.find((x) => x.id === id);
    return c ? `${c.name}${c.section ? "-" + c.section : ""}` : "—";
  };

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const pending = assignments.filter((a) => !a.due_date || a.due_date >= today).length;
    const overdue = assignments.filter((a) => a.due_date && a.due_date < today).length;
    const submitted = submissions.filter((s) => s.status !== "pending").length;
    return { total: assignments.length, pending, overdue, submitted };
  }, [assignments, submissions]);

  const submissionPie = useMemo(() => {
    const buckets: Record<string, number> = { pending: 0, submitted: 0, late: 0, graded: 0 };
    for (const s of submissions) buckets[s.status] = (buckets[s.status] ?? 0) + 1;
    return Object.entries(buckets).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: STATUS_COLORS[name],
    }));
  }, [submissions]);

  const handleCreate = async () => {
    if (!form.title || !form.class_id) {
      toast({ title: "Missing fields", description: "Title and class are required.", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("assignments").insert({
      title: form.title,
      description: form.description || null,
      subject: form.subject || null,
      class_id: form.class_id,
      kind: form.kind,
      due_date: form.due_date || null,
    });
    if (error) {
      toast({ title: "Failed to create", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Created", description: `${form.kind} added.` });
    setOpen(false);
    setForm({ title: "", description: "", subject: "", class_id: "", kind: "assignment", due_date: "" });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this assignment?")) return;
    const { error } = await supabase.from("assignments").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Deleted" });
    load();
  };

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading font-bold">Assignments &amp; Homework</h2>
          <p className="text-muted-foreground">
            {readOnly ? "View your class assignments, homework and tasks." : "Create and track assignments, homework and tasks."}
          </p>
        </div>

        {canCreate && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" /> New</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>Create Assignment / Homework / Task</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Type</Label>
                  <Select value={form.kind} onValueChange={(v) => setForm((f) => ({ ...f, kind: v as Kind }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="homework">Homework</SelectItem>
                      <SelectItem value="task">Task</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Algebra worksheet" />
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder="Mathematics" />
                </div>
                <div>
                  <Label>Class</Label>
                  <Select value={form.class_id} onValueChange={(v) => setForm((f) => ({ ...f, class_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}{c.section ? `-${c.section}` : ""}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input type="date" value={form.due_date} onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { title: "Total",     value: String(stats.total),     icon: ClipboardList, iconColor: "text-primary" },
          { title: "Pending",   value: String(stats.pending),   icon: Clock,         iconColor: "text-warning" },
          { title: "Overdue",   value: String(stats.overdue),   icon: AlertCircle,   iconColor: "text-destructive" },
          { title: "Submitted", value: String(stats.submitted), icon: CheckCircle2,  iconColor: "text-success" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {!readOnly && (
        <div className="rounded-2xl border bg-card p-6 glass">
          <h3 className="font-heading font-semibold mb-4">Submission Status</h3>
          {submissions.length === 0 ? (
            <EmptyState title="No submissions yet" description="Submission status will appear once recorded." />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={submissionPie} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {submissionPie.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <RTooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      <div className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">All Items</h3>
        {assignments.length === 0 ? (
          <EmptyState title="No assignments yet" description={readOnly ? "Your teachers haven't posted anything yet." : "Click New to create one."} />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Due</TableHead>
                {!readOnly && <TableHead className="w-12"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <Badge variant="outline" className={KIND_BADGE[a.kind]}>{a.kind}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell className="text-muted-foreground">{a.subject || "—"}</TableCell>
                  <TableCell>{className(a.class_id)}</TableCell>
                  <TableCell className="text-muted-foreground">{a.due_date || "—"}</TableCell>
                  {!readOnly && (
                    <TableCell>
                      {(user?.role === "class_teacher" || user?.role === "principal" || user?.role === "sms_admin") && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
