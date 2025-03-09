
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number;
  label: string;
  percentChange: number;
  colorClass?: string;
}

export default function StatsCard({
  title,
  value,
  label,
  percentChange,
  colorClass = "bg-savory-500"
}: StatsCardProps) {
  const isPositive = percentChange >= 0;
  const Arrow = isPositive ? ArrowUp : ArrowDown;
  
  return (
    <div className="flex items-center justify-between gap-4 animate-fade-up">
      <div className="flex-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="mt-1 flex items-center gap-1">
          <div className="text-xl font-semibold">{value}</div>
          <div className={cn(
            "text-xs px-1.5 py-0.5 rounded-sm",
            isPositive ? "text-savory-600 bg-savory-50" : "text-red-600 bg-red-50"
          )}>
            {isPositive ? "+" : ""}{percentChange}%
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      </div>
      
      <div className="h-20 w-[6px] rounded-full bg-gray-100 relative">
        <div 
          className={cn("absolute bottom-0 w-full rounded-full", colorClass)}
          style={{ height: `${Math.min(Math.max(value / 12, 10), 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
