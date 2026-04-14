import { motion } from "framer-motion";
import { GraduationCap, Users, CreditCard, CalendarDays, TrendingUp, AlertCircle, ClipboardCheck } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { useAuth, UserRole } from "@/lib/auth-context";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const enrollmentData = [
  { month: "Jan", students: 2400 }, { month: "Feb", students: 2500 }, { month: "Mar", students: 2600 },
  { month: "Apr", students: 2650 }, { month: "May", students: 2700 }, { month: "Jun", students: 2847 },
];

const feeData = [
  { month: "Jan", collected: 18, pending: 4 }, { month: "Feb", collected: 20, pending: 3 },
  { month: "Mar", collected: 22, pending: 5 }, { month: "Apr", collected: 21, pending: 4 },
  { month: "May", collected: 23, pending: 3 }, { month: "Jun", collected: 24.5, pending: 2.5 },
];

const attendancePie = [
  { name: "Present", value: 87, color: "hsl(142, 71%, 45%)" },
  { name: "Absent", value: 8, color: "hsl(0, 84%, 60%)" },
  { name: "Late", value: 5, color: "hsl(38, 92%, 50%)" },
];

const anim = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Students", value: "2,847", change: "+12%", changeType: "positive" as const, icon: GraduationCap, iconColor: "text-primary" },
          { title: "Total Staff", value: "186", change: "+3%", changeType: "positive" as const, icon: Users, iconColor: "text-accent" },
          { title: "Fees Collected", value: "₹24.5L", change: "+8%", changeType: "positive" as const, icon: CreditCard, iconColor: "text-success" },
          { title: "Attendance Rate", value: "96.4%", change: "-0.3%", changeType: "negative" as const, icon: CalendarDays, iconColor: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...anim} transition={{ delay: 0.3 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Student Enrollment Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={enrollmentData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} className="text-xs" />
              <Tooltip />
              <Area type="monotone" dataKey="students" stroke="hsl(217, 91%, 60%)" fill="url(#grad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...anim} transition={{ delay: 0.4 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Fee Collection (₹ Lakhs)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={feeData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} className="text-xs" />
              <Tooltip />
              <Bar dataKey="collected" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="pending" fill="hsl(38, 92%, 50%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div {...anim} transition={{ delay: 0.5 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Today's Attendance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={attendancePie} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {attendancePie.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {attendancePie.map((e) => (
              <div key={e.name} className="flex items-center gap-1.5 text-xs">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                {e.name} ({e.value}%)
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...anim} transition={{ delay: 0.6 }} className="rounded-2xl border bg-card p-6 lg:col-span-2">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" /> Recent Alerts
          </h3>
          <div className="space-y-3">
            {[
              { text: "15 students have pending fee dues over ₹50,000", type: "destructive" },
              { text: "Annual exam schedule published for Class 10-12", type: "primary" },
              { text: "3 substitute teachers needed for tomorrow", type: "warning" },
              { text: "PTM scheduled for 20th Jan — 142 slots booked", type: "primary" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
                <TrendingUp className={`h-4 w-4 mt-0.5 shrink-0 ${a.type === "destructive" ? "text-destructive" : a.type === "warning" ? "text-warning" : "text-primary"}`} />
                <p className="text-sm">{a.text}</p>
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
          { title: "Library Books", value: "3", icon: GraduationCap, iconColor: "text-accent" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
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
          { title: "Avg Attendance", value: "92%", icon: CalendarDays, iconColor: "text-success" },
          { title: "Due Fees", value: "₹25,000", icon: CreditCard, iconColor: "text-warning" },
          { title: "Upcoming PTM", value: "Jan 20", icon: CalendarDays, iconColor: "text-accent" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
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
