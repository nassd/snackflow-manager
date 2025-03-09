
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type ProductInput = {
  name: string;
  stock_quantity: number;
  cost_price: number;
  selling_price: number;
};

export function useInventory() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Rechercher un produit par son nom
  const findProductByName = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("name", name)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erreur lors de la recherche du produit:", error);
      return null;
    }
  };

  // Ajouter ou mettre à jour un produit
  const addOrUpdateProduct = async (product: ProductInput) => {
    setIsLoading(true);
    try {
      // Vérifier si le produit existe déjà
      const existingProduct = await findProductByName(product.name);

      if (existingProduct) {
        // Mettre à jour le produit existant
        const newQuantity = existingProduct.stock_quantity + product.stock_quantity;
        
        const { error } = await supabase
          .from("products")
          .update({ 
            stock_quantity: newQuantity,
            // Mettre à jour les prix seulement s'ils ont changé
            ...(product.cost_price !== existingProduct.cost_price ? { cost_price: product.cost_price } : {}),
            ...(product.selling_price !== existingProduct.selling_price ? { selling_price: product.selling_price } : {})
          })
          .eq("id", existingProduct.id);

        if (error) throw error;

        toast({
          title: "Stock mis à jour",
          description: `${product.stock_quantity} unités ajoutées au stock de ${product.name}`,
        });

        return { success: true, isNew: false, product: existingProduct };
      } else {
        // Créer un nouveau produit
        const { data, error } = await supabase
          .from("products")
          .insert([product])
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Produit ajouté",
          description: `${product.name} a été ajouté au stock avec ${product.stock_quantity} unités`,
        });

        return { success: true, isNew: true, product: data };
      }
    } catch (error: any) {
      console.error("Erreur lors de l'ajout/mise à jour du produit:", error);
      toast({
        title: "Erreur",
        description: `Impossible d'ajouter le produit: ${error.message || "Erreur inconnue"}`,
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    addOrUpdateProduct,
    findProductByName,
  };
}
