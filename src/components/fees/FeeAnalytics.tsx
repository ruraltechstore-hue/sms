import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { feeService } from "@/lib/services/feeService";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import type { MonthlyCollection, ClassWiseDue, FeePayment } from "@/lib/types";

const COLORS = ["hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--destructive))", "hsl(var(--muted-foreground))"];

export function FeeAnalytics() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [monthlyCollections, setMonthlyCollections] = useState<MonthlyCollection[]>([]);
  const [classWiseDues, setClassWiseDues] = useState<ClassWiseDue[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [p, m, c] = await Promise.all([
        feeService.getAll(),
        feeService.getMonthlyCollections(),
        feeService.getClassWiseDues(),
      ]);
      setPayments(p);
      setMonthlyCollections(m);
      setClassWiseDues(c);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  const statusCounts = payments.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = [
    { name: "Paid", value: statusCounts.paid || 0 },
    { name: "Partial", value: statusCounts.partial || 0 },
    { name: "Overdue", value: statusCounts.overdue || 0 },
    { name: "Pending", value: statusCounts.pending || 0 },
  ].filter((d) => d.value > 0);

  const collectionData = monthlyCollections.map((m) => ({
    ...m,
    collected: m.collected / 100000,
    pending: m.pending / 100000,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Monthly Collection (₹ in Lakhs)</h3>
        {collectionData.length === 0 ? (
          <EmptyState title="No Collection Data" description="Monthly collection data will appear here." />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={collectionData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              <Bar dataKey="collected" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Collected" />
              <Bar dataKey="pending" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Payment Status Distribution</h3>
        {pieData.length === 0 ? (
          <EmptyState title="No Payment Data" description="Payment status data will appear here." />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border bg-card p-6 lg:col-span-2">
        <h3 className="font-heading font-semibold mb-4">Class-wise Dues Overview</h3>
        {classWiseDues.length === 0 ? (
          <EmptyState title="No Dues Data" description="Class-wise dues data will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Class</th>
                  <th className="pb-3 font-medium">Total Fee</th>
                  <th className="pb-3 font-medium">Collected</th>
                  <th className="pb-3 font-medium">Pending</th>
                  <th className="pb-3 font-medium">Collection %</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {classWiseDues.map((row) => {
                  const pct = row.total > 0 ? Math.round((row.collected / row.total) * 100) : 0;
                  return (
                    <tr key={row.class} className="hover:bg-secondary/50 transition-colors">
                      <td className="py-3 font-medium">Class {row.class}</td>
                      <td className="py-3">₹{(row.total / 1000).toFixed(0)}K</td>
                      <td className="py-3 text-success font-semibold">₹{(row.collected / 1000).toFixed(0)}K</td>
                      <td className="py-3 text-destructive">₹{(row.pending / 1000).toFixed(0)}K</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[120px]">
                            <div className="h-full bg-success rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs font-medium">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
