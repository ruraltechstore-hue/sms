import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth, ROLE_DASHBOARD } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_DASHBOARD[user.role]} replace />;
}

function WrappedPage({ children }: { children: React.ReactNode }) {
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
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/dashboard/admin" element={<WrappedPage><Dashboard /></WrappedPage>} />
          <Route path="/dashboard/teacher" element={<WrappedPage><Dashboard /></WrappedPage>} />
          <Route path="/dashboard/student" element={<WrappedPage><Dashboard /></WrappedPage>} />
          <Route path="/dashboard/parent" element={<WrappedPage><Dashboard /></WrappedPage>} />
          <Route path="/admissions" element={<WrappedPage><Admissions /></WrappedPage>} />
          <Route path="/attendance" element={<WrappedPage><Attendance /></WrappedPage>} />
          <Route path="/fees" element={<WrappedPage><Fees /></WrappedPage>} />
          <Route path="/messaging" element={<WrappedPage><Messaging /></WrappedPage>} />
          <Route path="/exams" element={<WrappedPage><Exams /></WrappedPage>} />
          <Route path="/staff" element={<WrappedPage><Staff /></WrappedPage>} />
          <Route path="/parent-portal" element={<WrappedPage><ParentPortal /></WrappedPage>} />
          <Route path="/settings" element={<WrappedPage><Settings /></WrappedPage>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
