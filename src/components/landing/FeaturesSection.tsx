import { motion } from "framer-motion";
import {
  GraduationCap, CalendarDays, CreditCard, MessageSquare,
  Building2, ClipboardCheck, Users, BookOpen
} from "lucide-react";

const features = [
  { icon: GraduationCap, title: "Admissions", desc: "Multi-step forms, document uploads, and automated class allocation." },
  { icon: CalendarDays, title: "Attendance & Timetable", desc: "QR-based attendance, smart scheduling with conflict detection." },
  { icon: CreditCard, title: "Fee Management", desc: "Online payments, auto late fees, scholarships, and full financial reports." },
  { icon: MessageSquare, title: "Messaging", desc: "SMS, WhatsApp, and email broadcasting with templates and tracking." },
  { icon: Building2, title: "School ERP", desc: "Inventory, library, transport, hostel — all centralized." },
  { icon: ClipboardCheck, title: "Exams & Results", desc: "Configurable exams, auto grading, report cards, and analytics." },
  { icon: Users, title: "Staff & HR", desc: "Payroll, leave management, workload tracking, and appraisals." },
  { icon: BookOpen, title: "Parent Portal", desc: "Real-time updates, PTM scheduling, circulars, and event calendar." },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            Everything You <span className="text-gradient">Need</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            8 powerful modules designed to streamline every aspect of school management.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group p-6 rounded-2xl border bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-gradient-primary group-hover:text-primary-foreground transition-all duration-300">
                <f.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
