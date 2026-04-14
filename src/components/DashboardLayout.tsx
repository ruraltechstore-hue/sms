import { ReactNode, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap, LayoutDashboard, Users, CalendarDays, CreditCard,
  MessageSquare, Building2, ClipboardCheck, UserCog, BookOpen,
  LogOut, ChevronLeft, Menu, Settings, X, Bell,
} from "lucide-react";
import { useAuth, UserRole, ROLE_LABELS, ROLE_DASHBOARD } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  href: string;
}

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  admin: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/admin" },
    { icon: GraduationCap, label: "Admissions", href: "/admissions" },
    { icon: CalendarDays, label: "Attendance", href: "/attendance" },
    { icon: CreditCard, label: "Fees", href: "/fees" },
    { icon: MessageSquare, label: "Messaging", href: "/messaging" },
    { icon: ClipboardCheck, label: "Exams", href: "/exams" },
    { icon: Users, label: "Staff", href: "/staff" },
    { icon: BookOpen, label: "Parent Portal", href: "/parent-portal" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ],
  teacher: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/teacher" },
    { icon: CalendarDays, label: "Attendance", href: "/attendance" },
    { icon: ClipboardCheck, label: "Exams", href: "/exams" },
  ],
  student: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/student" },
    { icon: ClipboardCheck, label: "Exams", href: "/exams" },
    { icon: CalendarDays, label: "Attendance", href: "/attendance" },
  ],
  parent: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/parent" },
    { icon: BookOpen, label: "Parent Portal", href: "/parent-portal" },
  ],
};

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const navItems = NAV_BY_ROLE[user.role];
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
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 z-50 h-screen border-r bg-card transition-all duration-300 ease-in-out",
          collapsed ? "w-[68px]" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-4 h-16 border-b">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0 hover-scale active-press">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-heading font-bold"
                >
                  EduVerse
                </motion.span>
              )}
            </Link>
            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
            {navItems.map((item, i) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active-press",
                    active
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <item.icon className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-200",
                    !active && "group-hover:scale-110"
                  )} />
                  {!collapsed && <span>{item.label}</span>}
                  {active && !collapsed && (
                    <motion.div
                      layoutId="activeNav"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0 hover-scale">
                {user.name.charAt(0)}
              </div>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="min-w-0"
                >
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
                </motion.div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { logout(); navigate("/"); }}
              className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive transition-colors"
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
        <header className="sticky top-0 z-30 h-16 border-b bg-card/80 backdrop-blur-lg flex items-center justify-between px-4 lg:px-6">
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
            >
              <ChevronLeft className={cn("h-5 w-5 transition-transform duration-300", collapsed && "rotate-180")} />
            </Button>
            <motion.h1
              key={currentPage}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="font-heading font-semibold text-lg"
            >
              {currentPage}
            </motion.h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative h-9 w-9 hover-scale">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse-soft" />
            </Button>
            <span className="text-sm text-muted-foreground hidden sm:block">{user.name}</span>
            <ThemeToggle />
          </div>
        </header>

        {/* Content with page transition */}
        <main className="flex-1 p-4 lg:p-6">
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
