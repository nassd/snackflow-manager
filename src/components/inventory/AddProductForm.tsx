
import { useState } from "react";
import { useInventory, type ProductInput } from "@/hooks/useInventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, Plus, PackagePlus } from "lucide-react";

const initialProduct: ProductInput = {
  name: "",
  stock_quantity: 1,
  cost_price: 0,
  selling_price: 0,
};

export default function AddProductForm() {
  const [product, setProduct] = useState<ProductInput>(initialProduct);
  const { isLoading, addOrUpdateProduct } = useInventory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convertir les valeurs numériques
    const parsedValue = name === "name" ? value : parseFloat(value);
    
    setProduct((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple
    if (!product.name.trim()) {
      return;
    }
    
    if (product.stock_quantity <= 0 || product.cost_price < 0 || product.selling_price < 0) {
      return;
    }
    
    const result = await addOrUpdateProduct(product);
    
    if (result.success) {
      // Réinitialiser le formulaire
      setProduct(initialProduct);
    }
  };

  const marginAmount = product.selling_price - product.cost_price;
  const marginPercent = product.cost_price 
    ? (marginAmount / product.cost_price) * 100 
    : 0;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PackagePlus className="h-5 w-5" />
          Ajouter au stock
        </CardTitle>
        <CardDescription>
          Ajoutez un nouveau produit ou mettez à jour la quantité d'un produit existant
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Nom du produit</Label>
            <Input
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Ex: Tomates"
              required
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="stock_quantity">Quantité</Label>
            <Input
              id="stock_quantity"
              name="stock_quantity"
              type="number"
              min="1"
              step="1"
              value={product.stock_quantity}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="cost_price">Prix d'achat (€)</Label>
            <Input
              id="cost_price"
              name="cost_price"
              type="number"
              min="0"
              step="0.01"
              value={product.cost_price}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="selling_price">Prix de vente (€)</Label>
            <Input
              id="selling_price"
              name="selling_price"
              type="number"
              min="0"
              step="0.01"
              value={product.selling_price}
              onChange={handleChange}
              required
            />
          </div>
          
          {product.cost_price > 0 && product.selling_price > 0 && (
            <div className="text-sm p-2 bg-muted rounded-md">
              <p>
                Marge: <span className={marginAmount >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(marginAmount)}
                </span>
                {" "}
                <span className="text-muted-foreground">
                  ({marginPercent.toFixed(1)}%)
                </span>
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter au stock
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
