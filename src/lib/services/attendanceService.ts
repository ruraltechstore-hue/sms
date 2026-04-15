import type { StudentAttendance, MonthlyAttendanceData, WeeklyTrendData, ClassStatData, CalendarDayData } from "@/lib/types";

// TODO: Replace with actual API calls
export const attendanceService = {
  getClassStudents: async (className: string): Promise<StudentAttendance[]> => {
    // TODO: fetch from API
    return [];
  },
  saveAttendance: async (className: string, students: StudentAttendance[]): Promise<boolean> => {
    // TODO: POST to API
    return false;
  },
  getMonthlyAttendance: async (): Promise<MonthlyAttendanceData[]> => {
    // TODO: fetch from API
    return [];
  },
  getWeeklyTrend: async (): Promise<WeeklyTrendData[]> => {
    // TODO: fetch from API
    return [];
  },
  getClassStats: async (): Promise<ClassStatData[]> => {
    // TODO: fetch from API
    return [];
  },
  getCalendarData: async (year: number, month: number): Promise<CalendarDayData[]> => {
    // TODO: fetch from API
    return [];
  },
  getClasses: async (): Promise<string[]> => {
    // TODO: fetch from API
    return [];
  },
};
