# 📋 Guia para Popular o Cardápio no Supabase

## 🎯 Objetivo
Preencher a tabela `cardapio` do Supabase com todos os 85+ produtos do Wilson Pizzas.

---

## 📊 O Que Será Inserido

### Categorias Totais: 8
- **🍕 Pizzas Salgadas**: 43 sabores
- **🍕 Pizzas Doces**: 5 sabores
- **🍝 Massas Frescas**: 4 tipos (Espaguete, Parafuso/Penne, Penne, Rigatoni)
- **🥧 Pastéis de Forno**: 8 sabores
- **🍲 Lasanhas**: 4 tipos
- **📦 Calzones**: 6 tipos
- **🍖 Petiscos**: 6 opções
- **🥤 Bebidas**: 5 tipos

**Total: 85 produtos**

---

## 🚀 Como Fazer

### Opção 1: Usar o Script SQL (RECOMENDADO)

#### Passo 1: Abrir SQL Editor do Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Vá até seu projeto **Wilson Pizzas**
4. Clique em **SQL Editor** (no menu esquerdo)

#### Passo 2: Criar Nova Query
1. Clique em **New Query**
2. Copie TODO o conteúdo do arquivo: **SUPABASE-CARDAPIO-INSERT.sql**
3. Cole no editor

#### Passo 3: Executar
1. Clique no botão **RUN** (ou Ctrl+Enter)
2. Veja a mensagem: "85 rows inserted successfully"

✅ **Pronto!** Todos os produtos foram inseridos.

---

### Opção 2: Usar o JSON (Se Precisar Fazer Manualmente)

Se não conseguir usar SQL, pode importar o JSON:
1. Vá para **Data Editor** no Supabase
2. Abra a tabela `cardapio`
3. Clique em **Import Data**
4. Selecione o arquivo: **SUPABASE-CARDAPIO-JSON.json**
5. Mapeie os campos e confirme

---

## 📝 Estrutura da Tabela

A tabela `cardapio` deve ter essas colunas:

```sql
CREATE TABLE cardapio (
  id VARCHAR(100) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  categoria VARCHAR(100) NOT NULL,
  preco_p DECIMAL(10,2),
  preco_m DECIMAL(10,2),
  preco_g DECIMAL(10,2),
  preco_gg DECIMAL(10,2),
  preco_super DECIMAL(10,2),
  imagem VARCHAR(255),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔍 Validação

Após inserir, execute essa query para verificar:

```sql
-- Contar produtos por categoria
SELECT categoria, COUNT(*) as total
FROM cardapio
WHERE ativo = true
GROUP BY categoria
ORDER BY total DESC;
```

### Resultado Esperado:
```
categoria           | total
--------------------|-------
Salgadas           | 43
Doces              | 5
Massas             | 4
Pastéis de Forno   | 8
Calzones           | 6
Petiscos           | 6
Bebidas            | 5
Lasanhas           | 4
```

**Total geral esperado: 85 produtos**

---

## 🎨 Dados de Cada Produto

Cada produto contém:
- `id` - Identificador único (ex: "calabresa-especial")
- `nome` - Nome do produto (ex: "Calabresa Especial")
- `descricao` - Descrição detalhada com ingredientes
- `categoria` - Uma das 8 categorias
- `preco_p` - Preço Pequena (apenas pizzas)
- `preco_m` - Preço Média
- `preco_g` - Preço Grande
- `preco_gg` - Preço Gigante (pizzas doces)
- `preco_super` - Preço Super (pizzas salgadas)
- `imagem` - Arquivo de imagem (URL ou caminho)
- `ativo` - true = disponível, false = indisponível

---

## 🍝 Detalhes Especiais

### Massas
As massas têm estrutura diferente (apenas tamanho P = 26 reais):
- 4 molhos disponíveis: Vermelho, Branco, 4 Queijos, Bolonhesa
- Até 6 ingredientes para escolher (15 opções no app)

### Pastéis, Lasanhas, Calzones, Petiscos
Preço único ou com algumas variações, sem customização de tamanho além do que está indicado.

### Bebidas
Algumas têm apenas tamanho M, outras variam.

---

## ❌ Solução de Problemas

### Erro: "Foreign Key Constraint"
- Verifique se a tabela `cardapio` foi criada corretamente
- Se necessário, delete todos os dados primeiro: `DELETE FROM cardapio;`

### Erro: "Syntax Error"
- Copie o SQL novamente, certificando-se de que copiou TUDO
- Verifique se não há caracteres especiais truncados

### Dados Não Aparecendo
- Atualize a página (F5)
- Verifique a coluna `ativo` se está como `true`
- Execute a query de validação acima

---

## 🎯 Próximos Passos

Após popular o cardápio:

1. **Verificar no App**
   - Abra o cardápio online
   - Verifique se os 85 produtos aparecem

2. **Atualizar API do n8n**
   - Configure o webhook para buscar cardápio do Supabase
   - Teste o agente Don Wilson com os novos itens

3. **Testar Pedidos**
   - Faça um pedido com pizzas, massas, pastéis, etc.
   - Verifique se a formatação da mensagem no WhatsApp está correta

---

## 📞 Suporte

Se tiver dúvidas:
- Verifique os arquivos: `WILSON-AGENTE-ADAPTADO-NOVOS-ITENS.txt`
- Releia este guia
- Teste a conexão com Supabase

**Boa sorte! 🍕🚀**
