#!/usr/bin/env node

/**
 * Popula o banco de dados Railway com todos os 80 produtos Wilson Pizza
 * Usa as colunas corretas: nome_item, categoria, descricao, precos (JSONB), imagem_url, disponivel
 */

import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config(); // Carrega variáveis de ambiente do .env

const connectionString = process.env.DATABASE_URL;

const cardapioData = [
  // PIZZAS SALGADAS (43 itens)
  { nome_item: 'Costela', descricao: 'Costela desfiada, cebola, creme cheese, mussarela e barbecue.', categoria: 'Salgadas', precos: {p: 35.00, m: 45.00, g: 65.00, gg: null, super: 80.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Calabresa Especial', descricao: 'Molho de tomate, calabresa fatiada, mussarela, creme cheese, barbecue, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 32.00, m: 42.00, g: 53.00, gg: null, super: 73.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Carne de Sol', descricao: 'Molho de tomate, carne de sol desfiada, cebola fatiada, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 34.00, m: 44.00, g: 60.00, gg: null, super: 80.00}, imagem_url: null, disponivel: true },
  { nome_item: 'À Moda do Chefe', descricao: 'Molho de tomate, lombo canadense, bacon, mussarela, champignon, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 28.00, m: 38.00, g: 62.00, gg: null, super: 75.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Espanhola', descricao: 'Molho de tomate, calabresa moída, ovos cozidos, cebola, pimentão fatiado, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 28.00, m: 38.00, g: 50.00, gg: null, super: 65.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Peperone', descricao: 'Molho de tomate, mussarela, salaminho tipo peperone, parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 28.50, m: 38.00, g: 50.00, gg: null, super: 60.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Camarão', descricao: 'Molho de tomate, mussarela, filé de camarão, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 35.00, m: 45.00, g: 62.00, gg: null, super: 80.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Frango Bolonhesa', descricao: 'Molho de tomate, frango desfiado, queijo parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 32.00, m: 42.00, g: 56.00, gg: null, super: 75.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Siciliana', descricao: 'Molho de tomate, mussarela, champignon.', categoria: 'Salgadas', precos: {p: 28.00, m: 38.00, g: 50.00, gg: null, super: 70.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Nordestina', descricao: 'Molho de tomate, carne de charque desfiada, cebola, pimentão, pimenta de cheiro, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 32.00, m: 42.00, g: 62.00, gg: null, super: 80.00}, imagem_url: null, disponivel: true },
  { nome_item: 'À Sua Moda', descricao: 'Ingredientes sugeridos pelo cliente.', categoria: 'Salgadas', precos: {p: 35.00, m: 45.00, g: 64.00, gg: null, super: 80.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Vegetariana', descricao: 'Molho de tomate, mussarela, palmito, tomate fatiado, pimentão, champignon, manjericão, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 30.00, m: 40.00, g: 48.00, gg: null, super: 60.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Caipira', descricao: 'Molho de tomate, frango desfiado, milho verde, catupiry, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 32.00, m: 42.00, g: 53.00, gg: null, super: 73.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Toscana', descricao: 'Molho de tomate, calabresa moída, cebola, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 28.00, m: 38.00, g: 44.00, gg: null, super: 60.00}, imagem_url: null, disponivel: true },
  { nome_item: '4 Queijos', descricao: 'Molho de tomate, mussarela, provolone, catupiry, parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 28.00, m: 41.00, g: 48.00, gg: null, super: 62.00}, imagem_url: null, disponivel: true },
  { nome_item: 'À Moda do Forneiro', descricao: 'Molho de tomate, carne de sol desfiada, champignon, palmito, catupiry, manjericão, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 32.00, m: 42.00, g: 54.00, gg: null, super: 73.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Bolonhesa', descricao: 'Molho de tomate, mussarela, molho bolonhesa, parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 28.00, m: 38.00, g: 48.00, gg: null, super: 55.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Palmito', descricao: 'Molho de tomate, palmito picado e temperado, catupiry, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 28.00, m: 38.00, g: 53.00, gg: null, super: 60.00}, imagem_url: null, disponivel: true },
  { nome_item: 'À Moda do Pizzaiolo', descricao: 'Molho de tomate, presunto picado, palmito, ervilha, mussarela, bacon, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 32.00, m: 42.00, g: 52.00, gg: null, super: 73.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Marguerita', descricao: 'Molho de tomate, mussarela, manjericão, rodelas de tomate, parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 28.00, m: 38.00, g: 48.00, gg: null, super: 55.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Verona', descricao: 'Molho de tomate, palmito, bacon, catupiry, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 28.00, m: 38.00, g: 52.00, gg: null, super: 65.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Formágio', descricao: 'Molho de tomate, mussarela, provolone, catupiry, gorgonzola, parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 28.00, m: 38.00, g: 50.00, gg: null, super: 60.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Hot Dog', descricao: 'Salsicha, milho, catupiry, mussarela e batata palha.', categoria: 'Salgadas', precos: {p: 28.00, m: 38.00, g: 47.00, gg: null, super: 60.00}, imagem_url: null, disponivel: true },
  { nome_item: 'À Grega', descricao: 'Molho de tomate, mussarela, catupiry, calabresa fatiada, bacon, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 28.00, m: 41.00, g: 56.00, gg: null, super: 61.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Napolitana', descricao: 'Molho de tomate, mussarela, rodelas de tomate, parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 28.00, m: 38.00, g: 45.00, gg: null, super: 54.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Atum', descricao: 'Molho de tomate, atum sólido, cebola, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 32.00, m: 42.00, g: 45.00, gg: null, super: 65.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Atum c/ Cream Cheese', descricao: 'Molho de tomate, atum, cebola, cream cheese, orégano.', categoria: 'Salgadas', precos: {p: 35.00, m: 45.00, g: 53.00, gg: null, super: 73.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Agreste', descricao: 'Molho de tomate, carne de charque desfiada, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 32.00, m: 42.00, g: 60.00, gg: null, super: 73.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Charque', descricao: 'Molho de tomate, carne de charque desfiada, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 32.00, m: 42.00, g: 60.00, gg: null, super: 73.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Suíça', descricao: 'Molho de tomate, presunto, mussarela, gorgonzola, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 30.00, m: 40.00, g: 45.00, gg: null, super: 60.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Carne de Sol c/ Cream Cheese', descricao: 'Molho de tomate, carne de sol, cebola, orégano, Cream Cheese e Bacon Fatiado.', categoria: 'Salgadas', precos: {p: 32.00, m: 45.00, g: 62.00, gg: null, super: 73.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Strogonoff', descricao: 'Molho de tomate, mussarela, strogonoff.', categoria: 'Salgadas', precos: {p: 32.00, m: 42.00, g: 53.00, gg: null, super: 65.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Frango c/ Cream Cheese', descricao: 'Molho de tomate, frango desfiado, mussarela.', categoria: 'Salgadas', precos: {p: 35.00, m: 45.00, g: 60.00, gg: null, super: 73.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Frango c/ Mussarela', descricao: 'Molho de tomate, frango desfiado, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 32.00, m: 42.00, g: 55.00, gg: null, super: 75.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Frango c/ Catupiry', descricao: 'Molho de tomate, frango desfiado, catupiry, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 32.00, m: 42.00, g: 55.00, gg: null, super: 75.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Bacon', descricao: 'Molho de tomate, mussarela, bacon, rodelas de tomate, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 32.00, m: 42.00, g: 55.00, gg: null, super: 70.00}, imagem_url: null, disponivel: true },
  { nome_item: 'À Moda da Casa', descricao: 'Molho de tomate, frango desfiado, milho verde, mussarela, bacon, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 32.00, m: 42.00, g: 62.00, gg: null, super: 80.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Francesa', descricao: 'Molho de tomate, presunto, ovos, cebola, ervilha, catupiry, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 30.00, m: 40.00, g: 50.00, gg: null, super: 65.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Mussarela', descricao: 'Molho de tomate, mussarela, rodelas de tomate, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 28.00, m: 38.00, g: 44.00, gg: null, super: 54.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Calabresa', descricao: 'Molho de tomate, calabresa, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 28.00, m: 38.00, g: 46.00, gg: null, super: 60.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Portuguesa', descricao: 'Molho de tomate, presunto, ovos, cebola, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 30.00, m: 40.00, g: 50.00, gg: null, super: 65.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Bauru', descricao: 'Molho de tomate, presunto, mussarela, rodelas de tomate, orégano e azeitonas.', categoria: 'Salgadas', precos: {p: 28.00, m: 38.00, g: 44.00, gg: null, super: 60.00}, imagem_url: null, disponivel: true },
  // PIZZAS DOCES (5 itens)
  { nome_item: 'Chocolate com Morango', descricao: 'Chocolate com morango.', categoria: 'Doces', precos: {p: 30.00, m: 35.00, g: 40.00, gg: 54.00, super: null}, imagem_url: null, disponivel: true },
  { nome_item: 'Banana Nevada', descricao: 'Banana com canela, creme de leite e chocolate branco com borda de doce de leite.', categoria: 'Doces', precos: {p: 30.00, m: 35.00, g: 40.00, gg: 54.00, super: null}, imagem_url: null, disponivel: true },
  { nome_item: 'Cartola', descricao: 'Mussarela, catupiry, banana fatiada, açúcar e canela com borda de doce de leite.', categoria: 'Doces', precos: {p: 30.00, m: 35.00, g: 40.00, gg: 54.00, super: null}, imagem_url: null, disponivel: true },
  { nome_item: 'Romeu e Julieta', descricao: 'Mussarela coberta com fatia de goiabada, com borda de doce de leite.', categoria: 'Doces', precos: {p: 30.00, m: 35.00, g: 40.00, gg: 54.00, super: null}, imagem_url: null, disponivel: true },
  { nome_item: 'Dois Amores', descricao: 'Chocolate branco e chocolate de avelã com borda de doce de leite.', categoria: 'Doces', precos: {p: 30.00, m: 35.00, g: 40.00, gg: 54.00, super: null}, imagem_url: null, disponivel: true },
  // MASSAS (4 itens)
  { nome_item: 'Espaguete', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', precos: {p: 26.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Parafuso', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', precos: {p: 26.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Penne', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', precos: {p: 26.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Rigatoni', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', precos: {p: 26.00}, imagem_url: null, disponivel: true },
  // PASTÉIS (8 itens)
  { nome_item: 'Pastel de Queijo', descricao: 'Pastel crocante recheado com queijo derretido.', categoria: 'Pastéis de Forno', precos: {p: 15.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Pastel de Carne', descricao: 'Pastel crocante recheado com carne moída e temperos.', categoria: 'Pastéis de Forno', precos: {p: 15.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Pastel de Frango', descricao: 'Pastel crocante recheado com frango desfiado.', categoria: 'Pastéis de Forno', precos: {p: 15.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Pastel de Calabresa', descricao: 'Pastel crocante recheado com calabresa e queijo.', categoria: 'Pastéis de Forno', precos: {p: 15.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Pastel de Presunto', descricao: 'Pastel crocante recheado com presunto e queijo.', categoria: 'Pastéis de Forno', precos: {p: 15.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Pastel de Espinafre', descricao: 'Pastel crocante recheado com espinafre e queijo.', categoria: 'Pastéis de Forno', precos: {p: 15.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Pastel de Brócolis', descricao: 'Pastel crocante recheado com brócolis e queijo.', categoria: 'Pastéis de Forno', precos: {p: 15.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Pastel Mix', descricao: 'Pastel crocante com mix de recheios deliciosos.', categoria: 'Pastéis de Forno', precos: {p: 16.00}, imagem_url: null, disponivel: true },
  // LASANHAS (4 itens)
  { nome_item: 'Lasanha à Bolonhesa', descricao: 'Lasanha caseira com molho bolonhesa, mussarela e parmesão.', categoria: 'Lasanhas', precos: {m: 32.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Lasanha 4 Queijos', descricao: 'Lasanha caseira com 4 tipos de queijo derretido.', categoria: 'Lasanhas', precos: {m: 32.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Lasanha de Frango', descricao: 'Lasanha caseira com frango desfiado e molho branco.', categoria: 'Lasanhas', precos: {m: 32.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Lasanha de Brócolis', descricao: 'Lasanha caseira com brócolis, molho branco e queijo.', categoria: 'Lasanhas', precos: {m: 32.00}, imagem_url: null, disponivel: true },
  // CALZONES (6 itens)
  { nome_item: 'Calzone Calabresa', descricao: 'Pizza fechada recheada com calabresa, mussarela e cebola.', categoria: 'Calzones', precos: {p: 32.00, m: 42.00, g: 52.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Calzone Mussarela', descricao: 'Pizza fechada recheada com mussarela fresca e orégano.', categoria: 'Calzones', precos: {p: 28.00, m: 38.00, g: 48.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Calzone Frango', descricao: 'Pizza fechada recheada com frango desfiado e catupiry.', categoria: 'Calzones', precos: {p: 32.00, m: 42.00, g: 52.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Calzone 4 Queijos', descricao: 'Pizza fechada recheada com mix de 4 queijos.', categoria: 'Calzones', precos: {p: 32.00, m: 42.00, g: 52.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Calzone Portuguesa', descricao: 'Pizza fechada recheada com presunto, ovo, cebola e mussarela.', categoria: 'Calzones', precos: {p: 30.00, m: 40.00, g: 50.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Calzone Costela', descricao: 'Pizza fechada recheada com costela desfiada e creme cheese.', categoria: 'Calzones', precos: {p: 35.00, m: 45.00, g: 55.00}, imagem_url: null, disponivel: true },
  // PETISCOS (6 itens)
  { nome_item: 'Asinhas de Frango', descricao: 'Asinhas de frango temperadas e assadas na brasa.', categoria: 'Petiscos', precos: {m: 28.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Bolinha de Queijo', descricao: 'Bolinhas crocantes de queijo derretido por dentro.', categoria: 'Petiscos', precos: {m: 24.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Batata Frita', descricao: 'Batata frita crocante e saborosa.', categoria: 'Petiscos', precos: {m: 18.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Aros de Cebola', descricao: 'Aros de cebola empanados e fritos até ficar crocante.', categoria: 'Petiscos', precos: {m: 20.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Linguiça Grelhada', descricao: 'Linguiça fina grelhada e temperada.', categoria: 'Petiscos', precos: {m: 26.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Cubos de Queijo', descricao: 'Cubos de queijo empanados e fritos.', categoria: 'Petiscos', precos: {m: 22.00}, imagem_url: null, disponivel: true },
  // BEBIDAS (5 itens)
  { nome_item: 'Refrigerante 2L', descricao: 'Refrigerante gelado (Coca-Cola, Guaraná ou Fanta).', categoria: 'Bebidas', precos: {m: 12.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Suco Natural', descricao: 'Suco natural fresco de frutas da estação.', categoria: 'Bebidas', precos: {m: 10.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Água', descricao: 'Água mineral geladinha.', categoria: 'Bebidas', precos: {m: 3.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Cerveja 350ml', descricao: 'Cerveja gelada importada ou local.', categoria: 'Bebidas', precos: {m: 8.00}, imagem_url: null, disponivel: true },
  { nome_item: 'Chopp 1L', descricao: 'Chopp gelado direto do barril.', categoria: 'Bebidas', precos: {m: 25.00}, imagem_url: null, disponivel: true }
];

async function populateRailwayDB() {
  console.log('🔌 Conectando ao banco de dados Railway...');
  
  if (!connectionString) {
    console.error('❌ ERRO: Variável de ambiente DATABASE_URL não encontrada.');
    process.exit(1);
  }

  const sql = postgres(connectionString);

  try {
    console.log('🗑️ Limpando a tabela cardapio existente...');
    await sql`DELETE FROM cardapio`;
    console.log('✅ Tabela cardapio limpa.');

    console.log(`📝 Inserindo ${cardapioData.length} produtos...\n`);
    
    for (let i = 0; i < cardapioData.length; i++) {
      const item = cardapioData[i];
      await sql`
        INSERT INTO cardapio (nome_item, categoria, descricao, precos, imagem_url, disponivel)
        VALUES (${item.nome_item}, ${item.categoria}, ${item.descricao}, ${JSON.stringify(item.precos)}::jsonb, ${item.imagem_url}, ${item.disponivel})
      `;
      const percentage = Math.round(((i + 1) / cardapioData.length) * 100);
      console.log(`✅ ${i + 1}/${cardapioData.length} produtos (${percentage}%) inseridos.`);
    }

    console.log(`\n🎉 SUCESSO! ${cardapioData.length} produtos inseridos no banco de dados Railway!`);
    
  } catch (error) {
    console.error('❌ Erro ao popular o banco de dados:', error);
    process.exit(1);
  } finally {
    await sql.end(); // Fecha a conexão com o banco de dados
    console.log('Conexão com o banco de dados fechada.');
  }
}

populateRailwayDB();
