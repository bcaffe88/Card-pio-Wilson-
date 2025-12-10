# Sistema de Autenticação de Admin

## Visão Geral

Implementado sistema de autenticação simples para proteger endpoints administrativos contra acesso não autorizado.

## Como Funciona

### Backend (Node.js/Express)

**Arquivo:** `server/auth-middleware.ts`

- Middleware `requireAdminAuth` valida token Bearer enviado no header `Authorization`
- Token é a senha de admin codificada em base64
- Senha padrão: `admin123` (definida via variável de ambiente `ADMIN_PASSWORD`)
- Pode ser customizada: `export ADMIN_PASSWORD="sua-senha-segura"`

### Frontend (React)

**Arquivos:**
- `client/src/lib/admin-auth.ts` - Funções utilitárias para gerenciamento de token
- `client/src/components/admin-login-modal.tsx` - Modal de login de admin
- `client/src/pages/admin/settings.tsx` - Integração com sistema de autenticação

**Fluxo:**
1. Ao acessar área de admin, modal de login é exibido se sem token
2. User digita senha
3. Frontend envia requisição protegida com header `Authorization: Bearer <token_em_base64>`
4. Backend valida token
5. Se válido, senha é armazenada em localStorage
6. Requisições subsequentes incluem token automaticamente

## Endpoints Protegidos

Os seguintes endpoints requerem autenticação:

1. **PUT /api/configuracoes** - Atualizar configurações do restaurante
2. **PUT /api/cardapio/:id** - Modificar produto do menu
3. **PUT /api/pedidos/:id/status** - Atualizar status de pedido
4. **GET /api/admin/pedidos** - Listar todos os pedidos com itens

## Usando a Autenticação

### No Frontend

```typescript
import { fetchWithAuth, setAdminToken, getAdminToken } from "@/lib/admin-auth";

// Fazer requisição autenticada
const response = await fetchWithAuth("/api/configuracoes", {
  method: "PUT",
  body: JSON.stringify({ nome_restaurante: "Novo Nome" })
});

// Armazenar token após login bem-sucedido
setAdminToken("sua-senha");

// Verificar se existe token
if (hasAdminToken()) {
  // Fazer requisições autenticadas
}

// Limpar token ao fazer logout
clearAdminToken();
```

### No Backend

```typescript
import { requireAdminAuth } from "./auth-middleware";

app.put("/api/protected-route", requireAdminAuth, async (req, res) => {
  // req.isAdmin = true (autenticação bem-sucedida)
  // req.adminToken = token codificado
});
```

## Configuração

### Variáveis de Ambiente

```bash
# .env ou variáveis do Railway/Vercel
ADMIN_PASSWORD=sua-senha-muito-segura
```

Se não definida, usa padrão: `admin123`

### Customizar Senha

No **Railway/Deploy:**
1. Ir para Settings → Environment Variables
2. Adicionar: `ADMIN_PASSWORD=SenhaForte123!@#`

No **Localhost:**
```bash
export ADMIN_PASSWORD=SenhaLocal123
npm run dev
```

## TODO - Implementação Futura

### Autenticação Real com JWT
Quando banco de dados for preparado:
1. Criar tabela `admin_users` com fields: id, username, password_hash, created_at
2. Usar JWT (jsonwebtoken) em lugar de base64
3. Trocar `requireAdminAuth` para verificar token JWT contra banco
4. Adicionar refresh tokens com expiração

### Segurança em Produção
- [ ] HTTPS obrigatório (já há em Railway)
- [ ] CSRF protection
- [ ] Rate limiting em endpoints de login
- [ ] Logs de acesso administrativo
- [ ] Two-factor authentication (2FA)

### Interface Melhorada
- [ ] Logout button na barra de admin
- [ ] Tela dedicada de login (em vez de modal)
- [ ] Gerenciamento de múltiplos admins
- [ ] Histórico de alterações por admin

## Notas de Segurança

⚠️ **Versão Atual:** Autenticação básica via base64
- Segura se HTTPS ativado (obrigatório em produção)
- Use senha forte no ADMIN_PASSWORD
- Não registra logs de tentativas de acesso

⚠️ **Para Produção Real:**
- Migrar para JWT com expiração
- Implementar rate limiting
- Usar hash de senha (bcrypt) se armazenar no banco
- Adicionar 2FA

## Testes

```typescript
// Test de requisição protegida
const password = "admin123";
const token = btoa(password);

fetch("/api/configuracoes", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({ nome_restaurante: "Teste" })
});

// Deve retornar 200 OK se token correto
// Deve retornar 401/403 se token inválido
```
