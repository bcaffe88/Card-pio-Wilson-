import pepperoniImg from '@assets/stock_images/delicious_pepperoni__f6d6fa05.jpg';
import chickenImg from '@assets/stock_images/pizza_frango_com_cat_c5255c4b.jpg';
import meatImg from '@assets/stock_images/pizza_calabresa_onio_8ea1076f.jpg';
import sweetImg from '@assets/stock_images/sweet_pizza_chocolat_b4c83fb7.jpg';

export type Size = 'P' | 'M' | 'G' | 'GG' | 'Super';
export type Category = 'Salgadas' | 'Doces';

export interface PizzaFlavor {
  id: string;
  name: string;
  description: string;
  prices: Partial<Record<Size, number>>;
  image: string;
  category: Category;
}

export const SIZES: Record<Size, { label: string; slices: number; maxFlavors: number }> = {
  'P': { label: 'Pequena', slices: 4, maxFlavors: 2 },
  'M': { label: 'Média', slices: 6, maxFlavors: 4 },
  'G': { label: 'Grande', slices: 8, maxFlavors: 4 },
  'GG': { label: 'Gigante', slices: 10, maxFlavors: 4 }, // Some items have GG, some don't. Mapping based on availability.
  'Super': { label: 'Super', slices: 12, maxFlavors: 4 },
};

export const MENU_ITEMS: PizzaFlavor[] = [
  // Salgadas
  {
    id: 'costela',
    name: 'Costela',
    description: 'Costela desfiada, cebola, creme cheese, mussarela e barbecue.',
    prices: { 'GG': 80, 'G': 65, 'M': 45, 'P': 35 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'calabresa-especial',
    name: 'Calabresa Especial',
    description: 'Molho de tomate, calabresa fatiada, mussarela, creme cheese, barbecue, orégano e azeitonas.',
    prices: { 'GG': 73, 'G': 53, 'M': 42, 'P': 32 },
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
    name: 'Pepperone',
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
    image: chickenImg, // Placeholder
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
    description: 'Molho de tomate, mussarela, champignon.',
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
    id: 'vegetariana',
    name: 'Vegetariana',
    description: 'Molho de tomate, mussarela, palmito, tomate fatiado, pimentão, champignon, manjericão, orégano e azeitonas.',
    prices: { 'Super': 60, 'G': 50, 'M': 40, 'P': 30 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'caipira',
    name: 'Caipira',
    description: 'Molho de tomate, frango desfiado, milho verde, catupiry, orégano e azeitonas.',
    prices: { 'Super': 73, 'G': 55, 'M': 42, 'P': 32 },
    image: chickenImg,
    category: 'Salgadas'
  },
  {
    id: 'toscana',
    name: 'Toscana',
    description: 'Molho de tomate, calabresa moída, cebola, mussarela, orégano e azeitonas.',
    prices: { 'Super': 60, 'G': 46, 'M': 38, 'P': 28 },
    image: pepperoniImg,
    category: 'Salgadas'
  },
  {
    id: '4-queijos',
    name: '4 Queijos',
    description: 'Molho de tomate, mussarela, provolone, catupiry, parmesão, orégano e azeitonas.',
    prices: { 'Super': 62, 'G': 50, 'M': 41, 'P': 28 },
    image: chickenImg,
    category: 'Salgadas'
  },
  {
    id: 'a-moda-do-forneiro',
    name: 'À Moda do Forneiro',
    description: 'Molho de tomate, carne de sol desfiada, champignon, palmito, catupiry, manjericão, orégano e azeitonas.',
    prices: { 'Super': 80, 'G': 56, 'M': 42, 'P': 32 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'bolonhesa',
    name: 'Bolonhesa',
    description: 'Molho de tomate, mussarela, molho bolonhesa, parmesão, orégano e azeitonas.',
    prices: { 'Super': 55, 'G': 50, 'M': 38, 'P': 28 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'palmito',
    name: 'Palmito',
    description: 'Molho de tomate, palmito picado e temperado, catupiry, mussarela, orégano e azeitonas.',
    prices: { 'Super': 60, 'G': 55, 'M': 38, 'P': 28 },
    image: meatImg,
    category: 'Salgadas'
  },
  {
    id: 'marguerita',
    name: 'Marguerita',
    description: 'Molho de tomate, mussarela, manjericão, rodelas de tomate, parmesão, orégano e azeitonas.',
    prices: { 'Super': 55, 'G': 50, 'M': 38, 'P': 28 },
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
    description: 'Mussarela com goiabada.',
    prices: { 'GG': 54, 'G': 40, 'M': 35, 'P': 30 },
    image: sweetImg,
    category: 'Doces'
  }
];
