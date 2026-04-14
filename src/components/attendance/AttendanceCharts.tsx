import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { MONTHLY_ATTENDANCE, WEEKLY_TREND, CLASS_STATS } from "@/lib/mock-attendance";

const PIE_COLORS = [
  "hsl(142 71% 45%)",   // success/present
  "hsl(0 84% 60%)",     // destructive/absent
  "hsl(38 92% 50%)",    // warning/late
];

const todayData = [
  { name: "Present", value: 2456, color: PIE_COLORS[0] },
  { name: "Absent", value: 142, color: PIE_COLORS[1] },
  { name: "Late", value: 38, color: PIE_COLORS[2] },
];

export function AttendanceCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border bg-card p-6">
        <h4 className="font-heading font-semibold mb-1">Monthly Attendance Trend</h4>
        <p className="text-xs text-muted-foreground mb-4">Percentage breakdown by month</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={MONTHLY_ATTENDANCE} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(214 32% 91%)" />
            <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis fontSize={11} tickLine={false} axisLine={false} domain={[80, 100]} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(214 32% 91%)", fontSize: 12 }} />
            <Bar dataKey="present" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} name="Present %" />
            <Bar dataKey="absent" fill="hsl(0 84% 60%)" radius={[4, 4, 0, 0]} name="Absent %" />
            <Bar dataKey="late" fill="hsl(38 92% 50%)" radius={[4, 4, 0, 0]} name="Late %" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Today's Distribution */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border bg-card p-6">
        <h4 className="font-heading font-semibold mb-1">Today's Distribution</h4>
        <p className="text-xs text-muted-foreground mb-4">Overall attendance breakdown</p>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={todayData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {todayData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(214 32% 91%)", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-2">
          {todayData.map(d => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-muted-foreground">{d.name}</span>
              <span className="font-semibold">{d.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border bg-card p-6">
        <h4 className="font-heading font-semibold mb-1">Weekly Trend</h4>
        <p className="text-xs text-muted-foreground mb-4">This month's weekly rates</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={WEEKLY_TREND}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(214 32% 91%)" />
            <XAxis dataKey="week" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis fontSize={11} tickLine={false} axisLine={false} domain={[90, 100]} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(214 32% 91%)", fontSize: 12 }} />
            <Line type="monotone" dataKey="rate" stroke="hsl(217 91% 60%)" strokeWidth={2.5} dot={{ fill: "hsl(217 91% 60%)", r: 5 }} name="Rate %" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Class-wise Comparison */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl border bg-card p-6">
        <h4 className="font-heading font-semibold mb-1">Class-wise Comparison</h4>
        <p className="text-xs text-muted-foreground mb-4">Today's attendance rate by class</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={CLASS_STATS} layout="vertical" barSize={14}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(214 32% 91%)" />
            <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} domain={[80, 100]} />
            <YAxis type="category" dataKey="className" fontSize={10} tickLine={false} axisLine={false} width={75} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(214 32% 91%)", fontSize: 12 }} />
            <Bar dataKey="rate" fill="hsl(217 91% 60%)" radius={[0, 6, 6, 0]} name="Rate %" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
