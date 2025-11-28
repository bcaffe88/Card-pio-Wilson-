# 🍕 GUIA MANUAL - POPULAR CARDÁPIO NO SUPABASE

## ❌ PROBLEMA ENCONTRADO
Sua tabela `cardapio` ainda não existe no Supabase. 

## ✅ SOLUÇÃO RÁPIDA (2 PASSOS)

### PASSO 1️⃣ - Criar a Tabela
Abra seu Supabase → **SQL Editor** → **New Query** e cole **EXATAMENTE ISTO**:

```sql
CREATE TABLE cardapio (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT NOT NULL,
  preco_p DECIMAL(10,2),
  preco_m DECIMAL(10,2),
  preco_g DECIMAL(10,2),
  preco_gg DECIMAL(10,2),
  preco_super DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_cardapio_categoria ON cardapio(categoria);
CREATE INDEX idx_cardapio_ativo ON cardapio(ativo);
```

Clique **RUN** ✅

### PASSO 2️⃣ - Popular os Dados
Depois, copie o arquivo **SUPABASE-SETUP.sql** completo (com todos os 80 produtos) e cole no mesmo SQL Editor.

Clique **RUN** novamente ✅

---

## 📊 ESTRUTURA DA TABELA
- `id` - Identificador único (pizza-calabresa, pastel-queijo, etc)
- `nome` - Nome do produto
- `descricao` - Descrição detalhada
- `categoria` - Salgadas, Doces, Massas, Pastéis, etc
- `preco_p` - Preço tamanho P (pequeno)
- `preco_m` - Preço tamanho M (médio)
- `preco_g` - Preço tamanho G (grande)
- `preco_gg` - Preço tamanho GG (extra grande)
- `preco_super` - Preço Super

---

## 🎯 DEPOIS DE PRONTO
Execute este comando na pasta do projeto:
```bash
node scripts/auto-populate-supabase.js
```

Isso inserirá automaticamente todos os 80 produtos! 🚀
