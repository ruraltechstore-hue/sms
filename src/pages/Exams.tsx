import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, FileText, Award, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/StatCard";
import { ExamSchedule } from "@/components/exams/ExamSchedule";
import { GradeEntry } from "@/components/exams/GradeEntry";
import { PerformanceAnalytics } from "@/components/exams/PerformanceAnalytics";
import { LoadingState } from "@/components/LoadingState";
import { useIsReadOnly } from "@/lib/auth-context";

export default function Exams() {
  const [loading, setLoading] = useState(true);
  const readOnly = useIsReadOnly();

  useEffect(() => {
    // TODO: fetch exam stats from API
    setLoading(false);
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Examinations</h2>
        <p className="text-muted-foreground">Manage exams, grades, report cards, and analytics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Upcoming Exams", value: "0", icon: ClipboardCheck, iconColor: "text-primary" },
          { title: "Results Published", value: "0", icon: FileText, iconColor: "text-success" },
          { title: "Toppers", value: "0", icon: Award, iconColor: "text-warning" },
          { title: "Avg Score", value: "0%", icon: TrendingUp, iconColor: "text-accent" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Exam Schedule</TabsTrigger>
          <TabsTrigger value="grades">Grades & Report Cards</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule"><ExamSchedule /></TabsContent>
        <TabsContent value="grades"><GradeEntry /></TabsContent>
        <TabsContent value="analytics"><PerformanceAnalytics /></TabsContent>
      </Tabs>
    </div>
  );
}
