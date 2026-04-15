// ==================== Auth ====================
export type UserRole = "admin" | "teacher" | "student" | "parent";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// ==================== Students ====================
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  section: string;
  rollNumber: string;
  admissionDate: string;
  status: "active" | "inactive" | "alumni";
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  bloodGroup: string;
  address: string;
  fatherName: string;
  motherName: string;
  guardianPhone: string;
  guardianEmail: string;
  previousSchool: string;
  avatar?: string;
  attendance: number;
  cgpa: number;
  feeStatus: "paid" | "partial" | "pending";
}

// ==================== Attendance ====================
export interface StudentAttendance {
  id: string;
  name: string;
  rollNo: string;
  status: "present" | "absent" | "late" | "excused";
}

export interface MonthlyAttendanceData {
  month: string;
  present: number;
  absent: number;
  late: number;
}

export interface WeeklyTrendData {
  week: string;
  rate: number;
}

export interface ClassStatData {
  className: string;
  present: number;
  absent: number;
  late: number;
  total: number;
  rate: number;
}

export interface CalendarDayData {
  date: Date;
  rate: number;
}

// ==================== Fees ====================
export interface FeeStructure {
  id: string;
  name: string;
  class: string;
  amount: number;
  frequency: "monthly" | "quarterly" | "annually" | "one-time";
  category: "tuition" | "transport" | "lab" | "library" | "sports" | "exam" | "misc";
  dueDate: string;
}

export interface FeePayment {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  paidDate?: string;
  status: "paid" | "partial" | "overdue" | "pending";
  method?: "cash" | "online" | "cheque" | "upi";
  receiptNo?: string;
  feeType: string;
}

export interface MonthlyCollection {
  month: string;
  collected: number;
  pending: number;
}

export interface ClassWiseDue {
  class: string;
  total: number;
  collected: number;
  pending: number;
}

// ==================== Staff ====================
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  qualification: string;
  experience: number;
  joinDate: string;
  status: "active" | "on-leave" | "resigned";
  type: "teaching" | "non-teaching";
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  address: string;
  salary: number;
  subjects?: string[];
  classIncharge?: string;
}

export interface LeaveRecord {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  leaveType: "casual" | "sick" | "earned" | "maternity" | "unpaid";
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  status: "approved" | "pending" | "rejected";
  appliedOn: string;
}

export interface Department {
  name: string;
  hod: string;
  staffCount: number;
  type: "academic" | "administrative";
}

// ==================== Exams ====================
export interface ExamSubject {
  name: string;
  date: string;
  time: string;
  duration: string;
  maxMarks: number;
  room?: string;
}

export interface Exam {
  id: string;
  name: string;
  type: "unit-test" | "mid-term" | "final" | "pre-board" | "board";
  classes: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "ongoing" | "completed" | "scheduled";
  subjects: ExamSubject[];
}

export interface SubjectGrade {
  subject: string;
  maxMarks: number;
  obtained: number;
  grade: string;
}

export interface StudentGrade {
  studentId: string;
  studentName: string;
  class: string;
  section: string;
  rollNumber: string;
  subjects: SubjectGrade[];
  totalMarks: number;
  maxTotal: number;
  percentage: number;
  grade: string;
  rank: number;
}

export interface ClassPerformance {
  class: string;
  avgPercentage: number;
  passPercentage: number;
  topperName: string;
  topperScore: number;
}

export interface SubjectPerformance {
  subject: string;
  avgScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
}

// ==================== Messaging ====================
export interface Announcement {
  id: string;
  title: string;
  message: string;
  author: string;
  date: string;
  priority: "high" | "medium" | "low";
  audience: string;
  channel: "sms" | "email" | "whatsapp" | "all";
  status: "sent" | "scheduled" | "draft";
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isOwn: boolean;
}

export interface GroupChat {
  id: string;
  name: string;
  members: number;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  avatar: string;
  messages: ChatMessage[];
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: "info" | "warning" | "success" | "error";
  date: string;
  read: boolean;
  module: string;
}

// ==================== Parent ====================
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

// ==================== Constants ====================
export const CLASS_OPTIONS = ["5", "6", "7", "8", "9", "10", "11", "12"];
export const SECTION_OPTIONS = ["A", "B", "C", "D"];
export const STATUS_OPTIONS: Student["status"][] = ["active", "inactive", "alumni"];
