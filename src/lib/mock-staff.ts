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

export const DEPARTMENTS: Department[] = [
  { name: "Mathematics", hod: "Dr. Amit Patel", staffCount: 14, type: "academic" },
  { name: "Science", hod: "Dr. Meena Kumari", staffCount: 18, type: "academic" },
  { name: "English", hod: "Mrs. Sunita Roy", staffCount: 12, type: "academic" },
  { name: "Hindi", hod: "Mr. Devendra Mishra", staffCount: 10, type: "academic" },
  { name: "Social Studies", hod: "Mrs. Kavita Jain", staffCount: 11, type: "academic" },
  { name: "Computer Science", hod: "Mr. Sanjay Rao", staffCount: 8, type: "academic" },
  { name: "Physical Education", hod: "Mr. Vikram Rathi", staffCount: 6, type: "academic" },
  { name: "Arts & Music", hod: "Mrs. Prerna Desai", staffCount: 5, type: "academic" },
  { name: "Administration", hod: "Mr. Raghav Sharma", staffCount: 15, type: "administrative" },
  { name: "Accounts", hod: "Mrs. Nisha Agarwal", staffCount: 6, type: "administrative" },
  { name: "IT & Support", hod: "Mr. Arjun Nair", staffCount: 4, type: "administrative" },
  { name: "Library", hod: "Mrs. Sonia Das", staffCount: 3, type: "administrative" },
];

export const MOCK_STAFF: StaffMember[] = [
  { id: "STF001", name: "Dr. Amit Patel", email: "amit.p@school.com", phone: "9800010001", department: "Mathematics", designation: "HOD", qualification: "Ph.D. Mathematics", experience: 18, joinDate: "2010-06-15", status: "active", type: "teaching", gender: "male", dateOfBirth: "1978-03-12", address: "12 Faculty Colony, Delhi", salary: 95000, subjects: ["Mathematics", "Statistics"], classIncharge: "12-A" },
  { id: "STF002", name: "Dr. Meena Kumari", email: "meena.k@school.com", phone: "9800010002", department: "Science", designation: "HOD", qualification: "Ph.D. Physics", experience: 15, joinDate: "2012-04-10", status: "active", type: "teaching", gender: "female", dateOfBirth: "1982-07-25", address: "45 Lake View, Mumbai", salary: 92000, subjects: ["Physics", "General Science"] },
  { id: "STF003", name: "Rajiv Menon", email: "rajiv.m@school.com", phone: "9800010003", department: "English", designation: "Senior Teacher", qualification: "M.A. English Literature", experience: 10, joinDate: "2016-07-01", status: "on-leave", type: "teaching", gender: "male", dateOfBirth: "1986-11-08", address: "78 Green Park, Kochi", salary: 68000, subjects: ["English Language", "English Literature"], classIncharge: "10-B" },
  { id: "STF004", name: "Sonia Das", email: "sonia.d@school.com", phone: "9800010004", department: "Library", designation: "Head Librarian", qualification: "M.Lib.Sc", experience: 12, joinDate: "2014-08-20", status: "active", type: "non-teaching", gender: "female", dateOfBirth: "1984-01-30", address: "23 Nehru Nagar, Pune", salary: 55000 },
  { id: "STF005", name: "Sunita Roy", email: "sunita.r@school.com", phone: "9800010005", department: "English", designation: "HOD", qualification: "M.A., B.Ed", experience: 20, joinDate: "2008-04-01", status: "active", type: "teaching", gender: "female", dateOfBirth: "1975-09-14", address: "56 Civil Lines, Kolkata", salary: 98000, subjects: ["English"], classIncharge: "11-A" },
  { id: "STF006", name: "Sanjay Rao", email: "sanjay.r@school.com", phone: "9800010006", department: "Computer Science", designation: "HOD", qualification: "M.Tech CS", experience: 11, joinDate: "2015-06-10", status: "active", type: "teaching", gender: "male", dateOfBirth: "1985-05-22", address: "34 IT Park Road, Bangalore", salary: 88000, subjects: ["Computer Science", "IT"] },
  { id: "STF007", name: "Kavita Jain", email: "kavita.j@school.com", phone: "9800010007", department: "Social Studies", designation: "HOD", qualification: "M.A. History, B.Ed", experience: 16, joinDate: "2011-04-15", status: "active", type: "teaching", gender: "female", dateOfBirth: "1980-12-03", address: "89 Adarsh Nagar, Jaipur", salary: 90000, subjects: ["History", "Political Science"] },
  { id: "STF008", name: "Vikram Rathi", email: "vikram.r@school.com", phone: "9800010008", department: "Physical Education", designation: "HOD", qualification: "M.P.Ed", experience: 14, joinDate: "2013-07-01", status: "active", type: "teaching", gender: "male", dateOfBirth: "1981-08-18", address: "12 Stadium Road, Lucknow", salary: 72000, subjects: ["Physical Education"] },
  { id: "STF009", name: "Raghav Sharma", email: "raghav.s@school.com", phone: "9800010009", department: "Administration", designation: "Admin Head", qualification: "MBA", experience: 22, joinDate: "2006-01-10", status: "active", type: "non-teaching", gender: "male", dateOfBirth: "1974-04-05", address: "67 Sector 15, Chandigarh", salary: 85000 },
  { id: "STF010", name: "Prerna Desai", email: "prerna.d@school.com", phone: "9800010010", department: "Arts & Music", designation: "HOD", qualification: "M.F.A.", experience: 9, joinDate: "2017-08-01", status: "active", type: "teaching", gender: "female", dateOfBirth: "1988-02-28", address: "45 Art Colony, Ahmedabad", salary: 65000, subjects: ["Fine Arts", "Music"] },
  { id: "STF011", name: "Nisha Agarwal", email: "nisha.a@school.com", phone: "9800010011", department: "Accounts", designation: "Chief Accountant", qualification: "CA", experience: 13, joinDate: "2013-11-01", status: "active", type: "non-teaching", gender: "female", dateOfBirth: "1983-06-17", address: "78 MG Road, Indore", salary: 82000 },
  { id: "STF012", name: "Arjun Nair", email: "arjun.n@school.com", phone: "9800010012", department: "IT & Support", designation: "IT Manager", qualification: "B.Tech IT", experience: 7, joinDate: "2019-03-15", status: "active", type: "non-teaching", gender: "male", dateOfBirth: "1990-10-12", address: "23 Techno Park, Trivandrum", salary: 70000 },
];

export const LEAVE_RECORDS: LeaveRecord[] = [
  { id: "LV001", staffId: "STF003", staffName: "Rajiv Menon", department: "English", leaveType: "sick", fromDate: "2025-01-13", toDate: "2025-01-17", days: 5, reason: "Medical procedure and recovery", status: "approved", appliedOn: "2025-01-10" },
  { id: "LV002", staffId: "STF005", staffName: "Sunita Roy", department: "English", leaveType: "casual", fromDate: "2025-01-20", toDate: "2025-01-21", days: 2, reason: "Family function", status: "pending", appliedOn: "2025-01-15" },
  { id: "LV003", staffId: "STF008", staffName: "Vikram Rathi", department: "Physical Education", leaveType: "earned", fromDate: "2025-02-01", toDate: "2025-02-05", days: 5, reason: "Annual vacation", status: "pending", appliedOn: "2025-01-14" },
  { id: "LV004", staffId: "STF010", staffName: "Prerna Desai", department: "Arts & Music", leaveType: "casual", fromDate: "2025-01-08", toDate: "2025-01-08", days: 1, reason: "Personal work", status: "approved", appliedOn: "2025-01-06" },
  { id: "LV005", staffId: "STF001", staffName: "Dr. Amit Patel", department: "Mathematics", leaveType: "sick", fromDate: "2025-01-02", toDate: "2025-01-03", days: 2, reason: "Fever", status: "approved", appliedOn: "2025-01-02" },
  { id: "LV006", staffId: "STF012", staffName: "Arjun Nair", department: "IT & Support", leaveType: "casual", fromDate: "2025-01-22", toDate: "2025-01-22", days: 1, reason: "Bank work", status: "rejected", appliedOn: "2025-01-18" },
  { id: "LV007", staffId: "STF006", staffName: "Sanjay Rao", department: "Computer Science", leaveType: "earned", fromDate: "2025-01-27", toDate: "2025-01-31", days: 5, reason: "Family trip", status: "pending", appliedOn: "2025-01-16" },
];
