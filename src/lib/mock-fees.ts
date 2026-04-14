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

export const FEE_STRUCTURES: FeeStructure[] = [
  { id: "FS001", name: "Tuition Fee", class: "All", amount: 15000, frequency: "quarterly", category: "tuition", dueDate: "1st of quarter" },
  { id: "FS002", name: "Transport Fee", class: "All", amount: 3000, frequency: "monthly", category: "transport", dueDate: "5th of month" },
  { id: "FS003", name: "Lab Fee", class: "9-12", amount: 5000, frequency: "annually", category: "lab", dueDate: "April 15" },
  { id: "FS004", name: "Library Fee", class: "All", amount: 2000, frequency: "annually", category: "library", dueDate: "April 15" },
  { id: "FS005", name: "Sports Fee", class: "All", amount: 3500, frequency: "annually", category: "sports", dueDate: "April 15" },
  { id: "FS006", name: "Exam Fee", class: "All", amount: 2500, frequency: "quarterly", category: "exam", dueDate: "Before exams" },
  { id: "FS007", name: "Development Fund", class: "All", amount: 10000, frequency: "one-time", category: "misc", dueDate: "At admission" },
];

export const FEE_PAYMENTS: FeePayment[] = [
  { id: "FP001", studentId: "STU001", studentName: "Arjun Singh", class: "10", section: "A", amount: 15000, paidAmount: 15000, dueDate: "2025-01-01", paidDate: "2025-01-03", status: "paid", method: "online", receiptNo: "RCP-2025-001", feeType: "Tuition Fee" },
  { id: "FP002", studentId: "STU002", studentName: "Priya Sharma", class: "10", section: "A", amount: 15000, paidAmount: 15000, dueDate: "2025-01-01", paidDate: "2025-01-02", status: "paid", method: "upi", receiptNo: "RCP-2025-002", feeType: "Tuition Fee" },
  { id: "FP003", studentId: "STU003", studentName: "Rahul Verma", class: "8", section: "B", amount: 15000, paidAmount: 8000, dueDate: "2025-01-01", paidDate: "2025-01-10", status: "partial", method: "cash", receiptNo: "RCP-2025-003", feeType: "Tuition Fee" },
  { id: "FP004", studentId: "STU005", studentName: "Vikram Joshi", class: "9", section: "A", amount: 15000, paidAmount: 0, dueDate: "2025-01-01", status: "overdue", feeType: "Tuition Fee" },
  { id: "FP005", studentId: "STU004", studentName: "Ananya Gupta", class: "6", section: "C", amount: 3000, paidAmount: 3000, dueDate: "2025-01-05", paidDate: "2025-01-04", status: "paid", method: "online", receiptNo: "RCP-2025-004", feeType: "Transport Fee" },
  { id: "FP006", studentId: "STU006", studentName: "Sneha Patel", class: "11", section: "A", amount: 15000, paidAmount: 15000, dueDate: "2025-01-01", paidDate: "2025-01-01", status: "paid", method: "cheque", receiptNo: "RCP-2025-005", feeType: "Tuition Fee" },
  { id: "FP007", studentId: "STU007", studentName: "Karan Mehra", class: "12", section: "B", amount: 5000, paidAmount: 5000, dueDate: "2025-01-15", paidDate: "2025-01-14", status: "paid", method: "upi", receiptNo: "RCP-2025-006", feeType: "Lab Fee" },
  { id: "FP008", studentId: "STU008", studentName: "Isha Reddy", class: "7", section: "A", amount: 15000, paidAmount: 10000, dueDate: "2025-01-01", paidDate: "2025-01-08", status: "partial", method: "cash", receiptNo: "RCP-2025-007", feeType: "Tuition Fee" },
  { id: "FP009", studentId: "STU009", studentName: "Aditya Kumar", class: "10", section: "B", amount: 3000, paidAmount: 3000, dueDate: "2025-01-05", paidDate: "2025-01-05", status: "paid", method: "online", receiptNo: "RCP-2025-008", feeType: "Transport Fee" },
  { id: "FP010", studentId: "STU010", studentName: "Diya Nair", class: "5", section: "A", amount: 15000, paidAmount: 0, dueDate: "2025-01-01", status: "pending", feeType: "Tuition Fee" },
  { id: "FP011", studentId: "STU011", studentName: "Rohan Malhotra", class: "9", section: "B", amount: 15000, paidAmount: 0, dueDate: "2024-10-01", status: "overdue", feeType: "Tuition Fee" },
  { id: "FP012", studentId: "STU001", studentName: "Arjun Singh", class: "10", section: "A", amount: 3000, paidAmount: 3000, dueDate: "2025-01-05", paidDate: "2025-01-04", status: "paid", method: "upi", receiptNo: "RCP-2025-009", feeType: "Transport Fee" },
];

export const MONTHLY_COLLECTIONS: MonthlyCollection[] = [
  { month: "Aug", collected: 1820000, pending: 380000 },
  { month: "Sep", collected: 1950000, pending: 320000 },
  { month: "Oct", collected: 2100000, pending: 290000 },
  { month: "Nov", collected: 2050000, pending: 310000 },
  { month: "Dec", collected: 2200000, pending: 250000 },
  { month: "Jan", collected: 2450000, pending: 320000 },
];

export const CLASS_WISE_DUES = [
  { class: "5", total: 180000, collected: 155000, pending: 25000 },
  { class: "6", total: 210000, collected: 185000, pending: 25000 },
  { class: "7", total: 195000, collected: 160000, pending: 35000 },
  { class: "8", total: 225000, collected: 180000, pending: 45000 },
  { class: "9", total: 240000, collected: 195000, pending: 45000 },
  { class: "10", total: 260000, collected: 230000, pending: 30000 },
  { class: "11", total: 200000, collected: 185000, pending: 15000 },
  { class: "12", total: 210000, collected: 200000, pending: 10000 },
];

export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}
