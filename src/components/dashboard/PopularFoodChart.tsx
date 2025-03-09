
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, TooltipProps } from 'recharts';
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample data for the chart
const data = [
  { name: 'Asian Foods', value: 35, color: '#FF9800' },
  { name: 'Italian Foods', value: 40, color: '#F44336' },
  { name: 'Western Foods', value: 25, color: '#4CAF50' },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
        <p className="font-medium text-sm">{payload[0].name}</p>
        <p className="text-xs text-gray-600 mt-1">
          Value: <span className="font-medium text-gray-800">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function PopularFoodChart() {
  return (
    <div className="card p-6 animate-fade-up">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Popular Food</h3>
        
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
      
      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2">
        <div className="text-center mb-3">
          <div className="text-3xl font-bold">$120K</div>
          <div className="text-xs text-muted-foreground">Total sales</div>
        </div>
        
        <div className="space-y-2 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <div className="text-sm">{item.name} ({item.value}%)</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
