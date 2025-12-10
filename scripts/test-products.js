#!/usr/bin/env node

/**
 * Test script para validar se os produtos foram inseridos corretamente
 */

import pg from 'pg';
const { Client } = pg;

const client = new Client({ 
  connectionString: 'postgresql://postgres:mGBXIHVcdYaEHGFqJaOyVIIlBemGuEZR@centerbeam.proxy.rlwy.net:17816/railway' 
});

client.connect().then(() => {
  console.log('✅ Conectado ao Railway PostgreSQL\n');
  
  // Contar total de produtos
  client.query('SELECT COUNT(*) as total FROM cardapio')
    .then(res => {
      console.log('📊 TOTAL DE PRODUTOS:', res.rows[0].total);
      
      // Produtos por categoria
      return client.query('SELECT categoria, COUNT(*) as qtd FROM cardapio GROUP BY categoria ORDER BY categoria');
    })
    .then(res => {
      console.log('\n📋 PRODUTOS POR CATEGORIA:');
      res.rows.forEach(row => {
        console.log(`   ${row.categoria.padEnd(20)} | ${row.qtd} produtos`);
      });
      
      // Verificar algumas amostras
      return client.query('SELECT nome_item, categoria, precos, imagem_url FROM cardapio LIMIT 5');
    })
    .then(res => {
      console.log('\n🍕 AMOSTRA DE 5 PRODUTOS:');
      res.rows.forEach((row, idx) => {
        console.log(`\n   ${idx + 1}. ${row.nome_item}`);
        console.log(`      Categoria: ${row.categoria}`);
        console.log(`      Preços (tipo: ${typeof row.precos}): ${JSON.stringify(row.precos)}`);
        console.log(`      Imagem: ${row.imagem_url || 'null'}`);
      });
      
      // Verificar se não há duplicatas
      return client.query('SELECT nome_item, COUNT(*) as qtd FROM cardapio GROUP BY nome_item HAVING COUNT(*) > 1');
    })
    .then(res => {
      if (res.rows.length === 0) {
        console.log('\n\n✅ NENHUMA DUPLICATA ENCONTRADA - Banco está correto!');
      } else {
        console.log('\n\n❌ DUPLICATAS ENCONTRADAS:');
        res.rows.forEach(row => {
          console.log(`   ${row.nome_item}: ${row.qtd} vezes`);
        });
      }
      
      client.end();
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ ERRO:', err.message);
      client.end();
      process.exit(1);
    });
});
