#!/usr/bin/env node

/**
 * Clean and Populate Railway PostgreSQL Database
 * Limpa duplicatas e insere apenas os PRODUTOS REAIS do cardápio
 */

import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';
const { Client } = pg;

// PRODUTOS REAIS DO CARDÁPIO (do arquivo auto-populate-supabase.js)
const PRODUTOS_REAIS = [
  // PIZZAS SALGADAS (43 itens)
  { nome: 'Costela', descricao: 'Costela desfiada, cebola, creme cheese, mussarela e barbecue.', categoria: 'Salgadas', preco_p: 35.00, preco_m: 45.00, preco_g: 65.00, preco_gg: null, preco_super: 80.00 },
  { nome: 'Calabresa Especial', descricao: 'Molho de tomate, calabresa fatiada, mussarela, creme cheese, barbecue, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 53.00, preco_gg: null, preco_super: 73.00 },
  { nome: 'Carne de Sol', descricao: 'Molho de tomate, carne de sol desfiada, cebola fatiada, mussarela, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 34.00, preco_m: 44.00, preco_g: 60.00, preco_gg: null, preco_super: 80.00 },
  { nome: 'À Moda do Chefe', descricao: 'Molho de tomate, lombo canadense, bacon, mussarela, champignon, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 62.00, preco_gg: null, preco_super: 75.00 },
  { nome: 'Espanhola', descricao: 'Molho de tomate, calabresa moída, ovos cozidos, cebola, pimentão fatiado, mussarela, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 50.00, preco_gg: null, preco_super: 65.00 },
  { nome: 'Peperone', descricao: 'Molho de tomate, mussarela, salaminho tipo peperone, parmesão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.50, preco_m: 38.00, preco_g: 50.00, preco_gg: null, preco_super: 60.00 },
  { nome: 'Camarão', descricao: 'Molho de tomate, mussarela, filé de camarão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 35.00, preco_m: 45.00, preco_g: 62.00, preco_gg: null, preco_super: 80.00 },
  { nome: 'Frango Bolonhesa', descricao: 'Molho de tomate, frango desfiado, queijo parmesão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 56.00, preco_gg: null, preco_super: 75.00 },
  { nome: 'Siciliana', descricao: 'Molho de tomate, mussarela, champignon.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 50.00, preco_gg: null, preco_super: 70.00 },
  { nome: 'Nordestina', descricao: 'Molho de tomate, carne de charque desfiada, cebola, pimentão, pimenta de cheiro, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 62.00, preco_gg: null, preco_super: 80.00 },
  { nome: 'À Sua Moda', descricao: 'Ingredientes sugeridos pelo cliente.', categoria: 'Salgadas', preco_p: 35.00, preco_m: 45.00, preco_g: 64.00, preco_gg: null, preco_super: 80.00 },
  { nome: 'Vegetariana', descricao: 'Molho de tomate, mussarela, palmito, tomate fatiado, pimentão, champignon, manjericão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 30.00, preco_m: 40.00, preco_g: 48.00, preco_gg: null, preco_super: 60.00 },
  { nome: 'Caipira', descricao: 'Molho de tomate, frango desfiado, milho verde, catupiry, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 53.00, preco_gg: null, preco_super: 73.00 },
  { nome: 'Toscana', descricao: 'Molho de tomate, calabresa moída, cebola, mussarela, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 44.00, preco_gg: null, preco_super: 60.00 },
  { nome: '4 Queijos', descricao: 'Molho de tomate, mussarela, provolone, catupiry, parmesão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 41.00, preco_g: 48.00, preco_gg: null, preco_super: 62.00 },
  { nome: 'À Moda do Forneiro', descricao: 'Molho de tomate, carne de sol desfiada, champignon, palmito, catupiry, manjericão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 54.00, preco_gg: null, preco_super: 73.00 },
  { nome: 'Bolonhesa', descricao: 'Molho de tomate, mussarela, molho bolonhesa, parmesão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 48.00, preco_gg: null, preco_super: 55.00 },
  { nome: 'Palmito', descricao: 'Molho de tomate, palmito picado e temperado, catupiry, mussarela, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 53.00, preco_gg: null, preco_super: 60.00 },
  { nome: 'À Moda do Pizzaiolo', descricao: 'Molho de tomate, presunto picado, palmito, ervilha, mussarela, bacon, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 52.00, preco_gg: null, preco_super: 73.00 },
  { nome: 'Marguerita', descricao: 'Molho de tomate, mussarela, manjericão, rodelas de tomate, parmesão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 48.00, preco_gg: null, preco_super: 55.00 },
  { nome: 'Verona', descricao: 'Molho de tomate, palmito, bacon, catupiry, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 52.00, preco_gg: null, preco_super: 65.00 },
  { nome: 'Formágio', descricao: 'Molho de tomate, mussarela, provolone, catupiry, gorgonzola, parmesão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 50.00, preco_gg: null, preco_super: 60.00 },
  { nome: 'Hot Dog', descricao: 'Salsicha, milho, catupiry, mussarela e batata palha.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 47.00, preco_gg: null, preco_super: 60.00 },
  { nome: 'À Grega', descricao: 'Molho de tomate, mussarela, catupiry, calabresa fatiada, bacon, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 41.00, preco_g: 56.00, preco_gg: null, preco_super: 61.00 },
  { nome: 'Napolitana', descricao: 'Molho de tomate, mussarela, rodelas de tomate, parmesão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 45.00, preco_gg: null, preco_super: 54.00 },
  { nome: 'Atum', descricao: 'Molho de tomate, atum sólido, cebola, mussarela, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 45.00, preco_gg: null, preco_super: 65.00 },
  { nome: 'Atum c/ Cream Cheese', descricao: 'Molho de tomate, atum, cebola, cream cheese, orégano.', categoria: 'Salgadas', preco_p: 35.00, preco_m: 45.00, preco_g: 53.00, preco_gg: null, preco_super: 73.00 },
  { nome: 'Agreste', descricao: 'Molho de tomate, carne de charque desfiada, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 60.00, preco_gg: null, preco_super: 73.00 },
  { nome: 'Charque', descricao: 'Molho de tomate, carne de charque desfiada, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 60.00, preco_gg: null, preco_super: 73.00 },
  { nome: 'Suíça', descricao: 'Molho de tomate, presunto, mussarela, gorgonzola, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 30.00, preco_m: 40.00, preco_g: 45.00, preco_gg: null, preco_super: 60.00 },
  { nome: 'Carne de Sol c/ Cream Cheese', descricao: 'Molho de tomate, carne de sol, cebola, orégano, Cream Cheese e Bacon Fatiado.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 45.00, preco_g: 62.00, preco_gg: null, preco_super: 73.00 },
  { nome: 'Strogonoff', descricao: 'Molho de tomate, mussarela, strogonoff.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 53.00, preco_gg: null, preco_super: 65.00 },
  { nome: 'Frango c/ Cream Cheese', descricao: 'Molho de tomate, frango desfiado, mussarela.', categoria: 'Salgadas', preco_p: 35.00, preco_m: 45.00, preco_g: 60.00, preco_gg: null, preco_super: 73.00 },
  { nome: 'Frango c/ Mussarela', descricao: 'Molho de tomate, frango desfiado, mussarela, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 55.00, preco_gg: null, preco_super: 75.00 },
  { nome: 'Frango c/ Catupiry', descricao: 'Molho de tomate, frango desfiado, catupiry, mussarela, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 55.00, preco_gg: null, preco_super: 75.00 },
  { nome: 'Bacon', descricao: 'Molho de tomate, mussarela, bacon, rodelas de tomate, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 55.00, preco_gg: null, preco_super: 70.00 },
  { nome: 'À Moda da Casa', descricao: 'Molho de tomate, frango desfiado, milho verde, mussarela, bacon, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 62.00, preco_gg: null, preco_super: 80.00 },
  { nome: 'Francesa', descricao: 'Molho de tomate, presunto, ovos, cebola, ervilha, catupiry, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 30.00, preco_m: 40.00, preco_g: 50.00, preco_gg: null, preco_super: 65.00 },
  { nome: 'Mussarela', descricao: 'Molho de tomate, mussarela, rodelas de tomate, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 44.00, preco_gg: null, preco_super: 54.00 },
  { nome: 'Calabresa', descricao: 'Molho de tomate, calabresa, mussarela, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 46.00, preco_gg: null, preco_super: 60.00 },
  { nome: 'Portuguesa', descricao: 'Molho de tomate, presunto, ovos, cebola, mussarela, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 30.00, preco_m: 40.00, preco_g: 50.00, preco_gg: null, preco_super: 65.00 },
  { nome: 'Bauru', descricao: 'Molho de tomate, presunto, mussarela, rodelas de tomate, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 44.00, preco_gg: null, preco_super: 60.00 },

  // PIZZAS DOCES (5 itens)
  { nome: 'Chocolate com Morango', descricao: 'Chocolate com morango.', categoria: 'Doces', preco_p: 30.00, preco_m: 35.00, preco_g: 40.00, preco_gg: 54.00, preco_super: null },
  { nome: 'Banana Nevada', descricao: 'Banana com canela, creme de leite e chocolate branco com borda de doce de leite.', categoria: 'Doces', preco_p: 30.00, preco_m: 35.00, preco_g: 40.00, preco_gg: 54.00, preco_super: null },
  { nome: 'Cartola', descricao: 'Mussarela, catupiry, banana fatiada, açúcar e canela com borda de doce de leite.', categoria: 'Doces', preco_p: 30.00, preco_m: 35.00, preco_g: 40.00, preco_gg: 54.00, preco_super: null },
  { nome: 'Romeu e Julieta', descricao: 'Mussarela coberta com fatia de goiabada, com borda de doce de leite.', categoria: 'Doces', preco_p: 30.00, preco_m: 35.00, preco_g: 40.00, preco_gg: 54.00, preco_super: null },
  { nome: 'Dois Amores', descricao: 'Chocolate branco e chocolate de avelã com borda de doce de leite.', categoria: 'Doces', preco_p: 30.00, preco_m: 35.00, preco_g: 40.00, preco_gg: 54.00, preco_super: null },

  // MASSAS (4 itens)
  { nome: 'Espaguete', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', preco_p: 26.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Parafuso', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', preco_p: 26.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Penne', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', preco_p: 26.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Rigatoni', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', preco_p: 26.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null },

  // PASTÉIS (8 itens)
  { nome: 'Pastel de Queijo', descricao: 'Pastel crocante recheado com queijo derretido.', categoria: 'Pastéis de Forno', preco_p: 15.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Pastel de Carne', descricao: 'Pastel crocante recheado com carne moída e temperos.', categoria: 'Pastéis de Forno', preco_p: 15.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Pastel de Frango', descricao: 'Pastel crocante recheado com frango desfiado.', categoria: 'Pastéis de Forno', preco_p: 15.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Pastel de Calabresa', descricao: 'Pastel crocante recheado com calabresa e queijo.', categoria: 'Pastéis de Forno', preco_p: 15.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Pastel de Presunto', descricao: 'Pastel crocante recheado com presunto e queijo.', categoria: 'Pastéis de Forno', preco_p: 15.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Pastel de Espinafre', descricao: 'Pastel crocante recheado com espinafre e queijo.', categoria: 'Pastéis de Forno', preco_p: 15.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Pastel de Brócolis', descricao: 'Pastel crocante recheado com brócolis e queijo.', categoria: 'Pastéis de Forno', preco_p: 15.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Pastel Mix', descricao: 'Pastel crocante com mix de recheios deliciosos.', categoria: 'Pastéis de Forno', preco_p: 16.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null },

  // LASANHAS (4 itens)
  { nome: 'Lasanha à Bolonhesa', descricao: 'Lasanha caseira com molho bolonhesa, mussarela e parmesão.', categoria: 'Lasanhas', preco_p: null, preco_m: 32.00, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Lasanha 4 Queijos', descricao: 'Lasanha caseira com 4 tipos de queijo derretido.', categoria: 'Lasanhas', preco_p: null, preco_m: 32.00, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Lasanha de Frango', descricao: 'Lasanha caseira com frango desfiado e molho branco.', categoria: 'Lasanhas', preco_p: null, preco_m: 32.00, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Lasanha de Brócolis', descricao: 'Lasanha caseira com brócolis, molho branco e queijo.', categoria: 'Lasanhas', preco_p: null, preco_m: 32.00, preco_g: null, preco_gg: null, preco_super: null },

  // CALZONES (6 itens)
  { nome: 'Calzone Calabresa', descricao: 'Pizza fechada recheada com calabresa, mussarela e cebola.', categoria: 'Calzones', preco_p: 32.00, preco_m: 42.00, preco_g: 52.00, preco_gg: null, preco_super: null },
  { nome: 'Calzone Mussarela', descricao: 'Pizza fechada recheada com mussarela fresca e orégano.', categoria: 'Calzones', preco_p: 28.00, preco_m: 38.00, preco_g: 48.00, preco_gg: null, preco_super: null },
  { nome: 'Calzone Frango', descricao: 'Pizza fechada recheada com frango desfiado e catupiry.', categoria: 'Calzones', preco_p: 32.00, preco_m: 42.00, preco_g: 52.00, preco_gg: null, preco_super: null },
  { nome: 'Calzone 4 Queijos', descricao: 'Pizza fechada recheada com mix de 4 queijos.', categoria: 'Calzones', preco_p: 32.00, preco_m: 42.00, preco_g: 52.00, preco_gg: null, preco_super: null },
  { nome: 'Calzone Portuguesa', descricao: 'Pizza fechada recheada com presunto, ovo, cebola e mussarela.', categoria: 'Calzones', preco_p: 30.00, preco_m: 40.00, preco_g: 50.00, preco_gg: null, preco_super: null },
  { nome: 'Calzone Costela', descricao: 'Pizza fechada recheada com costela desfiada e creme cheese.', categoria: 'Calzones', preco_p: 35.00, preco_m: 45.00, preco_g: 55.00, preco_gg: null, preco_super: null },

  // PETISCOS (6 itens)
  { nome: 'Asinhas de Frango', descricao: 'Asinhas de frango temperadas e assadas na brasa.', categoria: 'Petiscos', preco_p: null, preco_m: 28.00, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Bolinha de Queijo', descricao: 'Bolinhas crocantes de queijo derretido por dentro.', categoria: 'Petiscos', preco_p: null, preco_m: 24.00, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Batata Frita', descricao: 'Batata frita crocante e saborosa.', categoria: 'Petiscos', preco_p: null, preco_m: 18.00, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Aros de Cebola', descricao: 'Aros de cebola empanados e fritos até ficar crocante.', categoria: 'Petiscos', preco_p: null, preco_m: 20.00, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Linguiça Grelhada', descricao: 'Linguiça fina grelhada e temperada.', categoria: 'Petiscos', preco_p: null, preco_m: 26.00, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Cubos de Queijo', descricao: 'Cubos de queijo empanados e fritos.', categoria: 'Petiscos', preco_p: null, preco_m: 22.00, preco_g: null, preco_gg: null, preco_super: null },

  // BEBIDAS (5 itens)
  { nome: 'Refrigerante 2L', descricao: 'Refrigerante gelado (Coca-Cola, Guaraná ou Fanta).', categoria: 'Bebidas', preco_p: null, preco_m: 12.00, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Suco Natural', descricao: 'Suco natural fresco de frutas da estação.', categoria: 'Bebidas', preco_p: null, preco_m: 10.00, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Água', descricao: 'Água mineral geladinha.', categoria: 'Bebidas', preco_p: null, preco_m: 3.00, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Cerveja 350ml', descricao: 'Cerveja gelada importada ou local.', categoria: 'Bebidas', preco_p: null, preco_m: 8.00, preco_g: null, preco_gg: null, preco_super: null },
  { nome: 'Chopp 1L', descricao: 'Chopp gelado direto do barril.', categoria: 'Bebidas', preco_p: null, preco_m: 25.00, preco_g: null, preco_gg: null, preco_super: null }
];

// Função para converter preços em JSON
function buildPrecosJson(produto) {
  const precos = {};
  if (produto.preco_p !== null) precos.P = produto.preco_p;
  if (produto.preco_m !== null) precos.M = produto.preco_m;
  if (produto.preco_g !== null) precos.G = produto.preco_g;
  if (produto.preco_gg !== null) precos.GG = produto.preco_gg;
  if (produto.preco_super !== null) precos.Super = produto.preco_super;
  return precos;
}

async function cleanAndPopulate() {
  const client = new Client({
    connectionString: 'postgresql://postgres:mGBXIHVcdYaEHGFqJaOyVIIlBemGuEZR@centerbeam.proxy.rlwy.net:17816/railway'
  });

  try {
    console.log('🔌 Conectando ao Railway PostgreSQL...');
    await client.connect();
    console.log('✅ Conectado!\n');

    // 1. Limpar tabela cardapio
    console.log('🧹 Limpando tabela cardapio...');
    const deleteResult = await client.query('DELETE FROM cardapio');
    console.log(`✅ ${deleteResult.rowCount} registros removidos\n`);

    // 2. Inserir produtos REAIS
    console.log(`📝 Inserindo ${PRODUTOS_REAIS.length} produtos reais...`);
    
    for (const produto of PRODUTOS_REAIS) {
      const uuid = uuidv4();
      const precos = buildPrecosJson(produto);
      
      await client.query(
        `INSERT INTO cardapio (id, nome_item, descricao, categoria, precos, imagem_url, disponivel)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [uuid, produto.nome, produto.descricao, produto.categoria, JSON.stringify(precos), null, true]
      );
    }
    console.log(`✅ ${PRODUTOS_REAIS.length} produtos inseridos com sucesso!\n`);

    // 3. Validação
    console.log('📊 Validação final:');
    const countResult = await client.query('SELECT COUNT(*) FROM cardapio');
    const total = parseInt(countResult.rows[0].count);
    console.log(`   Total de produtos: ${total}`);

    const categoriaResult = await client.query(
      'SELECT categoria, COUNT(*) as qtd FROM cardapio GROUP BY categoria ORDER BY categoria'
    );
    console.log('\n📋 Produtos por categoria:');
    categoriaResult.rows.forEach(row => {
      console.log(`   ${row.categoria.padEnd(20)} | ${row.qtd} produtos`);
    });

    console.log(`\n🎉 SUCESSO! Banco limpo e repovoado com ${total} produtos reais!`);

  } catch (error) {
    console.error('❌ ERRO:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

cleanAndPopulate();
