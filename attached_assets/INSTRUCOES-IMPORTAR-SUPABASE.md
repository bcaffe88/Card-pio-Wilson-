# 🍕 Corrigido: Como Importar as Tools Supabase (SEM ERRO UUID)

## ⚠️ PROBLEMA RESOLVIDO
O erro `invalid input syntax for type uuid: ""` era causado por filtros com parâmetros vazios. **AGORA RESOLVIDO!**

---

## ⚡ Passo 1: Baixe o Arquivo ATUALIZADO
```
Arquivo: n8n-supabase-tools-completas.json
(Version: CORRIGIDA - sem erros de UUID vazio)
```

## ⚡ Passo 2: No N8N Dashboard
```
1. Menu (≡) → Import from file
2. Selecione: n8n-supabase-tools-completas.json
3. Clique "Import"
```

## ⚡ Passo 3: Selecione Sua API Supabase

Cada tool vai aparecer no seu canvas com:
```
credentials → supabaseApi → id: {{ SELECIONE_SUA_API_SUPABASE }}
```

Você vai ver um ⚠️ de aviso (credentials não configuradas).

### Para CADA tool, faça (Leva 30 segundos):
```
1. Clique na tool
2. Vá em: Credentials
3. Clique no campo "supabase" 
4. Selecione sua API: "pizzaria" (ou a que você criou)
5. Clique ✓ (checkmark)
6. Done!
```

---

## ✅ Tools Que Vão Aparecer (12 no Total)

| # | Tool | O que faz | Parâmetros Obrigatórios |
|----|------|----------|------------------------|
| 1 | **BuscarCliente** | Busca cliente por telefone | `telefone` |
| 2 | **AdicionarCliente** | Cria novo cliente | `nome`, `telefone` |
| 3 | **AtualizarCliente** | Edita dados cliente | `id` + campo para atualizar |
| 4 | **ConsultarCardapio** | Lista todos produtos | Nenhum |
| 5 | **BuscarEndereço** | Lista endereços cliente | `cliente_id` |
| 6 | **AdicionarEndereco** | Cria novo endereço | `cliente_id`, `rua`, `numero`, `bairro`, `cidade` |
| 7 | **AtualizarEndereco** | Edita endereço | `id` + campo para atualizar |
| 8 | **ConsultarItensPedido** | Lista items dos pedidos | Nenhum |
| 9 | **CriarPedido** | Cria novo pedido | `cliente_nome`, `cliente_telefone`, `forma_pagamento`, `total` |
| 10 | **AtualizarPedido** | Atualiza pedido/status | `id` + campo para atualizar |
| 11 | **DeletarPedido** | Remove pedido | `id` |
| 12 | **ConsultarHorario** | Ver horários funcionamento | Nenhum |

---

## 🔗 Como Conectar ao Agente IA

```
1. Crie um nó de IA (Claude, GPT, etc)
2. Conecte as tools ao nó:
   Tool Node → AI Node (input "ai_tool")
3. Configure o prompt do agente:
   - Diga para usar as tools para responder perguntas
   - Sempre passe os parâmetros obrigatórios
   - Ex: "Use a tool BuscarCliente com o telefone do cliente"
```

---

## 🧪 TESTE AGORA (Faça isso para verificar!)

### Teste 1: Criar um Cliente
```
Pergunta ao agente:
"Criar um cliente chamado Maria com telefone 11987654321 e email maria@email.com"

O agente deve:
1. Reconhecer que precisa criar um cliente
2. Usar a tool: AdicionarCliente
3. Preencher: nome=Maria, telefone=11987654321, email=maria@email.com
4. Executar a tool
5. Responder: "Cliente criado com sucesso!"
```

### Teste 2: Buscar um Cliente
```
Pergunta ao agente:
"Buscar cliente com telefone 11987654321"

O agente deve:
1. Usar a tool: BuscarCliente
2. Preencher: telefone=11987654321
3. Retornar os dados do cliente
```

### Teste 3: Ver Cardápio
```
Pergunta ao agente:
"Quais pizzas vocês têm?"

O agente deve:
1. Usar a tool: ConsultarCardapio
2. Listar todos os produtos
3. Responder com as pizzas disponíveis
```

---

## ✅ Se Funcionar (Você vai ver):
- ✅ Tool é executada sem erros
- ✅ Dados aparecem na resposta
- ✅ Sem erros de UUID vazio

## ❌ Se Não Funcionar:

| Erro | Solução |
|------|---------|
| ⚠️ `invalid input syntax for type uuid` | **RESOLVIDO** - use a versão atualizada do JSON |
| ⚠️ Credentials não encontradas | Clique na tool e selecione sua API Supabase manualmente |
| ⚠️ Tool retorna dados vazios | Verifique se os dados existem no Supabase |
| ⚠️ Agente não usa a tool | Adicione instrução no prompt: "Use a tool XXX com parâmetro YYY" |

---

## 💡 Dica de Ouro: Prompt do Agente

Coloque isso no seu prompt de IA:

```
Você é um assistente de pedidos de pizzaria.

TOOLS DISPONÍVEIS:
- BuscarCliente: Usa para buscar cliente por TELEFONE
- AdicionarCliente: Usa para criar novo cliente com NOME e TELEFONE
- ConsultarCardapio: Usa para listar produtos disponíveis
- CriarPedido: Usa para criar pedido com CLIENTE_NOME, CLIENTE_TELEFONE, FORMA_PAGAMENTO, TOTAL
- [etc...]

REGRAS:
1. SEMPRE use as tools para buscar/criar dados, não invente dados
2. SE o usuário disser um telefone, PRIMEIRO busca o cliente com BuscarCliente
3. SE não encontrar o cliente, CRIA um novo com AdicionarCliente
4. PARA criar pedido, SEMPRE passe todos os parâmetros obrigatórios
5. NUNCA passe parâmetros vazios nas tools
```

---

## 🎉 Pronto!

Agora as tools funcionam sem erros! Teste nos 3 cenários acima e veja a mágica acontecer! ✨

---

**Status:** ✅ CORRIGIDO
**Total de Tools:** 12
**Erro UUID:** RESOLVIDO
**Tempo para setup:** ~2 minutos
