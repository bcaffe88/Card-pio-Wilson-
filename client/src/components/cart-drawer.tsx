import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/lib/store";
import { Trash2, ShoppingBag, MessageCircle, Plus, Minus, MapPin, Store } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { SIZES, CRUST_OPTIONS, EDGE_OPTIONS } from "@/data/menu";
// In a real app, we would import this from the admin store or context, but for mockup we use a hardcoded fallback or mock
// import { useAdminStore } from "@/lib/admin-store"; 

export function CartDrawer() {
  const { items, isCartOpen, toggleCart, removeFromCart, updateQuantity } = useCartStore();
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  
  // Checkout State
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [deliveryMethod, setDeliveryMethod] = useState('entrega');
  const [changeFor, setChangeFor] = useState('');
  const [notes, setNotes] = useState('');
  const [address, setAddress] = useState(''); // New address state

  // Mock Restaurant Address (In real app, get from AdminStore)
  const restaurantAddress = "Rua Principal, 123, Centro - Ouricuri/PE";

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    const phoneNumber = "5587999480699";
    
    const itemsList = items.map(item => {
      const category = item.category || item.flavors[0]?.category;
      const isMassa = item.flavors[0]?.isMassa;
      
      // Formatação diferente por categoria
      if (isMassa || category === 'Massas') {
        // Formato para Massas: Nome + Molho + Ingredientes
        const flavorName = item.flavors[0]?.name || 'Massa';
        return `- ${item.quantity}x ${flavorName}\n  ${item.notes || 'Sem molho'}`;
      } else if (category === 'Salgadas' || category === 'Doces') {
        // Formato para Pizzas: Tamanho + Sabores + Massa + Borda
        const flavors = item.flavors.map(f => f.name).join(', ');
        const crustName = CRUST_OPTIONS.find(c => c.id === item.crust)?.name || 'Massa Média';
        const edgeName = EDGE_OPTIONS.find(e => e.id === item.edge)?.name || 'Sem Borda';
        const edgePrice = (item.edgePrice || 0) > 0 ? `(+R$ ${item.edgePrice?.toFixed(2)})` : '';
        
        let itemDetails = `- ${item.quantity}x Pizza ${SIZES[item.size || 'M'].label} (${flavors})\n  ${crustName} | ${edgeName} ${edgePrice}`;
        
        if (item.notes && item.notes.trim()) {
          itemDetails += `\n  _${item.notes}_`;
        }
        
        return itemDetails;
      } else {
        // Formato simples para outras categorias: Quantidade + Nome + Preço
        const flavorName = item.flavors[0]?.name || 'Item';
        return `- ${item.quantity}x ${flavorName}`;
      }
    }).join('\n');

    const deliveryInfo = deliveryMethod === 'entrega' 
      ? `*ENTREGA:* ${address || 'Endereço não informado'}` 
      : `*RETIRADA:* Vou buscar no local`;

    // Pagamento formatado
    let paymentFormatted = '';
    if (paymentMethod === 'pix') paymentFormatted = 'PIX';
    else if (paymentMethod === 'cartao') paymentFormatted = 'CARTÃO';
    else if (paymentMethod === 'dinheiro') paymentFormatted = 'DINHEIRO';

    const changeInfo = paymentMethod === 'dinheiro' ? `\n*TROCO PARA:* R$ ${changeFor || '0,00'}` : '';

    const message = `
*🍕 NOVO PEDIDO WILSON PIZZAS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━

*📦 ITENS:*
${itemsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
*💰 TOTAL: R$ ${total.toFixed(2)}*

*💳 PAGAMENTO:* ${paymentFormatted}${changeInfo}

${deliveryInfo}

${notes ? `*📝 OBSERVAÇÕES:* ${notes}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => {
      toggleCart(open);
      if (!open) setStep('cart'); 
    }}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-background">
        <SheetHeader className="p-6 border-b border-border bg-card">
          <SheetTitle className="flex items-center text-xl font-heading">
            <ShoppingBag className="mr-2 w-5 h-5 text-primary" />
            {step === 'cart' ? 'Sua Sacola' : 'Finalizar Pedido'}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-lg font-medium">Sua sacola está vazia</h3>
            <p className="text-muted-foreground text-sm">
              Adicione algumas pizzas deliciosas para começar seu pedido.
            </p>
            <Button variant="outline" onClick={() => toggleCart(false)}>
              Voltar ao Cardápio
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 bg-background/50">
              {step === 'cart' ? (
                <div className="p-6 space-y-6">
                  {items.map((item) => {
                     const edgeName = EDGE_OPTIONS.find(e => e.id === item.edge)?.name;
                     const crustName = CRUST_OPTIONS.find(c => c.id === item.crust)?.name;
                     const category = item.category || item.flavors[0]?.category;
                     const isPizza = category === 'Salgadas' || category === 'Doces';
                     const isMassa = category === 'Massas';
                     
                     return (
                      <div key={item.id} className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-border bg-muted">
                          <img src={item.flavors[0].image} alt={item.flavors[0].name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-sm line-clamp-2 leading-tight">
                              {isPizza || isMassa ? item.flavors.map(f => f.name).join(' + ') : item.flavors[0].name}
                            </h4>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {(isPizza || isMassa) && (
                            <div className="text-xs text-muted-foreground space-y-0.5">
                              <p>Tamanho {SIZES[item.size || 'M'].label}</p>
                              <p>{crustName}</p>
                              {item.edge !== 'sem-borda' && <p className="text-accent">{edgeName}</p>}
                              {isMassa && item.notes && <p className="text-accent italic">{item.notes}</p>}
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center pt-2">
                            <span className="font-bold text-primary">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </span>
                            
                            <div className="flex items-center gap-3 bg-card border border-border rounded-md h-8 px-1 shadow-sm">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 hover:bg-muted rounded text-foreground/70"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 hover:bg-muted rounded text-foreground/70"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 space-y-8 animate-in slide-in-from-right-4 duration-300">
                  {/* Delivery Method */}
                  <div className="space-y-3">
                    <h4 className="font-heading font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">1</span>
                      Entrega ou Retirada
                    </h4>
                    <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="grid grid-cols-2 gap-3">
                      <div>
                        <RadioGroupItem value="entrega" id="entrega" className="peer sr-only" />
                        <Label
                          htmlFor="entrega"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all text-center h-full"
                        >
                          <span className="font-semibold">Entrega</span>
                          <span className="text-xs text-muted-foreground mt-1">Receber em casa</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="retirada" id="retirada" className="peer sr-only" />
                        <Label
                          htmlFor="retirada"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all text-center h-full"
                        >
                          <span className="font-semibold">Retirada</span>
                          <span className="text-xs text-muted-foreground mt-1">Buscar no local</span>
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    {/* Conditional Address Input or Restaurant Address */}
                    <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                      {deliveryMethod === 'entrega' ? (
                        <div className="space-y-2">
                          <Label htmlFor="address" className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            Endereço de Entrega
                          </Label>
                          <Textarea 
                            id="address" 
                            placeholder="Rua, Número, Bairro, Ponto de Referência..." 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="resize-none h-20"
                          />
                        </div>
                      ) : (
                        <div className="p-4 bg-secondary/30 rounded-lg border border-border space-y-2">
                          <Label className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-primary" />
                            Retirar em:
                          </Label>
                          <p className="text-sm text-foreground font-medium">
                            {restaurantAddress}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Seu pedido estará pronto em aproximadamente 40 minutos.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <h4 className="font-heading font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">2</span>
                      Pagamento
                    </h4>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                      <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="flex-1 cursor-pointer font-medium">Pix</Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="cartao" id="cartao" />
                        <Label htmlFor="cartao" className="flex-1 cursor-pointer font-medium">Cartão</Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="dinheiro" id="dinheiro" />
                        <Label htmlFor="dinheiro" className="flex-1 cursor-pointer font-medium">Dinheiro</Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === 'dinheiro' && (
                      <div className="mt-3 animate-in slide-in-from-top-2 fade-in">
                        <Label htmlFor="change" className="text-sm mb-1.5 block">Precisa de troco para quanto?</Label>
                        <Input 
                          id="change" 
                          placeholder="Ex: 50,00" 
                          value={changeFor}
                          onChange={(e) => setChangeFor(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Notes */}
                  <div className="space-y-3">
                    <h4 className="font-heading font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">3</span>
                      Observações
                    </h4>
                    <Textarea 
                      placeholder="Ex: Retirar cebola, caprichar no orégano..." 
                      className="resize-none"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </ScrollArea>

            <div className="p-6 border-t border-border bg-card shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground font-medium">Total do Pedido</span>
                <span className="text-2xl font-heading font-bold text-primary">
                  R$ {total.toFixed(2)}
                </span>
              </div>
              
              {step === 'cart' ? (
                <Button 
                  onClick={() => setStep('checkout')}
                  className="w-full h-12 text-lg font-bold shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Finalizar Pedido
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep('cart')}
                    className="h-12 px-6"
                  >
                    Voltar
                  </Button>
                  <Button 
                    onClick={handleCheckout}
                    disabled={deliveryMethod === 'entrega' && !address}
                    className="flex-1 h-12 text-lg font-bold shadow-lg hover:shadow-xl transition-all bg-[#25D366] hover:bg-[#20bd5a] text-white border-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageCircle className="mr-2 w-5 h-5" />
                    Enviar Pedido
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
