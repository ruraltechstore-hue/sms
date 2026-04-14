import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap, LayoutDashboard, Users, CalendarDays, CreditCard,
  MessageSquare, Building2, ClipboardCheck, UserCog, BookOpen,
  LogOut, ChevronLeft, Menu,
} from "lucide-react";
import { useAuth, UserRole, ROLE_LABELS } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
}

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  super_admin: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Building2, label: "Schools", href: "/dashboard/schools" },
    { icon: Users, label: "All Users", href: "/dashboard/users" },
    { icon: CreditCard, label: "Finance", href: "/dashboard/finance" },
    { icon: ClipboardCheck, label: "Reports", href: "/dashboard/reports" },
    { icon: UserCog, label: "Settings", href: "/dashboard/settings" },
  ],
  school_admin: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: GraduationCap, label: "Students", href: "/dashboard/students" },
    { icon: Users, label: "Staff", href: "/dashboard/staff" },
    { icon: CalendarDays, label: "Attendance", href: "/dashboard/attendance" },
    { icon: CreditCard, label: "Fees", href: "/dashboard/fees" },
    { icon: ClipboardCheck, label: "Exams", href: "/dashboard/exams" },
    { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
    { icon: Building2, label: "ERP", href: "/dashboard/erp" },
    { icon: UserCog, label: "Settings", href: "/dashboard/settings" },
  ],
  teacher: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "My Classes", href: "/dashboard/classes" },
    { icon: CalendarDays, label: "Attendance", href: "/dashboard/attendance" },
    { icon: ClipboardCheck, label: "Exams", href: "/dashboard/exams" },
    { icon: CalendarDays, label: "Timetable", href: "/dashboard/timetable" },
    { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  ],
  student: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: CalendarDays, label: "Attendance", href: "/dashboard/attendance" },
    { icon: ClipboardCheck, label: "Results", href: "/dashboard/results" },
    { icon: CreditCard, label: "Fees", href: "/dashboard/fees" },
    { icon: CalendarDays, label: "Timetable", href: "/dashboard/timetable" },
    { icon: BookOpen, label: "Library", href: "/dashboard/library" },
  ],
  parent: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: GraduationCap, label: "My Children", href: "/dashboard/children" },
    { icon: CalendarDays, label: "Attendance", href: "/dashboard/attendance" },
    { icon: ClipboardCheck, label: "Results", href: "/dashboard/results" },
    { icon: CreditCard, label: "Fees", href: "/dashboard/fees" },
    { icon: MessageSquare, label: "Messages", href: "/dashboard/messages" },
  ],
};

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const navItems = NAV_BY_ROLE[user.role];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b">
        <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
          <GraduationCap className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && <span className="font-heading font-bold">EduVerse</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
            {user.name.charAt(0)}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { logout(); navigate("/"); }}
          className="w-full justify-start gap-2 text-muted-foreground"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Log out"}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 z-50 h-screen border-r bg-card transition-all duration-300",
          collapsed ? "w-[68px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 border-b bg-card/80 backdrop-blur-lg flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={() => setCollapsed(!collapsed)}>
              <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
            </Button>
            <h1 className="font-heading font-semibold text-lg">
              {navItems.find((n) => n.href === location.pathname)?.label || "Dashboard"}
            </h1>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
