import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { attendanceService } from "@/lib/services/attendanceService";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import type { MonthlyAttendanceData, WeeklyTrendData, ClassStatData } from "@/lib/types";

const PIE_COLORS = ["hsl(142 71% 45%)", "hsl(0 84% 60%)", "hsl(38 92% 50%)"];

export function AttendanceCharts() {
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyAttendanceData[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyTrendData[]>([]);
  const [classStats, setClassStats] = useState<ClassStatData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [monthly, weekly, stats] = await Promise.all([
        attendanceService.getMonthlyAttendance(),
        attendanceService.getWeeklyTrend(),
        attendanceService.getClassStats(),
      ]);
      setMonthlyData(monthly);
      setWeeklyData(weekly);
      setClassStats(stats);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border bg-card p-6">
        <h4 className="font-heading font-semibold mb-1">Monthly Attendance Trend</h4>
        <p className="text-xs text-muted-foreground mb-4">Percentage breakdown by month</p>
        {monthlyData.length === 0 ? (
          <EmptyState title="No Data" description="Monthly attendance data will appear here." />
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(214 32% 91%)" />
              <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} domain={[80, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(214 32% 91%)", fontSize: 12 }} />
              <Bar dataKey="present" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} name="Present %" />
              <Bar dataKey="absent" fill="hsl(0 84% 60%)" radius={[4, 4, 0, 0]} name="Absent %" />
              <Bar dataKey="late" fill="hsl(38 92% 50%)" radius={[4, 4, 0, 0]} name="Late %" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border bg-card p-6">
        <h4 className="font-heading font-semibold mb-1">Today's Distribution</h4>
        <p className="text-xs text-muted-foreground mb-4">Overall attendance breakdown</p>
        <EmptyState title="No Data" description="Today's attendance data will appear here." />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border bg-card p-6">
        <h4 className="font-heading font-semibold mb-1">Weekly Trend</h4>
        <p className="text-xs text-muted-foreground mb-4">This month's weekly rates</p>
        {weeklyData.length === 0 ? (
          <EmptyState title="No Data" description="Weekly trend data will appear here." />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(214 32% 91%)" />
              <XAxis dataKey="week" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} domain={[90, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(214 32% 91%)", fontSize: 12 }} />
              <Line type="monotone" dataKey="rate" stroke="hsl(217 91% 60%)" strokeWidth={2.5} dot={{ fill: "hsl(217 91% 60%)", r: 5 }} name="Rate %" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border bg-card p-6">
        <h4 className="font-heading font-semibold mb-1">Class-wise Comparison</h4>
        <p className="text-xs text-muted-foreground mb-4">Today's attendance rate by class</p>
        {classStats.length === 0 ? (
          <EmptyState title="No Data" description="Class-wise data will appear here." />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={classStats} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(214 32% 91%)" />
              <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} domain={[80, 100]} />
              <YAxis type="category" dataKey="className" fontSize={10} tickLine={false} axisLine={false} width={75} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(214 32% 91%)", fontSize: 12 }} />
              <Bar dataKey="rate" fill="hsl(217 91% 60%)" radius={[0, 6, 6, 0]} name="Rate %" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  );
}
