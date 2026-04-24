import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import type { User, UserRole } from "@/lib/types";
import { authService } from "@/lib/services/authService";
import { supabase } from "@/integrations/supabase/client";
import { isReadOnlyRole } from "@/lib/rbac";

export type { UserRole, User };

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const ROLE_LABELS: Record<UserRole, string> = {
  principal: "Principal",
  sms_admin: "SMS Admin",
  front_desk: "Front Desk",
  teacher: "Teacher",
  class_teacher: "Class Teacher",
  exam_coordinator: "Exam Coordinator",
  transport_manager: "Transport Manager",
  librarian: "Librarian",
  hostel_warden: "Hostel Warden",
  student: "Student",
  parent: "Parent",
};

/**
 * One dedicated dashboard route per role.
 */
export const ROLE_DASHBOARD: Record<UserRole, string> = {
  principal:         "/dashboard/principal",
  sms_admin:         "/dashboard/admin",
  front_desk:        "/dashboard/front-desk",
  teacher:           "/dashboard/teacher",
  class_teacher:     "/dashboard/class-teacher",
  exam_coordinator:  "/dashboard/exam-coordinator",
  transport_manager: "/dashboard/transport",
  librarian:         "/dashboard/librarian",
  hostel_warden:     "/dashboard/hostel",
  student:           "/dashboard/student",
  parent:            "/dashboard/parent",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate session on mount + subscribe to auth state changes.
  useEffect(() => {
    let mounted = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (!session?.user) {
        setUser(null);
        return;
      }
      // Defer role lookup to avoid deadlocks inside the listener callback.
      setTimeout(async () => {
        const u = await authService.buildUser(
          session.user.id,
          session.user.email ?? "",
          session.user.user_metadata
        );
        if (mounted) setUser(u);
      }, 0);
    });

    authService.getCurrentUser().then((u) => {
      if (!mounted) return;
      setUser(u);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      if (result) {
        setUser(result);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(
    async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
      setLoading(true);
      try {
        const result = await authService.signup(email, password, name, role);
        if (result) {
          setUser(result);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, isAuthenticated: !!user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
