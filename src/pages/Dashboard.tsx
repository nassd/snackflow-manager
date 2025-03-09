
import { ArrowDown, ArrowUp } from "lucide-react";
import SalesCard from "@/components/dashboard/SalesCard";
import ActivityChart from "@/components/dashboard/ActivityChart";
import OrderRateChart from "@/components/dashboard/OrderRateChart";
import PopularFoodChart from "@/components/dashboard/PopularFoodChart";
import PerformanceCard from "@/components/dashboard/PerformanceCard";
import StatsCard from "@/components/dashboard/StatsCard";
import MonthlyActivityChart from "@/components/dashboard/MonthlyActivityChart";
import OrdersTable from "@/components/dashboard/OrdersTable";
import ProductsTable from "@/components/dashboard/ProductsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Top stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActivityChart 
          title="Activity" 
          value="$1200.00"
          percentChange={5.2}
        />
        
        <SalesCard 
          title="Total Sales" 
          value="$750.00" 
          itemCount={1200} 
          percentChange={-3.7} 
        />
        
        <SalesCard 
          title="Total Expense" 
          value="$950.00" 
          itemCount={1500} 
          percentChange={1.7} 
          type="expense" 
        />
      </div>
      
      {/* Stats indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-16">
        <StatsCard 
          title="Total Orders" 
          value={1200} 
          label="orders" 
          percentChange={5} 
          colorClass="bg-savory-500" 
        />
        
        <StatsCard 
          title="Total Sales" 
          value={900} 
          label="total sales" 
          percentChange={-5} 
          colorClass="bg-red-500" 
        />
        
        <StatsCard 
          title="Total Pending" 
          value={300} 
          label="total pending" 
          percentChange={5} 
          colorClass="bg-amber-500" 
        />
      </div>
      
      {/* Orders and products tables */}
      <Tabs defaultValue="orders" className="w-full">
        <TabsList>
          <TabsTrigger value="orders">Commandes</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="charts">Graphiques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="mt-6">
          <OrdersTable />
        </TabsContent>
        
        <TabsContent value="products" className="mt-6">
          <ProductsTable />
        </TabsContent>
        
        <TabsContent value="charts" className="mt-6 space-y-6">
          {/* Main charts row */}
          <div>
            <OrderRateChart />
          </div>
          
          {/* Bottom charts row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <MonthlyActivityChart />
            </div>
            
            <div className="space-y-6">
              <PopularFoodChart />
              <PerformanceCard />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
