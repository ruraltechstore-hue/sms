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

export const MOCK_STUDENTS: Student[] = [
  { id: "STU001", name: "Arjun Singh", email: "arjun@school.com", phone: "9876543210", class: "10", section: "A", rollNumber: "1001", admissionDate: "2023-04-15", status: "active", gender: "male", dateOfBirth: "2008-06-12", bloodGroup: "O+", address: "123 MG Road, Delhi", fatherName: "Rajendra Singh", motherName: "Kavita Singh", guardianPhone: "9876500001", guardianEmail: "rajendra@email.com", previousSchool: "DPS Noida", attendance: 94.2, cgpa: 8.7, feeStatus: "paid" },
  { id: "STU002", name: "Priya Sharma", email: "priya@school.com", phone: "9876543211", class: "10", section: "A", rollNumber: "1002", admissionDate: "2023-04-15", status: "active", gender: "female", dateOfBirth: "2008-09-23", bloodGroup: "A+", address: "45 Nehru Nagar, Mumbai", fatherName: "Amit Sharma", motherName: "Sunita Sharma", guardianPhone: "9876500002", guardianEmail: "amit.sharma@email.com", previousSchool: "Ryan International", attendance: 97.1, cgpa: 9.2, feeStatus: "paid" },
  { id: "STU003", name: "Rahul Verma", email: "rahul@school.com", phone: "9876543212", class: "8", section: "B", rollNumber: "803", admissionDate: "2024-04-10", status: "active", gender: "male", dateOfBirth: "2010-01-05", bloodGroup: "B+", address: "78 Park Avenue, Pune", fatherName: "Suresh Verma", motherName: "Anita Verma", guardianPhone: "9876500003", guardianEmail: "suresh.v@email.com", previousSchool: "Kendriya Vidyalaya", attendance: 88.5, cgpa: 7.4, feeStatus: "partial" },
  { id: "STU004", name: "Ananya Gupta", email: "ananya@school.com", phone: "9876543213", class: "6", section: "C", rollNumber: "605", admissionDate: "2024-06-01", status: "active", gender: "female", dateOfBirth: "2012-03-18", bloodGroup: "AB+", address: "12 Civil Lines, Jaipur", fatherName: "Vikram Gupta", motherName: "Neha Gupta", guardianPhone: "9876500004", guardianEmail: "vikram.g@email.com", previousSchool: "St. Xavier's", attendance: 91.3, cgpa: 8.1, feeStatus: "paid" },
  { id: "STU005", name: "Vikram Joshi", email: "vikram.j@school.com", phone: "9876543214", class: "9", section: "A", rollNumber: "901", admissionDate: "2023-04-15", status: "active", gender: "male", dateOfBirth: "2009-11-30", bloodGroup: "O-", address: "56 Station Road, Lucknow", fatherName: "Manoj Joshi", motherName: "Priti Joshi", guardianPhone: "9876500005", guardianEmail: "manoj.j@email.com", previousSchool: "La Martiniere", attendance: 85.7, cgpa: 7.9, feeStatus: "pending" },
  { id: "STU006", name: "Sneha Patel", email: "sneha@school.com", phone: "9876543215", class: "11", section: "A", rollNumber: "1101", admissionDate: "2022-04-10", status: "active", gender: "female", dateOfBirth: "2007-07-22", bloodGroup: "A-", address: "34 Lake View, Ahmedabad", fatherName: "Dinesh Patel", motherName: "Rupa Patel", guardianPhone: "9876500006", guardianEmail: "dinesh.p@email.com", previousSchool: "Udgam School", attendance: 96.8, cgpa: 9.5, feeStatus: "paid" },
  { id: "STU007", name: "Karan Mehra", email: "karan@school.com", phone: "9876543216", class: "12", section: "B", rollNumber: "1205", admissionDate: "2021-04-15", status: "active", gender: "male", dateOfBirth: "2006-02-14", bloodGroup: "B-", address: "89 Green Park, Chandigarh", fatherName: "Rakesh Mehra", motherName: "Sonia Mehra", guardianPhone: "9876500007", guardianEmail: "rakesh.m@email.com", previousSchool: "Vivek High School", attendance: 92.4, cgpa: 8.3, feeStatus: "paid" },
  { id: "STU008", name: "Isha Reddy", email: "isha@school.com", phone: "9876543217", class: "7", section: "A", rollNumber: "702", admissionDate: "2024-04-10", status: "active", gender: "female", dateOfBirth: "2011-12-08", bloodGroup: "O+", address: "23 Jubilee Hills, Hyderabad", fatherName: "Srinivas Reddy", motherName: "Lakshmi Reddy", guardianPhone: "9876500008", guardianEmail: "srinivas.r@email.com", previousSchool: "Meridian School", attendance: 89.9, cgpa: 7.6, feeStatus: "partial" },
  { id: "STU009", name: "Aditya Kumar", email: "aditya@school.com", phone: "9876543218", class: "10", section: "B", rollNumber: "1015", admissionDate: "2023-04-15", status: "active", gender: "male", dateOfBirth: "2008-04-25", bloodGroup: "AB-", address: "67 Koramangala, Bangalore", fatherName: "Praveen Kumar", motherName: "Deepa Kumar", guardianPhone: "9876500009", guardianEmail: "praveen.k@email.com", previousSchool: "Bishop Cotton", attendance: 93.6, cgpa: 8.9, feeStatus: "paid" },
  { id: "STU010", name: "Diya Nair", email: "diya@school.com", phone: "9876543219", class: "5", section: "A", rollNumber: "501", admissionDate: "2024-06-01", status: "active", gender: "female", dateOfBirth: "2013-08-16", bloodGroup: "A+", address: "45 Marine Drive, Kochi", fatherName: "Sunil Nair", motherName: "Asha Nair", guardianPhone: "9876500010", guardianEmail: "sunil.n@email.com", previousSchool: "Choice School", attendance: 95.2, cgpa: 8.8, feeStatus: "paid" },
  { id: "STU011", name: "Rohan Malhotra", email: "rohan@school.com", phone: "9876543220", class: "9", section: "B", rollNumber: "912", admissionDate: "2023-06-01", status: "inactive", gender: "male", dateOfBirth: "2009-10-03", bloodGroup: "B+", address: "12 Connaught Place, Delhi", fatherName: "Ajay Malhotra", motherName: "Meera Malhotra", guardianPhone: "9876500011", guardianEmail: "ajay.m@email.com", previousSchool: "Modern School", attendance: 76.3, cgpa: 6.8, feeStatus: "pending" },
  { id: "STU012", name: "Meera Iyer", email: "meera@school.com", phone: "9876543221", class: "12", section: "A", rollNumber: "1201", admissionDate: "2021-04-10", status: "alumni", gender: "female", dateOfBirth: "2006-05-20", bloodGroup: "O+", address: "78 T. Nagar, Chennai", fatherName: "Ramesh Iyer", motherName: "Geetha Iyer", guardianPhone: "9876500012", guardianEmail: "ramesh.i@email.com", previousSchool: "PSBB School", attendance: 98.1, cgpa: 9.8, feeStatus: "paid" },
];

export const CLASS_OPTIONS = ["5", "6", "7", "8", "9", "10", "11", "12"];
export const SECTION_OPTIONS = ["A", "B", "C", "D"];
export const STATUS_OPTIONS: Student["status"][] = ["active", "inactive", "alumni"];
