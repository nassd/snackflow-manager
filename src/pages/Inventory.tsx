
import { Toaster } from "@/components/ui/toaster";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AddProductForm from "@/components/inventory/AddProductForm";
import ProductsTable from "@/components/dashboard/ProductsTable";

export default function Inventory() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="md:w-1/3">
            <AddProductForm />
          </div>
          
          <div className="md:w-2/3">
            <ProductsTable />
          </div>
        </div>
      </div>
      <Toaster />
    </DashboardLayout>
  );
}
