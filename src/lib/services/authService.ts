import type { User } from "@/lib/types";

const DEMO_USERS: Record<string, User> = {
  "admin@school.com": { id: "1", name: "Admin User", email: "admin@school.com", role: "admin" },
  "teacher@school.com": { id: "2", name: "Teacher User", email: "teacher@school.com", role: "teacher" },
  "student@school.com": { id: "3", name: "Student User", email: "student@school.com", role: "student" },
  "parent@school.com": { id: "4", name: "Parent User", email: "parent@school.com", role: "parent" },
};

// TODO: Replace with actual API calls
export const authService = {
  login: async (email: string, _password: string): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return DEMO_USERS[email.toLowerCase()] || null;
  },
  logout: async (): Promise<boolean> => {
    return true;
  },
  getCurrentUser: async (): Promise<User | null> => {
    return null;
  },
  requestPasswordReset: async (_email: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return false;
  },
  resetPassword: async (_token: string, _newPassword: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return false;
  },
};
