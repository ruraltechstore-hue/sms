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

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isOwn: boolean;
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

export const ANNOUNCEMENTS: Announcement[] = [
  { id: "a1", title: "Annual Day Celebration", message: "We are pleased to announce that the Annual Day celebration will be held on February 15th. All parents are invited to attend.", author: "Principal - Dr. Sharma", date: "Jan 15, 2025", priority: "high", audience: "All Parents & Students", channel: "all", status: "sent" },
  { id: "a2", title: "Fee Payment Reminder", message: "This is a reminder that the last date for fee payment for Q3 is January 31st. Late fees will apply after the deadline.", author: "Accounts Dept.", date: "Jan 14, 2025", priority: "high", audience: "All Parents", channel: "sms", status: "sent" },
  { id: "a3", title: "Winter Uniform Notice", message: "Students must wear winter uniforms starting January 20th. Please ensure your child has the correct uniform.", author: "Admin Office", date: "Jan 13, 2025", priority: "medium", audience: "All Students", channel: "email", status: "sent" },
  { id: "a4", title: "PTM Schedule - Class 10", message: "Parent-Teacher Meeting for Class 10 is scheduled for January 25th, Saturday from 9 AM to 1 PM.", author: "Class Coordinator", date: "Jan 12, 2025", priority: "medium", audience: "Class 10 Parents", channel: "whatsapp", status: "sent" },
  { id: "a5", title: "Science Fair Registration", message: "Registration for the inter-school science fair is now open. Interested students should register by January 20th.", author: "Science Dept.", date: "Jan 11, 2025", priority: "low", audience: "Class 8-12 Students", channel: "email", status: "scheduled" },
  { id: "a6", title: "Board Exam Preparation Tips", message: "A special session on board exam preparation strategies will be conducted on January 18th for Class 10 and 12 students.", author: "Academic Head", date: "Jan 10, 2025", priority: "high", audience: "Class 10 & 12", channel: "all", status: "draft" },
];

export const GROUP_CHATS: GroupChat[] = [
  {
    id: "g1", name: "Class 10-A Parents", members: 42, lastMessage: "Thank you for the update!", lastMessageTime: "2:30 PM", unread: 3, avatar: "10A",
    messages: [
      { id: "m1", sender: "Mrs. Gupta", text: "Has the exam schedule been released?", time: "2:10 PM", isOwn: false },
      { id: "m2", sender: "You", text: "Yes, it will be shared by tomorrow.", time: "2:15 PM", isOwn: true },
      { id: "m3", sender: "Mr. Verma", text: "Thank you for the update!", time: "2:30 PM", isOwn: false },
    ],
  },
  {
    id: "g2", name: "Staff Room", members: 35, lastMessage: "Meeting at 3 PM today", lastMessageTime: "1:45 PM", unread: 1, avatar: "SR",
    messages: [
      { id: "m4", sender: "Dr. Sharma", text: "Please submit your monthly reports by Friday.", time: "1:00 PM", isOwn: false },
      { id: "m5", sender: "You", text: "Will do, sir.", time: "1:20 PM", isOwn: true },
      { id: "m6", sender: "Mrs. Patel", text: "Meeting at 3 PM today", time: "1:45 PM", isOwn: false },
    ],
  },
  {
    id: "g3", name: "Science Department", members: 8, lastMessage: "Lab equipment has arrived", lastMessageTime: "12:00 PM", unread: 0, avatar: "SD",
    messages: [
      { id: "m7", sender: "Mr. Roy", text: "The new lab equipment order has been placed.", time: "11:00 AM", isOwn: false },
      { id: "m8", sender: "You", text: "Great! When will it arrive?", time: "11:30 AM", isOwn: true },
      { id: "m9", sender: "Mr. Roy", text: "Lab equipment has arrived", time: "12:00 PM", isOwn: false },
    ],
  },
  {
    id: "g4", name: "Class 12-B Students", members: 38, lastMessage: "Good luck for the exams!", lastMessageTime: "11:30 AM", unread: 5, avatar: "12B",
    messages: [
      { id: "m10", sender: "Arjun", text: "Can we get extra practice papers?", time: "10:00 AM", isOwn: false },
      { id: "m11", sender: "You", text: "I'll share them today evening.", time: "10:30 AM", isOwn: true },
      { id: "m12", sender: "Priya", text: "Good luck for the exams!", time: "11:30 AM", isOwn: false },
    ],
  },
  {
    id: "g5", name: "Transport Committee", members: 12, lastMessage: "Route 5 delayed by 10 mins", lastMessageTime: "8:15 AM", unread: 0, avatar: "TC",
    messages: [
      { id: "m13", sender: "Driver - Ramu", text: "Route 5 delayed by 10 mins", time: "8:15 AM", isOwn: false },
    ],
  },
];

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "New Admission Application", description: "Rahul Sharma has submitted a new admission application for Class 6.", type: "info", date: "2 min ago", read: false, module: "Admissions" },
  { id: "n2", title: "Fee Overdue Alert", description: "15 students have overdue fee payments for January 2025.", type: "warning", date: "15 min ago", read: false, module: "Fees" },
  { id: "n3", title: "Attendance Below Threshold", description: "3 students in Class 9-B have attendance below 75%.", type: "error", date: "1 hour ago", read: false, module: "Attendance" },
  { id: "n4", title: "Exam Results Published", description: "Mid-term exam results for Class 8 have been published successfully.", type: "success", date: "2 hours ago", read: true, module: "Exams" },
  { id: "n5", title: "Leave Request Approved", description: "Mrs. Patel's leave request for Jan 20-22 has been approved.", type: "success", date: "3 hours ago", read: true, module: "Staff" },
  { id: "n6", title: "System Maintenance", description: "Scheduled maintenance on Jan 18, 2 AM - 4 AM. System may be unavailable.", type: "info", date: "5 hours ago", read: true, module: "System" },
  { id: "n7", title: "New Message from Parent", description: "Mrs. Gupta sent a message regarding PTM schedule.", type: "info", date: "6 hours ago", read: true, module: "Messaging" },
  { id: "n8", title: "Low Inventory Alert", description: "Science lab chemicals inventory is running low.", type: "warning", date: "1 day ago", read: true, module: "Inventory" },
];
