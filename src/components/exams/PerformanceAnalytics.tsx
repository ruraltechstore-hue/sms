import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from "recharts";
import { Trophy } from "lucide-react";
import { examService } from "@/lib/services/examService";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import type { ClassPerformance, SubjectPerformance } from "@/lib/types";

export function PerformanceAnalytics() {
  const [loading, setLoading] = useState(true);
  const [classPerformance, setClassPerformance] = useState<ClassPerformance[]>([]);
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [cp, sp] = await Promise.all([
        examService.getClassPerformance(),
        examService.getSubjectPerformance(),
      ]);
      setClassPerformance(cp);
      setSubjectPerformance(sp);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  const radarData = subjectPerformance.map((s) => ({
    subject: s.subject,
    average: s.avgScore,
    highest: s.highestScore,
    passRate: s.passRate,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Class-wise Average (%)</h3>
        {classPerformance.length === 0 ? (
          <EmptyState title="No Data" description="Class performance data will appear here." />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={classPerformance}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="class" tickFormatter={(v) => `Cl ${v}`} className="text-xs" />
              <YAxis domain={[0, 100]} className="text-xs" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              <Bar dataKey="avgPercentage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Avg %" />
              <Bar dataKey="passPercentage" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Pass %" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Subject Performance Radar</h3>
        {radarData.length === 0 ? (
          <EmptyState title="No Data" description="Subject performance data will appear here." />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid className="stroke-border" />
              <PolarAngleAxis dataKey="subject" className="text-xs" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Average" dataKey="average" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
              <Radar name="Highest" dataKey="highest" stroke="hsl(var(--success))" fill="hsl(var(--success))" fillOpacity={0.15} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border bg-card p-6 lg:col-span-2">
        <h3 className="font-heading font-semibold mb-4">Class Toppers</h3>
        {classPerformance.length === 0 ? (
          <EmptyState title="No Data" description="Topper data will appear here." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {classPerformance.map((cp, i) => (
              <motion.div key={cp.class} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
                className="rounded-xl border p-3 text-center hover:shadow-md transition-shadow">
                <p className="text-xs text-muted-foreground mb-1">Class {cp.class}</p>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Trophy className="h-3.5 w-3.5 text-warning" />
                  <p className="font-semibold text-sm truncate">{cp.topperName}</p>
                </div>
                <p className="text-primary font-bold text-lg">{cp.topperScore}%</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl border bg-card p-6 lg:col-span-2">
        <h3 className="font-heading font-semibold mb-4">Subject-wise Breakdown</h3>
        {subjectPerformance.length === 0 ? (
          <EmptyState title="No Data" description="Subject breakdown will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Subject</th>
                  <th className="pb-3 font-medium">Avg Score</th>
                  <th className="pb-3 font-medium">Highest</th>
                  <th className="pb-3 font-medium">Lowest</th>
                  <th className="pb-3 font-medium">Pass Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {subjectPerformance.map((sp) => (
                  <tr key={sp.subject} className="hover:bg-secondary/50 transition-colors">
                    <td className="py-3 font-medium">{sp.subject}</td>
                    <td className="py-3">{sp.avgScore}%</td>
                    <td className="py-3 text-success font-semibold">{sp.highestScore}</td>
                    <td className="py-3 text-destructive">{sp.lowestScore}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-success rounded-full" style={{ width: `${sp.passRate}%` }} />
                        </div>
                        <span className="text-xs font-medium">{sp.passRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
