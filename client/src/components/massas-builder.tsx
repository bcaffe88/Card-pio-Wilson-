import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/lib/store";
import { PizzaFlavor } from "@/data/menu";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MassasBuilderProps {
  isOpen: boolean;
  item: PizzaFlavor | null;
  onClose: () => void;
}

export function MassasBuilder({ isOpen, item, onClose }: MassasBuilderProps) {
  const { addToCart } = useCartStore();
  const [selectedMolho, setSelectedMolho] = useState<string>('molho-tomate');
  const [selectedIngredientes, setSelectedIngredientes] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  const price = item.prices['P'] || 0;
  const molhos = item.molhos || [];
  const ingredientes = item.ingredientes || [];

  const ingredientesSelecionados = ingredientes.filter(ing => selectedIngredientes.includes(ing.id));
  const precoIngredientes = ingredientesSelecionados.reduce((sum, ing) => sum + (ing.price || 0), 0);
  const precoTotal = price + precoIngredientes;

  const handleIngredientToggle = (ingredienteId: string) => {
    setSelectedIngredientes(prev => {
      if (prev.includes(ingredienteId)) {
        return prev.filter(id => id !== ingredienteId);
      }
      // Máximo 6 ingredientes
      if (prev.length >= 6) {
        return prev;
      }
      return [...prev, ingredienteId];
    });
  };

  const handleAddToCart = () => {
    const ingredientesNomes = ingredientesSelecionados.map(ing => ing.name).join(', ');
    const notasCompletas = `Molho: ${molhos.find(m => m.id === selectedMolho)?.name || 'Tomate'}${ingredientesNomes ? ` | Adicionais: ${ingredientesNomes}` : ''}`;
    
    addToCart({
      size: 'P',
      flavors: [item],
      quantity,
      price: precoTotal,
      crust: 'normal',
      edge: 'sem-borda',
      edgePrice: 0,
      notes: notasCompletas
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md md:max-w-xl p-0 gap-0 bg-card overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header Image */}
        <div className="relative h-32 md:h-40 w-full shrink-0">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <h2 className="text-white text-2xl font-heading font-bold drop-shadow-md">
              {item.name}
            </h2>
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            
            {/* Description */}
            <p className="text-sm text-muted-foreground">
              {item.description}
            </p>

            {/* Molho Selection */}
            <section>
              <h3 className="text-lg font-heading font-semibold mb-3 text-foreground">
                1. Escolha o Molho
              </h3>
              <RadioGroup value={selectedMolho} onValueChange={setSelectedMolho} className="space-y-2">
                {molhos.map((molho) => (
                  <div key={molho.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={molho.id} id={molho.id} />
                    <Label htmlFor={molho.id} className="cursor-pointer flex-1">
                      {molho.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </section>

            {/* Ingredientes Selection */}
            <section>
              <h3 className="text-lg font-heading font-semibold mb-3 text-foreground flex items-center justify-between">
                2. Escolha os Ingredientes
                <span className="text-xs font-normal bg-accent/20 text-accent px-2 py-1 rounded-md">
                  {selectedIngredientes.length}/6
                </span>
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {ingredientes.map((ingrediente) => (
                  <div 
                    key={ingrediente.id} 
                    className={cn(
                      "flex items-center space-x-2 p-3 rounded-lg transition-all",
                      selectedIngredientes.includes(ingrediente.id)
                        ? "bg-primary/10 border-2 border-primary"
                        : "hover:bg-secondary/50 border-2 border-transparent",
                      selectedIngredientes.length >= 6 && !selectedIngredientes.includes(ingrediente.id)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    )}
                  >
                    <Checkbox 
                      id={ingrediente.id}
                      checked={selectedIngredientes.includes(ingrediente.id)}
                      onCheckedChange={() => handleIngredientToggle(ingrediente.id)}
                      disabled={selectedIngredientes.length >= 6 && !selectedIngredientes.includes(ingrediente.id)}
                    />
                    <Label htmlFor={ingrediente.id} className="cursor-pointer flex-1 flex justify-between items-center">
                      <span className="font-medium">{ingrediente.name}</span>
                      <span className="text-sm text-accent font-semibold">+R$ {ingrediente.price?.toFixed(2)}</span>
                    </Label>
                  </div>
                ))}
              </div>
              {selectedIngredientes.length >= 6 && (
                <p className="text-xs text-accent mt-2 font-medium">Máximo de 6 ingredientes atingido</p>
              )}
            </section>

            {/* Quantity Selection */}
            <section>
              <h3 className="text-lg font-heading font-semibold mb-3 text-foreground">
                3. Quantidade
              </h3>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  −
                </Button>
                <span className="text-lg font-bold w-12 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </section>

            {/* Price Summary */}
            <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Base</span>
                <span className="font-semibold">R$ {price.toFixed(2)}</span>
              </div>
              {precoIngredientes > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Adicionais</span>
                  <span className="font-semibold">R$ {precoIngredientes.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border/50 pt-2 flex justify-between items-center text-lg font-bold">
                <span>Total por unidade</span>
                <span className="text-primary">R$ {precoTotal.toFixed(2)}</span>
              </div>
              {quantity > 1 && (
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{quantity}x</span>
                  <span>R$ {(precoTotal * quantity).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="shrink-0 bg-card border-t border-border p-4 flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAddToCart}
            className="flex-1 bg-primary hover:bg-primary/90 text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Adicionar à Sacola
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
