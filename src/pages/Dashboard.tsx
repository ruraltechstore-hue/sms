import { useState, useEffect } from "react";
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
import { LoadingState, ChartLoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";

const tooltipStyle = { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" };
const anim = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalStudents: 0, totalStaff: 0, onLeave: 0, collectionRate: 0, avgAttendance: 0, activeStudents: 0, upcomingExams: 0, overdueCount: 0, pendingLeaves: 0 });
  const [enrollmentData, setEnrollmentData] = useState<any[]>([]);
  const [feeChartData, setFeeChartData] = useState<any[]>([]);
  const [attendanceTrend, setAttendanceTrend] = useState<any[]>([]);
  const [classPerformanceData, setClassPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    // TODO: fetch dashboard data from API
    setLoading(false);
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Students", value: String(stats.totalStudents), icon: GraduationCap, iconColor: "text-primary" },
          { title: "Total Staff", value: String(stats.totalStaff), icon: Users, iconColor: "text-accent" },
          { title: "Fee Collection", value: `${stats.collectionRate}%`, icon: CreditCard, iconColor: "text-success" },
          { title: "Attendance Rate", value: `${stats.avgAttendance}%`, icon: CalendarDays, iconColor: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: "Active Students", value: stats.activeStudents, icon: UserCheck, color: "text-success" },
          { label: "Upcoming Exams", value: stats.upcomingExams, icon: ClipboardCheck, color: "text-primary" },
          { label: "Overdue Fees", value: stats.overdueCount, icon: AlertCircle, color: "text-destructive" },
          { label: "Pending Leaves", value: stats.pendingLeaves, icon: Clock, color: "text-warning" },
          { label: "Departments", value: 0, icon: BookOpen, color: "text-accent" },
          { label: "Avg CGPA", value: "0", icon: Award, color: "text-primary" },
        ].map((item, i) => (
          <motion.div key={item.label} {...anim} transition={{ delay: 0.4 + i * 0.05 }} className="rounded-xl border bg-card p-3 text-center">
            <item.icon className={`h-4 w-4 mx-auto mb-1 ${item.color}`} />
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="font-bold text-lg">{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...anim} transition={{ delay: 0.5 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Enrollment Trend</h3>
          {enrollmentData.length === 0 ? (
            <EmptyState title="No enrollment data" description="Enrollment trends will appear here." />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis axisLine={false} tickLine={false} className="text-xs" />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="students" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div {...anim} transition={{ delay: 0.55 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Fee Collection (₹ Lakhs)</h3>
          {feeChartData.length === 0 ? (
            <EmptyState title="No fee data" description="Fee collection data will appear here." />
          ) : (
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
          )}
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div {...anim} transition={{ delay: 0.6 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Today's Attendance</h3>
          <EmptyState title="No attendance data" description="Attendance breakdown will appear here." />
        </motion.div>

        <motion.div {...anim} transition={{ delay: 0.65 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Fee Status Distribution</h3>
          <EmptyState title="No fee status data" description="Fee status distribution will appear here." />
        </motion.div>

        <motion.div {...anim} transition={{ delay: 0.7 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Weekly Attendance Trend</h3>
          {attendanceTrend.length === 0 ? (
            <EmptyState title="No trend data" description="Weekly trends will appear here." />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} className="text-xs" />
                <YAxis domain={[90, 100]} axisLine={false} tickLine={false} className="text-xs" />
                <Tooltip contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} name="Rate %" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...anim} transition={{ delay: 0.75 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Class-wise Exam Performance</h3>
          {classPerformanceData.length === 0 ? (
            <EmptyState title="No performance data" description="Exam performance data will appear here." />
          ) : (
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
          )}
        </motion.div>

        <motion.div {...anim} transition={{ delay: 0.8 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Class-wise Fee Dues (₹K)</h3>
          <EmptyState title="No dues data" description="Fee dues data will appear here." />
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div {...anim} transition={{ delay: 0.85 }} className="rounded-2xl border bg-card p-6 lg:col-span-2">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" /> Recent Alerts & Activity
          </h3>
          <EmptyState title="No recent alerts" description="System alerts will appear here when data is connected." />
        </motion.div>

        <motion.div {...anim} transition={{ delay: 0.9 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Class Toppers</h3>
          <EmptyState title="No topper data" description="Top performers will appear here." />
        </motion.div>
      </div>
    </div>
  );
}

function TeacherDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: fetch teacher dashboard data from API
    setLoading(false);
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "My Classes", value: "0", icon: Users, iconColor: "text-primary" },
          { title: "Total Students", value: "0", icon: GraduationCap, iconColor: "text-accent" },
          { title: "Today's Periods", value: "0", icon: CalendarDays, iconColor: "text-success" },
          { title: "Pending Marks", value: "0", icon: ClipboardCheck, iconColor: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...anim} transition={{ delay: 0.3 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Today's Schedule</h3>
          <EmptyState title="No schedule data" description="Your class schedule will appear here." />
        </motion.div>

        <motion.div {...anim} transition={{ delay: 0.4 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Class Attendance Today</h3>
          <EmptyState title="No attendance data" description="Class attendance will appear here." />
        </motion.div>
      </div>
    </div>
  );
}

function StudentDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: fetch student dashboard data from API
    setLoading(false);
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Attendance", value: "0%", icon: CalendarDays, iconColor: "text-success" },
          { title: "CGPA", value: "0", icon: TrendingUp, iconColor: "text-primary" },
          { title: "Pending Fees", value: "₹0", icon: CreditCard, iconColor: "text-warning" },
          { title: "Upcoming Exams", value: "0", icon: ClipboardCheck, iconColor: "text-accent" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...anim} transition={{ delay: 0.3 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">My Attendance Trend</h3>
          <EmptyState title="No attendance data" description="Your attendance trend will appear here." />
        </motion.div>

        <motion.div {...anim} transition={{ delay: 0.4 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Upcoming Exams</h3>
          <EmptyState title="No upcoming exams" description="Exam schedule will appear here." />
        </motion.div>
      </div>
    </div>
  );
}

function ParentDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: fetch parent dashboard data from API
    setLoading(false);
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Children", value: "0", icon: Users, iconColor: "text-primary" },
          { title: "Avg Attendance", value: "0%", icon: CalendarDays, iconColor: "text-success" },
          { title: "Due Fees", value: "₹0", icon: CreditCard, iconColor: "text-warning" },
          { title: "Upcoming PTM", value: "—", icon: CalendarDays, iconColor: "text-accent" },
        ].map((s, i) => (
          <motion.div key={s.title} {...anim} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div {...anim} transition={{ delay: 0.3 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4">Children's Attendance</h3>
          <EmptyState title="No attendance data" description="Children's attendance will appear here." />
        </motion.div>

        <motion.div {...anim} transition={{ delay: 0.4 }} className="rounded-2xl border bg-card p-6">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" /> Recent Notices
          </h3>
          <EmptyState title="No notices" description="School notices will appear here." />
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
