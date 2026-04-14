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

export interface ExamSubject {
  name: string;
  date: string;
  time: string;
  duration: string;
  maxMarks: number;
  room?: string;
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

export interface SubjectGrade {
  subject: string;
  maxMarks: number;
  obtained: number;
  grade: string;
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

function getGrade(pct: number): string {
  if (pct >= 91) return "A+";
  if (pct >= 81) return "A";
  if (pct >= 71) return "B+";
  if (pct >= 61) return "B";
  if (pct >= 51) return "C";
  if (pct >= 41) return "D";
  return "F";
}

export const EXAMS: Exam[] = [
  {
    id: "EX001", name: "Unit Test 3", type: "unit-test", classes: "6-10", startDate: "2025-01-25", endDate: "2025-01-28", status: "ongoing",
    subjects: [
      { name: "Mathematics", date: "2025-01-25", time: "9:00 AM", duration: "1.5 hrs", maxMarks: 50 },
      { name: "Science", date: "2025-01-26", time: "9:00 AM", duration: "1.5 hrs", maxMarks: 50 },
      { name: "English", date: "2025-01-27", time: "9:00 AM", duration: "1.5 hrs", maxMarks: 50 },
      { name: "Social Studies", date: "2025-01-28", time: "9:00 AM", duration: "1.5 hrs", maxMarks: 50 },
    ],
  },
  {
    id: "EX002", name: "Mid-Term Examination", type: "mid-term", classes: "6-12", startDate: "2025-02-10", endDate: "2025-02-20", status: "upcoming",
    subjects: [
      { name: "Mathematics", date: "2025-02-10", time: "9:00 AM", duration: "3 hrs", maxMarks: 100, room: "Hall A" },
      { name: "Science/Physics", date: "2025-02-12", time: "9:00 AM", duration: "3 hrs", maxMarks: 100, room: "Hall B" },
      { name: "English", date: "2025-02-14", time: "9:00 AM", duration: "3 hrs", maxMarks: 100, room: "Hall A" },
      { name: "Hindi", date: "2025-02-16", time: "9:00 AM", duration: "3 hrs", maxMarks: 100, room: "Hall C" },
      { name: "Social Studies/History", date: "2025-02-18", time: "9:00 AM", duration: "3 hrs", maxMarks: 100, room: "Hall A" },
      { name: "Computer Science", date: "2025-02-20", time: "9:00 AM", duration: "2 hrs", maxMarks: 100, room: "Lab 1" },
    ],
  },
  {
    id: "EX003", name: "Pre-Board Examination", type: "pre-board", classes: "10, 12", startDate: "2025-03-01", endDate: "2025-03-15", status: "scheduled",
    subjects: [
      { name: "Mathematics", date: "2025-03-01", time: "9:00 AM", duration: "3 hrs", maxMarks: 100, room: "Hall A" },
      { name: "Science", date: "2025-03-04", time: "9:00 AM", duration: "3 hrs", maxMarks: 100, room: "Hall B" },
      { name: "English", date: "2025-03-07", time: "9:00 AM", duration: "3 hrs", maxMarks: 100, room: "Hall A" },
      { name: "Social Studies", date: "2025-03-10", time: "9:00 AM", duration: "3 hrs", maxMarks: 100, room: "Hall C" },
      { name: "Hindi", date: "2025-03-13", time: "9:00 AM", duration: "3 hrs", maxMarks: 100, room: "Hall A" },
    ],
  },
  {
    id: "EX004", name: "Final Examination 2024", type: "final", classes: "5-12", startDate: "2024-11-15", endDate: "2024-11-28", status: "completed",
    subjects: [
      { name: "Mathematics", date: "2024-11-15", time: "9:00 AM", duration: "3 hrs", maxMarks: 100 },
      { name: "Science", date: "2024-11-18", time: "9:00 AM", duration: "3 hrs", maxMarks: 100 },
      { name: "English", date: "2024-11-21", time: "9:00 AM", duration: "3 hrs", maxMarks: 100 },
      { name: "Hindi", date: "2024-11-24", time: "9:00 AM", duration: "3 hrs", maxMarks: 100 },
      { name: "Social Studies", date: "2024-11-27", time: "9:00 AM", duration: "3 hrs", maxMarks: 100 },
    ],
  },
];

const subjectsList = ["Mathematics", "Science", "English", "Hindi", "Social Studies"];

function genGrades(name: string, id: string, cls: string, sec: string, roll: string, scores: number[]): StudentGrade {
  const subjects: SubjectGrade[] = subjectsList.map((s, i) => ({
    subject: s, maxMarks: 100, obtained: scores[i], grade: getGrade(scores[i]),
  }));
  const total = scores.reduce((a, b) => a + b, 0);
  const pct = Math.round((total / 500) * 100 * 10) / 10;
  return { studentId: id, studentName: name, class: cls, section: sec, rollNumber: roll, subjects, totalMarks: total, maxTotal: 500, percentage: pct, grade: getGrade(pct), rank: 0 };
}

export const STUDENT_GRADES: StudentGrade[] = [
  genGrades("Priya Sharma", "STU002", "10", "A", "1002", [95, 92, 88, 90, 85]),
  genGrades("Arjun Singh", "STU001", "10", "A", "1001", [88, 85, 92, 78, 82]),
  genGrades("Aditya Kumar", "STU009", "10", "B", "1015", [82, 90, 78, 85, 88]),
  genGrades("Sneha Patel", "STU006", "11", "A", "1101", [96, 94, 91, 93, 97]),
  genGrades("Karan Mehra", "STU007", "12", "B", "1205", [78, 82, 85, 70, 75]),
  genGrades("Rahul Verma", "STU003", "8", "B", "803", [72, 68, 75, 65, 70]),
  genGrades("Ananya Gupta", "STU004", "6", "C", "605", [85, 80, 88, 82, 79]),
  genGrades("Vikram Joshi", "STU005", "9", "A", "901", [70, 65, 78, 60, 72]),
  genGrades("Isha Reddy", "STU008", "7", "A", "702", [80, 76, 82, 74, 78]),
  genGrades("Diya Nair", "STU010", "5", "A", "501", [90, 88, 92, 86, 91]),
].sort((a, b) => b.percentage - a.percentage).map((s, i) => ({ ...s, rank: i + 1 }));

export const CLASS_PERFORMANCE: ClassPerformance[] = [
  { class: "5", avgPercentage: 82.4, passPercentage: 98, topperName: "Diya Nair", topperScore: 89.4 },
  { class: "6", avgPercentage: 78.6, passPercentage: 95, topperName: "Ananya Gupta", topperScore: 82.8 },
  { class: "7", avgPercentage: 75.2, passPercentage: 93, topperName: "Isha Reddy", topperScore: 78.0 },
  { class: "8", avgPercentage: 72.8, passPercentage: 90, topperName: "Rahul Verma", topperScore: 70.0 },
  { class: "9", avgPercentage: 70.5, passPercentage: 88, topperName: "Vikram Joshi", topperScore: 69.0 },
  { class: "10", avgPercentage: 79.3, passPercentage: 96, topperName: "Priya Sharma", topperScore: 90.0 },
  { class: "11", avgPercentage: 81.7, passPercentage: 97, topperName: "Sneha Patel", topperScore: 94.2 },
  { class: "12", avgPercentage: 74.1, passPercentage: 91, topperName: "Karan Mehra", topperScore: 78.0 },
];

export const SUBJECT_PERFORMANCE: SubjectPerformance[] = [
  { subject: "Mathematics", avgScore: 78.2, highestScore: 96, lowestScore: 42, passRate: 89 },
  { subject: "Science", avgScore: 80.1, highestScore: 94, lowestScore: 38, passRate: 91 },
  { subject: "English", avgScore: 82.5, highestScore: 92, lowestScore: 45, passRate: 94 },
  { subject: "Hindi", avgScore: 76.8, highestScore: 93, lowestScore: 35, passRate: 87 },
  { subject: "Social Studies", avgScore: 79.4, highestScore: 97, lowestScore: 40, passRate: 90 },
];
