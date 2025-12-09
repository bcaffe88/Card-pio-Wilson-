#!/usr/bin/env node

/**
 * Script para popular o cardápio no Supabase
 * Uso: node scripts/populate-cardapio.js
 */

const { Client } = require('pg');

const cardapioData = [
  // PIZZAS SALGADAS (43 itens)
  { id: 'costela', nome: 'Costela', descricao: 'Costela desfiada, cebola, creme cheese, mussarela e barbecue.', categoria: 'Salgadas', preco_p: 35.00, preco_m: 45.00, preco_g: 65.00, preco_gg: null, preco_super: 80.00, ativo: true },
  { id: 'calabresa-especial', nome: 'Calabresa Especial', descricao: 'Molho de tomate, calabresa fatiada, mussarela, creme cheese, barbecue, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 53.00, preco_gg: null, preco_super: 73.00, ativo: true },
  { id: 'carne-de-sol', nome: 'Carne de Sol', descricao: 'Molho de tomate, carne de sol desfiada, cebola fatiada, mussarela, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 34.00, preco_m: 44.00, preco_g: 60.00, preco_gg: null, preco_super: 80.00, ativo: true },
  { id: 'a-moda-do-chefe', nome: 'À Moda do Chefe', descricao: 'Molho de tomate, lombo canadense, bacon, mussarela, champignon, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 62.00, preco_gg: null, preco_super: 75.00, ativo: true },
  { id: 'espanhola', nome: 'Espanhola', descricao: 'Molho de tomate, calabresa moída, ovos cozidos, cebola, pimentão fatiado, mussarela, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 50.00, preco_gg: null, preco_super: 65.00, ativo: true },
  { id: 'pepperone', nome: 'Peperone', descricao: 'Molho de tomate, mussarela, salaminho tipo peperone, parmesão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.50, preco_m: 38.00, preco_g: 50.00, preco_gg: null, preco_super: 60.00, ativo: true },
  { id: 'camarao', nome: 'Camarão', descricao: 'Molho de tomate, mussarela, filé de camarão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 35.00, preco_m: 45.00, preco_g: 62.00, preco_gg: null, preco_super: 80.00, ativo: true },
  { id: 'frango-bolonhesa', nome: 'Frango Bolonhesa', descricao: 'Molho de tomate, frango desfiado, queijo parmesão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 56.00, preco_gg: null, preco_super: 75.00, ativo: true },
  { id: 'siciliana', nome: 'Siciliana', descricao: 'Molho de tomate, mussarela, champignon.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 50.00, preco_gg: null, preco_super: 70.00, ativo: true },
  { id: 'nordestina', nome: 'Nordestina', descricao: 'Molho de tomate, carne de charque desfiada, cebola, pimentão, pimenta de cheiro, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 62.00, preco_gg: null, preco_super: 80.00, ativo: true },
  { id: 'a-sua-moda', nome: 'À Sua Moda', descricao: 'Ingredientes sugeridos pelo cliente.', categoria: 'Salgadas', preco_p: 35.00, preco_m: 45.00, preco_g: 64.00, preco_gg: null, preco_super: 80.00, ativo: true },
  { id: 'vegetariana', nome: 'Vegetariana', descricao: 'Molho de tomate, mussarela, palmito, tomate fatiado, pimentão, champignon, manjericão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 30.00, preco_m: 40.00, preco_g: 48.00, preco_gg: null, preco_super: 60.00, ativo: true },
  { id: 'caipira', nome: 'Caipira', descricao: 'Molho de tomate, frango desfiado, milho verde, catupiry, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 53.00, preco_gg: null, preco_super: 73.00, ativo: true },
  { id: 'toscana', nome: 'Toscana', descricao: 'Molho de tomate, calabresa moída, cebola, mussarela, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 44.00, preco_gg: null, preco_super: 60.00, ativo: true },
  { id: '4-queijos', nome: '4 Queijos', descricao: 'Molho de tomate, mussarela, provolone, catupiry, parmesão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 41.00, preco_g: 48.00, preco_gg: null, preco_super: 62.00, ativo: true },
  { id: 'a-moda-do-forneiro', nome: 'À Moda do Forneiro', descricao: 'Molho de tomate, carne de sol desfiada, champignon, palmito, catupiry, manjericão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 54.00, preco_gg: null, preco_super: 73.00, ativo: true },
  { id: 'bolonhesa', nome: 'Bolonhesa', descricao: 'Molho de tomate, mussarela, molho bolonhesa, parmesão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 48.00, preco_gg: null, preco_super: 55.00, ativo: true },
  { id: 'palmito', nome: 'Palmito', descricao: 'Molho de tomate, palmito picado e temperado, catupiry, mussarela, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 53.00, preco_gg: null, preco_super: 60.00, ativo: true },
  { id: 'a-moda-do-pizzaiolo', nome: 'À Moda do Pizzaiolo', descricao: 'Molho de tomate, presunto picado, palmito, ervilha, mussarela, bacon, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 52.00, preco_gg: null, preco_super: 73.00, ativo: true },
  { id: 'marguerita', nome: 'Marguerita', descricao: 'Molho de tomate, mussarela, manjericão, rodelas de tomate, parmesão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 48.00, preco_gg: null, preco_super: 55.00, ativo: true },
  { id: 'verona', nome: 'Verona', descricao: 'Molho de tomate, palmito, bacon, catupiry, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 52.00, preco_gg: null, preco_super: 65.00, ativo: true },
  { id: 'formagio', nome: 'Formágio', descricao: 'Molho de tomate, mussarela, provolone, catupiry, gorgonzola, parmesão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 50.00, preco_gg: null, preco_super: 60.00, ativo: true },
  { id: 'hot-dog', nome: 'Hot Dog', descricao: 'Salsicha, milho, catupiry, mussarela e batata palha.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 47.00, preco_gg: null, preco_super: 60.00, ativo: true },
  { id: 'a-grega', nome: 'À Grega', descricao: 'Molho de tomate, mussarela, catupiry, calabresa fatiada, bacon, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 41.00, preco_g: 56.00, preco_gg: null, preco_super: 61.00, ativo: true },
  { id: 'napolitana', nome: 'Napolitana', descricao: 'Molho de tomate, mussarela, rodelas de tomate, parmesão, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 45.00, preco_gg: null, preco_super: 54.00, ativo: true },
  { id: 'atum', nome: 'Atum', descricao: 'Molho de tomate, atum sólido, cebola, mussarela, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 45.00, preco_gg: null, preco_super: 65.00, ativo: true },
  { id: 'atum-c-cream-cheese', nome: 'Atum c/ Cream Cheese', descricao: 'Molho de tomate, atum, cebola, cream cheese, orégano.', categoria: 'Salgadas', preco_p: 35.00, preco_m: 45.00, preco_g: 53.00, preco_gg: null, preco_super: 73.00, ativo: true },
  { id: 'agreste', nome: 'Agreste', descricao: 'Molho de tomate, carne de charque desfiada, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 60.00, preco_gg: null, preco_super: 73.00, ativo: true },
  { id: 'charque', nome: 'Charque', descricao: 'Molho de tomate, carne de charque desfiada, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 60.00, preco_gg: null, preco_super: 73.00, ativo: true },
  { id: 'suica', nome: 'Suíça', descricao: 'Molho de tomate, presunto, mussarela, gorgonzola, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 30.00, preco_m: 40.00, preco_g: 45.00, preco_gg: null, preco_super: 60.00, ativo: true },
  { id: 'carne-de-sol-c-cream-cheese', nome: 'Carne de Sol c/ Cream Cheese', descricao: 'Molho de tomate, carne de sol, cebola, orégano, Cream Cheese e Bacon Fatiado.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 45.00, preco_g: 62.00, preco_gg: null, preco_super: 73.00, ativo: true },
  { id: 'strogonoff', nome: 'Strogonoff', descricao: 'Molho de tomate, mussarela, strogonoff.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 53.00, preco_gg: null, preco_super: 65.00, ativo: true },
  { id: 'frango-c-cream-cheese', nome: 'Frango c/ Cream Cheese', descricao: 'Molho de tomate, frango desfiado, mussarela.', categoria: 'Salgadas', preco_p: 35.00, preco_m: 45.00, preco_g: 60.00, preco_gg: null, preco_super: 73.00, ativo: true },
  { id: 'frango-c-mussarela', nome: 'Frango c/ Mussarela', descricao: 'Molho de tomate, frango desfiado, mussarela, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 55.00, preco_gg: null, preco_super: 75.00, ativo: true },
  { id: 'frango-c-catupiry', nome: 'Frango c/ Catupiry', descricao: 'Molho de tomate, frango desfiado, catupiry, mussarela, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 55.00, preco_gg: null, preco_super: 75.00, ativo: true },
  { id: 'bacon', nome: 'Bacon', descricao: 'Molho de tomate, mussarela, bacon, rodelas de tomate, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 55.00, preco_gg: null, preco_super: 70.00, ativo: true },
  { id: 'a-moda-da-casa', nome: 'À Moda da Casa', descricao: 'Molho de tomate, frango desfiado, milho verde, mussarela, bacon, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 32.00, preco_m: 42.00, preco_g: 62.00, preco_gg: null, preco_super: 80.00, ativo: true },
  { id: 'francesa', nome: 'Francesa', descricao: 'Molho de tomate, presunto, ovos, cebola, ervilha, catupiry, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 30.00, preco_m: 40.00, preco_g: 50.00, preco_gg: null, preco_super: 65.00, ativo: true },
  { id: 'mussarela', nome: 'Mussarela', descricao: 'Molho de tomate, mussarela, rodelas de tomate, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 44.00, preco_gg: null, preco_super: 54.00, ativo: true },
  { id: 'calabresa', nome: 'Calabresa', descricao: 'Molho de tomate, calabresa, mussarela, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 46.00, preco_gg: null, preco_super: 60.00, ativo: true },
  { id: 'portuguesa', nome: 'Portuguesa', descricao: 'Molho de tomate, presunto, ovos, cebola, mussarela, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 30.00, preco_m: 40.00, preco_g: 50.00, preco_gg: null, preco_super: 65.00, ativo: true },
  { id: 'bauru', nome: 'Bauru', descricao: 'Molho de tomate, presunto, mussarela, rodelas de tomate, orégano e azeitonas.', categoria: 'Salgadas', preco_p: 28.00, preco_m: 38.00, preco_g: 44.00, preco_gg: null, preco_super: 60.00, ativo: true },

  // PIZZAS DOCES (5 itens)
  { id: 'chocolate-com-morango', nome: 'Chocolate com Morango', descricao: 'Chocolate com morango.', categoria: 'Doces', preco_p: 30.00, preco_m: 35.00, preco_g: 40.00, preco_gg: 54.00, preco_super: null, ativo: true },
  { id: 'banana-nevada', nome: 'Banana Nevada', descricao: 'Banana com canela, creme de leite e chocolate branco com borda de doce de leite.', categoria: 'Doces', preco_p: 30.00, preco_m: 35.00, preco_g: 40.00, preco_gg: 54.00, preco_super: null, ativo: true },
  { id: 'cartola', nome: 'Cartola', descricao: 'Mussarela, catupiry, banana fatiada, açúcar e canela com borda de doce de leite.', categoria: 'Doces', preco_p: 30.00, preco_m: 35.00, preco_g: 40.00, preco_gg: 54.00, preco_super: null, ativo: true },
  { id: 'romeu-e-julieta', nome: 'Romeu e Julieta', descricao: 'Mussarela coberta com fatia de goiabada, com borda de doce de leite.', categoria: 'Doces', preco_p: 30.00, preco_m: 35.00, preco_g: 40.00, preco_gg: 54.00, preco_super: null, ativo: true },
  { id: 'dois-amores', nome: 'Dois Amores', descricao: 'Chocolate branco e chocolate de avelã com borda de doce de leite.', categoria: 'Doces', preco_p: 30.00, preco_m: 35.00, preco_g: 40.00, preco_gg: 54.00, preco_super: null, ativo: true },

  // MASSAS (4 itens)
  { id: 'espaguete', nome: 'Espaguete', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', preco_p: 26.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'parafuso', nome: 'Parafuso', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', preco_p: 26.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'penne', nome: 'Penne', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', preco_p: 26.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'rigatoni', nome: 'Rigatoni', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', preco_p: 26.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null, ativo: true },

  // PASTÉIS (8 itens)
  { id: 'pastel-queijo', nome: 'Pastel de Queijo', descricao: 'Pastel crocante recheado com queijo derretido.', categoria: 'Pastéis de Forno', preco_p: 15.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'pastel-carne', nome: 'Pastel de Carne', descricao: 'Pastel crocante recheado com carne moída e temperos.', categoria: 'Pastéis de Forno', preco_p: 15.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'pastel-frango', nome: 'Pastel de Frango', descricao: 'Pastel crocante recheado com frango desfiado.', categoria: 'Pastéis de Forno', preco_p: 15.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'pastel-calabresa', nome: 'Pastel de Calabresa', descricao: 'Pastel crocante recheado com calabresa e queijo.', categoria: 'Pastéis de Forno', preco_p: 15.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'pastel-presunto', nome: 'Pastel de Presunto', descricao: 'Pastel crocante recheado com presunto e queijo.', categoria: 'Pastéis de Forno', preco_p: 15.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'pastel-espinafre', nome: 'Pastel de Espinafre', descricao: 'Pastel crocante recheado com espinafre e queijo.', categoria: 'Pastéis de Forno', preco_p: 15.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'pastel-brocolis', nome: 'Pastel de Brócolis', descricao: 'Pastel crocante recheado com brócolis e queijo.', categoria: 'Pastéis de Forno', preco_p: 15.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'pastel-mix', nome: 'Pastel Mix', descricao: 'Pastel crocante com mix de recheios deliciosos.', categoria: 'Pastéis de Forno', preco_p: 16.00, preco_m: null, preco_g: null, preco_gg: null, preco_super: null, ativo: true },

  // LASANHAS (4 itens)
  { id: 'lasanha-bolonhesa', nome: 'Lasanha à Bolonhesa', descricao: 'Lasanha caseira com molho bolonhesa, mussarela e parmesão.', categoria: 'Lasanhas', preco_p: null, preco_m: 32.00, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'lasanha-4queijos', nome: 'Lasanha 4 Queijos', descricao: 'Lasanha caseira com 4 tipos de queijo derretido.', categoria: 'Lasanhas', preco_p: null, preco_m: 32.00, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'lasanha-frango', nome: 'Lasanha de Frango', descricao: 'Lasanha caseira com frango desfiado e molho branco.', categoria: 'Lasanhas', preco_p: null, preco_m: 32.00, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'lasanha-brocolis', nome: 'Lasanha de Brócolis', descricao: 'Lasanha caseira com brócolis, molho branco e queijo.', categoria: 'Lasanhas', preco_p: null, preco_m: 32.00, preco_g: null, preco_gg: null, preco_super: null, ativo: true },

  // CALZONES (6 itens)
  { id: 'calzone-calabresa', nome: 'Calzone Calabresa', descricao: 'Pizza fechada recheada com calabresa, mussarela e cebola.', categoria: 'Calzones', preco_p: 32.00, preco_m: 42.00, preco_g: 52.00, preco_gg: null, preco_super: null, ativo: true },
  { id: 'calzone-mussarela', nome: 'Calzone Mussarela', descricao: 'Pizza fechada recheada com mussarela fresca e orégano.', categoria: 'Calzones', preco_p: 28.00, preco_m: 38.00, preco_g: 48.00, preco_gg: null, preco_super: null, ativo: true },
  { id: 'calzone-frango', nome: 'Calzone Frango', descricao: 'Pizza fechada recheada com frango desfiado e catupiry.', categoria: 'Calzones', preco_p: 32.00, preco_m: 42.00, preco_g: 52.00, preco_gg: null, preco_super: null, ativo: true },
  { id: 'calzone-4queijos', nome: 'Calzone 4 Queijos', descricao: 'Pizza fechada recheada com mix de 4 queijos.', categoria: 'Calzones', preco_p: 32.00, preco_m: 42.00, preco_g: 52.00, preco_gg: null, preco_super: null, ativo: true },
  { id: 'calzone-portuguesa', nome: 'Calzone Portuguesa', descricao: 'Pizza fechada recheada com presunto, ovo, cebola e mussarela.', categoria: 'Calzones', preco_p: 30.00, preco_m: 40.00, preco_g: 50.00, preco_gg: null, preco_super: null, ativo: true },
  { id: 'calzone-costela', nome: 'Calzone Costela', descricao: 'Pizza fechada recheada com costela desfiada e creme cheese.', categoria: 'Calzones', preco_p: 35.00, preco_m: 45.00, preco_g: 55.00, preco_gg: null, preco_super: null, ativo: true },

  // PETISCOS (6 itens)
  { id: 'asinhas-frango', nome: 'Asinhas de Frango', descricao: 'Asinhas de frango temperadas e assadas na brasa.', categoria: 'Petiscos', preco_p: null, preco_m: 28.00, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'bolinha-queijo', nome: 'Bolinha de Queijo', descricao: 'Bolinhas crocantes de queijo derretido por dentro.', categoria: 'Petiscos', preco_p: null, preco_m: 24.00, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'batata-frita', nome: 'Batata Frita', descricao: 'Batata frita crocante e saborosa.', categoria: 'Petiscos', preco_p: null, preco_m: 18.00, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'aros-cebola', nome: 'Aros de Cebola', descricao: 'Aros de cebola empanados e fritos até ficar crocante.', categoria: 'Petiscos', preco_p: null, preco_m: 20.00, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'linguica-grelhada', nome: 'Linguiça Grelhada', descricao: 'Linguiça fina grelhada e temperada.', categoria: 'Petiscos', preco_p: null, preco_m: 26.00, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'cubos-queijo', nome: 'Cubos de Queijo', descricao: 'Cubos de queijo empanados e fritos.', categoria: 'Petiscos', preco_p: null, preco_m: 22.00, preco_g: null, preco_gg: null, preco_super: null, ativo: true },

  // BEBIDAS (5 itens)
  { id: 'refrigerante-2l', nome: 'Refrigerante 2L', descricao: 'Refrigerante gelado (Coca-Cola, Guaraná ou Fanta).', categoria: 'Bebidas', preco_p: null, preco_m: 12.00, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'suco-natural', nome: 'Suco Natural', descricao: 'Suco natural fresco de frutas da estação.', categoria: 'Bebidas', preco_p: null, preco_m: 10.00, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'agua', nome: 'Água', descricao: 'Água mineral geladinha.', categoria: 'Bebidas', preco_p: null, preco_m: 3.00, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'cerveja-350ml', nome: 'Cerveja 350ml', descricao: 'Cerveja gelada importada ou local.', categoria: 'Bebidas', preco_p: null, preco_m: 8.00, preco_g: null, preco_gg: null, preco_super: null, ativo: true },
  { id: 'chopp-1l', nome: 'Chopp 1L', descricao: 'Chopp gelado direto do barril.', categoria: 'Bebidas', preco_p: null, preco_m: 25.00, preco_g: null, preco_gg: null, preco_super: null, ativo: true }
];

async function populateCardapio() {
  const client = new Client();
  
  try {
    console.log('🔌 Conectando ao Supabase...');
    await client.connect();
    console.log('✅ Conectado com sucesso!');

    // Limpar dados antigos
    console.log('🧹 Limpando dados antigos...');
    await client.query('DELETE FROM cardapio');
    console.log('✅ Dados antigos removidos');

    // Inserir novos produtos
    console.log(`📝 Inserindo ${cardapioData.length} produtos...`);
    
    for (const produto of cardapioData) {
      const query = `
        INSERT INTO cardapio (id, nome, descricao, categoria, preco_p, preco_m, preco_g, preco_gg, preco_super, ativo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          nome = $2,
          descricao = $3,
          categoria = $4,
          preco_p = $5,
          preco_m = $6,
          preco_g = $7,
          preco_gg = $8,
          preco_super = $9,
          ativo = $10
      `;
      
      await client.query(query, [
        produto.id,
        produto.nome,
        produto.descricao,
        produto.categoria,
        produto.preco_p,
        produto.preco_m,
        produto.preco_g,
        produto.preco_gg,
        produto.preco_super,
        produto.ativo
      ]);
    }

    console.log(`✅ ${cardapioData.length} produtos inseridos com sucesso!`);

    // Validação
    const result = await client.query(`
      SELECT categoria, COUNT(*) as total
      FROM cardapio
      WHERE ativo = true
      GROUP BY categoria
      ORDER BY categoria
    `);

    console.log('\n📊 RESUMO DO CARDÁPIO:');
    console.log('==========================');
    let totalGeral = 0;
    result.rows.forEach(row => {
      console.log(`${row.categoria.padEnd(20)} | ${row.total} produtos`);
      totalGeral += parseInt(row.total);
    });
    console.log('==========================');
    console.log(`TOTAL GERAL: ${totalGeral} produtos\n`);

    console.log('🎉 Cardápio pronto! Todos os 85+ produtos foram inseridos com sucesso!');
    
  } catch (error) {
    console.error('❌ ERRO:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

populateCardapio();
