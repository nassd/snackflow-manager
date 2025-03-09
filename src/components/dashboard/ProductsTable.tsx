
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useOrders, type Product } from "@/hooks/useOrders";
import { ArrowUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsTable() {
  const [sortField, setSortField] = useState<keyof Product>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { useProductsQuery } = useOrders();
  const { data: products = [], isLoading, isError } = useProductsQuery();

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    if (sortField === "stock_quantity" || sortField === "cost_price" || sortField === "selling_price") {
      return sortDirection === "asc"
        ? (a[sortField] || 0) - (b[sortField] || 0)
        : (b[sortField] || 0) - (a[sortField] || 0);
    }
    
    const valueA = (a[sortField] || "").toString().toLowerCase();
    const valueB = (b[sortField] || "").toString().toLowerCase();
    
    return sortDirection === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  const getStockStatusColor = (quantity: number | null) => {
    if (quantity === null) return "bg-gray-500";
    if (quantity <= 0) return "bg-red-500";
    if (quantity < 10) return "bg-amber-500";
    return "bg-green-500";
  };

  if (isError) {
    return (
      <div className="p-4 rounded-md bg-red-50 text-red-800">
        Une erreur s'est produite lors du chargement des produits.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Produits en stock</h2>
      
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Nom du produit
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("stock_quantity")}
              >
                <div className="flex items-center">
                  Stock
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer text-right"
                onClick={() => handleSort("cost_price")}
              >
                <div className="flex items-center justify-end">
                  Prix d'achat
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer text-right"
                onClick={() => handleSort("selling_price")}
              >
                <div className="flex items-center justify-end">
                  Prix de vente
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Marge</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : sortedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Aucun produit trouvé
                </TableCell>
              </TableRow>
            ) : (
              sortedProducts.map((product) => {
                const marginAmount = (product.selling_price || 0) - (product.cost_price || 0);
                const marginPercent = product.cost_price 
                  ? (marginAmount / product.cost_price) * 100 
                  : 0;
                
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge className={getStockStatusColor(product.stock_quantity)}>
                        {product.stock_quantity || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(product.cost_price || 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(product.selling_price || 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className={marginAmount >= 0 ? "text-green-600" : "text-red-600"}>
                          {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(marginAmount)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {marginPercent.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
