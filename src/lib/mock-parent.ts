export interface ChildProfile {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  avatar?: string;
  attendance: number;
  grade: string;
  cgpa: number;
  feeStatus: "paid" | "partial" | "pending";
  pendingFees: number;
  subjects: ChildSubject[];
  recentAttendance: DayAttendance[];
  feeHistory: ChildFeeRecord[];
}

export interface ChildSubject {
  name: string;
  marks: number;
  maxMarks: number;
  grade: string;
  teacher: string;
}

export interface DayAttendance {
  date: string;
  status: "present" | "absent" | "late" | "holiday";
}

export interface ChildFeeRecord {
  id: string;
  type: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "partial" | "overdue" | "pending";
  receiptNo?: string;
}

export interface ParentMessage {
  id: string;
  from: string;
  role: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  type: "notice" | "message" | "alert";
}

function genAttendance(): DayAttendance[] {
  const days: DayAttendance[] = [];
  const statuses: DayAttendance["status"][] = ["present", "present", "present", "present", "present", "present", "late", "absent", "present", "present", "holiday", "present", "present", "present", "present", "present", "present", "present", "present", "present"];
  for (let i = 0; i < 20; i++) {
    const d = new Date(2025, 0, 6 + i);
    if (d.getDay() === 0) continue;
    days.push({ date: d.toISOString().split("T")[0], status: statuses[i % statuses.length] });
  }
  return days;
}

export const CHILDREN: ChildProfile[] = [
  {
    id: "STU001", name: "Arjun Singh", class: "10", section: "A", rollNumber: "1001",
    attendance: 94.2, grade: "A", cgpa: 8.7, feeStatus: "paid", pendingFees: 0,
    subjects: [
      { name: "Mathematics", marks: 88, maxMarks: 100, grade: "A", teacher: "Dr. Amit Patel" },
      { name: "Science", marks: 85, maxMarks: 100, grade: "A", teacher: "Dr. Meena Kumari" },
      { name: "English", marks: 92, maxMarks: 100, grade: "A+", teacher: "Mrs. Sunita Roy" },
      { name: "Hindi", marks: 78, maxMarks: 100, grade: "B+", teacher: "Mr. Devendra Mishra" },
      { name: "Social Studies", marks: 82, maxMarks: 100, grade: "A", teacher: "Mrs. Kavita Jain" },
    ],
    recentAttendance: genAttendance(),
    feeHistory: [
      { id: "F1", type: "Tuition Fee (Q3)", amount: 15000, paidAmount: 15000, dueDate: "2025-01-01", paidDate: "2025-01-03", status: "paid", receiptNo: "RCP-2025-001" },
      { id: "F2", type: "Transport Fee (Jan)", amount: 3000, paidAmount: 3000, dueDate: "2025-01-05", paidDate: "2025-01-04", status: "paid", receiptNo: "RCP-2025-009" },
      { id: "F3", type: "Tuition Fee (Q4)", amount: 15000, paidAmount: 0, dueDate: "2025-04-01", status: "pending" },
    ],
  },
  {
    id: "CHD002", name: "Kavya Singh", class: "7", section: "B", rollNumber: "712",
    attendance: 90.5, grade: "A", cgpa: 8.2, feeStatus: "partial", pendingFees: 25000,
    subjects: [
      { name: "Mathematics", marks: 80, maxMarks: 100, grade: "A", teacher: "Mrs. Rekha Joshi" },
      { name: "Science", marks: 76, maxMarks: 100, grade: "B+", teacher: "Mr. Sunil Verma" },
      { name: "English", marks: 85, maxMarks: 100, grade: "A", teacher: "Rajiv Menon" },
      { name: "Hindi", marks: 82, maxMarks: 100, grade: "A", teacher: "Mr. Devendra Mishra" },
      { name: "Social Studies", marks: 78, maxMarks: 100, grade: "B+", teacher: "Mrs. Kavita Jain" },
    ],
    recentAttendance: genAttendance(),
    feeHistory: [
      { id: "F4", type: "Tuition Fee (Q3)", amount: 15000, paidAmount: 10000, dueDate: "2025-01-01", paidDate: "2025-01-10", status: "partial", receiptNo: "RCP-2025-050" },
      { id: "F5", type: "Transport Fee (Jan)", amount: 3000, paidAmount: 0, dueDate: "2025-01-05", status: "overdue" },
      { id: "F6", type: "Lab Fee", amount: 5000, paidAmount: 5000, dueDate: "2024-04-15", paidDate: "2024-04-12", status: "paid", receiptNo: "RCP-2024-210" },
    ],
  },
];

export const PARENT_MESSAGES: ParentMessage[] = [
  { id: "M1", from: "School Administration", role: "Admin", subject: "PTM Scheduled - January 20", message: "Dear Parent, we are pleased to inform you that the Parent-Teacher Meeting has been scheduled for January 20, 2025 from 10:00 AM to 1:00 PM. Please make it convenient to attend. Your ward's class teacher will discuss academic progress and areas for improvement.", date: "2025-01-15", read: true, type: "notice" },
  { id: "M2", from: "Dr. Amit Patel", role: "Mathematics Teacher", subject: "Arjun's performance in Mathematics", message: "Dear Parent, Arjun has been performing well in Mathematics. He scored 88/100 in the recent unit test. However, he needs to practice more on trigonometry. I recommend 30 minutes of daily practice on NCERT exercises.", date: "2025-01-14", read: false, type: "message" },
  { id: "M3", from: "School Administration", role: "Admin", subject: "Annual Day Celebration - February 5", message: "We are excited to announce our Annual Day celebration on February 5, 2025. Your child has been selected for the cultural program. Please ensure they attend rehearsals from January 25 onwards.", date: "2025-01-13", read: false, type: "notice" },
  { id: "M4", from: "Mrs. Kavita Jain", role: "Class Teacher (7-B)", subject: "Kavya - Attendance concern", message: "Dear Parent, Kavya has been absent for 3 days last week without prior intimation. Kindly ensure regular attendance and inform us in advance for any planned leaves. Thank you.", date: "2025-01-12", read: true, type: "alert" },
  { id: "M5", from: "Accounts Department", role: "Accounts", subject: "Fee payment reminder", message: "This is a gentle reminder that the transport fee of ₹3,000 for Kavya Singh (Class 7-B) is overdue since January 5. Please clear the dues at the earliest to avoid late fees.", date: "2025-01-10", read: true, type: "alert" },
];
