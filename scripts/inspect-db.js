#!/usr/bin/env node

import pg from 'pg';
const { Client } = pg;

const client = new Client({ 
  connectionString: 'postgresql://postgres:mGBXIHVcdYaEHGFqJaOyVIIlBemGuEZR@centerbeam.proxy.rlwy.net:17816/railway' 
});

client.connect().then(() => {
  client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='cardapio'")
    .then(res => {
      console.log('Colunas da tabela cardapio:');
      res.rows.forEach(row => console.log('  -', row.column_name, '(' + row.data_type + ')'));
      
      // Também mostrar um registro para ver a estrutura
      return client.query('SELECT * FROM cardapio LIMIT 1');
    })
    .then(res => {
      if (res.rows.length > 0) {
        console.log('\nExemplo de registro:');
        console.log(res.rows[0]);
      }
      client.end();
    });
});
