import pepperoniImg from '@assets/stock_images/delicious_pepperoni__f6d6fa05.jpg';
import chickenImg from '@assets/stock_images/pizza_frango_com_cat_c5255c4b.jpg';
import meatImg from '@assets/stock_images/pizza_calabresa_onio_8ea1076f.jpg';
import sweetImg from '@assets/stock_images/sweet_pizza_chocolat_b4c83fb7.jpg';

export type Size = 'P' | 'M' | 'G' | 'GG' | 'Super';
export type Category = 'Salgadas' | 'Doces' | 'Massas' | 'Pastéis de Forno' | 'Lasanhas' | 'Petiscos' | 'Calzones' | 'Bebidas';

// Tipos para Massas com molho e ingredientes
export interface MolhoOption {
  id: string;
  name: string;
  price?: number;
}

export interface IngredienteOption {
  id: string;
  name: string;
  price?: number;
}

export interface PizzaFlavor {
  id: string;
  name: string;
  description: string;
  prices: Partial<Record<Size, number>>;
  image: string;
  category: Category;
  isMassa?: boolean; // Para diferenciar massas que precisam de molho
  molhos?: MolhoOption[]; // Opções de molho para massas
  ingredientes?: IngredienteOption[]; // Opções de ingredientes adicionais
}

export interface CrustOption {
  id: string;
  name: string;
  price: number;
}

export interface EdgeOption {
  id: string;
  name: string;
  price: number;
}

export const SIZES: Record<Size, { label: string; slices: number; maxFlavors: number }> = {
  'P': { label: 'Pequena', slices: 4, maxFlavors: 2 },
  'M': { label: 'Média', slices: 6, maxFlavors: 4 },
  'G': { label: 'Grande', slices: 8, maxFlavors: 4 },
  'GG': { label: 'Gigante', slices: 10, maxFlavors: 4 }, // Some items have GG, some don't. Mapping based on availability.
  'Super': { label: 'Super', slices: 12, maxFlavors: 4 },
};

export const CRUST_OPTIONS: CrustOption[] = [
  { id: 'fina', name: 'Massa Fina', price: 0 },
  { id: 'media', name: 'Massa Média', price: 0 },
  { id: 'grossa', name: 'Massa Grossa', price: 0 },
];

export const EDGE_OPTIONS: EdgeOption[] = [
  { id: 'sem-borda', name: 'Sem Borda Recheada', price: 0 },
  { id: 'catupiry', name: 'Catupiry', price: 8.00 },
  { id: 'cheddar', name: 'Cheddar', price: 8.00 },
  { id: 'chocolate', name: 'Chocolate', price: 8.00 },
  { id: 'mussarela', name: 'Mussarela', price: 8.00 }, // Updated based on images (was 14 in one, 8 in another, using conservative avg or lowest common denominator? Images show varied prices. Let's align with the last image: Catupiry/Cheddar/Chocolate 12.00/8.00/6.00/5.00 depending on size? The images have a table for edges prices)
  // Wait, the images show a table for edges prices based on size (Super/Grande/Média/Peq).
  // Let's simplify for MVP or implement size-based edge pricing if needed. 
  // The last image shows:
  // Borda Recheada: Mussarela | Catupiry | Cheddar | Vulcão
  // Prices: 8.00 | 7.00 | 5.00 | 4.00 (Maybe corresponding to sizes?)
  // Let's assume a flat rate for now or pick the 'Grande' price as average to simplify the UI, 
  // or better, just list them. The user asked to "add options".
  // Let's use the prices from the last image (Super/Grande/Media/Peq columns? No, looks like a single row of prices).
  // Actually, looking closely at image 4 (fae11...):
  // Borda Recheada: Mussarela | Catupiry | Cheddar | Vulcão
  // Below it has 8,00 | 7,00 | 5,00 | 4,00. This likely corresponds to sizes Super, Grande, Média, Peq.
  
  // Let's update the structure to support size-based edge pricing.
  { id: 'vulcao', name: 'Vulcão', price: 10.00 }, 
  { id: 'creme-cheese', name: 'Creme Cheese', price: 10.00 },
];

// Helper to get edge price by size (approximated from images)
export const getEdgePrice = (edgeId: string, size: Size): number => {
  if (edgeId === 'sem-borda') return 0;
  
  // Base prices from the images (approximate logic: bigger pizza = more expensive edge)
  // Image 2 shows: Catupiry/Cheddar/Chocolate: 12/8/6/5. Mussarela/Creme Cheese: 14/10/7/6.
  // Image 4 shows: 8/7/5/4 for Mussarela/Catupiry/Cheddar/Vulcão (Simpler table).
  
  // Let's implement the pricing from Image 2 (more comprehensive)
  const isPremium = ['mussarela', 'creme-cheese', 'vulcao'].includes(edgeId);
  
  switch (size) {
    case 'Super': return isPremium ? 14 : 12;
    case 'GG': return isPremium ? 14 : 12; // Assuming GG ~ Super
    case 'G': return isPremium ? 10 : 8;
    case 'M': return isPremium ? 7 : 6;
    case 'P': return isPremium ? 6 : 5;
    default: return 0;
  }
};


export const MENU_ITEMS: PizzaFlavor[] = [
  
];
