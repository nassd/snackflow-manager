
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  useOrders, 
  type Order, 
  type OrderStatus, 
  type OrderItem 
} from "@/hooks/useOrders";
import { MinusCircle, PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function OrderModal({ isOpen, onClose, order }: OrderModalProps) {
  const [formData, setFormData] = useState<Partial<Order>>({
    order_number: "",
    status: "en cours",
    payment_method: "carte",
    total_amount: 0,
  });
  
  const [orderItems, setOrderItems] = useState<Partial<OrderItem>[]>([
    { product_id: "", quantity: 1, unit_price: 0 }
  ]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calculatingTotal, setCalculatingTotal] = useState(false);

  const {
    useProductsQuery,
    useOrderItemsQuery,
    useAddOrderMutation,
    useUpdateOrderMutation,
  } = useOrders();

  const { data: products = [], isLoading: isLoadingProducts } = useProductsQuery();
  
  const { 
    data: existingItems = [], 
    isLoading: isLoadingItems 
  } = useOrderItemsQuery(order?.id || "");
  
  const addOrderMutation = useAddOrderMutation();
  const updateOrderMutation = useUpdateOrderMutation();

  // Initialize form when the order changes
  useEffect(() => {
    if (order) {
      setFormData({
        order_number: order.order_number,
        status: order.status as OrderStatus,
        payment_method: order.payment_method || "carte",
        total_amount: order.total_amount || 0,
      });
    } else {
      setFormData({
        order_number: generateOrderNumber(),
        status: "en cours",
        payment_method: "carte",
        total_amount: 0,
      });
      setOrderItems([{ product_id: "", quantity: 1, unit_price: 0 }]);
    }
  }, [order, isOpen]);

  // Load existing order items when editing
  useEffect(() => {
    if (order && existingItems.length > 0) {
      setOrderItems(existingItems.map(item => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })));
    }
  }, [order, existingItems]);

  // Calculate total when items change
  useEffect(() => {
    if (orderItems.length > 0) {
      setCalculatingTotal(true);
      
      const total = orderItems.reduce((sum, item) => {
        const quantity = item.quantity || 0;
        const price = item.unit_price || 0;
        return sum + (quantity * price);
      }, 0);
      
      setFormData(prev => ({ ...prev, total_amount: total }));
      setCalculatingTotal(false);
    }
  }, [orderItems]);

  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `CMD-${year}${month}${day}-${randomNum}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.order_number) {
      newErrors.order_number = "Le numéro de commande est requis";
    }
    
    if (!formData.status) {
      newErrors.status = "Le statut est requis";
    }
    
    if (!formData.payment_method) {
      newErrors.payment_method = "La méthode de paiement est requise";
    }
    
    let hasItemErrors = false;
    
    orderItems.forEach((item, index) => {
      if (!item.product_id) {
        newErrors[`item_${index}_product`] = "Veuillez sélectionner un produit";
        hasItemErrors = true;
      }
      
      if (!item.quantity || item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = "La quantité doit être positive";
        hasItemErrors = true;
      }
      
      // Check if we have enough stock for this product
      if (item.product_id && item.quantity) {
        const product = products.find(p => p.id === item.product_id);
        if (product && (product.stock_quantity < item.quantity)) {
          newErrors[`item_${index}_stock`] = `Stock insuffisant (${product.stock_quantity} disponible)`;
          hasItemErrors = true;
        }
      }
    });
    
    if (orderItems.length === 0 || hasItemErrors) {
      newErrors.items = "Au moins un article valide est requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // If product changed, update unit price
    if (field === "product_id") {
      const product = products.find(p => p.id === value);
      if (product) {
        updatedItems[index].unit_price = product.selling_price;
      }
    }
    
    setOrderItems(updatedItems);
    
    // Clear errors
    Object.keys(errors).forEach(key => {
      if (key.includes(`item_${index}`)) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[key];
          return newErrors;
        });
      }
    });
  };

  const addItem = () => {
    setOrderItems([...orderItems, { product_id: "", quantity: 1, unit_price: 0 }]);
  };

  const removeItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (order) {
        // Update existing order
        await updateOrderMutation.mutateAsync({
          id: order.id,
          updates: {
            order_number: formData.order_number,
            status: formData.status as OrderStatus,
            payment_method: formData.payment_method,
            total_amount: formData.total_amount,
          }
        });
      } else {
        // Create new order
        await addOrderMutation.mutateAsync({
          order: {
            order_number: formData.order_number as string,
            status: formData.status as OrderStatus,
            payment_method: formData.payment_method as string,
            total_amount: formData.total_amount as number,
          },
          items: orderItems.map(item => ({
            product_id: item.product_id as string,
            quantity: item.quantity as number,
            unit_price: item.unit_price as number,
          }))
        });
      }
      
      onClose();
    } catch (error) {
      console.error("Failed to save order:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {order ? "Modifier la commande" : "Nouvelle commande"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order_number">Numéro de commande</Label>
              <Input
                id="order_number"
                value={formData.order_number || ""}
                onChange={(e) => handleInputChange("order_number", e.target.value)}
                placeholder="Numéro de commande"
                className={errors.order_number ? "border-red-500" : ""}
              />
              {errors.order_number && (
                <p className="text-sm text-red-500">{errors.order_number}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status as string}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger id="status" className={errors.status ? "border-red-500" : ""}>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en cours">En cours</SelectItem>
                  <SelectItem value="prêt">Prêt</SelectItem>
                  <SelectItem value="livré">Livré</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method">Méthode de paiement</Label>
            <Select
              value={formData.payment_method as string}
              onValueChange={(value) => handleInputChange("payment_method", value)}
            >
              <SelectTrigger id="payment_method" className={errors.payment_method ? "border-red-500" : ""}>
                <SelectValue placeholder="Sélectionner une méthode de paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="carte">Carte bancaire</SelectItem>
                <SelectItem value="espèces">Espèces</SelectItem>
                <SelectItem value="chèque">Chèque</SelectItem>
                <SelectItem value="virement">Virement</SelectItem>
              </SelectContent>
            </Select>
            {errors.payment_method && (
              <p className="text-sm text-red-500">{errors.payment_method}</p>
            )}
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Articles</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addItem}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter un article
              </Button>
            </div>

            {errors.items && <p className="text-sm text-red-500">{errors.items}</p>}

            {orderItems.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-5 space-y-1">
                  <Label htmlFor={`item_${index}_product`}>Produit</Label>
                  <Select
                    value={item.product_id as string}
                    onValueChange={(value) => handleItemChange(index, "product_id", value)}
                    disabled={isLoadingProducts}
                  >
                    <SelectTrigger 
                      id={`item_${index}_product`}
                      className={errors[`item_${index}_product`] || errors[`item_${index}_stock`] ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Sélectionner un produit" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.stock_quantity} en stock)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors[`item_${index}_product`] && (
                    <p className="text-xs text-red-500">{errors[`item_${index}_product`]}</p>
                  )}
                  {errors[`item_${index}_stock`] && (
                    <p className="text-xs text-red-500">{errors[`item_${index}_stock`]}</p>
                  )}
                </div>
                
                <div className="col-span-2 space-y-1">
                  <Label htmlFor={`item_${index}_quantity`}>Quantité</Label>
                  <Input
                    id={`item_${index}_quantity`}
                    type="number"
                    min="1"
                    value={item.quantity || ""}
                    onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                    className={errors[`item_${index}_quantity`] ? "border-red-500" : ""}
                  />
                  {errors[`item_${index}_quantity`] && (
                    <p className="text-xs text-red-500">{errors[`item_${index}_quantity`]}</p>
                  )}
                </div>
                
                <div className="col-span-3 space-y-1">
                  <Label htmlFor={`item_${index}_price`}>Prix unitaire</Label>
                  <Input
                    id={`item_${index}_price`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unit_price || ""}
                    onChange={(e) => handleItemChange(index, "unit_price", parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="col-span-2 flex items-end justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    disabled={orderItems.length <= 1}
                    className="h-10"
                  >
                    <MinusCircle className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-2" />

          <div className="flex justify-between items-center">
            <span className="font-medium">Total:</span>
            <span className="text-xl font-bold">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(formData.total_amount || 0)}
            </span>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={addOrderMutation.isPending || updateOrderMutation.isPending || calculatingTotal}
            >
              {addOrderMutation.isPending || updateOrderMutation.isPending
                ? "Enregistrement..."
                : order
                  ? "Mettre à jour"
                  : "Enregistrer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
