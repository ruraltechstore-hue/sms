import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { ROLE_DASHBOARD } from "@/lib/auth-context";
import { canAccessRoute } from "@/lib/rbac";
import type { UserRole } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Optional explicit role list. If omitted, the guard derives the
   * allowed roles from ROUTE_PERMISSIONS using the current pathname,
   * so route configuration stays in one place (src/lib/rbac.ts).
   */
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const toastedRef = useRef(false);

  const allowed = user
    ? allowedRoles
      ? allowedRoles.includes(user.role)
      : canAccessRoute(user.role, location.pathname)
    : false;

  // Fire the "forbidden" toast as a side-effect so it survives the
  // synchronous Navigate that happens on the same render.
  useEffect(() => {
    if (!loading && user && !allowed && !toastedRef.current) {
      toastedRef.current = true;
      toast.error("You don't have access to that page.", {
        description: "Redirected to your dashboard.",
      });
    }
  }, [loading, user, allowed]);

  // 1. Still hydrating the session — show a centered spinner so we
  //    don't flash a redirect to /login for a logged-in user.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // 2. Not signed in → bounce to /login, remember the attempted URL
  //    so we can return after login (future enhancement).
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // 3. Signed in but role doesn't match → send to their own dashboard,
  //    not /login (which would feel like being signed out).
  if (!allowed) {
    return <Navigate to={ROLE_DASHBOARD[user.role]} replace />;
  }

  return <>{children}</>;
}

/**
 * Inverse guard: blocks already-authenticated users from /login,
 * /signup, /forgot-password, /reset-password — sends them straight
 * to their own dashboard.
 */
export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={ROLE_DASHBOARD[user.role]} replace />;
  }

  return <>{children}</>;
}
