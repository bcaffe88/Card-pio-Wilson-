# 🚀 Tabela Rápida - N8N Tools Wilson Pizza

## Setup Rápido (Faça isso PRIMEIRO)
```
1. Settings → Variables → Adicione:
   Nome: API_BASE_URL
   Valor: http://localhost:5000

2. Workflow novo
3. Copie cada tool abaixo
```

---

## 📋 Todas as 18 Tools em Uma Tabela

| # | Nome | Método | URL | Body? |
|---|------|--------|-----|-------|
| 1 | **BuscarCliente** | GET | `/api/clientes/buscar/{{ $fromAI('telefone', '', 'string') }}` | ❌ |
| 2 | **AdicionarCliente** | POST | `/api/clientes` | ✅ nome, telefone, email |
| 3 | **AtualizarCliente** | PUT | `/api/clientes/{{ $fromAI('cliente_id', '', 'string') }}` | ✅ nome, email, endereco_padrao |
| 4 | **ConsultarCardapio** | GET | `/api/cardapio` | ❌ |
| 5 | **ConsultarCardapioPorCategoria** | GET | `/api/cardapio/categoria/{{ $fromAI('categoria', '', 'string') }}` | ❌ |
| 6 | **BuscarCardapio** | GET | `/api/cardapio/buscar/{{ $fromAI('termo', '', 'string') }}` | ❌ |
| 7 | **BuscarEndereço** | GET | `/api/enderecos/{{ $fromAI('cliente_id', '', 'string') }}` | ❌ |
| 8 | **AdicionarEndereco** | POST | `/api/enderecos` | ✅ cliente_id, rua, numero, bairro, cidade, cep, complemento |
| 9 | **AtualizarEndereco** | PUT | `/api/enderecos/{{ $fromAI('endereco_id', '', 'string') }}` | ✅ rua, numero, bairro, cidade, cep, complemento |
| 10 | **DeletarEndereco** | DELETE | `/api/enderecos/{{ $fromAI('endereco_id', '', 'string') }}` | ❌ |
| 11 | **CriarPedido** | POST | `/api/pedidos` | ✅ cliente_nome, cliente_telefone, cliente_email, itens, endereco, forma_pagamento, observacoes |
| 12 | **ConsultarPedidoDetalhes** | GET | `/api/pedidos/{{ $fromAI('pedido_id', '', 'string') }}` | ❌ |
| 13 | **ConsultarPedidosCliente** | GET | `/api/pedidos/cliente/{{ $fromAI('cliente_id', '', 'string') }}` | ❌ |
| 14 | **AtualizarPedido** | PUT | `/api/pedidos/{{ $fromAI('pedido_id', '', 'string') }}/status` | ✅ status |
| 15 | **DeletarPedido** | DELETE | `/api/pedidos/{{ $fromAI('pedido_id', '', 'string') }}` | ❌ |
| 16 | **ConsultarPedidosAdmin** | GET | `/api/admin/pedidos` | ❌ |
| 17 | **ConsultarHorario** | GET | `/api/horarios-funcionamento` | ❌ |
| 18 | **AtualizarHorario** | PUT | `/api/horarios-funcionamento/{{ $fromAI('horario_id', '', 'string') }}` | ✅ abertura, fechamento, aberto |

---

## 🔧 Como Criar Cada Tool (3 clicks)

### Passo 1: Adicione HTTP Request
```
Canvas → + button → HTTP Request
```

### Passo 2: Configure URL e Método
```
URL: {{ $env.API_BASE_URL }}<COPIE_DA_TABELA_ACIMA>
Method: GET/POST/PUT/DELETE (conforme tabela)
```

### Passo 3: Se Body = ✅
```
Send Body: ON
Add cada Body Parameter (clique "Add Parameter" x vezes)
```

---

## 📝 Exemplo Prático: Tool BuscarCliente

### No Canvas:
```
1. + Add HTTP Request
2. Configure:
   - URL: {{ $env.API_BASE_URL }}/api/clientes/buscar/{{ $fromAI('telefone', '', 'string') }}
   - Method: GET
   - Send Body: OFF
   - Response Format: JSON
3. Clique 3 pontinhos → "Make this a Tool"
   - Tool Name: BuscarCliente
   - Description: Search client by phone
4. Save
```

---

## 🎯 Exemplo Prático: Tool AdicionarCliente (COM BODY)

### No Canvas:
```
1. + Add HTTP Request
2. Configure:
   - URL: {{ $env.API_BASE_URL }}/api/clientes
   - Method: POST
   - Send Body: ON
   - Response Format: JSON

3. Body Parameters (clique Add 3x):
   
   Param 1:
   - Name: nome
   - Value: {{ $fromAI('nome', '', 'string') }}
   
   Param 2:
   - Name: telefone
   - Value: {{ $fromAI('telefone', '', 'string') }}
   
   Param 3:
   - Name: email
   - Value: {{ $fromAI('email', '', 'string') }}

4. Clique 3 pontinhos → "Make this a Tool"
   - Tool Name: AdicionarCliente
   - Description: Create new client
5. Save
```

---

## ⚡ Resumo dos Grupos

### Clientes (4 tools)
- BuscarCliente
- AdicionarCliente
- AtualizarCliente
- (DeletearCliente - não implementado)

### Cardápio (3 tools)
- ConsultarCardapio
- ConsultarCardapioPorCategoria
- BuscarCardapio

### Endereços (4 tools)
- BuscarEndereço
- AdicionarEndereco
- AtualizarEndereco
- DeletarEndereco

### Pedidos (6 tools)
- CriarPedido
- ConsultarPedidoDetalhes
- ConsultarPedidosCliente
- AtualizarPedido
- DeletarPedido
- ConsultarPedidosAdmin

### Horários (2 tools)
- ConsultarHorario
- AtualizarHorario

---

## 🔗 Como Testar

Depois de criar as tools:
1. Crie um nó AI (Claude, GPT, etc)
2. Conecte as tools ao AI
3. Faça uma pergunta:
   ```
   "Criar um cliente chamado João com telefone 11987654321"
   ```
4. O agente deve usar a tool **AdicionarCliente** ✅

---

## ❌ Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `Connection refused` | Backend offline | `npm run dev` |
| `404 Not Found` | URL errada | Verificar `API_BASE_URL` |
| `400 Bad Request` | Params inválidos | Ver exemplos em `n8n-api-payloads.json` |
| Tool não aparece | Não clicou "Make this a Tool" | Clique nos 3 pontinhos e selecione |

---

## 📞 Precisa de Ajuda?

- **Setup**: Ver `N8N-CRIAR-TOOLS-MANUAL.md`
- **Valores**: Ver `COPIAR-COLA-TOOLS.txt`
- **Exemplos**: Ver `n8n-api-payloads.json`

---

**Status:** ✅ Pronto para usar
**Total de Tools:** 18
**Tempo para criar:** ~5 minutos
