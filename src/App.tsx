import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth, ROLE_DASHBOARD } from "@/lib/auth-context";
import { ProtectedRoute, PublicOnlyRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Admissions from "./pages/Admissions";
import Attendance from "./pages/Attendance";
import Fees from "./pages/Fees";
import Messaging from "./pages/Messaging";
import Exams from "./pages/Exams";
import Staff from "./pages/Staff";
import ParentPortal from "./pages/ParentPortal";
import Settings from "./pages/Settings";
import Transport from "./pages/Transport";
import Library from "./pages/Library";
import Hostel from "./pages/Hostel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function DashboardRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_DASHBOARD[user.role]} replace />;
}

/**
 * Wraps a page with auth + RBAC guard + the dashboard chrome.
 * The role check is automatically derived from the route path via
 * ROUTE_PERMISSIONS in src/lib/rbac.ts.
 */
function Guarded({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public landing */}
          <Route path="/" element={<Index />} />

          {/* Auth pages — redirect signed-in users away */}
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/signup" element={<PublicOnlyRoute><Signup /></PublicOnlyRoute>} />
          <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
          {/* /reset-password must stay accessible while a recovery session is active,
              so it is NOT wrapped in PublicOnlyRoute. */}
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Role-router for /dashboard */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Protected app — RBAC pulled from ROUTE_PERMISSIONS automatically */}
          {/* Per-role dashboards (one per role) */}
          <Route path="/dashboard/principal"        element={<Guarded><Dashboard /></Guarded>} />
          <Route path="/dashboard/admin"            element={<Guarded><Dashboard /></Guarded>} />
          <Route path="/dashboard/front-desk"       element={<Guarded><Dashboard /></Guarded>} />
          <Route path="/dashboard/teacher"          element={<Guarded><Dashboard /></Guarded>} />
          <Route path="/dashboard/class-teacher"    element={<Guarded><Dashboard /></Guarded>} />
          <Route path="/dashboard/exam-coordinator" element={<Guarded><Dashboard /></Guarded>} />
          <Route path="/dashboard/transport"        element={<Guarded><Dashboard /></Guarded>} />
          <Route path="/dashboard/librarian"        element={<Guarded><Dashboard /></Guarded>} />
          <Route path="/dashboard/hostel"           element={<Guarded><Dashboard /></Guarded>} />
          <Route path="/dashboard/student"          element={<Guarded><Dashboard /></Guarded>} />
          <Route path="/dashboard/parent"           element={<Guarded><Dashboard /></Guarded>} />

          {/* Modules */}
          <Route path="/admissions"    element={<Guarded><Admissions /></Guarded>} />
          <Route path="/attendance"    element={<Guarded><Attendance /></Guarded>} />
          <Route path="/fees"          element={<Guarded><Fees /></Guarded>} />
          <Route path="/messaging"     element={<Guarded><Messaging /></Guarded>} />
          <Route path="/exams"         element={<Guarded><Exams /></Guarded>} />
          <Route path="/staff"         element={<Guarded><Staff /></Guarded>} />
          <Route path="/parent-portal" element={<Guarded><ParentPortal /></Guarded>} />
          <Route path="/transport"     element={<Guarded><Transport /></Guarded>} />
          <Route path="/library"       element={<Guarded><Library /></Guarded>} />
          <Route path="/hostel"        element={<Guarded><Hostel /></Guarded>} />
          <Route path="/settings"      element={<Guarded><Settings /></Guarded>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
