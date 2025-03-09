
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Sample data for the chart
const data = [
  { name: 'Apr', value: 30 },
  { name: 'May', value: 60 },
  { name: 'Jun', value: 40 },
  { name: 'Jul', value: 50 },
  { name: 'Aug', value: 45 },
  { name: 'Sep', value: 42 },
  { name: 'Oct', value: 55 },
  { name: 'Nov', value: 45 },
  { name: 'Dec', value: 65 },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-gray-600 mt-1">
          Value: <span className="font-medium text-gray-800">${payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function MonthlyActivityChart() {
  const [activeTab, setActiveTab] = useState("weekly");
  
  return (
    <div className="card p-6 animate-fade-up">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Activity</h3>
        
        <div className="flex items-center gap-2">
          <Tabs defaultValue="weekly" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 h-8">
              <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
              <TabsTrigger value="yearly" className="text-xs">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
          
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
      </div>
      
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: '#888' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: '#888' }}
              tickCount={5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill="#FF9800" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
