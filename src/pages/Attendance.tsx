import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, CheckCircle, XCircle, Clock, ClipboardCheck, BarChart3, CalendarRange } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceMarking } from "@/components/attendance/AttendanceMarking";
import { AttendanceCalendar } from "@/components/attendance/AttendanceCalendar";
import { AttendanceCharts } from "@/components/attendance/AttendanceCharts";

export default function Attendance() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Attendance</h2>
        <p className="text-muted-foreground">Track and manage daily attendance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Present Today", value: "2,456", icon: CheckCircle, iconColor: "text-success" },
          { title: "Absent Today", value: "142", icon: XCircle, iconColor: "text-destructive" as any },
          { title: "Late Arrivals", value: "38", icon: Clock, iconColor: "text-warning" },
          { title: "Overall Rate", value: "96.4%", change: "+0.8%", changeType: "positive" as const, icon: CalendarDays, iconColor: "text-primary" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="marking" className="space-y-4">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="marking" className="gap-2"><ClipboardCheck className="h-4 w-4" /> Mark Attendance</TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2"><CalendarRange className="h-4 w-4" /> Calendar</TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2"><BarChart3 className="h-4 w-4" /> Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="marking">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <AttendanceMarking />
          </motion.div>
        </TabsContent>

        <TabsContent value="calendar">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border bg-card p-6">
            <AttendanceCalendar />
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <AttendanceCharts />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
