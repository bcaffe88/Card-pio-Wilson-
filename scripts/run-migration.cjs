#!/usr/bin/env node

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const client = new Client({
    connectionString: 'postgresql://postgres:mGBXIHVcdYaEHGFqJaOyVIIlBemGuEZR@centerbeam.proxy.rlwy.net:17816/railway'
  });

  try {
    console.log('🔌 Conectando ao Railway...');
    await client.connect();
    console.log('✅ Conectado com sucesso!');

    // Ler migration
    const migrationPath = path.join(__dirname, '..', 'migrations', 'add_item_id_to_cardapio.sql');
    const migration = fs.readFileSync(migrationPath, 'utf-8');

    console.log('🔄 Executando migration...');
    await client.query(migration);
    console.log('✅ Migration executada com sucesso!');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
