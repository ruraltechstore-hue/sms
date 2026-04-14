import { motion } from "framer-motion";
import {
  GraduationCap, CalendarDays, CreditCard, MessageSquare,
  Building2, ClipboardCheck, Users, BookOpen
} from "lucide-react";
import { FeatureCard } from "@/components/FeatureCard";

const features = [
  { icon: GraduationCap, title: "Admissions", desc: "Multi-step forms, document uploads, and automated class allocation.", href: "/admissions" },
  { icon: CalendarDays, title: "Attendance", desc: "QR-based attendance, smart scheduling with conflict detection.", href: "/attendance" },
  { icon: CreditCard, title: "Fee Management", desc: "Online payments, auto late fees, scholarships, and full financial reports.", href: "/fees" },
  { icon: MessageSquare, title: "Messaging", desc: "SMS, WhatsApp, and email broadcasting with templates and tracking.", href: "/messaging" },
  { icon: ClipboardCheck, title: "Exams & Results", desc: "Configurable exams, auto grading, report cards, and analytics.", href: "/exams" },
  { icon: Users, title: "Staff & HR", desc: "Payroll, leave management, workload tracking, and appraisals.", href: "/staff" },
  { icon: BookOpen, title: "Parent Portal", desc: "Real-time updates, PTM scheduling, circulars, and event calendar.", href: "/parent-portal" },
  { icon: Building2, title: "School ERP", desc: "Inventory, library, transport, hostel — all centralized.", href: "/login" },
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
            <FeatureCard
              key={f.title}
              icon={f.icon}
              title={f.title}
              description={f.desc}
              href={f.href}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
