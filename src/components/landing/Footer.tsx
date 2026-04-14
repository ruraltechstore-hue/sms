import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-heading font-bold">
          <GraduationCap className="h-5 w-5 text-primary" />
          EduVerse
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} EduVerse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
