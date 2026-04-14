import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Dr. Anand Mehta", role: "Principal, Delhi Public School", text: "This platform transformed how we manage 3,000+ students. Fee collection alone improved by 40%." },
  { name: "Suman Reddy", role: "Admin, Greenwood Academy", text: "The attendance system with QR codes saved us hours every week. Parents love the real-time updates." },
  { name: "Kavita Joshi", role: "Teacher, Modern High School", text: "Marks entry and report card generation used to take days. Now it's done in minutes. Incredible." },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            Trusted by <span className="text-gradient">Educators</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="p-8 rounded-2xl border bg-card"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">"{t.text}"</p>
              <div>
                <p className="font-heading font-semibold">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
