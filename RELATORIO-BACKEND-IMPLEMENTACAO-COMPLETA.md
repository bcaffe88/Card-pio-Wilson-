# 📋 RELATÓRIO COMPLETO - BACKEND IMPLEMENTAÇÃO
**Data**: 28/11/2025 | **Status**: CRÍTICO - IMPLEMENTAÇÃO NECESSÁRIA | **Prioridade**: ALTA

---

## 🔴 DIAGNÓSTICO DO PROJETO

### ✅ O QUE JÁ FUNCIONA (FRONTEND)
- ✅ Interface React completa com Tailwind + ShadCN
- ✅ Carrinho de compras (Zustand store)
- ✅ Pizza Builder (customização de sabores)
- ✅ Massas Builder (molho + ingredientes)
- ✅ Admin Dashboard (pedidos, menu, settings)
- ✅ Menu estático com 80+ produtos
- ✅ Routing (Wouter)
- ✅ Componentes UI (todos os 40+ componentes)

### ❌ O QUE FALTA (BACKEND)
- ❌ **ZERO APIs implementadas** (routes.ts está vazio)
- ❌ **ZERO tabelas no Supabase** (schema.ts desatualizado)
- ❌ **ZERO integração com Supabase** (sem clientes conectados)
- ❌ **ZERO persistência de dados** (tudo em memória)
- ❌ **ZERO n8n workflows** (agentes não operacionais)
- ❌ **ZERO autenticação** (admin login não funciona)

---

## 📊 ESTRUTURA ESPERADA vs REALIDADE

### **FRONTEND** (100% PRONTO)
```
client/src/
├── pages/home.tsx ✅ Cardápio funciona
├── pages/admin/ ✅ Dashboard pronto
├── components/ ✅ Todos os builders prontos
├── lib/store.ts ✅ Zustand store para cart
└── data/menu.ts ✅ 80+ produtos estáticos
```

### **BACKEND** (0% IMPLEMENTADO)
```
server/
├── index.ts ✅ Express setup OK
├── routes.ts ❌ VAZIO (precisa de 15+ endpoints)
├── storage.ts ❌ Só tem User (precisa de Pizza, Order, Client, Address)
└── vite.ts ✅ Config OK
```

### **BANCO DE DADOS** (ESQUEMA FALTA)
```
Supabase Tables:
- cardapio ✅ Criada + 80 produtos inseridos
- clientes ❌ PRECISA CRIAR
- enderecos ❌ PRECISA CRIAR
- pedidos ❌ PRECISA CRIAR
- itens_pedido ❌ PRECISA CRIAR
- horarios_funcionamento ❌ PRECISA CRIAR
```

---

## 🚀 ENDPOINTS QUE PRECISAM SER IMPLEMENTADOS

### **1️⃣ CARDÁPIO (GET)**
```
GET /api/cardapio                    → Lista todos os produtos
GET /api/cardapio/:categoria         → Lista por categoria (Salgadas, Doces, etc)
GET /api/cardapio/buscar/:nome       → Busca por nome (ILIKE)
GET /api/cardapio/:id                → Detalhes do produto
```

**Resposta esperada**:
```json
{
  "id": "uuid",
  "nome_item": "Calabresa",
  "categoria": "Salgadas",
  "descricao": "Molho...",
  "precos": {"p": 28, "m": 38, "g": 46, "gg": 60, "super": 73},
  "imagem_url": null,
  "disponivel": true
}
```

---

### **2️⃣ CLIENTES (POST/GET/PUT)**
```
POST /api/clientes                   → Criar novo cliente
GET /api/clientes/buscar/:telefone   → Buscar por telefone
GET /api/clientes/:id                → Detalhes cliente
PUT /api/clientes/:id                → Atualizar cliente
```

**POST /api/clientes** (Body):
```json
{
  "nome": "João Silva",
  "telefone": "+5587999999999",
  "email": "joao@email.com",
  "endereco_padrao": "Rua das Flores, 123"
}
```

**Resposta**:
```json
{
  "id": "uuid-cli-123",
  "nome": "João Silva",
  "telefone": "+5587999999999",
  "email": "joao@email.com",
  "created_at": "2025-11-28T19:00:00Z"
}
```

---

### **3️⃣ ENDEREÇOS (POST/GET/PUT/DELETE)**
```
POST /api/enderecos                  → Criar endereço
GET /api/enderecos/:cliente_id       → Lista endereços do cliente
GET /api/enderecos/:id               → Detalhes endereço
PUT /api/enderecos/:id               → Atualizar endereço
DELETE /api/enderecos/:id            → Deletar endereço
```

**POST /api/enderecos** (Body):
```json
{
  "cliente_id": "uuid-cli-123",
  "rua": "Rua das Flores",
  "numero": 123,
  "bairro": "Centro",
  "cidade": "Caucaia",
  "cep": "61600-000",
  "complemento": "Apt 501"
}
```

---

### **4️⃣ PEDIDOS (POST/GET/PUT)**
```
POST /api/pedidos                    → Criar novo pedido
GET /api/pedidos/:cliente_id         → Pedidos do cliente
GET /api/pedidos/:id                 → Detalhes do pedido
PUT /api/pedidos/:id                 → Atualizar status/dados
GET /api/pedidos/admin/todos         → Admin: todos os pedidos
```

**POST /api/pedidos** (Body completo):
```json
{
  "cliente_id": "uuid-cli-123",
  "cliente_nome": "João Silva",
  "cliente_telefone": "+5587999999999",
  "cliente_email": "joao@email.com",
  "itens": [
    {
      "produto_id": "uuid-prod-1",
      "produto_nome": "Calabresa",
      "categoria": "Salgadas",
      "tamanho": "G",
      "sabores": ["Calabresa", "Frango"],
      "quantidade": 1,
      "preco_unitario": 46.00,
      "observacoes": "Sem cebola"
    }
  ],
  "endereco": {
    "rua": "Rua das Flores",
    "numero": 123,
    "bairro": "Centro",
    "cidade": "Caucaia",
    "cep": "61600-000",
    "complemento": "Apt 501"
  },
  "forma_pagamento": "PIX",
  "observacoes": "Deixar na portaria"
}
```

**Resposta**:
```json
{
  "id": "uuid-ord-123",
  "numero_pedido": "12345",
  "cliente_id": "uuid-cli-123",
  "cliente_nome": "João Silva",
  "cliente_telefone": "+5587999999999",
  "status": "pending",
  "total": 58.00,
  "itens_count": 2,
  "forma_pagamento": "PIX",
  "created_at": "2025-11-28T19:30:00Z"
}
```

---

### **5️⃣ ITENS DO PEDIDO (GET/DELETE)**
```
GET /api/pedidos/:pedido_id/itens    → Lista itens do pedido
GET /api/itens-pedido/:id            → Detalhes item
DELETE /api/itens-pedido/:id         → Remover item
```

---

### **6️⃣ STATUS DO PEDIDO (PUT)**
```
PUT /api/pedidos/:id/status          → Atualizar status
```

**Body**:
```json
{
  "status": "production"
}
```

**Status válidos**: `pending` → `confirmed` → `production` → `ready` → `sent` → `delivered` | `cancelled`

---

### **7️⃣ HORÁRIOS (GET/PUT)**
```
GET /api/horarios-funcionamento      → Listar horários
PUT /api/horarios-funcionamento/:id  → Atualizar horário
```

---

### **8️⃣ ADMIN - AUTENTICAÇÃO (POST/GET)**
```
POST /api/admin/login                → Login admin
GET /api/admin/session               → Verificar sessão
POST /api/admin/logout               → Logout
```

**POST /api/admin/login** (Body):
```json
{
  "username": "admin",
  "password": "#123caffe@"
}
```

---

## 📊 TABELAS DO SUPABASE (SQL CRIAR)

### **Tabela: clientes**
```sql
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT UNIQUE NOT NULL,
  email TEXT,
  endereco_padrao TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_clientes_telefone ON clientes(telefone);
```

---

### **Tabela: enderecos**
```sql
CREATE TABLE enderecos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  rua TEXT NOT NULL,
  numero INT NOT NULL,
  bairro TEXT NOT NULL,
  cidade TEXT NOT NULL,
  cep TEXT,
  complemento TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_enderecos_cliente_id ON enderecos(cliente_id);
```

---

### **Tabela: pedidos**
```sql
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero_pedido SERIAL UNIQUE,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE SET NULL,
  cliente_nome TEXT NOT NULL,
  cliente_telefone TEXT NOT NULL,
  cliente_email TEXT,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','confirmed','production','ready','sent','delivered','cancelled')),
  total DECIMAL(10,2) NOT NULL,
  endereco_entrega JSONB NOT NULL,
  forma_pagamento TEXT NOT NULL,
  observacoes TEXT,
  viewed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_created_at ON pedidos(created_at DESC);
```

---

### **Tabela: itens_pedido**
```sql
CREATE TABLE itens_pedido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id UUID REFERENCES cardapio(id),
  produto_nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  tamanho TEXT,
  sabores JSONB,
  quantidade INT DEFAULT 1,
  preco_unitario DECIMAL(10,2) NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_itens_pedido_pedido_id ON itens_pedido(pedido_id);
```

---

### **Tabela: horarios_funcionamento**
```sql
CREATE TABLE horarios_funcionamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dia_semana TEXT NOT NULL UNIQUE CHECK(dia_semana IN ('Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo')),
  abertura TIME NOT NULL,
  fechamento TIME NOT NULL,
  aberto BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Dados iniciais
INSERT INTO horarios_funcionamento (dia_semana, abertura, fechamento, aberto) VALUES
('Segunda', '18:00', '00:00', true),
('Terça', '18:00', '00:00', true),
('Quarta', '18:00', '00:00', true),
('Quinta', '18:00', '00:00', true),
('Sexta', '18:00', '00:00', true),
('Sábado', '18:00', '00:00', true),
('Domingo', '18:00', '00:00', true);
```

---

### **Tabela: admin_users** (para autenticação)
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Admin padrão (senha hash de "#123caffe@")
-- Use bcrypt ou argon2 em produção!
INSERT INTO admin_users (username, password_hash) VALUES
('admin', '$2b$10$YourHashedPasswordHere');
```

---

## 🔧 MUDANÇAS NECESSÁRIAS NO CÓDIGO

### **1. shared/schema.ts** (REESCREVER)
```typescript
// Remover tabela 'users' antiga
// Adicionar todas as novas tabelas com Drizzle ORM

import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, integer, boolean, time, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Tabelas: clientes, enderecos, pedidos, itens_pedido, horarios_funcionamento, admin_users
// Ver arquivo completo no fim deste relatório
```

---

### **2. server/storage.ts** (ESTENDER INTERFACE)**
```typescript
export interface IStorage {
  // CLIENTES
  getCliente(id: string): Promise<Cliente | undefined>;
  getClienteByTelefone(telefone: string): Promise<Cliente | undefined>;
  createCliente(cliente: InsertCliente): Promise<Cliente>;
  updateCliente(id: string, cliente: Partial<InsertCliente>): Promise<Cliente>;

  // ENDEREÇOS
  getEndereco(id: string): Promise<Endereco | undefined>;
  getEnderecosByCliente(cliente_id: string): Promise<Endereco[]>;
  createEndereco(endereco: InsertEndereco): Promise<Endereco>;
  updateEndereco(id: string, endereco: Partial<InsertEndereco>): Promise<Endereco>;
  deleteEndereco(id: string): Promise<boolean>;

  // PEDIDOS
  getPedido(id: string): Promise<Pedido | undefined>;
  getPedidosByCliente(cliente_id: string): Promise<Pedido[]>;
  getAllPedidos(): Promise<Pedido[]>;
  createPedido(pedido: InsertPedido): Promise<Pedido>;
  updatePedidoStatus(id: string, status: OrderStatus): Promise<Pedido>;

  // ITENS PEDIDO
  getItensPedido(pedido_id: string): Promise<ItemPedido[]>;
  createItemPedido(item: InsertItemPedido): Promise<ItemPedido>;

  // CARDÁPIO
  getCardapio(id: string): Promise<Cardapio | undefined>;
  getCardapioByCategoria(categoria: string): Promise<Cardapio[]>;
  getAllCardapio(): Promise<Cardapio[]>;
  searchCardapio(termo: string): Promise<Cardapio[]>;

  // HORÁRIOS
  getHorarios(): Promise<HorarioFuncionamento[]>;
  updateHorario(id: string, horario: Partial<InsertHorario>): Promise<HorarioFuncionamento>;
  
  // ADMIN
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  validateAdminPassword(username: string, password: string): Promise<boolean>;
}
```

---

### **3. server/routes.ts** (IMPLEMENTAR 15+ ENDPOINTS)**
```typescript
export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  
  // CARDÁPIO
  app.get('/api/cardapio', (req, res) => { /* ... */ });
  app.get('/api/cardapio/:categoria', (req, res) => { /* ... */ });
  app.get('/api/cardapio/buscar/:termo', (req, res) => { /* ... */ });
  
  // CLIENTES
  app.post('/api/clientes', (req, res) => { /* ... */ });
  app.get('/api/clientes/buscar/:telefone', (req, res) => { /* ... */ });
  app.get('/api/clientes/:id', (req, res) => { /* ... */ });
  app.put('/api/clientes/:id', (req, res) => { /* ... */ });
  
  // ENDEREÇOS
  app.post('/api/enderecos', (req, res) => { /* ... */ });
  app.get('/api/enderecos/:cliente_id', (req, res) => { /* ... */ });
  app.put('/api/enderecos/:id', (req, res) => { /* ... */ });
  app.delete('/api/enderecos/:id', (req, res) => { /* ... */ });
  
  // PEDIDOS
  app.post('/api/pedidos', (req, res) => { /* Validar + criar */ });
  app.get('/api/pedidos/:id', (req, res) => { /* ... */ });
  app.get('/api/pedidos/cliente/:cliente_id', (req, res) => { /* ... */ });
  app.put('/api/pedidos/:id/status', (req, res) => { /* ... */ });
  app.get('/api/admin/pedidos/todos', authenticate, (req, res) => { /* ... */ });
  
  // ADMIN
  app.post('/api/admin/login', (req, res) => { /* ... */ });
  app.get('/api/admin/session', authenticate, (req, res) => { /* ... */ });
  app.post('/api/admin/logout', (req, res) => { /* ... */ });
  
  return httpServer;
}
```

---

## 🔌 INTEGRAÇÃO SUPABASE

### **Passo 1: Conectar ao Supabase**
```typescript
// server/supabase.ts (novo arquivo)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### **Passo 2: Vars de Ambiente**
```bash
SUPABASE_URL=https://aspbntijurqpeskempue.supabase.co
SUPABASE_KEY=seu_supabase_key_aqui
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/postgres
```

### **Passo 3: Usar com Drizzle ORM**
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client);
```

---

## 📱 FLUXO n8n (COM AGENTES)

### **Workflow: Pedido Manual → SDR → Supabase**
```
1. Wilson coleta dados manualmente
   ↓
2. Chama /api/pedidos (POST) com dados estruturados
   ↓
3. Backend chama n8n webhook
   ↓
4. n8n dispara Agente SDR (processar_pedido)
   ↓
5. SDR retorna JSON: {"status": "success", "dados": {...}}
   ↓
6. Backend salva em pedidos + itens_pedido
   ↓
7. Envia confirmação ao cliente via WhatsApp
```

### **Webhook n8n**
```
URL: https://seu-n8n.com/webhook/processar-pedido
Método: POST
Headers: { "Authorization": "Bearer token" }
Body: { "cliente": {...}, "itens": [...], "total": 58.00 }
```

---

## ✅ CHECKLIST IMPLEMENTAÇÃO

### **Fase 1: Banco de Dados** (Priority: CRÍTICA)
- [ ] Criar tabela `clientes` no Supabase
- [ ] Criar tabela `enderecos` no Supabase
- [ ] Criar tabela `pedidos` no Supabase
- [ ] Criar tabela `itens_pedido` no Supabase
- [ ] Criar tabela `horarios_funcionamento` no Supabase + dados
- [ ] Criar tabela `admin_users` no Supabase
- [ ] Inserir dados padrão em `horarios_funcionamento`
- [ ] Verificar `cardapio` (já criada e populada com 80 produtos)

### **Fase 2: Backend Schemas** (Priority: ALTA)
- [ ] Reescrever `shared/schema.ts` com todas as tabelas Drizzle
- [ ] Criar tipos TypeScript para cada tabela
- [ ] Criar validações Zod

### **Fase 3: Storage Layer** (Priority: ALTA)
- [ ] Estender `IStorage` interface com todos os métodos
- [ ] Implementar `SupabaseStorage` class (estender MemStorage)
- [ ] Conectar ao Supabase com JWT
- [ ] Testar CRUD para todas as tabelas

### **Fase 4: Rotas API** (Priority: ALTA)
- [ ] Implementar 15+ endpoints em `server/routes.ts`
- [ ] Adicionar validação com Zod
- [ ] Adicionar tratamento de erros
- [ ] Adicionar logs estruturados

### **Fase 5: Autenticação Admin** (Priority: MÉDIA)
- [ ] Implementar `/api/admin/login`
- [ ] Adicionar middleware authenticate
- [ ] Implementar sessions com express-session
- [ ] Proteger rotas admin

### **Fase 6: n8n Integration** (Priority: MÉDIA)
- [ ] Criar webhooks em n8n para SDR
- [ ] Integrar agentes (processamento de pedidos)
- [ ] Sincronizar status pedidos
- [ ] Webhooks para WhatsApp

### **Fase 7: Frontend Integration** (Priority: MÉDIA)
- [ ] Conectar home.tsx aos endpoints
- [ ] Conectar cart ao /api/pedidos
- [ ] Conectar admin/orders ao /api/admin/pedidos
- [ ] Conectar admin/menu ao /api/cardapio

---

## 📝 RESUMO EXECUTIVO

| Componente | Status | Ação |
|------------|--------|------|
| Frontend UI | ✅ 100% | Nenhuma (pronto) |
| Backend API | ❌ 0% | **IMPLEMENTAR 15+ endpoints** |
| Banco Dados | 🟡 50% | **Criar 6 tabelas faltantes** |
| Autenticação | ❌ 0% | **Implementar com bcrypt** |
| n8n Agentes | ❌ 0% | **Criar workflows + webhooks** |
| Integração | ❌ 0% | **Conectar frontend ↔ backend** |

---

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

1. **Hoje**: Executar SQL de criação das 6 tabelas no Supabase
2. **Amanhã**: Implementar `shared/schema.ts` com Drizzle
3. **Amanhã**: Implementar storage layer com Supabase
4. **Após-amanhã**: Implementar 15+ endpoints em routes.ts
5. **Após-amanhã**: Testar integração frontend ↔ backend

---

## 📞 CONTATO & DÚVIDAS

- Frontend está **100% pronto** para consumir APIs
- Backend precisa de **implementação urgente**
- Agentes n8n precisam ser **sincronizados com n8n**
- Supabase **já tem cardápio com 80 produtos**

**Status**: BLOQUEADO por falta de backend → Desbloquear implementando APIs conforme este relatório

---

## 📎 ARQUIVOS DE REFERÊNCIA

- `AGENTE-SDR-ADAPTADO.md` - Prompt do SDR (já pronto)
- `SUPABASE-INSERCAO-FINAL.sql` - SQL para popular cardápio (já executado)
- `client/src/pages/home.tsx` - Frontend esperando APIs
- `client/src/pages/admin/orders.tsx` - Admin dashboard esperando APIs

**RELATORIO FINALIZADO EM**: 28/11/2025 às 19:45
**RESPONSÁVEL**: Backend Team
**PRIORIDADE**: 🔴 CRÍTICA
