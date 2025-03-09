
import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SalesCardProps {
  title: string;
  value: string;
  itemCount?: number;
  percentChange?: number;
  type?: "sales" | "expense" | "pending";
  className?: string;
}

export default function SalesCard({
  title,
  value,
  itemCount,
  percentChange = 0,
  type = "sales",
  className,
}: SalesCardProps) {
  const isPositive = percentChange >= 0;
  const isExpense = type === "expense";
  
  // For the expense card, we invert the color (positive change in expenses is bad)
  const indicatorColor = isExpense
    ? !isPositive ? "text-savory-500" : "text-destructive"
    : isPositive ? "text-savory-500" : "text-destructive";
  
  const Arrow = isPositive ? ArrowUp : ArrowDown;
  
  return (
    <div className={cn("card p-6 flex flex-col gap-3 animate-fade-up", className)}>
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-muted-foreground">{title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Export Data</DropdownMenuItem>
            <DropdownMenuItem>Set Alert</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div>
        <div className="text-3xl font-bold">{value}</div>
      </div>
      
      {(itemCount !== undefined || percentChange !== undefined) && (
        <div className="flex items-center gap-3">
          {itemCount !== undefined && (
            <div className="text-sm text-muted-foreground">
              {itemCount} Item
            </div>
          )}
          
          {percentChange !== undefined && (
            <div className={cn("flex items-center text-sm", indicatorColor)}>
              <Arrow className="mr-1 h-4 w-4" />
              <span>{Math.abs(percentChange).toFixed(1)}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
