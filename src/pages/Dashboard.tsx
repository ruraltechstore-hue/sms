import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap, Users, CreditCard, CalendarDays, TrendingUp,
  ClipboardCheck, BookOpen, UserCheck, Bus, Library as LibraryIcon,
  Home as HomeIcon, ShieldCheck, Megaphone, Award, FileCheck, ClipboardList,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/lib/types";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { supabase } from "@/integrations/supabase/client";

// ============================================================
// Shared chart helpers
// ============================================================
const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "12px",
  color: "hsl(var(--foreground))",
};
const anim = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

const PALETTE = {
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  destructive: "hsl(var(--destructive))",
  primary: "hsl(var(--primary))",
  accent: "hsl(var(--accent))",
  muted: "hsl(var(--muted-foreground))",
};

interface PieDatum { name: string; value: number; color: string; }

function PieCard({
  title, data, height = 240,
}: { title: string; data: PieDatum[]; height?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="rounded-2xl border bg-card p-6 glass">
      <h3 className="font-heading font-semibold mb-4">{title}</h3>
      {total === 0 ? (
        <EmptyState title="No data yet" description="Will appear once records exist." />
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              animationDuration={800}
            >
              {data.map((d) => <Cell key={d.name} fill={d.color} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function LineCard({
  title, data, dataKey, xKey, height = 220,
}: { title: string; data: any[]; dataKey: string; xKey: string; height?: number }) {
  return (
    <div className="rounded-2xl border bg-card p-6 glass">
      <h3 className="font-heading font-semibold mb-4">{title}</h3>
      {data.length === 0 ? (
        <EmptyState title="No data yet" description="Trend will appear here." />
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={xKey} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey={dataKey} stroke={PALETTE.primary} strokeWidth={2} dot={{ r: 4 }} animationDuration={800} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// ============================================================
// Data helpers — all queries are guarded by RLS, so each role
// only ever sees the rows it is allowed to see. We just count.
// ============================================================
async function countRows(table: string, filter?: Record<string, unknown>): Promise<number> {
  let q = supabase.from(table as any).select("*", { count: "exact", head: true });
  if (filter) for (const [k, v] of Object.entries(filter)) q = q.eq(k, v);
  const { count, error } = await q;
  if (error) return 0;
  return count ?? 0;
}

async function fetchAttendancePie(): Promise<PieDatum[]> {
  const { data, error } = await supabase.from("attendance").select("status");
  if (error || !data) return [];
  const buckets = { present: 0, absent: 0, leave: 0 };
  for (const r of data) {
    const s = String(r.status).toLowerCase();
    if (s === "present") buckets.present++;
    else if (s === "absent") buckets.absent++;
    else buckets.leave++;
  }
  return [
    { name: "Present", value: buckets.present, color: PALETTE.success },
    { name: "Absent",  value: buckets.absent,  color: PALETTE.destructive },
    { name: "Leave",   value: buckets.leave,   color: PALETTE.warning },
  ];
}

async function fetchFeesPie(): Promise<PieDatum[]> {
  const { data, error } = await supabase.from("fees").select("status, due_date");
  if (error || !data) return [];
  const today = new Date().toISOString().slice(0, 10);
  let paid = 0, pending = 0, overdue = 0;
  for (const r of data) {
    if (r.status === "paid") paid++;
    else if (r.due_date && r.due_date < today) overdue++;
    else pending++;
  }
  return [
    { name: "Paid",    value: paid,    color: PALETTE.success },
    { name: "Pending", value: pending, color: PALETTE.warning },
    { name: "Overdue", value: overdue, color: PALETTE.destructive },
  ];
}

async function fetchClassDistributionPie(): Promise<PieDatum[]> {
  const { data: classes } = await supabase.from("classes").select("id, name");
  const { data: students } = await supabase.from("students").select("class_id");
  if (!classes || !students) return [];
  const counts = new Map<string, number>();
  for (const s of students) counts.set(s.class_id ?? "unassigned", (counts.get(s.class_id ?? "unassigned") ?? 0) + 1);
  const colors = [PALETTE.primary, PALETTE.accent, PALETTE.success, PALETTE.warning, PALETTE.destructive, PALETTE.muted];
  return classes.map((c, i) => ({
    name: c.name,
    value: counts.get(c.id) ?? 0,
    color: colors[i % colors.length],
  }));
}

async function fetchGrowthLine(): Promise<{ month: string; students: number }[]> {
  const { data, error } = await supabase.from("students").select("admission_date");
  if (error || !data) return [];
  const by = new Map<string, number>();
  for (const s of data) {
    if (!s.admission_date) continue;
    const m = String(s.admission_date).slice(0, 7);
    by.set(m, (by.get(m) ?? 0) + 1);
  }
  const months = [...by.keys()].sort();
  let running = 0;
  return months.map((m) => {
    running += by.get(m)!;
    return { month: m.slice(5), students: running };
  });
}

// ============================================================
// 1. Principal — full analytics
// ============================================================
function PrincipalDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ students: 0, staff: 0, classes: 0, exams: 0 });
  const [attendance, setAttendance] = useState<PieDatum[]>([]);
  const [fees, setFees] = useState<PieDatum[]>([]);
  const [classDist, setClassDist] = useState<PieDatum[]>([]);
  const [growth, setGrowth] = useState<{ month: string; students: number }[]>([]);

  useEffect(() => {
    (async () => {
      const [students, teachers, classes, exams, a, f, cd, g] = await Promise.all([
        countRows("students"),
        countRows("teachers"),
        countRows("classes"),
        countRows("exams"),
        fetchAttendancePie(),
        fetchFeesPie(),
        fetchClassDistributionPie(),
        fetchGrowthLine(),
      ]);
      setStats({ students, staff: teachers, classes, exams });
      setAttendance(a); setFees(f); setClassDist(cd); setGrowth(g);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { title: "Total Students", value: String(stats.students), icon: GraduationCap, iconColor: "text-primary" },
          { title: "Total Staff",    value: String(stats.staff),    icon: Users,         iconColor: "text-accent" },
          { title: "Classes",        value: String(stats.classes),  icon: BookOpen,      iconColor: "text-success" },
          { title: "Exams",          value: String(stats.exams),    icon: ClipboardCheck,iconColor: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <PieCard title="Attendance Today"   data={attendance} />
        <PieCard title="Fee Collection"     data={fees} />
        <PieCard title="Class Distribution" data={classDist} />
      </div>

      <LineCard title="Enrollment Growth" data={growth} dataKey="students" xKey="month" />
    </div>
  );
}

// ============================================================
// 2. SMS Admin — system stats + user distribution
// ============================================================
function SmsAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, classes: 0, students: 0, teachers: 0 });
  const [userDist, setUserDist] = useState<PieDatum[]>([]);
  const [growth, setGrowth] = useState<{ month: string; students: number }[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: roles }, classes, students, teachers, g] = await Promise.all([
        supabase.from("user_roles").select("role"),
        countRows("classes"),
        countRows("students"),
        countRows("teachers"),
        fetchGrowthLine(),
      ]);
      const counts = new Map<string, number>();
      for (const r of roles ?? []) counts.set(r.role, (counts.get(r.role) ?? 0) + 1);
      const colors = [PALETTE.primary, PALETTE.accent, PALETTE.success, PALETTE.warning, PALETTE.destructive, PALETTE.muted];
      const dist: PieDatum[] = [...counts.entries()].map(([name, value], i) => ({
        name: name.replace("_", " "),
        value,
        color: colors[i % colors.length],
      }));
      setUserDist(dist);
      setStats({ users: (roles?.length ?? 0), classes, students, teachers });
      setGrowth(g);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { title: "System Users", value: String(stats.users),    icon: ShieldCheck,   iconColor: "text-primary" },
          { title: "Classes",      value: String(stats.classes),  icon: BookOpen,      iconColor: "text-accent" },
          { title: "Students",     value: String(stats.students), icon: GraduationCap, iconColor: "text-success" },
          { title: "Teachers",     value: String(stats.teachers), icon: Users,         iconColor: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <PieCard title="User Role Distribution" data={userDist} />
        <LineCard title="Student Growth" data={growth} dataKey="students" xKey="month" />
      </div>
    </div>
  );
}

// ============================================================
// 3. Front Desk — admissions desk
// ============================================================
function FrontDeskDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ admissionsToday: 0, totalStudents: 0, thisMonth: 0 });
  const [growth, setGrowth] = useState<{ month: string; students: number }[]>([]);

  useEffect(() => {
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const monthStart = today.slice(0, 7) + "-01";
      const [total, { count: todayN }, { count: monthN }, g] = await Promise.all([
        countRows("students"),
        supabase.from("students").select("*", { count: "exact", head: true }).gte("admission_date", today),
        supabase.from("students").select("*", { count: "exact", head: true }).gte("admission_date", monthStart),
        fetchGrowthLine(),
      ]);
      setStats({ admissionsToday: todayN ?? 0, totalStudents: total, thisMonth: monthN ?? 0 });
      setGrowth(g);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Admissions Today", value: String(stats.admissionsToday), icon: UserCheck,    iconColor: "text-success" },
          { title: "This Month",       value: String(stats.thisMonth),       icon: CalendarDays, iconColor: "text-primary" },
          { title: "Total Students",   value: String(stats.totalStudents),   icon: GraduationCap,iconColor: "text-accent" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>
      <LineCard title="Admission Growth" data={growth} dataKey="students" xKey="month" />
    </div>
  );
}

// ============================================================
// 4. Teacher — class data, subject performance
// ============================================================
function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ classes: 0, students: 0, exams: 0 });
  const [attendance, setAttendance] = useState<PieDatum[]>([]);

  useEffect(() => {
    (async () => {
      const [classes, students, exams, a] = await Promise.all([
        countRows("classes"),
        countRows("students"),
        countRows("exams"),
        fetchAttendancePie(),
      ]);
      setStats({ classes, students, exams });
      setAttendance(a);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "My Classes",  value: String(stats.classes),  icon: BookOpen,       iconColor: "text-primary" },
          { title: "My Students", value: String(stats.students), icon: GraduationCap,  iconColor: "text-accent" },
          { title: "Exams",       value: String(stats.exams),    icon: ClipboardCheck, iconColor: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>
      <PieCard title="Class Attendance" data={attendance} />
    </div>
  );
}

// ============================================================
// 5. Class Teacher — full class overview
// ============================================================
function ClassTeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ students: 0, present: 0, absent: 0, pendingAssignments: 0 });
  const [attendance, setAttendance] = useState<PieDatum[]>([]);
  const [classDist, setClassDist] = useState<PieDatum[]>([]);
  const [submissionPie, setSubmissionPie] = useState<PieDatum[]>([]);

  useEffect(() => {
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [students, a, cd, { data: assignments }, { data: subs }] = await Promise.all([
        countRows("students"),
        fetchAttendancePie(),
        fetchClassDistributionPie(),
        supabase.from("assignments").select("id, due_date"),
        supabase.from("assignment_submissions").select("status"),
      ]);
      const present = a.find((d) => d.name === "Present")?.value ?? 0;
      const absent  = a.find((d) => d.name === "Absent")?.value ?? 0;
      const pendingAssignments = (assignments ?? []).filter((x: any) => !x.due_date || x.due_date >= today).length;
      const buckets: Record<string, number> = { pending: 0, submitted: 0, late: 0, graded: 0 };
      for (const s of subs ?? []) buckets[(s as any).status] = (buckets[(s as any).status] ?? 0) + 1;
      setSubmissionPie([
        { name: "Pending",   value: buckets.pending,   color: PALETTE.warning },
        { name: "Submitted", value: buckets.submitted, color: PALETTE.primary },
        { name: "Late",      value: buckets.late,      color: PALETTE.destructive },
        { name: "Graded",    value: buckets.graded,    color: PALETTE.success },
      ]);
      setStats({ students, present, absent, pendingAssignments });
      setAttendance(a);
      setClassDist(cd);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { title: "Class Strength", value: String(stats.students),           icon: Users,         iconColor: "text-primary" },
          { title: "Present Today",  value: String(stats.present),            icon: UserCheck,     iconColor: "text-success" },
          { title: "Absent Today",   value: String(stats.absent),             icon: CalendarDays,  iconColor: "text-destructive" },
          { title: "Pending Work",   value: String(stats.pendingAssignments), icon: ClipboardList, iconColor: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <PieCard title="Class Attendance"   data={attendance} />
        <PieCard title="Class Distribution" data={classDist} />
        <PieCard title="Submission Status"  data={submissionPie} />
      </div>
    </div>
  );
}

// ============================================================
// 6. Exam Coordinator — exam stats + result analytics
// ============================================================
function ExamCoordinatorDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, draft: 0, scheduled: 0, completed: 0 });
  const [statusPie, setStatusPie] = useState<PieDatum[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("exams").select("status");
      const counts = { draft: 0, scheduled: 0, completed: 0, ongoing: 0 } as Record<string, number>;
      for (const e of data ?? []) counts[e.status] = (counts[e.status] ?? 0) + 1;
      setStats({
        total: data?.length ?? 0,
        draft: counts.draft ?? 0,
        scheduled: counts.scheduled ?? 0,
        completed: counts.completed ?? 0,
      });
      setStatusPie([
        { name: "Draft",     value: counts.draft ?? 0,     color: PALETTE.muted },
        { name: "Scheduled", value: counts.scheduled ?? 0, color: PALETTE.primary },
        { name: "Ongoing",   value: counts.ongoing ?? 0,   color: PALETTE.warning },
        { name: "Completed", value: counts.completed ?? 0, color: PALETTE.success },
      ]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { title: "Total Exams", value: String(stats.total),     icon: ClipboardCheck, iconColor: "text-primary" },
          { title: "Scheduled",   value: String(stats.scheduled), icon: CalendarDays,   iconColor: "text-accent" },
          { title: "Completed",   value: String(stats.completed), icon: FileCheck,      iconColor: "text-success" },
          { title: "Drafts",      value: String(stats.draft),     icon: ClipboardCheck, iconColor: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>
      <PieCard title="Exam Status Distribution" data={statusPie} />
    </div>
  );
}

// ============================================================
// 7. Transport Manager — route stats
// ============================================================
function TransportDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ assignments: 0, routes: 0, vehicles: 0 });
  const [routePie, setRoutePie] = useState<PieDatum[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("transport").select("route, vehicle");
      const routes = new Map<string, number>();
      const vehicles = new Set<string>();
      for (const t of data ?? []) {
        routes.set(t.route, (routes.get(t.route) ?? 0) + 1);
        vehicles.add(t.vehicle);
      }
      const colors = [PALETTE.primary, PALETTE.accent, PALETTE.success, PALETTE.warning, PALETTE.destructive];
      setRoutePie([...routes.entries()].map(([name, value], i) => ({
        name, value, color: colors[i % colors.length],
      })));
      setStats({ assignments: data?.length ?? 0, routes: routes.size, vehicles: vehicles.size });
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Students on Transport", value: String(stats.assignments), icon: GraduationCap, iconColor: "text-primary" },
          { title: "Active Routes",         value: String(stats.routes),      icon: Bus,           iconColor: "text-accent" },
          { title: "Vehicles",              value: String(stats.vehicles),    icon: Bus,           iconColor: "text-success" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>
      <PieCard title="Student Distribution by Route" data={routePie} />
    </div>
  );
}

// ============================================================
// 8. Librarian — book stats (NO fees access)
// ============================================================
function LibrarianDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ titles: 0, issued: 0, available: 0, overdue: 0, fines: 0 });
  const [pie, setPie] = useState<PieDatum[]>([]);

  useEffect(() => {
    (async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [{ data: books }, { data: issues }] = await Promise.all([
        supabase.from("books").select("total_copies, available_copies"),
        supabase.from("book_issues").select("status, due_date, fine"),
      ]);
      const totalCopies = (books ?? []).reduce((s, b: any) => s + Number(b.total_copies), 0);
      const available  = (books ?? []).reduce((s, b: any) => s + Number(b.available_copies), 0);
      const issued     = totalCopies - available;
      const overdue    = (issues ?? []).filter((i: any) => i.status !== "returned" && i.due_date && i.due_date < today).length;
      const fines      = (issues ?? []).reduce((s, i: any) => s + Number(i.fine || 0), 0);
      setStats({ titles: books?.length ?? 0, issued, available, overdue, fines });
      setPie([
        { name: "Issued",    value: issued,    color: PALETTE.primary },
        { name: "Available", value: available, color: PALETTE.success },
      ]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { title: "Titles",       value: String(stats.titles),    icon: LibraryIcon, iconColor: "text-primary" },
          { title: "Books Issued", value: String(stats.issued),    icon: BookOpen,    iconColor: "text-accent" },
          { title: "Overdue",      value: String(stats.overdue),   icon: TrendingUp,  iconColor: "text-destructive" },
          { title: "Total Fines",  value: `₹${stats.fines}`,       icon: TrendingUp,  iconColor: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>
      <PieCard title="Books Issued vs Available" data={pie} />
    </div>
  );
}

// ============================================================
// 9. Hostel Warden — hostel stats
// ============================================================
function HostelDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ rooms: 0, capacity: 0, occupied: 0, available: 0 });
  const [pie, setPie] = useState<PieDatum[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: rooms }, { data: alloc }] = await Promise.all([
        supabase.from("hostel_rooms").select("capacity"),
        supabase.from("hostel").select("room"),
      ]);
      const capacity = (rooms ?? []).reduce((s, r: any) => s + Number(r.capacity), 0);
      const occupied = alloc?.length ?? 0;
      const available = Math.max(0, capacity - occupied);
      setStats({ rooms: rooms?.length ?? 0, capacity, occupied, available });
      setPie([
        { name: "Occupied",  value: occupied,  color: PALETTE.primary },
        { name: "Available", value: available, color: PALETTE.success },
      ]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { title: "Rooms",     value: String(stats.rooms),     icon: HomeIcon,      iconColor: "text-primary" },
          { title: "Capacity",  value: String(stats.capacity),  icon: Users,         iconColor: "text-accent" },
          { title: "Occupied",  value: String(stats.occupied),  icon: GraduationCap, iconColor: "text-warning" },
          { title: "Vacant",    value: String(stats.available), icon: HomeIcon,      iconColor: "text-success" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>
      <PieCard title="Room Occupancy" data={pie} />
    </div>
  );
}

// ============================================================
// 10. Student — own data (READ-ONLY)
// ============================================================
function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ attendanceRate: 0, avgScore: 0, pendingFees: 0, exams: 0 });
  const [attendance, setAttendance] = useState<PieDatum[]>([]);
  const [fees, setFees] = useState<PieDatum[]>([]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data: studentRow } = await supabase.from("students").select("id").eq("user_id", user.id).maybeSingle();
      const sid = studentRow?.id;
      if (!sid) { setLoading(false); return; }

      const [{ data: att }, { data: marks }, { data: feeRows }, examCount] = await Promise.all([
        supabase.from("attendance").select("status").eq("student_id", sid),
        supabase.from("marks").select("score, max_score").eq("student_id", sid),
        supabase.from("fees").select("amount, paid_amount, status, due_date").eq("student_id", sid),
        countRows("exams"),
      ]);

      const present = (att ?? []).filter((a) => a.status === "present").length;
      const absent  = (att ?? []).filter((a) => a.status === "absent").length;
      const leave   = (att ?? []).filter((a) => !["present","absent"].includes(a.status)).length;
      const total   = (att?.length ?? 0) || 1;
      const rate    = Math.round((present / total) * 100);

      const totalMax   = (marks ?? []).reduce((s, m) => s + Number(m.max_score), 0) || 1;
      const totalScore = (marks ?? []).reduce((s, m) => s + Number(m.score), 0);
      const avgPct     = Math.round((totalScore / totalMax) * 100);

      const pending = (feeRows ?? []).reduce(
        (s, f) => s + Math.max(0, Number(f.amount) - Number(f.paid_amount)),
        0
      );
      const today = new Date().toISOString().slice(0, 10);
      let paid = 0, pend = 0, over = 0;
      for (const f of feeRows ?? []) {
        if (f.status === "paid") paid++;
        else if (f.due_date && f.due_date < today) over++;
        else pend++;
      }

      setStats({ attendanceRate: rate, avgScore: avgPct, pendingFees: pending, exams: examCount });
      setAttendance([
        { name: "Present", value: present, color: PALETTE.success },
        { name: "Absent",  value: absent,  color: PALETTE.destructive },
        { name: "Leave",   value: leave,   color: PALETTE.warning },
      ]);
      setFees([
        { name: "Paid",    value: paid, color: PALETTE.success },
        { name: "Pending", value: pend, color: PALETTE.warning },
        { name: "Overdue", value: over, color: PALETTE.destructive },
      ]);
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { title: "Attendance",     value: `${stats.attendanceRate}%`,           icon: CalendarDays,  iconColor: "text-success" },
          { title: "Avg Score",      value: `${stats.avgScore}%`,                 icon: TrendingUp,    iconColor: "text-primary" },
          { title: "Pending Fees",   value: `₹${stats.pendingFees.toLocaleString("en-IN")}`, icon: CreditCard,    iconColor: "text-warning" },
          { title: "Upcoming Exams", value: String(stats.exams),                  icon: ClipboardCheck,iconColor: "text-accent" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <PieCard title="My Attendance" data={attendance} />
        <PieCard title="My Fees"       data={fees} />
      </div>
    </div>
  );
}

// ============================================================
// 11. Parent — child data (READ-ONLY)
// ============================================================
function ParentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ children: 0, avgAttendance: 0, pendingFees: 0 });
  const [attendance, setAttendance] = useState<PieDatum[]>([]);
  const [fees, setFees] = useState<PieDatum[]>([]);

  useEffect(() => {
    (async () => {
      if (!user) return;
      const { data: parentRow } = await supabase.from("parents").select("id").eq("user_id", user.id).maybeSingle();
      const pid = parentRow?.id;
      if (!pid) { setLoading(false); return; }

      const { data: kids } = await supabase.from("students").select("id").eq("parent_id", pid);
      const kidIds = (kids ?? []).map((k) => k.id);
      if (kidIds.length === 0) { setStats({ children: 0, avgAttendance: 0, pendingFees: 0 }); setLoading(false); return; }

      const [{ data: att }, { data: feeRows }] = await Promise.all([
        supabase.from("attendance").select("status").in("student_id", kidIds),
        supabase.from("fees").select("amount, paid_amount, status, due_date").in("student_id", kidIds),
      ]);

      const present = (att ?? []).filter((a) => a.status === "present").length;
      const absent  = (att ?? []).filter((a) => a.status === "absent").length;
      const leave   = (att ?? []).filter((a) => !["present","absent"].includes(a.status)).length;
      const total   = (att?.length ?? 0) || 1;
      const rate    = Math.round((present / total) * 100);
      const pending = (feeRows ?? []).reduce(
        (s, f) => s + Math.max(0, Number(f.amount) - Number(f.paid_amount)),
        0
      );
      const today = new Date().toISOString().slice(0, 10);
      let paid = 0, pend = 0, over = 0;
      for (const f of feeRows ?? []) {
        if (f.status === "paid") paid++;
        else if (f.due_date && f.due_date < today) over++;
        else pend++;
      }

      setStats({ children: kidIds.length, avgAttendance: rate, pendingFees: pending });
      setAttendance([
        { name: "Present", value: present, color: PALETTE.success },
        { name: "Absent",  value: absent,  color: PALETTE.destructive },
        { name: "Leave",   value: leave,   color: PALETTE.warning },
      ]);
      setFees([
        { name: "Paid",    value: paid, color: PALETTE.success },
        { name: "Pending", value: pend, color: PALETTE.warning },
        { name: "Overdue", value: over, color: PALETTE.destructive },
      ]);
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Children",         value: String(stats.children),           icon: Users,        iconColor: "text-primary" },
          { title: "Avg Attendance",   value: `${stats.avgAttendance}%`,        icon: CalendarDays, iconColor: "text-success" },
          { title: "Pending Fees",     value: `₹${stats.pendingFees.toLocaleString("en-IN")}`, icon: CreditCard,   iconColor: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <PieCard title="Child Attendance" data={attendance} />
        <PieCard title="Fee Status"       data={fees} />
      </div>
    </div>
  );
}

// ============================================================
// Dispatcher
// ============================================================
const DASHBOARDS: Record<UserRole, () => JSX.Element> = {
  principal:         PrincipalDashboard,
  sms_admin:         SmsAdminDashboard,
  front_desk:        FrontDeskDashboard,
  teacher:           TeacherDashboard,
  class_teacher:     ClassTeacherDashboard,
  exam_coordinator:  ExamCoordinatorDashboard,
  transport_manager: TransportDashboard,
  librarian:         LibrarianDashboard,
  hostel_warden:     HostelDashboard,
  student:           StudentDashboard,
  parent:            ParentDashboard,
};

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  const C = DASHBOARDS[user.role];
  return <C />;
}
