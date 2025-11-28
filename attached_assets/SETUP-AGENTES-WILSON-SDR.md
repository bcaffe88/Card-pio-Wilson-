# 🍕 Setup: Agente Wilson + Agente SDR com Tools

## 📋 Visão Geral

```
CLIENTE (WhatsApp)
    ↓
AGENTE WILSON (Atendimento)
    ↓
Chama → AGENDAMENTOS_SDR (Tool)
    ↓
AGENTE SDR (Processa com as 11 operations)
    ↓
SUPABASE (BD)
```

---

## ✅ Os 11 Operations do SDR

| # | Operation | Faz O Quê | Parâmetros |
|----|-----------|-----------|-----------|
| 1 | **validar_abertura** | Verifica se está aberto | Nenhum (usa hora atual) |
| 2 | **validar_cliente** | Busca cliente por telefone | `telefone` |
| 3 | **buscar_produto** | Busca produto no cardápio | `nome_item` |
| 4 | **processar_pedido** | Cria pedido completo | `cliente_nome`, `cliente_telefone`, `forma_pagamento`, `total`, `itens` |
| 5 | **processar_pedido_formatado** | Parse de mensagem WhatsApp | `mensagem_texto` |
| 6 | **calcular_total** | Calcula total dos items | `itens` array |
| 7 | **buscar_pedido** | Busca pedido por ID ou telefone | `pedido_id` OU `cliente_telefone` |
| 8 | **atualizar_status_pedido** | Muda status do pedido | `pedido_id`, `novo_status` |
| 9 | **validar_endereco** | Valida campos de endereço | `rua`, `numero`, `bairro`, `cidade` |
| 10 | **sugerir_complemento** | Sugere bebidas/doces | `itens_pedido` array |
| 11 | **criar_cliente** | Cria novo cliente | `nome`, `telefone`, `email`, `endereco_padrao` |

---

## 🚀 Como Configurar (4 Passos)

### PASSO 1: Importar as Tools
```
1. No N8N Dashboard:
   Menu (≡) → Import from file
   
2. Selecione: n8n-supabase-tools-sdr-agentes.json

3. Clique "Import"
```

### PASSO 2: Configurar Credenciais
```
Para CADA uma das 11 tools:

1. Clique na tool
2. Vá em: Credentials
3. Selecione sua API Supabase (a que você criou)
4. Clique ✓

⏱️ Leva ~2 minutos para todas
```

### PASSO 3: Conectar ao Agente SDR
```
1. Crie um nó de IA (Claude, GPT, etc)
2. Nomeie como: "Agente SDR"
3. Adicione o prompt do SDR (veja abaixo)
4. Conecte as 11 tools ao nó:
   
   Tool → AI Node (input "ai_tool")
```

### PASSO 4: Conectar ao Agente Wilson
```
1. Crie outro nó de IA
2. Nomeie como: "Wilson (Principal)"
3. Adicione o prompt do Wilson
4. Configure a tool "Agendamentos_SDR" que chama o Agente SDR
```

---

## 🤖 Prompt para Agente SDR

Copie e cole no seu agente SDR:

```
Você é o Agente SDR (Orquestrador de Dados) da Wilson Pizza.
Sua função: Validar, calcular e persistir dados no banco de dados.

TOOLS DISPONÍVEIS (11):
1. validar_abertura - Verificar se está aberto
2. validar_cliente - Buscar cliente por telefone
3. buscar_produto - Buscar produto no cardápio
4. processar_pedido - Criar pedido completo
5. processar_pedido_formatado - Parse de mensagem formatada
6. calcular_total - Calcular total de items
7. buscar_pedido - Buscar pedido por ID ou telefone
8. atualizar_status_pedido - Atualizar status
9. validar_endereco - Validar campos de endereço
10. sugerir_complemento - Sugerir bebidas/doces
11. criar_cliente - Criar novo cliente

REGRAS:
1. SEMPRE retorne JSON estruturado: {status, dados}
2. NUNCA invente dados - use apenas banco de dados
3. SEMPRE normalize telefone como: +55XXXXXXXXXXX
4. SEMPRE calcule preço usando tamanho como chave JSON
5. SEMPRE valide dados obrigatórios antes de processar
6. NUNCA converse - apenas dados estruturados
7. SER RÁPIDO - respostas em <1s

FLUXO:
- Wilson coleta dados
- Você valida e processa com as tools
- Wilson confirma ao cliente

EXEMPLO:
Wilson: "Processe este pedido: cliente_nome=João, telefone=+5587999999999, itens=1x Calabresa G, total=46"

Você:
1. validar_cliente(telefone: "+5587999999999")
2. buscar_produto(nome_item: "Calabresa")
3. processar_pedido(dados_completos)
4. Retorna: {status: "success", numero_pedido: "12345"}
```

---

## 🤖 Prompt para Agente Wilson

Copie e cole no seu agente Wilson (está no arquivo que você passou):

```
Você é Don Wilson, agente de atendimento principal.

TOOL: Agendamentos_SDR

QUANDO USAR:
- Verificar se cliente existe
- Consultar cardápio/preços
- Calcular total
- Processar pedido
- Buscar status de pedido

FORMATO:
Sem texto adicional, somente:
<tool>
operacao_sdr: parametro1=valor1, parametro2=valor2
</tool>

EXEMPLOS:
<tool>
validar_cliente: telefone=+5587999999999
</tool>

<tool>
buscar_produto: nome_item=Calabresa
</tool>

<tool>
processar_pedido: cliente_nome=João, cliente_telefone=+5587999999999, forma_pagamento=PIX, total=46, itens=[{nome: Calabresa, tamanho: G, qtd: 1}]
</tool>
```

---

## 🧪 Teste Agora

### Teste 1: Cliente Valida
```
Wilson pergunta: "Qual seu telefone?"
Cliente: "11987654321"
Wilson chama SDR: validar_cliente(telefone: +5587999999999)
SDR retorna: {status: "found", dados: {cliente_id: "...", nome: "João"}}
Wilson responde: "Ótimo João! Bem vindo de volta!"
```

### Teste 2: Consulta Cardápio
```
Cliente: "Qual a calabresa?"
Wilson chama SDR: buscar_produto(nome_item: "Calabresa")
SDR retorna: {precos: {p: 28, m: 38, g: 46, gg: 60, super: 73}}
Wilson responde: "Calabresa: P-R$28, M-R$38, G-R$46, GG-R$60, Super-R$73"
```

### Teste 3: Cria Pedido
```
Cliente: "1 Calabresa G, PIX"
Wilson coleta tudo + chama SDR: processar_pedido(...)
SDR retorna: {status: "success", numero_pedido: "12345"}
Wilson responde: "✅ Pedido #12345 confirmado!"
```

---

## ❌ Se Houver Erro

| Erro | Solução |
|------|---------|
| `invalid input syntax for type uuid` | Verifique se está passando UUIDs válidos |
| Tool não aparece | Selecione a API Supabase na tool |
| Dados retornam vazios | Verifique se os dados existem no Supabase |
| Agente não usa tool | Adicione instrução clara no prompt |

---

## 🎯 Fluxo Completo

```
Cliente: "Oi, quero pedir uma pizza"
    ↓
Wilson: "Bem vindo! Qual seu telefone?"
    ↓
Cliente: "11987654321"
    ↓
Wilson chama SDR: validar_cliente(+5587999999999)
    ↓
SDR retorna: Cliente encontrado ou novo
    ↓
Wilson: "Qual pizza?"
    ↓
Cliente: "Calabresa"
    ↓
Wilson chama SDR: buscar_produto("Calabresa")
    ↓
SDR retorna: Preços da Calabresa
    ↓
Wilson: "Qual tamanho?"
    ↓
Cliente: "Grande"
    ↓
Wilson coleta tudo...
    ↓
Wilson chama SDR: processar_pedido(...)
    ↓
SDR retorna: Pedido criado com #12345
    ↓
Wilson: "✅ Pedido #12345 confirmado!"
```

---

## 📝 Checklist

```
□ Importei o JSON com as 11 tools
□ Configurei credenciais Supabase para cada tool
□ Criei Agente SDR com os 11 operations
□ Criei Agente Wilson que chama o SDR
□ Testei validar_cliente
□ Testei buscar_produto
□ Testei processar_pedido
□ Tudo funcionando! 🎉
```

---

**Status:** ✅ PRONTO PARA USAR
**Total de Tools:** 11
**Agentes:** 2 (Wilson + SDR)
**Tempo de setup:** ~5 minutos
