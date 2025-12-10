#!/usr/bin/env node

/**
 * Script para popular o cardápio com os 43 produtos ORIGINAIS
 * Imagens vazias - serão preenchidas via admin panel com upload para Supabase
 */

const { Client } = require('pg');

// Apenas os 43 produtos originais do menu.ts
const cardapioData = [
  // SALGADAS (43 itens)
  { nome: 'Costela', descricao: 'Costela desfiada, cebola, creme cheese, mussarela e barbecue.', categoria: 'Salgadas', precos: { p: 35, m: 45, g: 65, gg: null, super: 80 } },
  { nome: 'Calabresa Especial', descricao: 'Molho de tomate, calabresa fatiada, mussarela, creme cheese, barbecue, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 32, m: 42, g: 53, gg: null, super: 73 } },
  { nome: 'Carne de Sol', descricao: 'Molho de tomate, carne de sol desfiada, cebola fatiada, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 34, m: 44, g: 60, gg: null, super: 80 } },
  { nome: 'À Moda do Chefe', descricao: 'Molho de tomate, lombo canadense, bacon, mussarela, champignon, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28, m: 38, g: 62, gg: null, super: 75 } },
  { nome: 'Espanhola', descricao: 'Molho de tomate, calabresa moída, ovos cozidos, cebola, pimentão fatiado, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28, m: 38, g: 50, gg: null, super: 65 } },
  { nome: 'Peperone', descricao: 'Molho de tomate, mussarela, salaminho tipo peperone, parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28.50, m: 38, g: 50, gg: null, super: 60 } },
  { nome: 'Camarão', descricao: 'Molho de tomate, mussarela, filé de camarão, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 35, m: 45, g: 62, gg: null, super: 80 } },
  { nome: 'Frango Bolonhesa', descricao: 'Molho de tomate, frango desfiado, queijo parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 32, m: 42, g: 56, gg: null, super: 75 } },
  { nome: 'Siciliana', descricao: 'Molho de tomate, mussarela, champignon.', categoria: 'Salgadas', precos: { p: 28, m: 38, g: 50, gg: null, super: 70 } },
  { nome: 'Nordestina', descricao: 'Molho de tomate, carne de charque desfiada, cebola, pimentão, pimenta de cheiro, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 32, m: 42, g: 62, gg: null, super: 80 } },
  { nome: 'À Sua Moda', descricao: 'Ingredientes sugeridos pelo cliente.', categoria: 'Salgadas', precos: { p: 35, m: 45, g: 64, gg: null, super: 80 } },
  { nome: 'Vegetariana', descricao: 'Molho de tomate, mussarela, palmito, tomate fatiado, pimentão, champignon, manjericão, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 30, m: 40, g: 48, gg: null, super: 60 } },
  { nome: 'Caipira', descricao: 'Molho de tomate, frango desfiado, milho verde, catupiry, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 32, m: 42, g: 53, gg: null, super: 73 } },
  { nome: 'Toscana', descricao: 'Molho de tomate, calabresa moída, cebola, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28, m: 38, g: 44, gg: null, super: 60 } },
  { nome: '4 Queijos', descricao: 'Molho de tomate, mussarela, provolone, catupiry, parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28, m: 41, g: 48, gg: null, super: 62 } },
  { nome: 'À Moda do Forneiro', descricao: 'Molho de tomate, carne de sol desfiada, champignon, palmito, catupiry, manjericão, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 32, m: 42, g: 54, gg: null, super: 73 } },
  { nome: 'Bolonhesa', descricao: 'Molho de tomate, mussarela, molho bolonhesa, parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28, m: 38, g: 48, gg: null, super: 55 } },
  { nome: 'Palmito', descricao: 'Molho de tomate, palmito picado e temperado, catupiry, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28, m: 38, g: 53, gg: null, super: 60 } },
  { nome: 'À Moda do Pizzaiolo', descricao: 'Molho de tomate, presunto picado, palmito, ervilha, mussarela, bacon, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 32, m: 42, g: 52, gg: null, super: 73 } },
  { nome: 'Marguerita', descricao: 'Molho de tomate, mussarela, manjericão, rodelas de tomate, parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28, m: 38, g: 48, gg: null, super: 55 } },
  { nome: 'Verona', descricao: 'Molho de tomate, palmito, bacon, catupiry, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28, m: 38, g: 52, gg: null, super: 65 } },
  { nome: 'Baiana', descricao: 'Molho de tomate, calabresa moída, ovos cozidos, pimenta calabresa, cebola, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 30, m: 40, g: 50, gg: null, super: 65 } },
  { nome: 'Sertaneja', descricao: 'Molho de tomate, mussarela, calabresa, milho verde, cebola, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28, m: 38, g: 46, gg: null, super: 60 } },
  { nome: 'Alho', descricao: 'Molho de tomate, mussarela, parmesão, alho frito, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28, m: 38, g: 46, gg: null, super: 60 } },
  { nome: 'Lombinho', descricao: 'Molho de tomate, mussarela, lombo canadense, cebola fatiada, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28, m: 38, g: 50, gg: null, super: 62 } },
  { nome: 'Veneza', descricao: 'Molho de tomate, lombo canadense, alho frito, catupiry, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28, m: 38, g: 50, gg: null, super: 62 } },
  { nome: 'Formágio', descricao: 'Molho de tomate, mussarela, provolone, catupiry, gorgonzola, parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28, m: 38, g: 50, gg: null, super: 60 } },
  { nome: 'Hot Dog', descricao: 'Salsicha, milho, catupiry, mussarela e batata palha.', categoria: 'Salgadas', precos: { p: 28, m: 38, g: 47, gg: null, super: 60 } },
  { nome: 'À Grega', descricao: 'Molho de tomate, mussarela, catupiry, calabresa fatiada, bacon, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28, m: 41, g: 56, gg: null, super: 61 } },
  { nome: 'Napolitana', descricao: 'Molho de tomate, mussarela, rodelas de tomate, parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28, m: 38, g: 45, gg: null, super: 54 } },
  { nome: 'Atum', descricao: 'Molho de tomate, atum sólido, cebola, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 32, m: 42, g: 45, gg: null, super: 65 } },
  { nome: 'Atum c/ Cream Cheese', descricao: 'Molho de tomate, atum, cebola, cream cheese, orégano.', categoria: 'Salgadas', precos: { p: 35, m: 45, g: 53, gg: null, super: 73 } },
  { nome: 'Agreste', descricao: 'Molho de tomate, carne de charque desfiada, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 32, m: 42, g: 60, gg: null, super: 73 } },
  { nome: 'Charque', descricao: 'Molho de tomate, carne de charque desfiada, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 32, m: 42, g: 60, gg: null, super: 73 } },
  { nome: 'Suíça', descricao: 'Molho de tomate, presunto, mussarela, gorgonzola, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 30, m: 40, g: 45, gg: null, super: 60 } },
  { nome: 'Carne de Sol c/ Cream Cheese', descricao: 'Molho de tomate, carne de sol, cebola, orégano, Cream Cheese e Bacon Fatiado.', categoria: 'Salgadas', precos: { p: 32, m: 45, g: 62, gg: null, super: 73 } },
  { nome: 'Strogonoff', descricao: 'Molho de tomate, mussarela, strogonoff.', categoria: 'Salgadas', precos: { p: 32, m: 42, g: 53, gg: null, super: 65 } },
  { nome: 'Frango c/ Cream Cheese', descricao: 'Molho de tomate, frango desfiado, mussarela.', categoria: 'Salgadas', precos: { p: 35, m: 45, g: 60, gg: null, super: 73 } },
  { nome: 'Frango c/ Mussarela', descricao: 'Molho de tomate, frango desfiado, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 32, m: 42, g: 55, gg: null, super: 75 } },
  { nome: 'Frango c/ Catupiry', descricao: 'Molho de tomate, frango desfiado, catupiry, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 32, m: 42, g: 55, gg: null, super: 75 } },
  { nome: 'Bacon', descricao: 'Molho de tomate, mussarela, bacon, rodelas de tomate, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 32, m: 42, g: 55, gg: null, super: 70 } },
  { nome: 'À Moda da Casa', descricao: 'Molho de tomate, frango desfiado, milho verde, mussarela, bacon, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 32, m: 42, g: 62, gg: null, super: 80 } },
  { nome: 'Francesa', descricao: 'Molho de tomate, presunto, ovos, cebola, ervilha, catupiry, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 30, m: 40, g: 50, gg: null, super: 65 } },
  { nome: 'Mussarela', descricao: 'Molho de tomate, mussarela, rodelas de tomate, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28, m: 38, g: 44, gg: null, super: 54 } },
  { nome: 'Calabresa', descricao: 'Molho de tomate, calabresa, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28, m: 38, g: 46, gg: null, super: 60 } },
  { nome: 'Portuguesa', descricao: 'Molho de tomate, presunto, ovos, cebola, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 30, m: 40, g: 50, gg: null, super: 65 } },
  { nome: 'Bauru', descricao: 'Molho de tomate, presunto, mussarela, rodelas de tomate, orégano e azeitonas.', categoria: 'Salgadas', precos: { p: 28, m: 38, g: 44, gg: null, super: 60 } },

  // DOCES (5 itens)
  { nome: 'Chocolate com Morango', descricao: 'Chocolate com morango.', categoria: 'Doces', precos: { p: 30, m: 35, g: 40, gg: 54, super: null } },
  { nome: 'Banana Nevada', descricao: 'Banana com canela, creme de leite e chocolate branco com borda de doce de leite.', categoria: 'Doces', precos: { p: 30, m: 35, g: 40, gg: 54, super: null } },
  { nome: 'Cartola', descricao: 'Mussarela, catupiry, banana fatiada, açúcar e canela com borda de doce de leite.', categoria: 'Doces', precos: { p: 30, m: 35, g: 40, gg: 54, super: null } },
  { nome: 'Romeu e Julieta', descricao: 'Mussarela coberta com fatia de goiabada, com borda de doce de leite.', categoria: 'Doces', precos: { p: 30, m: 35, g: 40, gg: 54, super: null } },
  { nome: 'Dois Amores', descricao: 'Chocolate branco e chocolate de avelã com borda de doce de leite.', categoria: 'Doces', precos: { p: 30, m: 35, g: 40, gg: 54, super: null } },

  // MASSAS (4 itens)
  { nome: 'Espaguete', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', precos: { p: 26 } },
  { nome: 'Parafuso', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', precos: { p: 26 } },
  { nome: 'Penne', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', precos: { p: 26 } },
  { nome: 'Talharim', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', precos: { p: 26 } },

  // PASTÉIS DE FORNO (10 itens)
  { nome: 'Pastel de Forno 4 Queijos', descricao: 'Pastel de forno orgânico com 4 queijos.', categoria: 'Pastéis de Forno', precos: { p: 14 } },
  { nome: 'Pastel de Forno Bauru', descricao: 'Pastel de forno orgânico com presunto, mussarela e tomate.', categoria: 'Pastéis de Forno', precos: { p: 14 } },
  { nome: 'Pastel de Forno Carne de Sol com Cream Cheese', descricao: 'Pastel de forno orgânico com carne de sol e cream cheese.', categoria: 'Pastéis de Forno', precos: { p: 17 } },
  { nome: 'Pastel de Forno Charque', descricao: 'Pastel de forno orgânico com carne de charque.', categoria: 'Pastéis de Forno', precos: { p: 14 } },
  { nome: 'Pastel de Forno Frango com Catupiry', descricao: 'Pastel de forno orgânico com frango desfiado e catupiry.', categoria: 'Pastéis de Forno', precos: { p: 12 } },
  { nome: 'Pastel de Forno Frango com Cream Cheese', descricao: 'Pastel de forno orgânico com frango e cream cheese.', categoria: 'Pastéis de Forno', precos: { p: 17 } },
  { nome: 'Pastel de Forno Moda do Cliente', descricao: 'Pastel de forno orgânico personalizado.', categoria: 'Pastéis de Forno', precos: { p: 18 } },
  { nome: 'Pastel de Forno Mussarela com Tomate', descricao: 'Pastel de forno orgânico com mussarela e tomate.', categoria: 'Pastéis de Forno', precos: { p: 13 } },
  { nome: 'Pastel de Forno Portuguesa', descricao: 'Pastel de forno orgânico com presunto, ovos e cebola.', categoria: 'Pastéis de Forno', precos: { p: 14 } },
  { nome: 'Pastel de Forno À Moda da Casa', descricao: 'Pastel de forno orgânico com receita especial da casa.', categoria: 'Pastéis de Forno', precos: { p: 15 } },

  // LASANHAS (5 itens)
  { nome: 'Lasanha Bolonhesa', descricao: 'Massa caseira. Serve uma pessoa. Lasanha com molho bolonhesa artesanal.', categoria: 'Lasanhas', precos: { p: 35 } },
  { nome: 'Lasanha Presunto e Queijo', descricao: 'Massa caseira. Serve uma pessoa. Lasanha com presunto e queijo.', categoria: 'Lasanhas', precos: { p: 35 } },
  { nome: 'Lasanha 4 Queijos', descricao: 'Massa caseira. Serve uma pessoa. Lasanha com 4 tipos de queijo.', categoria: 'Lasanhas', precos: { p: 35 } },
  { nome: 'Lasanha de Frango com Molho Branco', descricao: 'Massa caseira. Serve uma pessoa. Lasanha de frango com molho branco cremoso.', categoria: 'Lasanhas', precos: { p: 35 } },
  { nome: 'Lasanha de Carne de Sol', descricao: 'Massa caseira. Serve uma pessoa. Lasanha com carne de sol desfiada.', categoria: 'Lasanhas', precos: { p: 35 } },

  // PETISCOS (6 itens)
  { nome: 'Filé à Parmegiana', descricao: 'Filé coberto com molho tomate, mussarela e parmesão. Executivo e completo.', categoria: 'Petiscos', precos: { p: 48 } },
  { nome: 'Filé 4 Queijos', descricao: 'Filé coberto com 4 tipos de queijo. Serve 2 pessoas.', categoria: 'Petiscos', precos: { p: 70 } },
  { nome: 'Arroz', descricao: 'Arroz branco cozido no vapor. Serve 1 pessoa.', categoria: 'Petiscos', precos: { p: 7 } },
  { nome: 'Frango à Passarinho', descricao: 'Frango crocante. Acompanha fritas e salada. Serve 1 pessoa.', categoria: 'Petiscos', precos: { p: 35 } },
  { nome: 'Batata Frita com Bacon e Cheddar', descricao: 'Batata frita sequinha com bacon crocante e cobertura de cheddar.', categoria: 'Petiscos', precos: { p: 30 } },
  { nome: 'Filé com Fritas', descricao: 'Filé grelhado acompanhado com batata frita. Serve 1 pessoa.', categoria: 'Petiscos', precos: { p: 40 } },

  // CALZONES (3 itens)
  { nome: 'Mini Calzone de Camarão', descricao: 'Mini calzone crocante recheado com camarão.', categoria: 'Calzones', precos: { p: 17 } },
  { nome: 'Mini Calzone de Carne de Sol', descricao: 'Mini calzone crocante recheado com carne de sol desfiada.', categoria: 'Calzones', precos: { p: 15 } },
  { nome: 'Mini Calzone de Bacon com Queijo', descricao: 'Mini calzone crocante recheado com bacon e queijo derretido.', categoria: 'Calzones', precos: { p: 14 } },

  // BEBIDAS (4 itens)
  { nome: 'Refrigerante 2L', descricao: 'Escolha o seu sabor favorito em garrafa de 2 litros.', categoria: 'Bebidas', precos: { p: 12 } },
  { nome: 'Refrigerante 350ml', descricao: 'Refrigerante gelado em lata de 350ml.', categoria: 'Bebidas', precos: { p: 5 } },
  { nome: 'Suco Natural 500ml', descricao: 'Suco natural fresco preparado na hora. Sabores variados.', categoria: 'Bebidas', precos: { p: 10 } },
  { nome: 'Água 500ml', descricao: 'Água mineral gelada.', categoria: 'Bebidas', precos: { p: 3 } }
];

async function populateCardapio() {
  const client = new Client({
    connectionString: 'postgresql://postgres:mGBXIHVcdYaEHGFqJaOyVIIlBemGuEZR@centerbeam.proxy.rlwy.net:17816/railway'
  });

  try {
    console.log('🔌 Conectando ao Railway...');
    await client.connect();
    console.log('✅ Conectado com sucesso!');

    // Limpar dados antigos (opcional, já foi feito)
    console.log('🧹 Limpando dados antigos...');
    await client.query('DELETE FROM cardapio');
    console.log('✅ Dados antigos removidos');

    // Inserir produtos
    console.log('📥 Inserindo produtos...');
    let insertedCount = 0;

    for (const produto of cardapioData) {
      const precos = JSON.stringify(produto.precos);
      const query = `
        INSERT INTO cardapio (nome_item, descricao, categoria, precos, imagem_url, disponivel, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `;

      await client.query(query, [
        produto.nome,
        produto.descricao,
        produto.categoria,
        precos,
        '', // imagem_url vazio - será preenchido via admin panel
        true // disponivel
      ]);

      insertedCount++;
    }

    console.log(`✅ ${insertedCount} produtos inseridos com sucesso!`);

    // Validação
    const result = await client.query(`
      SELECT categoria, COUNT(*) as total
      FROM cardapio
      GROUP BY categoria
      ORDER BY categoria
    `);

    console.log('\n📊 Produtos por categoria:');
    result.rows.forEach(row => {
      console.log(`  ${row.categoria}: ${row.total}`);
    });

    const totalResult = await client.query('SELECT COUNT(*) as total FROM cardapio');
    console.log(`\n✅ Total de ${totalResult.rows[0].total} produtos no banco!`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

populateCardapio();
