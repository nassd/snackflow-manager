
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const data = [
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 59 },
  { month: 'Mar', value: 80 },
  { month: 'Apr', value: 81 },
  { month: 'May', value: 56 },
  { month: 'Jun', value: 55 },
  { month: 'Jul', value: 40 },
];

interface ActivityChartProps {
  title: string;
  value: string;
  percentChange?: number;
  className?: string;
}

export default function ActivityChart({ 
  title, 
  value, 
  percentChange = 0,
  className 
}: ActivityChartProps) {
  const isPositive = percentChange >= 0;
  
  return (
    <div className={`card p-6 flex flex-col gap-4 animate-fade-up ${className}`}>
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="font-medium text-muted-foreground">{title}</h3>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{value}</div>
            {percentChange !== undefined && (
              <div className={`text-sm px-2 py-0.5 rounded-full ${isPositive ? 'bg-savory-50 text-savory-600' : 'bg-red-50 text-red-600'}`}>
                {isPositive ? '+' : ''}{percentChange}%
              </div>
            )}
          </div>
        </div>
        
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
      
      <div className="h-[120px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#888' }}
            />
            <YAxis 
              hide={true}
            />
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="#f0f0f0" 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
                border: 'none' 
              }}
              itemStyle={{ color: '#4CAF50' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#4CAF50" 
              strokeWidth={3} 
              dot={{ r: 0 }}
              activeDot={{ r: 6, fill: '#4CAF50', stroke: 'white', strokeWidth: 2 }}
              fillOpacity={1}
              fill="url(#colorUv)"
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
