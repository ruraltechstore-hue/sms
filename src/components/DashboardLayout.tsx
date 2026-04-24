import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap, LayoutDashboard, Users, CalendarDays, CreditCard,
  MessageSquare, ClipboardCheck, BookOpen, Bus, Library, Home as HomeIcon,
  LogOut, ChevronLeft, Menu, Settings, X, Bell, ShieldCheck,
} from "lucide-react";
import { useAuth, ROLE_LABELS } from "@/lib/auth-context";
import type { UserRole } from "@/lib/types";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
}

/**
 * Per-role navigation. Each of the 11 roles sees only the modules
 * they have permission to use, mirroring the RLS rules in the database.
 *
 * Dashboards reuse the 4 grouped routes (admin/teacher/student/parent)
 * because the Dashboard component picks the right view via ROLE_GROUP.
 */
const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  principal: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/admin" },
    { icon: GraduationCap, label: "Admissions", href: "/admissions" },
    { icon: Users, label: "Staff", href: "/staff" },
    { icon: CalendarDays, label: "Attendance", href: "/attendance" },
    { icon: ClipboardCheck, label: "Exams", href: "/exams" },
    { icon: CreditCard, label: "Fees", href: "/fees" },
    { icon: MessageSquare, label: "Messaging", href: "/messaging" },
    { icon: BookOpen, label: "Parent Portal", href: "/parent-portal" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ],
  sms_admin: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/admin" },
    { icon: GraduationCap, label: "Admissions", href: "/admissions" },
    { icon: Users, label: "Staff", href: "/staff" },
    { icon: CalendarDays, label: "Attendance", href: "/attendance" },
    { icon: ClipboardCheck, label: "Exams", href: "/exams" },
    { icon: CreditCard, label: "Fees", href: "/fees" },
    { icon: MessageSquare, label: "Messaging", href: "/messaging" },
    { icon: ShieldCheck, label: "Settings", href: "/settings" },
  ],
  front_desk: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/admin" },
    { icon: GraduationCap, label: "Admissions", href: "/admissions" },
    { icon: MessageSquare, label: "Messaging", href: "/messaging" },
  ],
  teacher: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/teacher" },
    { icon: CalendarDays, label: "Attendance", href: "/attendance" },
    { icon: ClipboardCheck, label: "Exams", href: "/exams" },
    { icon: MessageSquare, label: "Messaging", href: "/messaging" },
  ],
  class_teacher: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/teacher" },
    { icon: CalendarDays, label: "Attendance", href: "/attendance" },
    { icon: ClipboardCheck, label: "Exams", href: "/exams" },
    { icon: GraduationCap, label: "Students", href: "/admissions" },
    { icon: MessageSquare, label: "Messaging", href: "/messaging" },
  ],
  exam_coordinator: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/admin" },
    { icon: ClipboardCheck, label: "Exams", href: "/exams" },
    { icon: MessageSquare, label: "Messaging", href: "/messaging" },
  ],
  transport_manager: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/admin" },
    { icon: Bus, label: "Transport", href: "/settings" },
    { icon: MessageSquare, label: "Messaging", href: "/messaging" },
  ],
  librarian: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/admin" },
    { icon: Library, label: "Library", href: "/settings" },
    { icon: MessageSquare, label: "Messaging", href: "/messaging" },
  ],
  hostel_warden: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/admin" },
    { icon: HomeIcon, label: "Hostel", href: "/settings" },
    { icon: MessageSquare, label: "Messaging", href: "/messaging" },
  ],
  student: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/student" },
    { icon: CalendarDays, label: "Attendance", href: "/attendance" },
    { icon: ClipboardCheck, label: "Exams", href: "/exams" },
  ],
  parent: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/parent" },
    { icon: BookOpen, label: "Parent Portal", href: "/parent-portal" },
    { icon: MessageSquare, label: "Messaging", href: "/messaging" },
  ],
};

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const navItems = NAV_BY_ROLE[user.role] ?? NAV_BY_ROLE.student;
  const currentPage = navItems.find((n) => n.href === location.pathname)?.label || "Dashboard";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-md lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 z-50 h-screen border-r border-border/60 transition-all duration-300 ease-in-out",
          "bg-sidebar/80 backdrop-blur-xl supports-[backdrop-filter]:bg-sidebar/60",
          collapsed ? "w-[72px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-border/60">
            <Link to="/" className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0 hover-scale active-press shadow-glow">
                <GraduationCap className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-heading font-bold text-base tracking-tight truncate"
                >
                  EduVerse
                </motion.span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Role chip */}
          {!collapsed && (
            <div className="px-4 pt-4">
              <div className="glass rounded-lg px-3 py-2 text-xs">
                <p className="text-muted-foreground/70 font-medium uppercase tracking-wider text-[10px] mb-0.5">
                  Signed in as
                </p>
                <p className="text-foreground/90 font-semibold truncate">
                  {ROLE_LABELS[user.role]}
                </p>
              </div>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 p-3 mt-2 space-y-1 overflow-y-auto scrollbar-thin">
            {navItems.map((item, i) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={`${item.href}-${item.label}`}
                  to={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active-press",
                    active
                      ? "bg-primary/15 text-primary border border-primary/30 shadow-glow"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                  )}
                  style={{ animationDelay: `${i * 30}ms` }}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-200",
                    !active && "group-hover:scale-110"
                  )} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {active && !collapsed && (
                    <motion.div
                      layoutId="activeNav"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-glow"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-border/60 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0 hover-scale shadow-glow">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="min-w-0"
                >
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </motion.div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { logout(); navigate("/"); }}
              className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && "Log out"}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 border-b border-border/60 bg-background/60 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 hover-scale active-press"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex h-9 w-9 hover-scale"
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft className={cn("h-5 w-5 transition-transform duration-300", collapsed && "rotate-180")} />
            </Button>
            <motion.h1
              key={currentPage}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="font-heading font-semibold text-lg tracking-tight"
            >
              {currentPage}
            </motion.h1>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" className="relative h-9 w-9 hover-scale">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse-soft" />
            </Button>
            <span className="text-sm text-muted-foreground hidden sm:block px-2">
              {user.name}
            </span>
            <ThemeToggle />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 relative">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
