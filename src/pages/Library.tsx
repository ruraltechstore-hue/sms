import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Library as LibraryIcon, BookOpen, IndianRupee, Plus, Trash2, AlertCircle, Pencil } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { LoadingState } from "@/components/LoadingState";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { isReadOnlyRole } from "@/lib/rbac";
import { toast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Book {
  id: string;
  title: string;
  author: string | null;
  isbn: string | null;
  category: string | null;
  total_copies: number;
  available_copies: number;
}

interface Issue {
  id: string;
  book_id: string;
  student_id: string;
  issue_date: string;
  due_date: string | null;
  return_date: string | null;
  fine: number;
  status: "issued" | "returned" | "overdue";
}

interface StudentRow { id: string; name: string }

export default function Library() {
  const { user } = useAuth();
  const readOnly = user ? isReadOnlyRole(user.role) : true;
  const canManage = user?.role === "librarian" || user?.role === "principal" || user?.role === "sms_admin";

  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);

  // Add/edit book dialog
  const [bookDialog, setBookDialog] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [bookForm, setBookForm] = useState({ title: "", author: "", isbn: "", category: "", total_copies: 1 });

  // Issue book dialog
  const [issueDialog, setIssueDialog] = useState(false);
  const [issueForm, setIssueForm] = useState({ book_id: "", student_id: "", due_date: "" });

  const load = async () => {
    setLoading(true);
    const [{ data: b }, { data: i }, { data: s }] = await Promise.all([
      supabase.from("books").select("*").order("title"),
      supabase.from("book_issues").select("*").order("issue_date", { ascending: false }),
      supabase.from("students").select("id, name").order("name"),
    ]);
    setBooks((b ?? []) as Book[]);
    setIssues((i ?? []) as Issue[]);
    setStudents((s ?? []) as StudentRow[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const totalCopies = books.reduce((s, b) => s + b.total_copies, 0);
    const available  = books.reduce((s, b) => s + b.available_copies, 0);
    const issued     = totalCopies - available;
    const today      = new Date().toISOString().slice(0, 10);
    const overdue    = issues.filter((i) => i.status !== "returned" && i.due_date && i.due_date < today).length;
    const totalFines = issues.reduce((s, i) => s + Number(i.fine || 0), 0);
    return { titles: books.length, totalCopies, available, issued, overdue, totalFines };
  }, [books, issues]);

  const issuedVsAvailable = [
    { name: "Issued",    value: stats.issued,    color: "hsl(var(--primary))" },
    { name: "Available", value: stats.available, color: "hsl(var(--success))" },
  ];

  const openNewBook = () => {
    setEditing(null);
    setBookForm({ title: "", author: "", isbn: "", category: "", total_copies: 1 });
    setBookDialog(true);
  };

  const openEditBook = (b: Book) => {
    setEditing(b);
    setBookForm({ title: b.title, author: b.author ?? "", isbn: b.isbn ?? "", category: b.category ?? "", total_copies: b.total_copies });
    setBookDialog(true);
  };

  const saveBook = async () => {
    if (!bookForm.title) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    if (editing) {
      // keep available_copies in sync with delta in total
      const delta = bookForm.total_copies - editing.total_copies;
      const newAvail = Math.max(0, editing.available_copies + delta);
      const { error } = await supabase.from("books").update({
        title: bookForm.title, author: bookForm.author || null, isbn: bookForm.isbn || null,
        category: bookForm.category || null, total_copies: bookForm.total_copies, available_copies: newAvail,
      }).eq("id", editing.id);
      if (error) return toast({ title: "Update failed", description: error.message, variant: "destructive" });
      toast({ title: "Book updated" });
    } else {
      const { error } = await supabase.from("books").insert({
        title: bookForm.title, author: bookForm.author || null, isbn: bookForm.isbn || null,
        category: bookForm.category || null, total_copies: bookForm.total_copies, available_copies: bookForm.total_copies,
      });
      if (error) return toast({ title: "Add failed", description: error.message, variant: "destructive" });
      toast({ title: "Book added" });
    }
    setBookDialog(false);
    load();
  };

  const deleteBook = async (id: string) => {
    if (!confirm("Delete this book? All loan records will be removed.")) return;
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    toast({ title: "Book deleted" });
    load();
  };

  const issueBook = async () => {
    if (!issueForm.book_id || !issueForm.student_id) {
      toast({ title: "Select book & student", variant: "destructive" });
      return;
    }
    const book = books.find((b) => b.id === issueForm.book_id);
    if (!book || book.available_copies < 1) {
      toast({ title: "Not available", description: "No copies available for this book.", variant: "destructive" });
      return;
    }
    const { error: e1 } = await supabase.from("book_issues").insert({
      book_id: issueForm.book_id, student_id: issueForm.student_id,
      due_date: issueForm.due_date || null, status: "issued",
    });
    if (e1) return toast({ title: "Issue failed", description: e1.message, variant: "destructive" });
    await supabase.from("books").update({ available_copies: book.available_copies - 1 }).eq("id", book.id);
    toast({ title: "Book issued" });
    setIssueDialog(false);
    setIssueForm({ book_id: "", student_id: "", due_date: "" });
    load();
  };

  const returnBook = async (i: Issue) => {
    const today = new Date().toISOString().slice(0, 10);
    const overdueDays = i.due_date && i.due_date < today
      ? Math.floor((Date.parse(today) - Date.parse(i.due_date)) / 86400000)
      : 0;
    const fine = overdueDays * 5; // ₹5/day
    const { error } = await supabase.from("book_issues").update({
      return_date: today, status: "returned", fine,
    }).eq("id", i.id);
    if (error) return toast({ title: "Return failed", description: error.message, variant: "destructive" });
    const book = books.find((b) => b.id === i.book_id);
    if (book) await supabase.from("books").update({ available_copies: book.available_copies + 1 }).eq("id", book.id);
    toast({ title: "Book returned", description: fine > 0 ? `Fine: ₹${fine}` : undefined });
    load();
  };

  if (loading) return <LoadingState type="spinner" />;

  const studentName = (id: string) => students.find((s) => s.id === id)?.name ?? id.slice(0, 8) + "…";
  const bookTitle   = (id: string) => books.find((b) => b.id === id)?.title ?? "—";
  const today       = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold">Library</h2>
        <p className="text-muted-foreground">Manage book inventory, issues, returns and fines</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { title: "Titles",       value: String(stats.titles),     icon: LibraryIcon, iconColor: "text-primary" },
          { title: "Books Issued", value: String(stats.issued),     icon: BookOpen,    iconColor: "text-accent" },
          { title: "Overdue",      value: String(stats.overdue),    icon: AlertCircle, iconColor: "text-destructive" },
          { title: "Total Fines",  value: `₹${stats.totalFines}`,   icon: IndianRupee, iconColor: "text-warning" },
        ].map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </div>

      {(stats.issued + stats.available) > 0 && (
        <div className="rounded-2xl border bg-card p-6 glass">
          <h3 className="font-heading font-semibold mb-4">Books Issued vs Available</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={issuedVsAvailable} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {issuedVsAvailable.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <Tabs defaultValue="books" className="space-y-4">
        <TabsList>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="issues">Loans</TabsTrigger>
        </TabsList>

        <TabsContent value="books" className="space-y-4">
          {canManage && (
            <div className="flex justify-end">
              <Button onClick={openNewBook} className="gap-2"><Plus className="h-4 w-4" /> Add Book</Button>
            </div>
          )}
          <div className="rounded-2xl border bg-card p-6">
            {books.length === 0 ? (
              <EmptyState title="No books in catalog" description={canManage ? "Click Add Book to start." : "Books will appear here once added."} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                    {canManage && <TableHead className="w-24"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {books.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.title}</TableCell>
                      <TableCell className="text-muted-foreground">{b.author || "—"}</TableCell>
                      <TableCell>{b.category || "—"}</TableCell>
                      <TableCell className="text-right">{b.total_copies}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className={b.available_copies > 0 ? "border-success/30 text-success" : "border-destructive/30 text-destructive"}>
                          {b.available_copies}
                        </Badge>
                      </TableCell>
                      {canManage && (
                        <TableCell className="space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditBook(b)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteBook(b.id)}><Trash2 className="h-4 w-4" /></Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          {canManage && (
            <div className="flex justify-end">
              <Button onClick={() => setIssueDialog(true)} className="gap-2"><Plus className="h-4 w-4" /> Issue Book</Button>
            </div>
          )}
          <div className="rounded-2xl border bg-card p-6">
            {issues.length === 0 ? (
              <EmptyState title="No loans" description="Issued books will appear here." />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Fine</TableHead>
                    {canManage && <TableHead className="w-24"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.map((i) => {
                    const isOverdue = i.status !== "returned" && i.due_date && i.due_date < today;
                    return (
                      <TableRow key={i.id}>
                        <TableCell className="font-medium">{bookTitle(i.book_id)}</TableCell>
                        <TableCell>{studentName(i.student_id)}</TableCell>
                        <TableCell className="text-muted-foreground">{i.issue_date}</TableCell>
                        <TableCell className="text-muted-foreground">{i.due_date || "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            i.status === "returned" ? "border-success/30 text-success" :
                            isOverdue ? "border-destructive/30 text-destructive" :
                            "border-primary/30 text-primary"
                          }>
                            {isOverdue ? "overdue" : i.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">₹{Number(i.fine || 0)}</TableCell>
                        {canManage && (
                          <TableCell>
                            {i.status !== "returned" && (
                              <Button size="sm" variant="outline" onClick={() => returnBook(i)}>Return</Button>
                            )}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add / Edit Book Dialog */}
      <Dialog open={bookDialog} onOpenChange={setBookDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Book" : "Add Book"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={bookForm.title} onChange={(e) => setBookForm((f) => ({ ...f, title: e.target.value }))} /></div>
            <div><Label>Author</Label><Input value={bookForm.author} onChange={(e) => setBookForm((f) => ({ ...f, author: e.target.value }))} /></div>
            <div><Label>ISBN</Label><Input value={bookForm.isbn} onChange={(e) => setBookForm((f) => ({ ...f, isbn: e.target.value }))} /></div>
            <div><Label>Category</Label><Input value={bookForm.category} onChange={(e) => setBookForm((f) => ({ ...f, category: e.target.value }))} placeholder="Fiction, Science, ..." /></div>
            <div><Label>Total Copies</Label><Input type="number" min={1} value={bookForm.total_copies} onChange={(e) => setBookForm((f) => ({ ...f, total_copies: Math.max(1, parseInt(e.target.value || "1")) }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookDialog(false)}>Cancel</Button>
            <Button onClick={saveBook}>{editing ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Issue Book Dialog */}
      <Dialog open={issueDialog} onOpenChange={setIssueDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Issue Book</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Book</Label>
              <Select value={issueForm.book_id} onValueChange={(v) => setIssueForm((f) => ({ ...f, book_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select book" /></SelectTrigger>
                <SelectContent>
                  {books.filter((b) => b.available_copies > 0).map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.title} ({b.available_copies} avail)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Student</Label>
              <Select value={issueForm.student_id} onValueChange={(v) => setIssueForm((f) => ({ ...f, student_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>
                  {students.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Due Date</Label><Input type="date" value={issueForm.due_date} onChange={(e) => setIssueForm((f) => ({ ...f, due_date: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIssueDialog(false)}>Cancel</Button>
            <Button onClick={issueBook}>Issue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
