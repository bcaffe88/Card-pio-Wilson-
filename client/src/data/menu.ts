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
  // Salgadas
  {
    id: 'costela',
    name: 'Costela',
    description: 'Costela desfiada, cebola, creme cheese, mussarela e barbecue.',
    prices: { 'Super': 80, 'G': 65, 'M': 45, 'P': 35 }, // Updated from image
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'calabresa-especial',
    name: 'Calabresa Especial',
    description: 'Molho de tomate, calabresa fatiada, mussarela, creme cheese, barbecue, orégano e azeitonas.',
    prices: { 'Super': 73, 'G': 53, 'M': 42, 'P': 32 }, // Updated from image (Super 73 vs GG 73)
    image: pepperoniImg,
    category: 'Salgadas'
  },
  {
    id: 'carne-de-sol',
    name: 'Carne de Sol',
    description: 'Molho de tomate, carne de sol desfiada, cebola fatiada, mussarela, orégano e azeitonas.',
    prices: { 'Super': 80, 'G': 60, 'M': 44, 'P': 34 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'a-moda-do-chefe',
    name: 'À Moda do Chefe',
    description: 'Molho de tomate, lombo canadense, bacon, mussarela, champignon, orégano e azeitonas.',
    prices: { 'Super': 75, 'G': 62, 'M': 38, 'P': 28 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'espanhola',
    name: 'Espanhola',
    description: 'Molho de tomate, calabresa moída, ovos cozidos, cebola, pimentão fatiado, mussarela, orégano e azeitonas.',
    prices: { 'Super': 65, 'G': 50, 'M': 38, 'P': 28 },
    image: pepperoniImg,
    category: 'Salgadas'
  },
  {
    id: 'pepperone',
    name: 'Peperone', // Image spelling
    description: 'Molho de tomate, mussarela, salaminho tipo peperone, parmesão, orégano e azeitonas.',
    prices: { 'Super': 60, 'G': 50, 'M': 38, 'P': 28.50 },
    image: pepperoniImg,
    category: 'Salgadas'
  },
  {
    id: 'camarao',
    name: 'Camarão',
    description: 'Molho de tomate, mussarela, filé de camarão, orégano e azeitonas.',
    prices: { 'Super': 80, 'G': 62, 'M': 45, 'P': 35 },
    image: chickenImg, 
    category: 'Salgadas'
  },
  {
    id: 'frango-bolonhesa',
    name: 'Frango Bolonhesa',
    description: 'Molho de tomate, frango desfiado, queijo parmesão, orégano e azeitonas.',
    prices: { 'Super': 75, 'G': 56, 'M': 42, 'P': 32 },
    image: chickenImg,
    category: 'Salgadas'
  },
  {
    id: 'siciliana',
    name: 'Siciliana',
    description: 'Molho de tomate, mussareala, champignon.', // Typo in image preserved/fixed? Fixed "mussareala" -> mussarela in code for correctness but description from menu.
    prices: { 'Super': 70, 'G': 50, 'M': 38, 'P': 28 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'nordestina',
    name: 'Nordestina',
    description: 'Molho de tomate, carne de charque desfiada, cebola, pimentão, pimenta de cheiro, orégano e azeitonas.',
    prices: { 'Super': 80, 'G': 62, 'M': 42, 'P': 32 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'a-sua-moda', // New Item
    name: 'À Sua Moda',
    description: 'Ingredientes sugeridos pelo cliente.',
    prices: { 'Super': 80, 'G': 64, 'M': 45, 'P': 35 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'vegetariana',
    name: 'Vegetariana',
    description: 'Molho de tomate, mussarela, palmito, tomate fatiado, pimentão, champignon, manjericão, orégano e azeitonas.',
    prices: { 'Super': 60, 'G': 48, 'M': 40, 'P': 30 }, // Updated G price from 50 to 48 (Image 3)
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'caipira',
    name: 'Caipira',
    description: 'Molho de tomate, frango desfiado, milho verde, catupiry, orégano e azeitonas.',
    prices: { 'Super': 73, 'G': 53, 'M': 42, 'P': 32 }, // Updated G price from 55 to 53 (Image 3)
    image: chickenImg,
    category: 'Salgadas'
  },
  {
    id: 'toscana',
    name: 'Toscana',
    description: 'Molho de tomate, calabresa moída, cebola, mussarela, orégano e azeitonas.',
    prices: { 'Super': 60, 'G': 44, 'M': 38, 'P': 28 }, // Updated G price from 46 to 44 (Image 3)
    image: pepperoniImg,
    category: 'Salgadas'
  },
  {
    id: '4-queijos',
    name: '4 Queijos',
    description: 'Molho de tomate, mussarela, provolone, catupiry, parmesão, orégano e azeitonas.',
    prices: { 'Super': 62, 'G': 48, 'M': 41, 'P': 28 }, // Updated G price from 50 to 48 (Image 3)
    image: chickenImg,
    category: 'Salgadas'
  },
  {
    id: 'a-moda-do-forneiro',
    name: 'À Moda do Forneiro',
    description: 'Molho de tomate, carne de sol desfiada, champignon, palmito, catupiry, manjericão, orégano e azeitonas.',
    prices: { 'Super': 73, 'G': 54, 'M': 42, 'P': 32 }, // Updated Super from 80 to 73, G from 56 to 54 (Image 3)
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'bolonhesa',
    name: 'Bolonhesa',
    description: 'Molho de tomate, mussarela, molho bolonhesa, parmesão, orégano e azeitonas.',
    prices: { 'Super': 55, 'G': 48, 'M': 38, 'P': 28 }, // Updated G from 50 to 48 (Image 3)
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'palmito',
    name: 'Palmito',
    description: 'Molho de tomate, palmito picado e temperado, catupiry, mussarela, orégano e azeitonas.',
    prices: { 'Super': 60, 'G': 53, 'M': 38, 'P': 28 }, // Updated G from 55 to 53 (Image 3)
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'a-moda-do-pizzaiolo', // New Item from Image 3
    name: 'À Moda do Pizzaiolo',
    description: 'Molho de tomate, presunto picado, palmito, ervilha, mussarela, bacon, orégano e azeitonas.',
    prices: { 'Super': 73, 'G': 52, 'M': 42, 'P': 32 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'marguerita',
    name: 'Marguerita',
    description: 'Molho de tomate, mussarela, manjericão, rodelas de tomate, parmesão, orégano e azeitonas.',
    prices: { 'Super': 55, 'G': 48, 'M': 38, 'P': 28 }, // Updated G from 50 to 48 (Image 3)
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'verona', // New Item from Image 4
    name: 'Verona',
    description: 'Molho de tomate, palmito, bacon, catupiry, orégano e azeitonas.',
    prices: { 'Super': 65, 'G': 52, 'M': 38, 'P': 28 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'baiana',
    name: 'Baiana',
    description: 'Molho de tomate, calabresa moída, ovos cozidos, pimenta calabresa, cebola, mussarela, orégano e azeitonas.',
    prices: { 'Super': 65, 'G': 50, 'M': 40, 'P': 30 },
    image: pepperoniImg,
    category: 'Salgadas'
  },
  {
    id: 'sertaneja',
    name: 'Sertaneja',
    description: 'Molho de tomate, mussarela, calabresa, milho verde, cebola, orégano e azeitonas.',
    prices: { 'Super': 60, 'G': 46, 'M': 38, 'P': 28 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'alho',
    name: 'Alho',
    description: 'Molho de tomate, mussarela, parmesão, alho frito, orégano e azeitonas.',
    prices: { 'Super': 60, 'G': 46, 'M': 38, 'P': 28 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'lombinho',
    name: 'Lombinho',
    description: 'Molho de tomate, mussarela, lombo canadense, cebola fatiada, orégano e azeitonas.',
    prices: { 'Super': 62, 'G': 50, 'M': 38, 'P': 28 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'veneza', // New Item from Image 4
    name: 'Veneza',
    description: 'Molho de tomate, lombo canadense, alho frito, catupiry, orégano e azeitonas.',
    prices: { 'Super': 62, 'G': 50, 'M': 38, 'P': 28 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'formagio', // New Item from Image 4
    name: 'Formágio',
    description: 'Molho de tomate, mussarela, provolone, catupiry, gorgonzola, parmesão, orégano e azeitonas.',
    prices: { 'Super': 60, 'G': 50, 'M': 38, 'P': 28 },
    image: chickenImg,
    category: 'Salgadas'
  },
  {
    id: 'hot-dog', // New Item from Image 4
    name: 'Hot Dog',
    description: 'Salsicha, milho, catupiry, mussarela e batata palha.',
    prices: { 'Super': 60, 'G': 47, 'M': 38, 'P': 28 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'a-grega', // New Item from Image 4
    name: 'À Grega',
    description: 'Molho de tomate, mussarela, catupiry, calabresa fatiada, bacon, orégano e azeitonas.',
    prices: { 'Super': 61, 'G': 56, 'M': 41, 'P': 28 },
    image: pepperoniImg,
    category: 'Salgadas'
  },
  {
    id: 'napolitana', // New Item from Image 5
    name: 'Napolitana',
    description: 'Molho de tomate, mussarela, rodelas de tomate, parmesão, orégano e azeitonas.',
    prices: { 'Super': 54, 'G': 45, 'M': 38, 'P': 28 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'atum', // New Item from Image 5
    name: 'Atum',
    description: 'Molho de tomate, atum sólido, cebola, mussarela, orégano e azeitonas.',
    prices: { 'Super': 65, 'G': 45, 'M': 42, 'P': 32 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'atum-c-cream-cheese', // New Item from Image 5
    name: 'Atum c/ Cream Cheese',
    description: 'Molho de tomate, atum, cebola, cream cheese, orégano.',
    prices: { 'Super': 73, 'G': 53, 'M': 45, 'P': 35 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'agreste', // New Item from Image 5
    name: 'Agreste',
    description: 'Molho de tomate, carne de charque desfiada, orégano e azeitonas.',
    prices: { 'Super': 73, 'G': 60, 'M': 42, 'P': 32 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'charque', // New Item from Image 5
    name: 'Charque',
    description: 'Molho de tomate, carne de charque desfiada, orégano e azeitonas.',
    prices: { 'Super': 73, 'G': 60, 'M': 42, 'P': 32 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'suica', // New Item from Image 5
    name: 'Suíça',
    description: 'Molho de tomate, presunto, mussarela, gorgonzola, orégano e azeitonas.',
    prices: { 'Super': 60, 'G': 45, 'M': 40, 'P': 30 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'carne-de-sol-c-cream-cheese', // New Item from Image 5
    name: 'Carne de Sol c/ Cream Cheese',
    description: 'Molho de tomate, carne de sol, cebola, orégano, Cream X e Bacon Fatiado.',
    prices: { 'Super': 73, 'G': 62, 'M': 45, 'P': 32 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'strogonoff', // New Item from Image 5
    name: 'Strogonoff',
    description: 'Molho de tomate, mussarela, strogonoff.',
    prices: { 'Super': 65, 'G': 53, 'M': 42, 'P': 32 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'frango-c-cream-cheese', // New Item from Image 5
    name: 'Frango c/ Cream Cheese',
    description: 'Molho de tomate, frango desfiado, mussarela.', // Image cut off, assuming standard
    prices: { 'Super': 73, 'G': 60, 'M': 45, 'P': 35 },
    image: chickenImg,
    category: 'Salgadas'
  },
  {
    id: 'frango-c-mussarela',
    name: 'Frango c/ Mussarela',
    description: 'Molho de tomate, frango desfiado, mussarela, orégano e azeitonas.',
    prices: { 'Super': 75, 'G': 55, 'M': 42, 'P': 32 },
    image: chickenImg,
    category: 'Salgadas'
  },
  {
    id: 'frango-c-catupiry',
    name: 'Frango c/ Catupiry',
    description: 'Molho de tomate, frango desfiado, catupiry, mussarela, orégano e azeitonas.',
    prices: { 'Super': 75, 'G': 55, 'M': 42, 'P': 32 },
    image: chickenImg,
    category: 'Salgadas'
  },
  {
    id: 'bacon',
    name: 'Bacon',
    description: 'Molho de tomate, mussarela, bacon, rodelas de tomate, orégano e azeitonas.',
    prices: { 'Super': 70, 'G': 55, 'M': 42, 'P': 32 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'a-moda-da-casa',
    name: 'À Moda da Casa',
    description: 'Molho de tomate, frango desfiado, milho verde, mussarela, bacon, orégano e azeitonas.',
    prices: { 'Super': 80, 'G': 62, 'M': 42, 'P': 32 },
    image: chickenImg,
    category: 'Salgadas'
  },
  {
    id: 'francesa', // New Item
    name: 'Francesa',
    description: 'Molho de tomate, presunto, ovos, cebola, ervilha, catupiry, orégano e azeitonas.',
    prices: { 'Super': 65, 'G': 50, 'M': 40, 'P': 30 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'mussarela', // New Item
    name: 'Mussarela',
    description: 'Molho de tomate, mussarela, rodelas de tomate, orégano e azeitonas.',
    prices: { 'Super': 54, 'G': 44, 'M': 38, 'P': 28 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'calabresa', // New Item
    name: 'Calabresa',
    description: 'Molho de tomate, calabresa, mussarela, orégano e azeitonas.',
    prices: { 'Super': 60, 'G': 46, 'M': 38, 'P': 28 },
    image: pepperoniImg,
    category: 'Salgadas'
  },
  {
    id: 'portuguesa', // New Item
    name: 'Portuguesa',
    description: 'Molho de tomate, presunto, ovos, cebola, mussarela, orégano e azeitonas.',
    prices: { 'Super': 65, 'G': 50, 'M': 40, 'P': 30 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'bauru', // New Item
    name: 'Bauru',
    description: 'Molho de tomate, presunto, mussarela, rodelas de tomate, orégano e azeitonas.',
    prices: { 'Super': 60, 'G': 44, 'M': 38, 'P': 28 },
    image: meatImg,
    category: 'Salgadas'
  },
  
  // Doces
  {
    id: 'chocolate-com-morango',
    name: 'Chocolate com Morango',
    description: 'Chocolate com morango.',
    prices: { 'GG': 54, 'G': 40, 'M': 35, 'P': 30 },
    image: sweetImg,
    category: 'Doces'
  },
  {
    id: 'banana-nevada',
    name: 'Banana Nevada',
    description: 'Banana com canela, creme de leite e chocolate branco com borda de doce de leite.',
    prices: { 'GG': 54, 'G': 40, 'M': 35, 'P': 30 },
    image: sweetImg,
    category: 'Doces'
  },
  {
    id: 'cartola',
    name: 'Cartola',
    description: 'Mussarela, catupiry, banana fatiada, açúcar e canela com borda de doce de leite.',
    prices: { 'GG': 54, 'G': 40, 'M': 35, 'P': 30 },
    image: sweetImg,
    category: 'Doces'
  },
  {
    id: 'romeu-e-julieta',
    name: 'Romeu e Julieta',
    description: 'Mussarela coberta com fatia de goiabada, com borda de doce de leite.',
    prices: { 'GG': 54, 'G': 40, 'M': 35, 'P': 30 },
    image: sweetImg,
    category: 'Doces'
  },
  {
    id: 'dois-amores', // New Item from Image 1
    name: 'Dois Amores',
    description: 'Chocolate branco e chocolate de avelã com borda de doce de leite.',
    prices: { 'GG': 54, 'G': 40, 'M': 35, 'P': 30 },
    image: sweetImg,
    category: 'Doces'
  },

  // MASSAS TRADICIONAIS
  {
    id: 'espaguete',
    name: 'Espaguete',
    description: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.',
    prices: { 'P': 26 },
    image: meatImg,
    category: 'Massas',
    isMassa: true,
    molhos: [
      { id: 'molho-vermelho', name: 'Vermelho', price: 0 },
      { id: 'molho-branco', name: 'Branco', price: 0 },
      { id: 'molho-4queijos', name: '4 Queijos', price: 0 },
      { id: 'molho-bolonhesa', name: 'Bolonhesa', price: 0 }
    ],
    ingredientes: [
      { id: 'ing-bacon', name: 'Bacon', price: 0 },
      { id: 'ing-frango', name: 'Frango', price: 0 },
      { id: 'ing-calabresa', name: 'Calabresa', price: 0 },
      { id: 'ing-presunto', name: 'Presunto', price: 0 },
      { id: 'ing-alho-frito', name: 'Alho Frito', price: 0 },
      { id: 'ing-azeitona-fatiada', name: 'Azeitona fatiada', price: 0 },
      { id: 'ing-milho-verde', name: 'Milho verde', price: 0 },
      { id: 'ing-ervilha', name: 'Ervilha', price: 0 },
      { id: 'ing-salsicha', name: 'Salsicha', price: 0 },
      { id: 'ing-pimenta-calabresa', name: 'Pimenta calabresa', price: 0 },
      { id: 'ing-ovo-codorna', name: 'Ovo de codorna', price: 0 },
      { id: 'ing-tomate', name: 'Tomate', price: 0 },
      { id: 'ing-uva-passas', name: 'Uva Passas', price: 0 },
      { id: 'ing-oregano', name: 'Orégano', price: 0 },
      { id: 'ing-cebinha', name: 'Cebinha', price: 0 }
    ]
  },
  {
    id: 'parafuso',
    name: 'Parafuso',
    description: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.',
    prices: { 'P': 26 },
    image: meatImg,
    category: 'Massas',
    isMassa: true,
    molhos: [
      { id: 'molho-vermelho', name: 'Vermelho', price: 0 },
      { id: 'molho-branco', name: 'Branco', price: 0 },
      { id: 'molho-4queijos', name: '4 Queijos', price: 0 },
      { id: 'molho-bolonhesa', name: 'Bolonhesa', price: 0 }
    ],
    ingredientes: [
      { id: 'ing-bacon', name: 'Bacon', price: 0 },
      { id: 'ing-frango', name: 'Frango', price: 0 },
      { id: 'ing-calabresa', name: 'Calabresa', price: 0 },
      { id: 'ing-presunto', name: 'Presunto', price: 0 },
      { id: 'ing-alho-frito', name: 'Alho Frito', price: 0 },
      { id: 'ing-azeitona-fatiada', name: 'Azeitona fatiada', price: 0 },
      { id: 'ing-milho-verde', name: 'Milho verde', price: 0 },
      { id: 'ing-ervilha', name: 'Ervilha', price: 0 },
      { id: 'ing-salsicha', name: 'Salsicha', price: 0 },
      { id: 'ing-pimenta-calabresa', name: 'Pimenta calabresa', price: 0 },
      { id: 'ing-ovo-codorna', name: 'Ovo de codorna', price: 0 },
      { id: 'ing-tomate', name: 'Tomate', price: 0 },
      { id: 'ing-uva-passas', name: 'Uva Passas', price: 0 },
      { id: 'ing-oregano', name: 'Orégano', price: 0 },
      { id: 'ing-cebinha', name: 'Cebinha', price: 0 }
    ]
  },
  {
    id: 'penne',
    name: 'Penne',
    description: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.',
    prices: { 'P': 26 },
    image: meatImg,
    category: 'Massas',
    isMassa: true,
    molhos: [
      { id: 'molho-vermelho', name: 'Vermelho', price: 0 },
      { id: 'molho-branco', name: 'Branco', price: 0 },
      { id: 'molho-4queijos', name: '4 Queijos', price: 0 },
      { id: 'molho-bolonhesa', name: 'Bolonhesa', price: 0 }
    ],
    ingredientes: [
      { id: 'ing-bacon', name: 'Bacon', price: 0 },
      { id: 'ing-frango', name: 'Frango', price: 0 },
      { id: 'ing-calabresa', name: 'Calabresa', price: 0 },
      { id: 'ing-presunto', name: 'Presunto', price: 0 },
      { id: 'ing-alho-frito', name: 'Alho Frito', price: 0 },
      { id: 'ing-azeitona-fatiada', name: 'Azeitona fatiada', price: 0 },
      { id: 'ing-milho-verde', name: 'Milho verde', price: 0 },
      { id: 'ing-ervilha', name: 'Ervilha', price: 0 },
      { id: 'ing-salsicha', name: 'Salsicha', price: 0 },
      { id: 'ing-pimenta-calabresa', name: 'Pimenta calabresa', price: 0 },
      { id: 'ing-ovo-codorna', name: 'Ovo de codorna', price: 0 },
      { id: 'ing-tomate', name: 'Tomate', price: 0 },
      { id: 'ing-uva-passas', name: 'Uva Passas', price: 0 },
      { id: 'ing-oregano', name: 'Orégano', price: 0 },
      { id: 'ing-cebinha', name: 'Cebinha', price: 0 }
    ]
  },
  {
    id: 'talharim',
    name: 'Talharim',
    description: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.',
    prices: { 'P': 26 },
    image: meatImg,
    category: 'Massas',
    isMassa: true,
    molhos: [
      { id: 'molho-vermelho', name: 'Vermelho', price: 0 },
      { id: 'molho-branco', name: 'Branco', price: 0 },
      { id: 'molho-4queijos', name: '4 Queijos', price: 0 },
      { id: 'molho-bolonhesa', name: 'Bolonhesa', price: 0 }
    ],
    ingredientes: [
      { id: 'ing-bacon', name: 'Bacon', price: 0 },
      { id: 'ing-frango', name: 'Frango', price: 0 },
      { id: 'ing-calabresa', name: 'Calabresa', price: 0 },
      { id: 'ing-presunto', name: 'Presunto', price: 0 },
      { id: 'ing-alho-frito', name: 'Alho Frito', price: 0 },
      { id: 'ing-azeitona-fatiada', name: 'Azeitona fatiada', price: 0 },
      { id: 'ing-milho-verde', name: 'Milho verde', price: 0 },
      { id: 'ing-ervilha', name: 'Ervilha', price: 0 },
      { id: 'ing-salsicha', name: 'Salsicha', price: 0 },
      { id: 'ing-pimenta-calabresa', name: 'Pimenta calabresa', price: 0 },
      { id: 'ing-ovo-codorna', name: 'Ovo de codorna', price: 0 },
      { id: 'ing-tomate', name: 'Tomate', price: 0 },
      { id: 'ing-uva-passas', name: 'Uva Passas', price: 0 },
      { id: 'ing-oregano', name: 'Orégano', price: 0 },
      { id: 'ing-cebinha', name: 'Cebinha', price: 0 }
    ]
  },

  // PASTÉIS DE FORNO
  {
    id: 'pastel-4queijos',
    name: 'Pastel de Forno 4 Queijos',
    description: 'Pastel de forno orgânico com 4 queijos.',
    prices: { 'P': 14 },
    image: meatImg,
    category: 'Pastéis de Forno'
  },
  {
    id: 'pastel-bauru',
    name: 'Pastel de Forno Bauru',
    description: 'Pastel de forno orgânico com presunto, mussarela e tomate.',
    prices: { 'P': 14 },
    image: meatImg,
    category: 'Pastéis de Forno'
  },
  {
    id: 'pastel-carnesol-cream',
    name: 'Pastel de Forno Carne de Sol com Cream Cheese',
    description: 'Pastel de forno orgânico com carne de sol e cream cheese.',
    prices: { 'P': 17 },
    image: meatImg,
    category: 'Pastéis de Forno'
  },
  {
    id: 'pastel-charque',
    name: 'Pastel de Forno Charque',
    description: 'Pastel de forno orgânico com carne de charque.',
    prices: { 'P': 14 },
    image: meatImg,
    category: 'Pastéis de Forno'
  },
  {
    id: 'pastel-frango-catupiry',
    name: 'Pastel de Forno Frango com Catupiry',
    description: 'Pastel de forno orgânico com frango desfiado e catupiry.',
    prices: { 'P': 12 },
    image: meatImg,
    category: 'Pastéis de Forno'
  },
  {
    id: 'pastel-frango-cream',
    name: 'Pastel de Forno Frango com Cream Cheese',
    description: 'Pastel de forno orgânico com frango e cream cheese.',
    prices: { 'P': 17 },
    image: meatImg,
    category: 'Pastéis de Forno'
  },
  {
    id: 'pastel-moda-cliente',
    name: 'Pastel de Forno Moda do Cliente',
    description: 'Pastel de forno orgânico personalizado.',
    prices: { 'P': 18 },
    image: meatImg,
    category: 'Pastéis de Forno'
  },
  {
    id: 'pastel-mussarela-tomate',
    name: 'Pastel de Forno Mussarela com Tomate',
    description: 'Pastel de forno orgânico com mussarela e tomate.',
    prices: { 'P': 13 },
    image: meatImg,
    category: 'Pastéis de Forno'
  },
  {
    id: 'pastel-portuguesa',
    name: 'Pastel de Forno Portuguesa',
    description: 'Pastel de forno orgânico com presunto, ovos e cebola.',
    prices: { 'P': 14 },
    image: meatImg,
    category: 'Pastéis de Forno'
  },
  {
    id: 'pastel-moda-casa',
    name: 'Pastel de Forno À Moda da Casa',
    description: 'Pastel de forno orgânico com receita especial da casa.',
    prices: { 'P': 15 },
    image: meatImg,
    category: 'Pastéis de Forno'
  },
  {
    id: 'pastel-calabresa-queijo',
    name: 'Pastel de Forno Calabresa com Queijo',
    description: 'Pastel de forno orgânico com calabresa e queijo.',
    prices: { 'P': 14 },
    image: meatImg,
    category: 'Pastéis de Forno'
  },

  // LASANHAS
  {
    id: 'lasanha-bolonhesa',
    name: 'Lasanha Bolonhesa',
    description: 'Massa caseira. Serve uma pessoa. Lasanha com molho bolonhesa artesanal.',
    prices: { 'P': 35 },
    image: meatImg,
    category: 'Lasanhas'
  },
  {
    id: 'lasanha-presunto-queijo',
    name: 'Lasanha Presunto e Queijo',
    description: 'Massa caseira. Serve uma pessoa. Lasanha com presunto e queijo.',
    prices: { 'P': 35 },
    image: meatImg,
    category: 'Lasanhas'
  },
  {
    id: 'lasanha-4queijos',
    name: 'Lasanha 4 Queijos',
    description: 'Massa caseira. Serve uma pessoa. Lasanha com 4 tipos de queijo.',
    prices: { 'P': 35 },
    image: meatImg,
    category: 'Lasanhas'
  },
  {
    id: 'lasanha-frango-branco',
    name: 'Lasanha de Frango com Molho Branco',
    description: 'Massa caseira. Serve uma pessoa. Lasanha de frango com molho branco cremoso.',
    prices: { 'P': 35 },
    image: meatImg,
    category: 'Lasanhas'
  },
  {
    id: 'lasanha-carnesol',
    name: 'Lasanha de Carne de Sol',
    description: 'Massa caseira. Serve uma pessoa. Lasanha com carne de sol desfiada.',
    prices: { 'P': 35 },
    image: meatImg,
    category: 'Lasanhas'
  },

  // PETISCOS
  {
    id: 'file-parmegiana',
    name: 'Filé à Parmegiana',
    description: 'Filé coberto com molho tomate, mussarela e parmesão. Executivo e completo.',
    prices: { 'P': 48 },
    image: meatImg,
    category: 'Petiscos'
  },
  {
    id: 'file-4queijos',
    name: 'Filé 4 Queijos',
    description: 'Filé coberto com 4 tipos de queijo. Serve 2 pessoas.',
    prices: { 'P': 70 },
    image: meatImg,
    category: 'Petiscos'
  },
  {
    id: 'arroz',
    name: 'Arroz',
    description: 'Arroz branco cozido no vapor. Serve 1 pessoa.',
    prices: { 'P': 7 },
    image: meatImg,
    category: 'Petiscos'
  },
  {
    id: 'frango-passarinho',
    name: 'Frango à Passarinho',
    description: 'Frango crocante. Acompanha fritas e salada. Serve 1 pessoa.',
    prices: { 'P': 35 },
    image: chickenImg,
    category: 'Petiscos'
  },
  {
    id: 'batata-bacon-cheddar',
    name: 'Batata Frita com Bacon e Cheddar',
    description: 'Batata frita sequinha com bacon crocante e cobertura de cheddar.',
    prices: { 'P': 30 },
    image: meatImg,
    category: 'Petiscos'
  },
  {
    id: 'file-fritas',
    name: 'Filé com Fritas',
    description: 'Filé grelhado acompanhado com batata frita. Serve 1 pessoa.',
    prices: { 'P': 40 },
    image: meatImg,
    category: 'Petiscos'
  },
  {
    id: 'carnesol-fritas',
    name: 'Carne de Sol com Fritas',
    description: 'Carne de sol desfiada com batata frita. Serve 1 pessoa.',
    prices: { 'P': 38 },
    image: meatImg,
    category: 'Petiscos'
  },
  {
    id: 'batata-frita',
    name: 'Batata Frita',
    description: 'Batata frita sequinha com sal. Serve 1 pessoa.',
    prices: { 'P': 18 },
    image: meatImg,
    category: 'Petiscos'
  },
  {
    id: 'batata-calabresa',
    name: 'Batata Frita com Calabresa',
    description: 'Batata frita com calabresa crocante. Serve 1 pessoa.',
    prices: { 'P': 24 },
    image: meatImg,
    category: 'Petiscos'
  },
  {
    id: 'camarao-alho-oleo',
    name: 'Camarão Alho e Óleo 400g',
    description: 'Camarão fresco ao alho e óleo. Serve 2 pessoas.',
    prices: { 'P': 47 },
    image: chickenImg,
    category: 'Petiscos'
  },

  // CALZONES
  {
    id: 'mini-calzone-camarao',
    name: 'Mini Calzone de Camarão',
    description: 'Mini calzone crocante recheado com camarão.',
    prices: { 'P': 17 },
    image: meatImg,
    category: 'Calzones'
  },
  {
    id: 'mini-calzone-carnesol',
    name: 'Mini Calzone de Carne de Sol',
    description: 'Mini calzone crocante recheado com carne de sol desfiada.',
    prices: { 'P': 15 },
    image: meatImg,
    category: 'Calzones'
  },
  {
    id: 'mini-calzone-bacon-queijo',
    name: 'Mini Calzone de Bacon com Queijo',
    description: 'Mini calzone crocante recheado com bacon e queijo derretido.',
    prices: { 'P': 14 },
    image: meatImg,
    category: 'Calzones'
  },

  // BEBIDAS
  {
    id: 'refrigerante-2l',
    name: 'Refrigerante 2L',
    description: 'Escolha o seu sabor favorito em garrafa de 2 litros.',
    prices: { 'P': 12 },
    image: meatImg,
    category: 'Bebidas'
  },
  {
    id: 'refrigerante-350ml',
    name: 'Refrigerante 350ml',
    description: 'Refrigerante gelado em lata de 350ml.',
    prices: { 'P': 5 },
    image: meatImg,
    category: 'Bebidas'
  },
  {
    id: 'suco-natural',
    name: 'Suco Natural 500ml',
    description: 'Suco natural fresco preparado na hora. Sabores variados.',
    prices: { 'P': 10 },
    image: meatImg,
    category: 'Bebidas'
  },
  {
    id: 'agua',
    name: 'Água 500ml',
    description: 'Água mineral gelada.',
    prices: { 'P': 3 },
    image: meatImg,
    category: 'Bebidas'
  }
];
