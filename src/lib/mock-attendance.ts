export interface StudentAttendance {
  id: string;
  name: string;
  rollNo: string;
  status: "present" | "absent" | "late" | "excused";
}

export interface ClassAttendance {
  className: string;
  section: string;
  students: StudentAttendance[];
}

export const CLASSES = [
  "Class 10-A", "Class 10-B", "Class 9-A", "Class 9-B",
  "Class 8-A", "Class 8-B", "Class 7-A", "Class 7-B",
];

const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Ananya", "Diya", "Priya", "Riya", "Saanvi", "Anika", "Myra", "Sara", "Aadhya", "Navya"];
const lastNames = ["Sharma", "Verma", "Patel", "Gupta", "Singh", "Kumar", "Reddy", "Nair", "Das", "Mehta"];

export function generateClassStudents(className: string): StudentAttendance[] {
  const count = 35 + Math.floor(Math.random() * 10);
  return Array.from({ length: count }, (_, i) => ({
    id: `${className}-${i + 1}`,
    name: `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    rollNo: `${className.replace(/\s|-/g, "").slice(0, 4).toUpperCase()}${String(i + 1).padStart(3, "0")}`,
    status: "present" as const,
  }));
}

// Monthly attendance data for charts
export const MONTHLY_ATTENDANCE = [
  { month: "Jan", present: 94.2, absent: 4.1, late: 1.7 },
  { month: "Feb", present: 95.1, absent: 3.5, late: 1.4 },
  { month: "Mar", present: 93.8, absent: 4.5, late: 1.7 },
  { month: "Apr", present: 96.4, absent: 2.3, late: 1.3 },
  { month: "May", present: 95.7, absent: 3.0, late: 1.3 },
  { month: "Jun", present: 94.9, absent: 3.6, late: 1.5 },
  { month: "Jul", present: 96.1, absent: 2.7, late: 1.2 },
  { month: "Aug", present: 95.5, absent: 3.2, late: 1.3 },
  { month: "Sep", present: 96.8, absent: 2.1, late: 1.1 },
  { month: "Oct", present: 95.3, absent: 3.3, late: 1.4 },
  { month: "Nov", present: 96.0, absent: 2.8, late: 1.2 },
  { month: "Dec", present: 94.5, absent: 3.9, late: 1.6 },
];

// Weekly trend for the current month
export const WEEKLY_TREND = [
  { week: "Week 1", rate: 95.2 },
  { week: "Week 2", rate: 96.8 },
  { week: "Week 3", rate: 94.1 },
  { week: "Week 4", rate: 96.4 },
];

// Class-wise stats
export const CLASS_STATS = [
  { className: "Class 10-A", present: 42, absent: 3, late: 1, total: 45, rate: 93.3 },
  { className: "Class 10-B", present: 40, absent: 4, late: 2, total: 44, rate: 90.9 },
  { className: "Class 9-A", present: 38, absent: 2, late: 0, total: 40, rate: 95.0 },
  { className: "Class 9-B", present: 41, absent: 1, late: 1, total: 42, rate: 97.6 },
  { className: "Class 8-A", present: 39, absent: 3, late: 1, total: 42, rate: 92.9 },
  { className: "Class 8-B", present: 37, absent: 2, late: 1, total: 40, rate: 92.5 },
  { className: "Class 7-A", present: 43, absent: 2, late: 0, total: 45, rate: 95.6 },
  { className: "Class 7-B", present: 38, absent: 3, late: 2, total: 43, rate: 88.4 },
];

// Calendar heatmap data for current month
export function generateCalendarData(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const data: { date: Date; rate: number }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const day = date.getDay();
    if (day === 0 || day === 6) continue; // skip weekends
    data.push({ date, rate: 88 + Math.random() * 12 });
  }
  return data;
}
