import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  delay?: number;
}

export function FeatureCard({ icon: Icon, title, description, href, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <Link
        to={href}
        className="group block p-6 rounded-2xl border bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover-lift"
      >
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-gradient-primary transition-all duration-300 group-hover:scale-110">
          <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
        </div>
        <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{description}</p>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
          Explore <ArrowRight className="h-3 w-3" />
        </span>
      </Link>
    </motion.div>
  );
}
