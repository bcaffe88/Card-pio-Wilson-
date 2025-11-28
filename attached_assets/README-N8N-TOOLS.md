# 🍕 N8N Tools - Wilson Pizza (Versão 2.0)

## 📦 Arquivos Inclusos

```
├── n8n-workflow-tools-corrected.json   ← Arquivo principal para importar
├── n8n-setup-guide.md                   ← Documentação completa
├── n8n-api-payloads.json               ← Exemplos de requisições
├── export-n8n-tools.sh                  ← Script de exportação
└── README-N8N-TOOLS.md                  ← Este arquivo
```

---

## 🚀 Quick Start (30 segundos)

### 1️⃣ Importar no N8N
```bash
# No dashboard n8n:
Menu (≡) → Import from file → Selecione: n8n-workflow-tools-corrected.json
```

### 2️⃣ Configurar API URL
```
Settings → Variables
Nome: API_BASE_URL
Valor: http://localhost:5000  (dev) ou https://seu-app.railway.app (prod)
```

### 3️⃣ Pronto! 
As 18 ferramentas estão disponíveis para seus agentes de IA.

---

## 📊 O que Mudou?

### ❌ Antes (v1)
- 12 Supabase Tools diretos
- Conexão direta ao banco
- Limitado ao que Supabase oferecia

### ✅ Depois (v2)
- **18 HTTP Request Tools** que chamam a **API Express**
- Flexível e escalável
- Suporta **lógica de negócio complexa** no backend

---

## 🔧 As 18 Ferramentas

### Grupo 1: CLIENTES (4 ferramentas)
```
BuscarCliente           → GET  /api/clientes/buscar/:telefone
AdicionarCliente        → POST /api/clientes
AtualizarCliente        → PUT  /api/clientes/:id
(DeletearCliente)       → (não implementado)
```

### Grupo 2: CARDÁPIO (3 ferramentas)
```
ConsultarCardapio       → GET  /api/cardapio
ConsultarCardapioPorCategoria → GET /api/cardapio/categoria/:cat
BuscarCardapio          → GET  /api/cardapio/buscar/:termo
```

### Grupo 3: ENDEREÇOS (4 ferramentas)
```
BuscarEndereço          → GET  /api/enderecos/:cliente_id
AdicionarEndereco       → POST /api/enderecos
AtualizarEndereco       → PUT  /api/enderecos/:id
DeletarEndereco         → DELETE /api/enderecos/:id
```

### Grupo 4: PEDIDOS (5 ferramentas)
```
CriarPedido             → POST /api/pedidos
ConsultarPedidoDetalhes → GET  /api/pedidos/:id
ConsultarPedidosCliente → GET  /api/pedidos/cliente/:cliente_id
AtualizarPedido         → PUT  /api/pedidos/:id/status
DeletarPedido           → DELETE /api/pedidos/:id
(+ ConsultarPedidosAdmin → GET /api/admin/pedidos)
```

### Grupo 5: HORÁRIOS (2 ferramentas)
```
ConsultarHorario        → GET  /api/horarios-funcionamento
AtualizarHorario        → PUT  /api/horarios-funcionamento/:id
```

---

## 📋 Casos de Uso Típicos

### 1. Cliente Novo Faz Pedido
```
Agente: "Olá, tudo bem?"
↓
BuscarCliente (por telefone) → Não existe?
↓
AdicionarCliente → Criado ✓
↓
ConsultarCardapio → Lista produtos
↓
AdicionarEndereco → Salva endereço
↓
CriarPedido → Pedido criado! 🎉
```

### 2. Admin Acompanha Pedidos
```
Agente: "Quais são os pedidos em produção?"
↓
ConsultarPedidosAdmin → [lista todos]
↓
AtualizarPedido → Status: "ready"
```

### 3. Cliente Consulta Pedido
```
Agente: "Qual é o status do meu pedido?"
↓
BuscarCliente → ID do cliente
↓
ConsultarPedidosCliente → [lista pedidos]
↓
ConsultarPedidoDetalhes → Mostra detalhes completos
```

---

## 🔐 Segurança

✅ **O que está seguro:**
- `DATABASE_URL` fica no backend, nunca expostos
- `API_BASE_URL` fica em n8n Variables
- Validação Zod protege todos os endpoints
- N8N não expõe credenciais Supabase

⚠️ **Boas práticas:**
- Mantenha `API_BASE_URL` em Variables, nunca hardcode
- Use HTTPS em produção
- Valide dados antes de enviar para a API

---

## 🐛 Troubleshooting

| Erro | Causa | Solução |
|------|-------|---------|
| `Connection refused` | API offline | Rodar `npm run dev` |
| `404 Not Found` | URL errada | Verificar `API_BASE_URL` |
| `400 Bad Request` | Dados inválidos | Ver formato em `n8n-api-payloads.json` |
| `500 Server Error` | Erro no backend | Verificar logs do servidor |

---

## 📚 Documentação Completa

Para mais detalhes, consulte:
- **Setup**: `n8n-setup-guide.md`
- **Payloads**: `n8n-api-payloads.json`
- **API Backend**: Veja `server/routes.ts` no repositório

---

## 💡 Dicas de Uso com Agentes AI

### ✅ Bom - Agente pensa logicamente
```
Agente: "O cliente 11987654321 tem endereço salvo? 
Se não, preciso perguntar o endereço antes de criar o pedido."
```

### ❌ Ruim - Agente tenta forçar
```
Agente: "Vou criar o pedido mesmo sem endereço"
→ API retorna erro 400
```

### ✅ Bom - Agente trata erros
```
Agente: "Se a busca do cliente falhar, crio um novo cliente"
```

---

## 🚀 Deploy Production

Quando fazer deploy no **Railway/Vercel**:

1. Atualize `API_BASE_URL` no n8n:
```
API_BASE_URL = https://seu-app-name.railway.app
```

2. Certifique-se que o backend está rodando:
```bash
npm run build  # Build para produção
npm run start  # Inicia servidor
```

3. Teste um pedido via n8n para confirmar

---

## 📞 Suporte

Se tiver problemas:

1. Verifique se o backend está rodando: `http://localhost:5000/api/cardapio`
2. Verifique o `API_BASE_URL` em n8n Variables
3. Consulte `n8n-setup-guide.md`
4. Verifique os logs do n8n e do backend

---

## 🎯 Próximas Melhorias

- [ ] Adicionar autenticação de API key
- [ ] Adicionar rate limiting
- [ ] Adicionar webhooks de notificação
- [ ] Adicionar integração com WhatsApp
- [ ] Adicionar integração com pagamentos

---

**Versão:** 2.0 (HTTP-based)
**Status:** ✅ Production Ready
**Última atualização:** Nov 28, 2025
