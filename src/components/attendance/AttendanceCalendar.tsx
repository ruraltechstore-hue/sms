import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { attendanceService } from "@/lib/services/attendanceService";
import { EmptyState } from "@/components/EmptyState";
import type { CalendarDayData } from "@/lib/types";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getRateColor(rate: number) {
  if (rate >= 96) return "bg-success text-success-foreground";
  if (rate >= 92) return "bg-success/60 text-foreground";
  if (rate >= 88) return "bg-warning/50 text-foreground";
  return "bg-destructive/40 text-foreground";
}

export function AttendanceCalendar() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(3);
  const [calendarData, setCalendarData] = useState<CalendarDayData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await attendanceService.getCalendarData(year, month);
      setCalendarData(data);
    };
    fetchData();
  }, [year, month]);

  const rateMap = useMemo(() => {
    const map = new Map<number, number>();
    calendarData.forEach(d => map.set(d.date.getDate(), d.rate));
    return map;
  }, [calendarData]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const navigateMonth = (dir: number) => {
    let m = month + dir;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m);
    setYear(y);
  };

  const avgRate = calendarData.length > 0
    ? (calendarData.reduce((sum, d) => sum + d.rate, 0) / calendarData.length).toFixed(1)
    : "0";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-heading font-semibold text-lg">{MONTHS[month]} {year}</h4>
          <p className="text-sm text-muted-foreground">Average attendance: <span className="text-success font-medium">{avgRate}%</span></p>
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateMonth(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateMonth(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {calendarData.length === 0 ? (
        <EmptyState title="No Calendar Data" description="Attendance calendar data will appear here." />
      ) : (
        <>
          <div className="grid grid-cols-7 gap-1.5">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
            ))}
            {Array.from({ length: startOffset }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const rate = rateMap.get(day);
              const isWeekend = new Date(year, month, day).getDay() === 0 || new Date(year, month, day).getDay() === 6;
              return (
                <motion.div key={day} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.01 }}
                  className={cn("aspect-square rounded-lg flex flex-col items-center justify-center text-xs relative cursor-default transition-all",
                    isWeekend ? "bg-muted/30 text-muted-foreground" : rate ? getRateColor(rate) : "bg-secondary/30")}
                  title={rate ? `${rate.toFixed(1)}% attendance` : isWeekend ? "Weekend" : "No data"}>
                  <span className="font-medium">{day}</span>
                  {rate && <span className="text-[9px] opacity-75">{rate.toFixed(0)}%</span>}
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 justify-center text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded bg-success" /> 96%+</div>
            <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded bg-success/60" /> 92-96%</div>
            <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded bg-warning/50" /> 88-92%</div>
            <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded bg-destructive/40" /> &lt;88%</div>
            <div className="flex items-center gap-1.5"><div className="h-3 w-3 rounded bg-muted/30" /> Weekend</div>
          </div>
        </>
      )}
    </div>
  );
}
