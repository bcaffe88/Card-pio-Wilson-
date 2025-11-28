# 🎯 GUIA PARA IMPLEMENTAÇÃO DE BACKEND - PRÓXIMO AGENTE

## 📋 Visão Geral
O frontend está **100% preparado** para receber 3 funcionalidades críticas do backend. Este documento detalha o que precisa ser implementado.

---

## ✅ 1️⃣ EDIÇÃO DE PRODUTOS (CRUD)

### Frontend Ready ✅
- ✅ Modal de edição criado: `client/src/components/product-edit-modal.tsx`
- ✅ Página de menu atualizada: `client/src/pages/admin/menu.tsx`
- ✅ Componente pronto para receber dados via API

### APIs a Implementar

#### 1. **GET /api/products** (Lista todos os produtos)
```json
Response (200):
{
  "success": true,
  "data": [
    {
      "id": "pizza-calabresa",
      "name": "Pizza Calabresa",
      "description": "Calabresa, queijo e tomate",
      "category": "Salgadas",
      "prices": { "P": 28.00, "M": 39.00, "G": 47.00, "Super": 60.00 },
      "image": "https://supabase-url/pizza-calabresa.jpg",
      "active": true
    }
  ]
}
```

#### 2. **GET /api/products/:id** (Obter produto específico)
```json
Response (200):
{ "success": true, "data": { /* produto */ } }
```

#### 3. **PUT /api/products/:id** (Atualizar produto)
```json
Body:
{
  "name": "Pizza Calabresa Premium",
  "description": "Nova descrição",
  "category": "Salgadas",
  "prices": { "P": 30.00, "M": 42.00, "G": 50.00, "Super": 65.00 },
  "image": "https://novo-url.jpg",
  "active": true
}

Response (200):
{ "success": true, "message": "Produto atualizado", "data": { /* produto atualizado */ } }
```

#### 4. **DELETE /api/products/:id** (Deletar produto)
```json
Response (200):
{ "success": true, "message": "Produto deletado" }
```

#### 5. **POST /api/upload** (Upload de imagem para Supabase Storage)
```
Method: POST
Content-Type: multipart/form-data
Body: { "file": <arquivo> }

Response (200):
{
  "success": true,
  "imageUrl": "https://supabase-url/bucket/image-name.jpg"
}
```

### Banco de Dados
**Tabela: `cardapio`**
```sql
CREATE TABLE cardapio (
  id UUID PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT NOT NULL,
  preco_p DECIMAL(10,2),
  preco_m DECIMAL(10,2),
  preco_g DECIMAL(10,2),
  preco_super DECIMAL(10,2),
  imagem_url TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Notas Importantes
- Sincronizar com Supabase usando `@neondatabase/serverless` ou Supabase SDK
- Upload de imagens via **Supabase Storage** (bucket: `products`)
- Validar preços antes de salvar (não negativo)
- Quando product é deletado, refletir no frontend automaticamente via WebSocket (opcional, mas recomendado)

---

## ✅ 2️⃣ NOTIFICAÇÃO DE NOVOS PEDIDOS

### Frontend Ready ✅
- ✅ Badge de notificação criado: `client/src/pages/admin/orders.tsx`
- ✅ Campo `viewed` adicionado ao Order interface: `client/src/lib/admin-store.ts`
- ✅ Método `markOrderAsViewed()` pronto
- ✅ Função `getUnviewedOrdersCount()` pronta
- ✅ Animação de notificação já implementada

### APIs a Implementar

#### 1. **PUT /api/orders/:id/mark-viewed** (Marcar pedido como visualizado)
```json
Body:
{
  "viewed": true
}

Response (200):
{ "success": true, "message": "Pedido marcado como visualizado" }
```

#### 2. **GET /api/orders/unviewed-count** (Contar pedidos não visualizados)
```json
Response (200):
{
  "success": true,
  "unviewedCount": 3
}
```

### Banco de Dados
**Tabela: `pedidos`** (adicionar campo se não existir)
```sql
ALTER TABLE pedidos ADD COLUMN viewed BOOLEAN DEFAULT false;
```

### WebSocket (Recomendado para tempo real)
- Emitir evento `new-order` quando novo pedido chegar
- Emitir evento `order-updated` quando status muda
- Frontend automaticamente marca como visualizado quando acessa a página

---

## ✅ 3️⃣ SINCRONIZAÇÃO DE CONFIGURAÇÕES

### Frontend Ready ✅
- ✅ Formulário de configurações criado: `client/src/pages/admin/settings.tsx`
- ✅ Store preparado: `client/src/lib/admin-store.ts`
- ✅ Campos disponíveis: nome, endereço, telefone, logo

### APIs a Implementar

#### 1. **GET /api/settings** (Carregar configurações)
```json
Response (200):
{
  "success": true,
  "data": {
    "restaurantName": "Wilson Pizzas",
    "restaurantAddress": "Rua Principal, 123",
    "restaurantPhone": "5587999480699",
    "restaurantLogo": "https://supabase-url/logo.png",
    "supabaseUrl": "...",
    "supabaseKey": "...",
    "webhookUrl": "...",
    "whatsappNotification": true
  }
}
```

#### 2. **PUT /api/settings** (Atualizar configurações)
```json
Body:
{
  "restaurantName": "Wilson Pizzas Forno a Lenha",
  "restaurantAddress": "Rua Principal, 123, Centro",
  "restaurantPhone": "5587999480699",
  "restaurantLogo": "https://url-da-logo.jpg",
  "webhookUrl": "https://...",
  "whatsappNotification": true
}

Response (200):
{ "success": true, "message": "Configurações atualizadas" }
```

### Banco de Dados
**Tabela: `configuracoes`**
```sql
CREATE TABLE configuracoes (
  id UUID PRIMARY KEY,
  chave TEXT UNIQUE NOT NULL,
  valor TEXT,
  updated_at TIMESTAMP
);

INSERT INTO configuracoes VALUES
('logo', 'https://...'),
('nome_restaurante', 'Wilson Pizzas'),
('endereco', 'Rua Principal, 123'),
('telefone_whatsapp', '5587999480699');
```

### Integração no Menu
Quando as configurações forem atualizadas:
1. Logo deve refletir no header do site
2. Nome do restaurante deve aparecer no título
3. Telefone WhatsApp deve ser usado nos botões de contato

---

## 🔧 ESTRUTURA DO BACKEND

### Rotas Resumidas
```
GET    /api/products              → Listar todos
GET    /api/products/:id          → Obter um
PUT    /api/products/:id          → Atualizar
DELETE /api/products/:id          → Deletar
POST   /api/upload                → Upload imagem

GET    /api/settings              → Carregar configurações
PUT    /api/settings              → Atualizar configurações

PUT    /api/orders/:id/mark-viewed → Marcar pedido visualizado
GET    /api/orders/unviewed-count → Contar não visualizados
```

### Autenticação
- Verificar token JWT no header `Authorization`
- Apenas admin pode acessar `/api/admin/*` rotas
- Credenciais atuais: `admin` / `#123caffe@`

### Tratamento de Erros
```json
{
  "success": false,
  "error": "Erro descritivo",
  "statusCode": 400
}
```

---

## 🚀 PRIORIDADE DE IMPLEMENTAÇÃO

1. **CRÍTICO (Fazer primeiro)**
   - ✅ GET /api/products
   - ✅ PUT /api/products/:id
   - ✅ DELETE /api/products/:id
   - ✅ POST /api/upload

2. **IMPORTANTE (Depois)**
   - ✅ PUT /api/orders/:id/mark-viewed
   - ✅ GET /api/orders/unviewed-count

3. **DESEJÁVEL (Após completar)**
   - ✅ GET /api/settings
   - ✅ PUT /api/settings
   - ✅ WebSocket em tempo real

---

## 💾 COMO TESTAR

### Teste local com cURL
```bash
# Listar produtos
curl http://localhost:3000/api/products

# Atualizar um produto
curl -X PUT http://localhost:3000/api/products/pizza-calabresa \
  -H "Content-Type: application/json" \
  -d '{"name":"Nova Pizza","price":45}'

# Deletar
curl -X DELETE http://localhost:3000/api/products/pizza-calabresa
```

### Frontend já está pronto para:
- Exibir dados da API
- Fazer requisições PUT/DELETE
- Renderizar respostas
- Mostrar notificações de sucesso/erro

---

## 📝 OBSERVAÇÕES FINAIS

- Frontend está 100% pronto (componentes, modal, store, endpoints)
- Variáveis de ambiente necessárias: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- Implementar validações no backend (preço mínimo, nome não vazio, etc)
- Adicionar rate limiting para uploads
- Considerar adicionar versionamento de produtos para auditoria

---

**Feito com ❤️ pelo Frontend Agent - Mockup Mode**
Data: 2025-11-28
