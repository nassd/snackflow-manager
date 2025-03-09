
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type OrderStatus = "en cours" | "prêt" | "livré";

export interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  created_at: string;
  status: OrderStatus;
  payment_method: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product?: {
    name: string;
    stock_quantity: number;
  };
}

export interface Product {
  id: string;
  name: string;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  created_at: string;
}

export function useOrders() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  // Fetch orders
  const fetchOrders = async (): Promise<Order[]> => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      throw new Error(error.message);
    }

    // Type casting to ensure data conforms to Order[] type
    return (data || []).map(order => ({
      ...order,
      status: (order.status as OrderStatus) || "en cours",
      total_amount: Number(order.total_amount) || 0
    }));
  };

  // Fetch order items with product details
  const fetchOrderItems = async (orderId: string): Promise<OrderItem[]> => {
    const { data, error } = await supabase
      .from("order_items")
      .select(`
        *,
        product:product_id (
          name,
          stock_quantity
        )
      `)
      .eq("order_id", orderId);

    if (error) {
      console.error("Error fetching order items:", error);
      throw new Error(error.message);
    }

    return data || [];
  };

  // Fetch products
  const fetchProducts = async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching products:", error);
      throw new Error(error.message);
    }

    return data || [];
  };

  // Add a new order with items
  const addOrder = async (
    order: Omit<Order, "id" | "created_at">,
    items: Omit<OrderItem, "id" | "order_id">[]
  ) => {
    try {
      setLoading(true);

      // 1. Insert the order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: order.order_number,
          total_amount: order.total_amount,
          status: order.status,
          payment_method: order.payment_method,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert order items and update product stock
      for (const item of items) {
        // Insert order item
        const { error: itemError } = await supabase
          .from("order_items")
          .insert({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            order_id: orderData.id,
          });

        if (itemError) throw itemError;

        // Update product stock
        const { error: updateError } = await supabase.rpc("update_stock_quantity", {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        });

        if (updateError) throw updateError;
      }

      toast({
        title: "Commande ajoutée",
        description: `La commande ${order.order_number} a été créée avec succès.`,
      });

      return orderData;
    } catch (error) {
      console.error("Error adding order:", error);
      toast({
        title: "Erreur",
        description: `Échec de l'ajout de la commande: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update an order
  const updateOrder = async (
    id: string,
    updates: Partial<Omit<Order, "id" | "created_at">>
  ) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Commande mise à jour",
        description: `La commande a été mise à jour avec succès.`,
      });

      return data;
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Erreur",
        description: `Échec de la mise à jour: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete an order and its items
  const deleteOrder = async (id: string) => {
    try {
      setLoading(true);

      // 1. Get order items to restore stock later
      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", id);

      if (itemsError) throw itemsError;

      // 2. Delete order (cascade will delete order items)
      const { error: deleteError } = await supabase
        .from("orders")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      // 3. Restore product stock quantities
      for (const item of items || []) {
        const { error: updateError } = await supabase.rpc("restore_stock_quantity", {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        });

        if (updateError) throw updateError;
      }

      toast({
        title: "Commande supprimée",
        description: "La commande a été supprimée avec succès.",
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "Erreur",
        description: `Échec de la suppression: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    return updateOrder(id, { status });
  };

  // Calculate profit margin for an order
  const calculateProfitMargin = async (orderId: string): Promise<number> => {
    try {
      const { data, error } = await supabase.rpc("calculate_profit_margin", {
        p_order_id: orderId,
      });

      if (error) throw error;

      return data || 0;
    } catch (error) {
      console.error("Error calculating profit margin:", error);
      toast({
        title: "Erreur",
        description: `Échec du calcul de la marge: ${error.message}`,
        variant: "destructive",
      });
      return 0;
    }
  };

  // React Query hooks
  const useOrdersQuery = () => {
    return useQuery({
      queryKey: ["orders"],
      queryFn: fetchOrders,
    });
  };

  const useOrderItemsQuery = (orderId: string) => {
    return useQuery({
      queryKey: ["orderItems", orderId],
      queryFn: () => fetchOrderItems(orderId),
      enabled: !!orderId,
    });
  };

  const useProductsQuery = () => {
    return useQuery({
      queryKey: ["products"],
      queryFn: fetchProducts,
    });
  };

  const useAddOrderMutation = () => {
    return useMutation({
      mutationFn: ({ order, items }: { 
        order: Omit<Order, "id" | "created_at">, 
        items: Omit<OrderItem, "id" | "order_id">[] 
      }) => addOrder(order, items),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
    });
  };

  const useUpdateOrderMutation = () => {
    return useMutation({
      mutationFn: ({ id, updates }: { 
        id: string, 
        updates: Partial<Omit<Order, "id" | "created_at">> 
      }) => updateOrder(id, updates),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      },
    });
  };

  const useDeleteOrderMutation = () => {
    return useMutation({
      mutationFn: (id: string) => deleteOrder(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
    });
  };

  const useUpdateOrderStatusMutation = () => {
    return useMutation({
      mutationFn: ({ id, status }: { id: string, status: OrderStatus }) => 
        updateOrderStatus(id, status),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
      },
    });
  };

  return {
    loading,
    useOrdersQuery,
    useOrderItemsQuery,
    useProductsQuery,
    useAddOrderMutation,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
    useUpdateOrderStatusMutation,
    calculateProfitMargin,
  };
}
