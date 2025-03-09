
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, CheckSquare, ArrowUpDown } from "lucide-react";
import { useOrders, type Order, type OrderStatus } from "@/hooks/useOrders";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import OrderModal from "./OrderModal";
import { Skeleton } from "@/components/ui/skeleton";
import { fr } from "date-fns/locale";

export default function OrdersTable() {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Order>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [profitMargins, setProfitMargins] = useState<Record<string, number>>({});

  const {
    useOrdersQuery,
    useDeleteOrderMutation,
    useUpdateOrderStatusMutation,
    calculateProfitMargin,
  } = useOrders();

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useOrdersQuery();

  const deleteOrderMutation = useDeleteOrderMutation();
  const updateOrderStatusMutation = useUpdateOrderStatusMutation();

  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleStatusChange = (id: string, status: OrderStatus) => {
    updateOrderStatusMutation.mutate({ id, status });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrderMutation.mutateAsync(id);
      setOrderToDelete(null);
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingOrder(null);
    setIsModalOpen(true);
  };

  const loadProfitMargin = async (orderId: string) => {
    if (!profitMargins[orderId]) {
      const margin = await calculateProfitMargin(orderId);
      setProfitMargins(prev => ({ ...prev, [orderId]: margin }));
    }
  };

  // Sort orders
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortField === "total_amount" || sortField === "created_at") {
      return sortDirection === "asc"
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }
    
    const valueA = (a[sortField] || "").toString().toLowerCase();
    const valueB = (b[sortField] || "").toString().toLowerCase();
    
    return sortDirection === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  // Format date with French locale
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy HH:mm", { locale: fr });
    } catch (error) {
      return "Date invalide";
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "en cours":
        return "bg-amber-500";
      case "prêt":
        return "bg-blue-500";
      case "livré":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isError) {
    return (
      <div className="p-4 rounded-md bg-red-50 text-red-800">
        Une erreur s'est produite lors du chargement des commandes.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Commandes</h2>
        <Button onClick={handleAddNew}>Ajouter une commande</Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("order_number")}
              >
                <div className="flex items-center">
                  N° de commande
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("created_at")}
              >
                <div className="flex items-center">
                  Date
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Statut
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer text-right"
                onClick={() => handleSort("total_amount")}
              >
                <div className="flex items-center justify-end">
                  Montant
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Marge</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : sortedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Aucune commande trouvée
                </TableCell>
              </TableRow>
            ) : (
              sortedOrders.map((order) => {
                // Load profit margin when rendering
                loadProfitMargin(order.id);
                
                return (
                  <TableRow key={order.id} onMouseEnter={() => loadProfitMargin(order.id)}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status as OrderStatus)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(order.total_amount || 0)}
                    </TableCell>
                    <TableCell className="text-right">
                      {profitMargins[order.id] !== undefined ? (
                        <span className={profitMargins[order.id] >= 0 ? "text-green-600" : "text-red-600"}>
                          {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(profitMargins[order.id])}
                        </span>
                      ) : (
                        <Skeleton className="h-5 w-16 ml-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              État
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(order.id, "en cours")}
                              disabled={order.status === "en cours"}
                            >
                              En cours
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(order.id, "prêt")}
                              disabled={order.status === "prêt"}
                            >
                              Prêt
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(order.id, "livré")}
                              disabled={order.status === "livré"}
                            >
                              Livré
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(order)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setOrderToDelete(order.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal for adding/editing orders */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={editingOrder}
      />

      {/* Confirmation dialog for deleting orders */}
      <AlertDialog open={!!orderToDelete} onOpenChange={(open) => !open && setOrderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cette commande sera définitivement supprimée de notre système.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => orderToDelete && handleDelete(orderToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
