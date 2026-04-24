import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Library as LibraryIcon, BookOpen, IndianRupee } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Row {
  id: string;
  student_id: string;
  books_issued: any;
  fines: number;
}

export default function Library() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("library").select("id, student_id, books_issued, fines");
      setRows((data ?? []) as Row[]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingState type="spinner" />;

  const totalBooks = rows.reduce((s, r) => s + (Array.isArray(r.books_issued) ? r.books_issued.length : 0), 0);
  const totalFines = rows.reduce((s, r) => s + Number(r.fines || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Library</h2>
        <p className="text-muted-foreground">Manage books, issues, returns, and fines</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Records",      value: String(rows.length), icon: LibraryIcon, iconColor: "text-primary" },
          { title: "Books Issued", value: String(totalBooks),  icon: BookOpen,    iconColor: "text-accent" },
          { title: "Total Fines",  value: `₹${totalFines}`,    icon: IndianRupee, iconColor: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <h3 className="font-heading font-semibold mb-4">Library Records</h3>
        {rows.length === 0 ? (
          <EmptyState title="No library records" description="Book issues and fines will appear here." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Books Issued</TableHead>
                <TableHead className="text-right">Fines</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.student_id.slice(0, 8)}…</TableCell>
                  <TableCell>{Array.isArray(r.books_issued) ? r.books_issued.length : 0}</TableCell>
                  <TableCell className="text-right">₹{Number(r.fines || 0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
