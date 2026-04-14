import { motion } from "framer-motion";
import {
  GraduationCap, Users, CreditCard, CalendarDays, TrendingUp, AlertCircle,
  ClipboardCheck, Award, BookOpen, UserCheck, Clock, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { useAuth, UserRole } from "@/lib/auth-context";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend, CartesianGrid,
} from "recharts";
import { MOCK_STUDENTS } from "@/lib/mock-students";
import { MONTHLY_COLLECTIONS, FEE_PAYMENTS, CLASS_WISE_DUES } from "@/lib/mock-fees";
import { CLASS_STATS } from "@/lib/mock-attendance";
import { MOCK_STAFF, LEAVE_RECORDS } from "@/lib/mock-staff";
import { CLASS_PERFORMANCE, EXAMS } from "@/lib/mock-exams";

// Derived data
const activeStudents = MOCK_STUDENTS.filter((s) => s.status === "active").length;
const totalStaff = MOCK_STAFF.length;
const onLeaveToday = LEAVE_RECORDS.filter((l) => l.status === "approved").length;
const pendingLeaves = LEAVE_RECORDS.filter((l) => l.status === "pending").length;
const upcomingExams = EXAMS.filter((e) => e.status === "upcoming" || e.status === "scheduled").length;
const paidStudents = FEE_PAYMENTS.filter((f) => f.status === "paid").length;
const overdueCount = FEE_PAYMENTS.filter((f) => f.status === "overdue").length;
const totalCollected = MONTHLY_COLLECTIONS.reduce((a, m) => a + m.collected, 0);
const totalPending = MONTHLY_COLLECTIONS.reduce((a, m) => a + m.pending, 0);
const collectionRate = Math.round((totalCollected / (totalCollected + totalPending)) * 100);
const avgAttendance = Math.round(CLASS_STATS.reduce((a, c) => a + c.present, 0) / CLASS_STATS.length * 10) / 10;

const enrollmentData = [
  { month: "Aug", students: 2680 }, { month: "Sep", students: 2710 }, { month: "Oct", students: 2745 },
  { month: "Nov", students: 2780 }, { month: "Dec", students: 2810 }, { month: "Jan", students: 2847 },
];

const feeChartData = MONTHLY_COLLECTIONS.map((m) => ({
  month: m.month,
  collected: Math.round(m.collected / 100000),
  pending: Math.round(m.pending / 100000),
}));

const attendanceTrend = [
  { week: "W1", rate: 94.2 }, { week: "W2", rate: 95.8 }, { week: "W3", rate: 93.1 },
  { week: "W4", rate: 96.4 }, { week: "W5", rate: 95.0 }, { week: "W6", rate: 96.8 },
];

const attendancePie = [
  { name: "Present", value: 87, color: "hsl(var(--success))" },
  { name: "Absent", value: 8, color: "hsl(var(--destructive))" },
  { name: "Late", value: 5, color: "hsl(var(--warning))" },
];

const classPerformanceData = CLASS_PERFORMANCE.map((c) => ({
  class: `Cl ${c.class}`,
  avg: c.avgPercentage,
  pass: c.passPercentage,
}));

const duesData = CLASS_WISE_DUES.map((d) => ({
  class: `Cl ${d.class}`,
  collected: Math.round(d.collected / 1000),
  pending: Math.round(d.pending / 1000),
}));

const feeStatusPie = [
  { name: "Paid", value: paidStudents, color: "hsl(var(--success))" },
  { name: "Partial", value: FEE_PAYMENTS.filter((f) => f.status === "partial").length, color: "hsl(var(--warning))" },
  { name: "Overdue", value: overdueCount, color: "hsl(var(--destructive))" },
  { name: "Pending", value: FEE_PAYMENTS.filter((f) => f.status === "pending").length, color: "hsl(var(--muted-foreground))" },
];

const tooltipStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" };

const anim = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Students", value: `${MOCK_STUDENTS.length}`, change: "+12%", changeType: "positive" as const, icon: GraduationCap, iconColor: "text-primary" },
          { title: "Total Staff", value: `${totalStaff}`, change: `${onLeaveToday} on leave`, changeType: "neutral" as const, icon: Users, iconColor: "text-accent" },
          { title: "Fee Collection", value: `${collectionRate}%`, change: "+8%", changeType: "positive" as const, icon: CreditCard, iconColor: "text-success" },
          { title: "Attendance Rate", value: `${avgAttendance}%`, change: "-0.3%", changeType: "negative" as const, icon: CalendarDays, iconColor: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: "Active Students", value: activeStudents, icon: UserCheck, color: "text-success" },
          { label: "Upcoming Exams", value: upcomingExams, icon: ClipboardCheck, color: "text-primary" },
          { label: "Overdue Fees", value: overdueCount, icon: AlertCircle, color: "text-destructive" },
          { label: "Pending Leaves", value: pendingLeaves, icon: Clock, color: "text-warning" },
          { label: "Departments", value: 12, icon: BookOpen, color: "text-accent" },
          { label: "Avg CGPA", value: "8.2", icon: Award, color: "text-primary" },
        ].map((item, i) => (
          <motion.div key={item.label} {...anim} transition={{ delay: 0.4 + i * 0.05 }} className="rounded-xl border bg-card p-3 text-center">
            <item.icon className={`h-4 w-4 mx-auto mb-1 ${item.color}`} />
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="font-bold text-lg">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...anim} transition={{ delay: 0.5 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Enrollment Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={enrollmentData}>
              <defs>
                <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} className="text-xs" domain={["dataMin - 50", "dataMax + 50"]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="students" stroke="hsl(var(--primary))" fill="url(#enrollGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...anim} transition={{ delay: 0.55 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Fee Collection (₹ Lakhs)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={feeChartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} className="text-xs" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="collected" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Collected" />
              <Bar dataKey="pending" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div {...anim} transition={{ delay: 0.6 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Today's Attendance</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={attendancePie} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                {attendancePie.map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-1">
            {attendancePie.map((e) => (
              <div key={e.name} className="flex items-center gap-1.5 text-xs">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: e.color }} />
                {e.name} ({e.value}%)
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...anim} transition={{ delay: 0.65 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Fee Status Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={feeStatusPie} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value"
                label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}>
                {feeStatusPie.map((e) => <Cell key={e.name} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...anim} transition={{ delay: 0.7 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Weekly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis domain={[90, 100]} axisLine={false} tickLine={false} className="text-xs" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} name="Rate %" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...anim} transition={{ delay: 0.75 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Class-wise Exam Performance</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={classPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="class" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} className="text-xs" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="avg" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Avg %" />
              <Bar dataKey="pass" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Pass %" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...anim} transition={{ delay: 0.8 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Class-wise Fee Dues (₹K)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={duesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="class" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} className="text-xs" />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="collected" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Collected" stackId="a" />
              <Bar dataKey="pending" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Pending" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Alerts & Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div {...anim} transition={{ delay: 0.85 }} className="rounded-2xl border bg-card p-6 lg:col-span-2">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" /> Recent Alerts & Activity
          </h3>
          <div className="space-y-2">
            {[
              { text: `${overdueCount} students have overdue fee payments`, icon: CreditCard, type: "destructive" },
              { text: `${pendingLeaves} staff leave requests pending approval`, icon: Clock, type: "warning" },
              { text: `${upcomingExams} exams scheduled — Mid-Term & Pre-Board`, icon: ClipboardCheck, type: "primary" },
              { text: `Attendance dropped to ${avgAttendance}% this week`, icon: CalendarDays, type: "warning" },
              { text: `${activeStudents} active students across all classes`, icon: UserCheck, type: "primary" },
              { text: "PTM scheduled for 20th Jan — 142 slots booked", icon: Users, type: "primary" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
                <a.icon className={`h-4 w-4 mt-0.5 shrink-0 ${a.type === "destructive" ? "text-destructive" : a.type === "warning" ? "text-warning" : "text-primary"}`} />
                <p className="text-sm">{a.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...anim} transition={{ delay: 0.9 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Class Toppers</h3>
          <div className="space-y-3">
            {CLASS_PERFORMANCE.slice(0, 6).map((cp) => (
              <div key={cp.class} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-warning" />
                  <div>
                    <p className="text-sm font-medium">{cp.topperName}</p>
                    <p className="text-[10px] text-muted-foreground">Class {cp.class}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-primary">{cp.topperScore}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "My Classes", value: "6", icon: Users, iconColor: "text-primary" },
          { title: "Total Students", value: "248", icon: GraduationCap, iconColor: "text-accent" },
          { title: "Today's Periods", value: "5", icon: CalendarDays, iconColor: "text-success" },
          { title: "Pending Marks", value: "2", icon: ClipboardCheck, iconColor: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...anim} transition={{ delay: 0.3 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {[
              { time: "8:00 AM", class: "Class 10-A", subject: "Mathematics" },
              { time: "9:00 AM", class: "Class 9-B", subject: "Mathematics" },
              { time: "10:00 AM", class: "Class 11-A", subject: "Statistics" },
              { time: "11:30 AM", class: "Class 10-C", subject: "Mathematics" },
              { time: "1:00 PM", class: "Class 12-A", subject: "Calculus" },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                <span className="text-sm font-mono text-muted-foreground w-20">{p.time}</span>
                <div className="h-8 w-0.5 bg-primary rounded-full" />
                <div>
                  <p className="font-medium text-sm">{p.class}</p>
                  <p className="text-xs text-muted-foreground">{p.subject}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...anim} transition={{ delay: 0.4 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Class Attendance Today</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={classPerformanceData.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="class" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} className="text-xs" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="pass" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Attendance", value: "94.2%", change: "+1.2%", changeType: "positive" as const, icon: CalendarDays, iconColor: "text-success" },
          { title: "CGPA", value: "8.7", icon: TrendingUp, iconColor: "text-primary" },
          { title: "Pending Fees", value: "₹12,500", icon: CreditCard, iconColor: "text-warning" },
          { title: "Upcoming Exams", value: String(upcomingExams), icon: ClipboardCheck, iconColor: "text-accent" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...anim} transition={{ delay: 0.3 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">My Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis domain={[85, 100]} axisLine={false} tickLine={false} className="text-xs" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...anim} transition={{ delay: 0.4 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Upcoming Exams</h3>
          <div className="space-y-3">
            {EXAMS.filter((e) => e.status !== "completed").map((exam) => (
              <div key={exam.id} className="p-3 rounded-xl bg-secondary/50 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{exam.name}</p>
                  <p className="text-xs text-muted-foreground">{exam.startDate} → {exam.endDate}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${exam.status === "ongoing" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                  {exam.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ParentDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Children", value: "2", icon: Users, iconColor: "text-primary" },
          { title: "Avg Attendance", value: "92%", change: "+1.5%", changeType: "positive" as const, icon: CalendarDays, iconColor: "text-success" },
          { title: "Due Fees", value: "₹25,000", icon: CreditCard, iconColor: "text-warning" },
          { title: "Upcoming PTM", value: "Jan 20", icon: CalendarDays, iconColor: "text-accent" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...anim} transition={{ delay: 0.3 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Children's Attendance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[{ name: "Arjun", attendance: 94.2 }, { name: "Kavya", attendance: 90.5 }]}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis domain={[80, 100]} axisLine={false} tickLine={false} className="text-xs" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="attendance" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...anim} transition={{ delay: 0.4 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" /> Recent Notices
          </h3>
          <div className="space-y-2">
            {[
              { text: "PTM scheduled for January 20 — please confirm attendance", type: "primary" },
              { text: "Kavya's transport fee (₹3,000) is overdue", type: "destructive" },
              { text: "Annual Day rehearsals start January 25", type: "primary" },
              { text: "Mid-Term exams from Feb 10-20", type: "warning" },
            ].map((n, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
                <AlertCircle className={`h-4 w-4 mt-0.5 shrink-0 ${n.type === "destructive" ? "text-destructive" : n.type === "warning" ? "text-warning" : "text-primary"}`} />
                <p className="text-sm">{n.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;

  const dashboards: Record<UserRole, JSX.Element> = {
    admin: <AdminDashboard />,
    teacher: <TeacherDashboard />,
    student: <StudentDashboard />,
    parent: <ParentDashboard />,
  };

  return dashboards[user.role];
}
