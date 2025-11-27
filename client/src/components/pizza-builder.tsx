import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/lib/store";
import { MENU_ITEMS, SIZES, CRUST_OPTIONS, EDGE_OPTIONS, getEdgePrice, Size, PizzaFlavor } from "@/data/menu";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function PizzaBuilder() {
  const { isBuilderOpen, closeBuilder, currentBuilderItem, addToCart } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<Size>("G");
  const [selectedFlavors, setSelectedFlavors] = useState<PizzaFlavor[]>([]);
  const [selectedCrust, setSelectedCrust] = useState<string>("media");
  const [selectedEdge, setSelectedEdge] = useState<string>("sem-borda");
  
  // Reset state when opening
  useEffect(() => {
    if (isBuilderOpen && currentBuilderItem) {
      // Try to default to G, if not available, find first available size
      const availableSizes = Object.keys(currentBuilderItem.prices) as Size[];
      if (availableSizes.includes("G")) {
        setSelectedSize("G");
      } else if (availableSizes.length > 0) {
        setSelectedSize(availableSizes[0]);
      }
      
      setSelectedFlavors([currentBuilderItem]);
      setSelectedCrust("media");
      setSelectedEdge("sem-borda");
    }
  }, [isBuilderOpen, currentBuilderItem]);

  if (!currentBuilderItem) return null;

  const currentSizeConfig = SIZES[selectedSize];
  const maxFlavors = currentSizeConfig?.maxFlavors || 1;
  
  // Filter flavors that have the selected size available
  const availableFlavors = MENU_ITEMS.filter(item => 
    item.category === currentBuilderItem.category && 
    item.prices[selectedSize] !== undefined
  );

  // Price Calculation
  const calculatePrice = () => {
    if (selectedFlavors.length === 0) return 0;
    const flavorPrices = selectedFlavors.map(f => f.prices[selectedSize] || 0);
    const basePrice = Math.max(...flavorPrices); // Highest price logic
    const edgePrice = getEdgePrice(selectedEdge, selectedSize);
    return basePrice + edgePrice;
  };

  const totalPrice = calculatePrice();

  const handleFlavorToggle = (flavor: PizzaFlavor) => {
    if (selectedFlavors.find(f => f.id === flavor.id)) {
      // Remove if already selected (unless it's the only one, preventing empty)
      if (selectedFlavors.length > 1) {
        setSelectedFlavors(selectedFlavors.filter(f => f.id !== flavor.id));
      }
    } else {
      // Add if limit not reached
      if (selectedFlavors.length < maxFlavors) {
        setSelectedFlavors([...selectedFlavors, flavor]);
      }
    }
  };

  const handleAddToCart = () => {
    addToCart({
      size: selectedSize,
      flavors: selectedFlavors,
      quantity: 1,
      price: totalPrice,
      crust: selectedCrust,
      edge: selectedEdge,
      edgePrice: getEdgePrice(selectedEdge, selectedSize)
    });
  };

  return (
    <Dialog open={isBuilderOpen} onOpenChange={(open) => !open && closeBuilder()}>
      <DialogContent className="max-w-md md:max-w-xl p-0 gap-0 bg-card overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header Image */}
        <div className="relative h-32 md:h-40 w-full shrink-0">
          <img 
            src={currentBuilderItem.image} 
            alt={currentBuilderItem.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <h2 className="text-white text-2xl font-heading font-bold drop-shadow-md">
              {currentBuilderItem.name}
            </h2>
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            
            {/* Size Selection */}
            <section>
              <h3 className="text-lg font-heading font-semibold mb-3 text-foreground flex items-center justify-between">
                1. Escolha o Tamanho
                <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                  {currentSizeConfig.slices} fatias
                </span>
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(currentBuilderItem.prices) as Size[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      // Reset flavors if not compatible
                      if (!currentBuilderItem.prices[size]) {
                         // Logic handled by effect
                      }
                    }}
                    className={cn(
                      "border-2 rounded-xl p-3 flex flex-col items-center transition-all",
                      selectedSize === size 
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                        : "border-muted hover:border-primary/50"
                    )}
                  >
                    <span className={cn("font-bold", selectedSize === size ? "text-primary" : "text-foreground")}>
                      {SIZES[size].label}
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      R$ {currentBuilderItem.prices[size]?.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Crust Selection */}
            <section>
              <h3 className="text-lg font-heading font-semibold mb-3 text-foreground">
                2. Escolha a Massa
              </h3>
              <RadioGroup value={selectedCrust} onValueChange={setSelectedCrust} className="grid grid-cols-3 gap-2">
                {CRUST_OPTIONS.map((crust) => (
                  <div key={crust.id}>
                    <RadioGroupItem value={crust.id} id={crust.id} className="peer sr-only" />
                    <Label
                      htmlFor={crust.id}
                      className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:text-primary cursor-pointer transition-all h-full"
                    >
                      <span className="font-medium text-sm text-center">{crust.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </section>

            {/* Edge Selection */}
            <section>
              <h3 className="text-lg font-heading font-semibold mb-3 text-foreground">
                3. Escolha a Borda
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {EDGE_OPTIONS.map((edge) => {
                  const price = getEdgePrice(edge.id, selectedSize);
                  return (
                    <button
                      key={edge.id}
                      onClick={() => setSelectedEdge(edge.id)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left",
                        selectedEdge === edge.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-muted hover:border-primary/50"
                      )}
                    >
                      <span className="font-medium text-sm">{edge.name}</span>
                      {price > 0 && (
                        <span className="text-xs font-bold text-accent">+ R$ {price.toFixed(2)}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Flavor Selection */}
            <section>
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-card py-2 z-10 border-b border-border/50 backdrop-blur-sm">
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  4. Sabores
                </h3>
                <div className="text-sm font-medium px-3 py-1 rounded-full bg-accent/10 text-accent-foreground/90 bg-accent">
                  {selectedFlavors.length}/{maxFlavors} selecionados
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                O preço final será baseado no sabor de maior valor.
              </p>

              <div className="space-y-3">
                {availableFlavors.map((flavor) => {
                  const isSelected = selectedFlavors.some(f => f.id === flavor.id);
                  const price = flavor.prices[selectedSize];
                  const isAllowed = selectedFlavors.length < maxFlavors || isSelected;

                  return (
                    <div 
                      key={flavor.id}
                      onClick={() => isAllowed && handleFlavorToggle(flavor)}
                      className={cn(
                        "flex items-start p-3 rounded-lg border transition-all cursor-pointer",
                        isSelected 
                          ? "border-primary bg-primary/5 shadow-sm" 
                          : isAllowed 
                            ? "border-border hover:border-primary/30" 
                            : "opacity-50 cursor-not-allowed border-transparent bg-muted/30"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 mt-0.5 rounded-full border flex items-center justify-center mr-3 shrink-0 transition-colors",
                        isSelected ? "bg-primary border-primary" : "border-muted-foreground"
                      )}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium text-foreground">{flavor.name}</span>
                          <span className="text-sm font-semibold text-accent">
                            {price ? `R$ ${price.toFixed(2)}` : '--'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {flavor.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-card shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground font-medium">Total</span>
            <span className="text-2xl font-heading font-bold text-primary">
              R$ {totalPrice.toFixed(2)}
            </span>
          </div>
          <Button 
            onClick={handleAddToCart}
            className="w-full h-12 text-lg font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98] bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Adicionar à Sacola
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
