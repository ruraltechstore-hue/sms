import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronLeft, ChevronRight, Eye, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MOCK_STUDENTS, CLASS_OPTIONS, STATUS_OPTIONS, type Student } from "@/lib/mock-students";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

interface StudentTableProps {
  onViewStudent: (student: Student) => void;
}

export function StudentTable({ onViewStudent }: StudentTableProps) {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return MOCK_STUDENTS.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.id.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      const matchClass = classFilter === "all" || s.class === classFilter;
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchClass && matchStatus;
    });
  }, [search, classFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusColor = (status: Student["status"]) => {
    if (status === "active") return "bg-success/10 text-success border-success/20";
    if (status === "inactive") return "bg-destructive/10 text-destructive border-destructive/20";
    return "bg-muted text-muted-foreground border-border";
  };

  const feeColor = (fee: Student["feeStatus"]) => {
    if (fee === "paid") return "bg-success/10 text-success border-success/20";
    if (fee === "partial") return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, ID, or email..."
            className="pl-9"
          />
        </div>
        <Select value={classFilter} onValueChange={(v) => { setClassFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-36">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {CLASS_OPTIONS.map((c) => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">ID</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Class</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Attendance</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">CGPA</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Fees</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginated.map((student) => (
                <tr key={student.id} className="hover:bg-secondary/30 transition-colors group">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{student.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground font-mono text-xs hidden md:table-cell">{student.id}</td>
                  <td className="py-3 px-4">{student.class}-{student.section}</td>
                  <td className="py-3 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full bg-success" style={{ width: `${student.attendance}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{student.attendance}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium hidden lg:table-cell">{student.cgpa}</td>
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", feeColor(student.feeStatus))}>
                      {student.feeStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize border", statusColor(student.status))}>
                      {student.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewStudent(student)}>
                          <Eye className="h-4 w-4 mr-2" /> View Profile
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    No students found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-secondary/20">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={page === 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button key={p} variant={p === page ? "default" : "ghost"} size="icon" className={cn("h-8 w-8 text-xs", p === page && "bg-primary text-primary-foreground")} onClick={() => setPage(p)}>
                  {p}
                </Button>
              ))}
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
