# N8N Setup Guide - Wilson Pizza API Tools

## 📋 O que foi corrigido

Seu arquivo anterior usava **Supabase Tools diretos**. Agora foi atualizado para usar **HTTP Requests** que chamam os endpoints da nossa **API Express** implementada.

### ✅ Mudanças principais:
- ❌ Removidos: Supabase Tools (conexão direta ao banco)
- ✅ Adicionados: HTTP Request nodes que chamam `/api/*` endpoints
- ✅ Adicionados: 6 novas ferramentas para melhor cobertura
- ✅ Total: **18 ferramentas** em vez de 12

---

## 🚀 Como Usar

### 1. **Importar o workflow no n8n**

```bash
# Copie o conteúdo de: n8n-workflow-tools-corrected.json
# No n8n dashboard:
# 1. Clique em "Import from file"
# 2. Selecione: n8n-workflow-tools-corrected.json
# 3. Click "Import"
```

### 2. **Configurar Variável de Ambiente**

No n8n, vá para **Settings > Variables** e adicione:

```
API_BASE_URL = http://localhost:5000   # Para desenvolvimento
API_BASE_URL = https://sua-app.railway.app  # Para produção
```

---

## 📦 Ferramentas Disponíveis (18 total)

### 👤 Clientes (4 ferramentas)
| Tool | Método | Descrição |
|------|--------|-----------|
| `BuscarCliente` | GET | Buscar cliente por telefone |
| `AdicionarCliente` | POST | Criar novo cliente |
| `AtualizarCliente` | PUT | Atualizar dados do cliente |
| - | - | - |

### 🍕 Cardápio (3 ferramentas)
| Tool | Método | Descrição |
|------|--------|-----------|
| `ConsultarCardapio` | GET | Listar todos os produtos |
| `ConsultarCardapioPorCategoria` | GET | Filtrar por categoria |
| `BuscarCardapio` | GET | Buscar por nome do produto |

### 📍 Endereços (4 ferramentas)
| Tool | Método | Descrição |
|------|--------|-----------|
| `BuscarEndereço` | GET | Listar endereços de um cliente |
| `AdicionarEndereco` | POST | Criar novo endereço |
| `AtualizarEndereco` | PUT | Editar endereço existente |
| `DeletarEndereco` | DELETE | Remover endereço |

### 📦 Pedidos (5 ferramentas)
| Tool | Método | Descrição |
|------|--------|-----------|
| `CriarPedido` | POST | Criar pedido completo com itens |
| `ConsultarPedidoDetalhes` | GET | Ver detalhes de um pedido |
| `ConsultarPedidosCliente` | GET | Listar pedidos de um cliente |
| `AtualizarPedido` | PUT | Mudar status do pedido |
| `DeletarPedido` | DELETE | Remover pedido |

### ⏰ Horários (2 ferramentas)
| Tool | Método | Descrição |
|------|--------|-----------|
| `ConsultarHorario` | GET | Ver horário de funcionamento |
| `AtualizarHorario` | PUT | Editar horário de um dia |

---

## 💡 Exemplos de Uso no Agente AI

### Exemplo 1: Buscar Cliente
```
O agente diz: "Procure o cliente com telefone 11987654321"

N8N executa:
GET http://localhost:5000/api/clientes/buscar/11987654321

Resposta:
{
  "found": true,
  "cliente": {
    "id": "uuid-123",
    "nome": "João Silva",
    "telefone": "11987654321",
    "email": "joao@email.com"
  }
}
```

### Exemplo 2: Criar Pedido
```
O agente diz: "Crie um pedido para João com pizza calabresa"

N8N executa:
POST http://localhost:5000/api/pedidos
{
  "cliente_nome": "João Silva",
  "cliente_telefone": "11987654321",
  "cliente_email": "joao@email.com",
  "itens": [
    {
      "produto_nome": "Pizza Calabresa",
      "categoria": "Pizzas",
      "tamanho": "M",
      "quantidade": 1,
      "preco_unitario": 35.90
    }
  ],
  "endereco": {
    "rua": "Rua das Flores",
    "numero": 123,
    "bairro": "Centro",
    "cidade": "São Paulo",
    "cep": "01000-000"
  },
  "forma_pagamento": "cartao",
  "observacoes": "Sem cebola"
}

Resposta:
{
  "id": "uuid-pedido-456",
  "numero_pedido": 1001,
  "cliente_id": "uuid-123",
  "status": "pending",
  "total": "35.90"
}
```

### Exemplo 3: Atualizar Status do Pedido
```
O agente diz: "Marque o pedido 1001 como em produção"

N8N executa:
PUT http://localhost:5000/api/pedidos/uuid-pedido-456/status
{
  "status": "production"
}

Resposta:
{
  "id": "uuid-pedido-456",
  "status": "production",
  "updated_at": "2025-11-28T20:00:00Z"
}
```

---

## 🔑 Parâmetros de Cada Tool

### BuscarCliente
**Parâmetros do AI:**
- `telefone` (string): Telefone do cliente

### AdicionarCliente
**Parâmetros do AI:**
- `nome` (string): Nome completo
- `telefone` (string): Telefone com DDD
- `email` (string): Email (opcional)

### AtualizarCliente
**Parâmetros do AI:**
- `cliente_id` (string): UUID do cliente
- `nome` (string): Novo nome (opcional)
- `email` (string): Novo email (opcional)
- `endereco_padrao` (string): Endereço padrão (opcional)

### CriarPedido
**Parâmetros do AI:**
- `cliente_nome` (string): Nome do cliente
- `cliente_telefone` (string): Telefone
- `cliente_email` (string): Email (opcional)
- `itens` (array): Items do pedido
  ```
  [
    {
      "produto_nome": "Pizza Calabresa",
      "categoria": "Pizzas",
      "tamanho": "M",
      "quantidade": 1,
      "preco_unitario": 35.90,
      "observacoes": "Sem cebola"
    }
  ]
  ```
- `endereco` (object): Endereço de entrega
  ```
  {
    "rua": "Rua das Flores",
    "numero": 123,
    "bairro": "Centro",
    "cidade": "São Paulo",
    "cep": "01000-000"
  }
  ```
- `forma_pagamento` (string): "pix", "cartao", "dinheiro"
- `observacoes` (string): Observações do pedido (opcional)

### AtualizarPedido
**Parâmetros do AI:**
- `pedido_id` (string): UUID do pedido
- `status` (string): Um de:
  - "pending"
  - "confirmed"
  - "production"
  - "ready"
  - "sent"
  - "delivered"
  - "cancelled"

---

## 🔐 Notas de Segurança

✅ **Seguro:**
- As ferramentas fazem requisições HTTP via n8n
- Nenhuma credencial Supabase é exposta
- API_BASE_URL fica segura em n8n Variables

⚠️ **Considerações:**
- Validação Zod no backend valida todos os dados
- N8N faz retry automático em caso de falha
- Erros HTTP são tratados e retornam mensagens legíveis

---

## 🐛 Troubleshooting

### Erro: "Connection refused"
```
❌ API não está rodando
✅ Solução: npm run dev no backend
```

### Erro: "404 Not Found"
```
❌ Endpoint não existe ou URL está incorreta
✅ Solução: Verificar API_BASE_URL em Variables
```

### Erro: "400 Bad Request"
```
❌ Parâmetros inválidos
✅ Solução: Verificar formato dos dados (telefone, email, etc)
```

### Erro: "500 Internal Server Error"
```
❌ Erro no servidor
✅ Solução: Ver logs do backend com: npm run dev
```

---

## 📊 Fluxo Completo de Pedido

```mermaid
Agente recebe: "Quero fazer um pedido"
    ↓
BuscarCliente (por telefone)
    ↓
    ├─ Encontrou? → Continua
    └─ Não? → AdicionarCliente
    ↓
ConsultarCardapio ou BuscarCardapio
    ↓
Agente calcula preços
    ↓
CriarPedido (com todos os items)
    ↓
Pedido criado! ID: xxxxx
    ↓
Agente pode então:
  - ConsultarPedidoDetalhes
  - AtualizarPedido (mudar status)
  - DeletarPedido (se necessário)
```

---

## 🚀 Deployment

### Para Railway/Vercel, use:
```
API_BASE_URL=https://seu-app-name.railway.app
```

### No n8n (self-hosted):
```
API_BASE_URL=http://seu-dominio.com:5000
```

---

**Última atualização:** Nov 28, 2025
**Versão:** 2.0 (HTTP-based)
**Status:** ✅ Production Ready
