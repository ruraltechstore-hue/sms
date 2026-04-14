import React, { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "super_admin" | "school_admin" | "teacher" | "student" | "parent";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS: Record<UserRole, User> = {
  super_admin: { id: "1", name: "Rajesh Kumar", email: "admin@school.com", role: "super_admin" },
  school_admin: { id: "2", name: "Priya Sharma", email: "school@school.com", role: "school_admin" },
  teacher: { id: "3", name: "Amit Patel", email: "teacher@school.com", role: "teacher" },
  student: { id: "4", name: "Arjun Singh", email: "student@school.com", role: "student" },
  parent: { id: "5", name: "Sunita Devi", email: "parent@school.com", role: "parent" },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((_email: string, _password: string, role: UserRole) => {
    setUser(DEMO_USERS[role]);
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  school_admin: "School Admin",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};
