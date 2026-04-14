import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { DashboardLayout } from "@/components/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function DashboardPage() {
  return (
    <DashboardLayout>
      <Dashboard />
    </DashboardLayout>
  );
}

function PlaceholderModule({ title }: { title: string }) {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">This module is coming soon.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/students" element={<PlaceholderModule title="Student Management" />} />
            <Route path="/dashboard/staff" element={<PlaceholderModule title="Staff & HR" />} />
            <Route path="/dashboard/attendance" element={<PlaceholderModule title="Attendance" />} />
            <Route path="/dashboard/fees" element={<PlaceholderModule title="Fee Management" />} />
            <Route path="/dashboard/exams" element={<PlaceholderModule title="Examinations" />} />
            <Route path="/dashboard/messages" element={<PlaceholderModule title="Messaging" />} />
            <Route path="/dashboard/erp" element={<PlaceholderModule title="School ERP" />} />
            <Route path="/dashboard/settings" element={<PlaceholderModule title="Settings" />} />
            <Route path="/dashboard/schools" element={<PlaceholderModule title="Schools" />} />
            <Route path="/dashboard/users" element={<PlaceholderModule title="User Management" />} />
            <Route path="/dashboard/finance" element={<PlaceholderModule title="Finance" />} />
            <Route path="/dashboard/reports" element={<PlaceholderModule title="Reports" />} />
            <Route path="/dashboard/classes" element={<PlaceholderModule title="My Classes" />} />
            <Route path="/dashboard/timetable" element={<PlaceholderModule title="Timetable" />} />
            <Route path="/dashboard/results" element={<PlaceholderModule title="Results" />} />
            <Route path="/dashboard/library" element={<PlaceholderModule title="Library" />} />
            <Route path="/dashboard/children" element={<PlaceholderModule title="My Children" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
