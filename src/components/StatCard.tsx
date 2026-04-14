import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon, iconColor = "text-primary" }: StatCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-6 hover-lift hover-glow transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "h-11 w-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
          iconColor === "text-primary" ? "bg-primary/10" : iconColor === "text-success" ? "bg-success/10" : iconColor === "text-accent" ? "bg-accent/10" : "bg-warning/10"
        )}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
        {change && (
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full transition-all duration-200",
            changeType === "positive" ? "bg-success/10 text-success" : changeType === "negative" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
          )}>
            {change}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-heading font-bold">{value}</p>
    </div>
  );
}
