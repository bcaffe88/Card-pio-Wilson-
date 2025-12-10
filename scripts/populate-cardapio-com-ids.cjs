#!/usr/bin/env node

/**
 * Script para popular o cardápio COM OS IDS CORRETOS
 * Necessário para que o merge de MENU_ITEMS funcione corretamente
 * Os IDs devem corresponder aos `id` do menu.ts
 */

const { Client } = require('pg');

// Produtos com IDs correspondentes ao menu.ts
const cardapioData = [
  // SALGADAS (47 itens)
  { id: 'costela', nome: 'Costela', descricao: 'Costela desfiada, cebola, creme cheese, mussarela e barbecue.', categoria: 'Salgadas', precos: { P: 35, M: 45, G: 65, Super: 80 } },
  { id: 'calabresa-especial', nome: 'Calabresa Especial', descricao: 'Molho de tomate, calabresa fatiada, mussarela, creme cheese, barbecue, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 32, M: 42, G: 53, Super: 73 } },
  { id: 'carne-de-sol', nome: 'Carne de Sol', descricao: 'Molho de tomate, carne de sol desfiada, cebola fatiada, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 34, M: 44, G: 60, Super: 80 } },
  { id: 'a-moda-do-chefe', nome: 'À Moda do Chefe', descricao: 'Molho de tomate, lombo canadense, bacon, mussarela, champignon, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28, M: 38, G: 62, Super: 75 } },
  { id: 'espanhola', nome: 'Espanhola', descricao: 'Molho de tomate, calabresa moída, ovos cozidos, cebola, pimentão fatiado, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28, M: 38, G: 50, Super: 65 } },
  { id: 'pepperone', nome: 'Peperone', descricao: 'Molho de tomate, mussarela, salaminho tipo peperone, parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28.50, M: 38, G: 50, Super: 60 } },
  { id: 'camarao', nome: 'Camarão', descricao: 'Molho de tomate, mussarela, filé de camarão, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 35, M: 45, G: 62, Super: 80 } },
  { id: 'frango-bolonhesa', nome: 'Frango Bolonhesa', descricao: 'Molho de tomate, frango desfiado, queijo parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 32, M: 42, G: 56, Super: 75 } },
  { id: 'siciliana', nome: 'Siciliana', descricao: 'Molho de tomate, mussarela, champignon.', categoria: 'Salgadas', precos: { P: 28, M: 38, G: 50, Super: 70 } },
  { id: 'nordestina', nome: 'Nordestina', descricao: 'Molho de tomate, carne de charque desfiada, cebola, pimentão, pimenta de cheiro, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 32, M: 42, G: 62, Super: 80 } },
  { id: 'a-sua-moda', nome: 'À Sua Moda', descricao: 'Ingredientes sugeridos pelo cliente.', categoria: 'Salgadas', precos: { P: 35, M: 45, G: 64, Super: 80 } },
  { id: 'vegetariana', nome: 'Vegetariana', descricao: 'Molho de tomate, mussarela, palmito, tomate fatiado, pimentão, champignon, manjericão, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 30, M: 40, G: 48, Super: 60 } },
  { id: 'caipira', nome: 'Caipira', descricao: 'Molho de tomate, frango desfiado, milho verde, catupiry, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 32, M: 42, G: 53, Super: 73 } },
  { id: 'toscana', nome: 'Toscana', descricao: 'Molho de tomate, calabresa moída, cebola, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28, M: 38, G: 44, Super: 60 } },
  { id: '4-queijos', nome: '4 Queijos', descricao: 'Molho de tomate, mussarela, provolone, catupiry, parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28, M: 41, G: 48, Super: 62 } },
  { id: 'a-moda-do-forneiro', nome: 'À Moda do Forneiro', descricao: 'Molho de tomate, carne de sol desfiada, champignon, palmito, catupiry, manjericão, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 32, M: 42, G: 54, Super: 73 } },
  { id: 'bolonhesa', nome: 'Bolonhesa', descricao: 'Molho de tomate, mussarela, molho bolonhesa, parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28, M: 38, G: 48, Super: 55 } },
  { id: 'palmito', nome: 'Palmito', descricao: 'Molho de tomate, palmito picado e temperado, catupiry, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28, M: 38, G: 53, Super: 60 } },
  { id: 'a-moda-do-pizzaiolo', nome: 'À Moda do Pizzaiolo', descricao: 'Molho de tomate, presunto picado, palmito, ervilha, mussarela, bacon, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 32, M: 42, G: 52, Super: 73 } },
  { id: 'marguerita', nome: 'Marguerita', descricao: 'Molho de tomate, mussarela, manjericão, rodelas de tomate, parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28, M: 38, G: 48, Super: 55 } },
  { id: 'verona', nome: 'Verona', descricao: 'Molho de tomate, palmito, bacon, catupiry, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28, M: 38, G: 52, Super: 65 } },
  { id: 'baiana', nome: 'Baiana', descricao: 'Molho de tomate, calabresa moída, ovos cozidos, pimenta calabresa, cebola, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 30, M: 40, G: 50, Super: 65 } },
  { id: 'sertaneja', nome: 'Sertaneja', descricao: 'Molho de tomate, mussarela, calabresa, milho verde, cebola, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28, M: 38, G: 46, Super: 60 } },
  { id: 'alho', nome: 'Alho', descricao: 'Molho de tomate, mussarela, parmesão, alho frito, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28, M: 38, G: 46, Super: 60 } },
  { id: 'lombinho', nome: 'Lombinho', descricao: 'Molho de tomate, mussarela, lombo canadense, cebola fatiada, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28, M: 38, G: 50, Super: 62 } },
  { id: 'veneza', nome: 'Veneza', descricao: 'Molho de tomate, lombo canadense, alho frito, catupiry, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28, M: 38, G: 50, Super: 62 } },
  { id: 'formagio', nome: 'Formágio', descricao: 'Molho de tomate, mussarela, provolone, catupiry, gorgonzola, parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28, M: 38, G: 50, Super: 60 } },
  { id: 'hot-dog', nome: 'Hot Dog', descricao: 'Salsicha, milho, catupiry, mussarela e batata palha.', categoria: 'Salgadas', precos: { P: 28, M: 38, G: 47, Super: 60 } },
  { id: 'a-grega', nome: 'À Grega', descricao: 'Molho de tomate, mussarela, catupiry, calabresa fatiada, bacon, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28, M: 41, G: 56, Super: 61 } },
  { id: 'napolitana', nome: 'Napolitana', descricao: 'Molho de tomate, mussarela, rodelas de tomate, parmesão, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28, M: 38, G: 45, Super: 54 } },
  { id: 'atum', nome: 'Atum', descricao: 'Molho de tomate, atum sólido, cebola, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 32, M: 42, G: 45, Super: 65 } },
  { id: 'atum-cream-cheese', nome: 'Atum c/ Cream Cheese', descricao: 'Molho de tomate, atum, cebola, cream cheese, orégano.', categoria: 'Salgadas', precos: { P: 35, M: 45, G: 53, Super: 73 } },
  { id: 'agreste', nome: 'Agreste', descricao: 'Molho de tomate, carne de charque desfiada, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 32, M: 42, G: 60, Super: 73 } },
  { id: 'charque', nome: 'Charque', descricao: 'Molho de tomate, carne de charque desfiada, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 32, M: 42, G: 60, Super: 73 } },
  { id: 'suica', nome: 'Suíça', descricao: 'Molho de tomate, presunto, mussarela, gorgonzola, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 30, M: 40, G: 45, Super: 60 } },
  { id: 'carne-de-sol-cream-cheese', nome: 'Carne de Sol c/ Cream Cheese', descricao: 'Molho de tomate, carne de sol, cebola, orégano, Cream Cheese e Bacon Fatiado.', categoria: 'Salgadas', precos: { P: 32, M: 45, G: 62, Super: 73 } },
  { id: 'strogonoff', nome: 'Strogonoff', descricao: 'Molho de tomate, mussarela, strogonoff.', categoria: 'Salgadas', precos: { P: 32, M: 42, G: 53, Super: 65 } },
  { id: 'frango-cream-cheese', nome: 'Frango c/ Cream Cheese', descricao: 'Molho de tomate, frango desfiado, mussarela.', categoria: 'Salgadas', precos: { P: 35, M: 45, G: 60, Super: 73 } },
  { id: 'frango-mussarela', nome: 'Frango c/ Mussarela', descricao: 'Molho de tomate, frango desfiado, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 32, M: 42, G: 55, Super: 75 } },
  { id: 'frango-catupiry', nome: 'Frango c/ Catupiry', descricao: 'Molho de tomate, frango desfiado, catupiry, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 32, M: 42, G: 55, Super: 75 } },
  { id: 'bacon', nome: 'Bacon', descricao: 'Molho de tomate, mussarela, bacon, rodelas de tomate, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 32, M: 42, G: 55, Super: 70 } },
  { id: 'a-moda-da-casa', nome: 'À Moda da Casa', descricao: 'Molho de tomate, frango desfiado, milho verde, mussarela, bacon, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 32, M: 42, G: 62, Super: 80 } },
  { id: 'francesa', nome: 'Francesa', descricao: 'Molho de tomate, presunto, ovos, cebola, ervilha, catupiry, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 30, M: 40, G: 50, Super: 65 } },
  { id: 'mussarela', nome: 'Mussarela', descricao: 'Molho de tomate, mussarela, rodelas de tomate, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28, M: 38, G: 44, Super: 54 } },
  { id: 'calabresa', nome: 'Calabresa', descricao: 'Molho de tomate, calabresa, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28, M: 38, G: 46, Super: 60 } },
  { id: 'portuguesa', nome: 'Portuguesa', descricao: 'Molho de tomate, presunto, ovos, cebola, mussarela, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 30, M: 40, G: 50, Super: 65 } },
  { id: 'bauru', nome: 'Bauru', descricao: 'Molho de tomate, presunto, mussarela, rodelas de tomate, orégano e azeitonas.', categoria: 'Salgadas', precos: { P: 28, M: 38, G: 44, Super: 60 } },

  // DOCES (5 itens)
  { id: 'chocolate-morango', nome: 'Chocolate com Morango', descricao: 'Chocolate com morango.', categoria: 'Doces', precos: { P: 30, M: 35, G: 40, GG: 54 } },
  { id: 'banana-nevada', nome: 'Banana Nevada', descricao: 'Banana com canela, creme de leite e chocolate branco com borda de doce de leite.', categoria: 'Doces', precos: { P: 30, M: 35, G: 40, GG: 54 } },
  { id: 'cartola', nome: 'Cartola', descricao: 'Mussarela, catupiry, banana fatiada, açúcar e canela com borda de doce de leite.', categoria: 'Doces', precos: { P: 30, M: 35, G: 40, GG: 54 } },
  { id: 'romeu-julieta', nome: 'Romeu e Julieta', descricao: 'Mussarela coberta com fatia de goiabada, com borda de doce de leite.', categoria: 'Doces', precos: { P: 30, M: 35, G: 40, GG: 54 } },
  { id: 'dois-amores', nome: 'Dois Amores', descricao: 'Chocolate branco e chocolate de avelã com borda de doce de leite.', categoria: 'Doces', precos: { P: 30, M: 35, G: 40, GG: 54 } },

  // MASSAS (4 itens)
  { id: 'espaguete', nome: 'Espaguete', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', precos: { P: 26 } },
  { id: 'parafuso', nome: 'Parafuso', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', precos: { P: 26 } },
  { id: 'penne', nome: 'Penne', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', precos: { P: 26 } },
  { id: 'talharim', nome: 'Talharim', descricao: 'Serve 1 pessoa. Monte sua massa escolhendo molho e até 6 ingredientes.', categoria: 'Massas', precos: { P: 26 } },

  // PASTÉIS DE FORNO (10 itens)
  { id: 'pastel-4queijos', nome: 'Pastel de Forno 4 Queijos', descricao: 'Pastel de forno orgânico com 4 queijos.', categoria: 'Pastéis de Forno', precos: { P: 14 } },
  { id: 'pastel-bauru', nome: 'Pastel de Forno Bauru', descricao: 'Pastel de forno orgânico com presunto, mussarela e tomate.', categoria: 'Pastéis de Forno', precos: { P: 14 } },
  { id: 'pastel-carnesol-creamcheese', nome: 'Pastel de Forno Carne de Sol com Cream Cheese', descricao: 'Pastel de forno orgânico com carne de sol e cream cheese.', categoria: 'Pastéis de Forno', precos: { P: 17 } },
  { id: 'pastel-charque', nome: 'Pastel de Forno Charque', descricao: 'Pastel de forno orgânico com carne de charque.', categoria: 'Pastéis de Forno', precos: { P: 14 } },
  { id: 'pastel-frango-catupiry', nome: 'Pastel de Forno Frango com Catupiry', descricao: 'Pastel de forno orgânico com frango desfiado e catupiry.', categoria: 'Pastéis de Forno', precos: { P: 12 } },
  { id: 'pastel-frango-creamcheese', nome: 'Pastel de Forno Frango com Cream Cheese', descricao: 'Pastel de forno orgânico com frango e cream cheese.', categoria: 'Pastéis de Forno', precos: { P: 17 } },
  { id: 'pastel-moda-cliente', nome: 'Pastel de Forno Moda do Cliente', descricao: 'Pastel de forno orgânico personalizado.', categoria: 'Pastéis de Forno', precos: { P: 18 } },
  { id: 'pastel-mussarela-tomate', nome: 'Pastel de Forno Mussarela com Tomate', descricao: 'Pastel de forno orgânico com mussarela e tomate.', categoria: 'Pastéis de Forno', precos: { P: 13 } },
  { id: 'pastel-portuguesa', nome: 'Pastel de Forno Portuguesa', descricao: 'Pastel de forno orgânico com presunto, ovos e cebola.', categoria: 'Pastéis de Forno', precos: { P: 14 } },
  { id: 'pastel-moda-casa', nome: 'Pastel de Forno À Moda da Casa', descricao: 'Pastel de forno orgânico com receita especial da casa.', categoria: 'Pastéis de Forno', precos: { P: 15 } },

  // LASANHAS (5 itens)
  { id: 'lasanha-bolonhesa', nome: 'Lasanha Bolonhesa', descricao: 'Massa caseira. Serve uma pessoa. Lasanha com molho bolonhesa artesanal.', categoria: 'Lasanhas', precos: { P: 35 } },
  { id: 'lasanha-presunto-queijo', nome: 'Lasanha Presunto e Queijo', descricao: 'Massa caseira. Serve uma pessoa. Lasanha com presunto e queijo.', categoria: 'Lasanhas', precos: { P: 35 } },
  { id: 'lasanha-4queijos', nome: 'Lasanha 4 Queijos', descricao: 'Massa caseira. Serve uma pessoa. Lasanha com 4 tipos de queijo.', categoria: 'Lasanhas', precos: { P: 35 } },
  { id: 'lasanha-frango-branco', nome: 'Lasanha de Frango com Molho Branco', descricao: 'Massa caseira. Serve uma pessoa. Lasanha de frango com molho branco cremoso.', categoria: 'Lasanhas', precos: { P: 35 } },
  { id: 'lasanha-carnesol', nome: 'Lasanha de Carne de Sol', descricao: 'Massa caseira. Serve uma pessoa. Lasanha com carne de sol desfiada.', categoria: 'Lasanhas', precos: { P: 35 } },

  // PETISCOS (6 itens)
  { id: 'file-parmegiana', nome: 'Filé à Parmegiana', descricao: 'Filé coberto com molho tomate, mussarela e parmesão. Executivo e completo.', categoria: 'Petiscos', precos: { P: 48 } },
  { id: 'file-4queijos', nome: 'Filé 4 Queijos', descricao: 'Filé coberto com 4 tipos de queijo. Serve 2 pessoas.', categoria: 'Petiscos', precos: { P: 70 } },
  { id: 'arroz', nome: 'Arroz', descricao: 'Arroz branco cozido no vapor. Serve 1 pessoa.', categoria: 'Petiscos', precos: { P: 7 } },
  { id: 'frango-passarinho', nome: 'Frango à Passarinho', descricao: 'Frango crocante. Acompanha fritas e salada. Serve 1 pessoa.', categoria: 'Petiscos', precos: { P: 35 } },
  { id: 'batata-bacon-cheddar', nome: 'Batata Frita com Bacon e Cheddar', descricao: 'Batata frita sequinha com bacon crocante e cobertura de cheddar.', categoria: 'Petiscos', precos: { P: 30 } },
  { id: 'file-fritas', nome: 'Filé com Fritas', descricao: 'Filé grelhado acompanhado com batata frita. Serve 1 pessoa.', categoria: 'Petiscos', precos: { P: 40 } },

  // CALZONES (3 itens)
  { id: 'mini-calzone-camarao', nome: 'Mini Calzone de Camarão', descricao: 'Mini calzone crocante recheado com camarão.', categoria: 'Calzones', precos: { P: 17 } },
  { id: 'mini-calzone-carnesol', nome: 'Mini Calzone de Carne de Sol', descricao: 'Mini calzone crocante recheado com carne de sol desfiada.', categoria: 'Calzones', precos: { P: 15 } },
  { id: 'mini-calzone-bacon-queijo', nome: 'Mini Calzone de Bacon com Queijo', descricao: 'Mini calzone crocante recheado com bacon e queijo derretido.', categoria: 'Calzones', precos: { P: 14 } },

  // BEBIDAS (4 itens)
  { id: 'refrigerante-2l', nome: 'Refrigerante 2L', descricao: 'Escolha o seu sabor favorito em garrafa de 2 litros.', categoria: 'Bebidas', precos: { P: 12 } },
  { id: 'refrigerante-350ml', nome: 'Refrigerante 350ml', descricao: 'Refrigerante gelado em lata de 350ml.', categoria: 'Bebidas', precos: { P: 5 } },
  { id: 'suco-natural', nome: 'Suco Natural 500ml', descricao: 'Suco natural fresco preparado na hora. Sabores variados.', categoria: 'Bebidas', precos: { P: 10 } },
  { id: 'agua', nome: 'Água 500ml', descricao: 'Água mineral gelada.', categoria: 'Bebidas', precos: { P: 3 } }
];

async function populateCardapio() {
  const client = new Client({
    connectionString: 'postgresql://postgres:mGBXIHVcdYaEHGFqJaOyVIIlBemGuEZR@centerbeam.proxy.rlwy.net:17816/railway'
  });

  try {
    console.log('🔌 Conectando ao Railway...');
    await client.connect();
    console.log('✅ Conectado com sucesso!');

    // Limpar dados antigos
    console.log('🧹 Limpando dados antigos...');
    await client.query('DELETE FROM cardapio');
    console.log('✅ Dados antigos removidos');

    // Inserir produtos com IDs corretos
    console.log('📥 Inserindo produtos com IDs correspondentes ao menu.ts...');
    let insertedCount = 0;

    for (const produto of cardapioData) {
      const precos = JSON.stringify(produto.precos);
      const query = `
        INSERT INTO cardapio (item_id, nome_item, descricao, categoria, precos, imagem_url, disponivel, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      `;

      await client.query(query, [
        produto.id,           // ID string como no menu.ts
        produto.nome,
        produto.descricao,
        produto.categoria,
        precos,
        '',                   // imagem_url vazio - será preenchido via admin panel
        true                  // disponivel
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
    
    console.log('\n✨ Pronto! O merge de MENU_ITEMS agora funcionará corretamente!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

populateCardapio();
