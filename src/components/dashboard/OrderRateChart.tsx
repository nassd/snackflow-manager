
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, TooltipProps } from 'recharts';
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

// Sample data for the chart
const data = [
  { name: 'Jun', orders: 20, revenue: 40 },
  { name: 'Jul', orders: 80, revenue: 100 },
  { name: 'Aug', orders: 30, revenue: 60 },
  { name: 'Sep', orders: 60, revenue: 80 },
  { name: 'Oct', orders: 40, revenue: 50 },
  { name: 'Nov', orders: 70, revenue: 90 },
  { name: 'Dec', orders: 30, revenue: 60 },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
        <p className="font-medium text-sm">{label}</p>
        <div className="flex flex-col gap-1 mt-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-savory-500"></div>
            <p className="text-xs text-gray-600">Revenue: <span className="font-medium text-gray-800">${payload[0].value}</span></p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
            <p className="text-xs text-gray-600">Orders: <span className="font-medium text-gray-800">{payload[1].value}</span></p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function OrderRateChart() {
  const [timeframe, setTimeframe] = useState("year");

  return (
    <div className="card p-6 animate-fade-up">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium">Order Rate</h3>
        
        <div className="flex items-center gap-2">
          <div className="bg-savory-100 text-savory-600 px-3 py-1 rounded-md text-sm font-medium">
            $120K
            <span className="text-xs ml-1 opacity-70">Target</span>
          </div>
          
          <Select defaultValue={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[90px] h-8 text-sm">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
          
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
          <LineChart
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
              tickCount={6}
              domain={[0, 'dataMax + 20']}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#4CAF50" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#4CAF50', stroke: 'white', strokeWidth: 2 }}
              isAnimationActive={true}
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#FF9800" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#FF9800', stroke: 'white', strokeWidth: 2 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
