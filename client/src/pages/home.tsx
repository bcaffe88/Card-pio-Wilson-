import { useEffect, useState } from "react";
import { MENU_ITEMS, Category } from "@/data/menu";
import { useCartStore } from "@/lib/store";
import { PizzaBuilder } from "@/components/pizza-builder";
import { MassasBuilder } from "@/components/massas-builder";
import { CartDrawer } from "@/components/cart-drawer";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, UtensilsCrossed, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMassasBuilderOpen, setIsMassasBuilderOpen] = useState(false);
  const [selectedMassa, setSelectedMassa] = useState<any>(null);
  const { openBuilder, toggleCart, items } = useCartStore();

  // Derived state for cart count
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const [hybridItems, setHybridItems] = useState<any[]>([]);

  useEffect(() => {
    // Estratégia SIMPLES: carrega APENAS do banco de dados (Railway)
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/cardapio');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        
        // Transforma produtos do banco para formato do frontend
        const transformed = data.map((dbItem: any) => ({
          id: dbItem.id,
          name: dbItem.nome_item,
          description: dbItem.descricao || '',
          category: dbItem.categoria,
          prices: dbItem.precos || {},
          image: dbItem.imagem_url || '',
          active: dbItem.disponivel !== false
        }));
        
        setHybridItems(transformed);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback para MENU_ITEMS apenas se banco falhar
        setHybridItems(MENU_ITEMS.map(item => ({ ...item })));
      }
    };
    fetchProducts();
  }, []);

  const filteredItems = hybridItems.filter(item => {
    const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">W</div>
            <h1 className="text-xl font-heading font-bold tracking-tight text-foreground">
              Wilson <span className="text-primary">Pizza</span>
            </h1>
          </div>

          <Button 
            variant="ghost" 
            className="relative p-2 hover:bg-secondary rounded-full"
            onClick={() => toggleCart(true)}
          >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-secondary overflow-hidden">
        <div className="container max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-sm mb-4">
              🛵 Entrega Rápida
            </span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold leading-tight mb-4 text-foreground">
              A Melhor Pizza <br/>
              <span className="text-primary">Direto na Sua Mesa</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto md:mx-0">
              Ingredientes selecionados, massa artesanal e muito recheio. Escolha seus sabores favoritos!
            </p>
          </div>
          
          {/* Decorative Pizza Image */}
          <div className="flex-1 relative w-full max-w-sm md:max-w-md">
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl"></div>
             <img 
               src="https://ktbzjpwvzcrzzoacfciv.supabase.co/storage/v1/object/public/imagens-cardapio/1764962741635-r855-advertisement-wilson-pizzas-2022-11.jpg" 
               alt="Pizza Hero" 
               className="relative w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 rotate-12 hover:rotate-0"
             />
          </div>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="sticky top-16 z-30 bg-background border-b border-border shadow-sm">
        <div className="container max-w-5xl mx-auto px-4 py-3 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar sabores..." 
              className="pl-9 bg-secondary/50 border-transparent focus:bg-background focus:border-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {(['Todos', 'Salgadas', 'Doces', 'Massas', 'Pastéis de Forno', 'Lasanhas', 'Petiscos', 'Calzones', 'Bebidas'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  activeCategory === cat 
                    ? "bg-foreground text-background shadow-md" 
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <main className="container max-w-5xl mx-auto px-4 py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <UtensilsCrossed className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-heading font-semibold text-muted-foreground">Nenhuma pizza encontrada</h3>
            <p className="text-muted-foreground/60">Tente buscar por outro termo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <motion.div 
                layoutId={item.id}
                key={item.id}
                className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <h3 className="text-white font-heading font-bold text-lg drop-shadow-md leading-tight">
                      {item.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">A partir de</span>
                      <span className="text-lg font-bold text-accent">
                        R$ {Math.min(...Object.values(item.prices) as number[]).toFixed(2)}
                      </span>
                    </div>
                    
                    {(item.category === 'Salgadas' || item.category === 'Doces' || item.isMassa) ? (
                      <Button 
                        onClick={() => {
                          if (item.isMassa) {
                            setSelectedMassa(item);
                            setIsMassasBuilderOpen(true);
                          } else {
                            openBuilder(item);
                          }
                        }}
                        size="sm" 
                        className="rounded-full font-semibold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg active:scale-95 transition-all"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Montar
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => {
                          // Add simple item directly to cart
                          const minPrice = Math.min(...Object.values(item.prices) as number[]);
                          const { addToCart } = useCartStore.getState();
                          addToCart({
                            size: 'M',
                            flavors: [item],
                            quantity: 1,
                            price: minPrice,
                            category: item.category,
                            productId: item.id,
                            edgePrice: 0
                          });
                        }}
                        size="sm" 
                        className="rounded-full font-semibold bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg active:scale-95 transition-all"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <PizzaBuilder />
      <MassasBuilder 
        isOpen={isMassasBuilderOpen}
        item={selectedMassa}
        onClose={() => setIsMassasBuilderOpen(false)}
      />
      <CartDrawer />

      {/* Mobile Floating Cart Button (if cart has items) */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-4 right-4 md:hidden z-50"
          >
            <Button 
              onClick={() => toggleCart(true)}
              className="w-full h-14 rounded-full shadow-xl bg-foreground text-background flex items-center justify-between px-6 text-lg font-bold"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs text-white">
                  {cartCount}
                </div>
                <span>Ver Sacola</span>
              </div>
              <span>R$ {items.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2)}</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
