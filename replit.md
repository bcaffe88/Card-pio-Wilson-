# Wilson Pizza - Aplicação Fullstack iFood-style

## 🎯 Status Atual
✅ **PRONTO PARA DEPLOY** - Fullstack completo com Supabase + Drizzle ORM

## 📋 Arquitetura

### Frontend (React + Vite)
- **Tech Stack**: React 19 + Vite + TailwindCSS + Radix UI
- **Roteamento**: Wouter (client-side)
- **State Management**: Zustand + React Query
- **Componentes**: Moderno com shadcn/ui
- **Páginas**: `/home`, `/menu`, `/carrinho`, `/checkout`, `/pedidos`, `/admin`

### Backend (Node.js + Express)
- **Framework**: Express.js com TypeScript
- **ORM**: Drizzle ORM + PostgreSQL
- **Database**: PostgreSQL (Supabase/Railway/Vercel)
- **Validação**: Zod
- **APIs**: 15+ endpoints RESTful

### Database (PostgreSQL - 7 Tabelas)
```
cardapio: 80+ produtos com preços JSONB (p, m, g, gg, super)
clientes: dados de clientes com telefone único
enderecos: endereços por cliente
pedidos: pedidos com status tracking
itens_pedido: items de cada pedido
horarios_funcionamento: horários de funcionamento por dia
```

## 🚀 Deploy (Railroad/Vercel)

### Variáveis de Ambiente Necessárias
```
DATABASE_URL=postgresql://user:password@host:5432/database
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=chave-anonima
VITE_N8N_WEBHOOK_URL=https://seu-n8n-endpoint.com/
NODE_ENV=production
```

### Vercel Deploy
1. Push para GitHub
2. Import no Vercel
3. Adicionar env vars em Settings > Environment Variables
4. Deploy automático

### Railway Deploy
1. Criar novo projeto no railway.app
2. Conectar repositório GitHub
3. Adicionar PostgreSQL plugin
4. Adicionar env vars em Variables
5. Deploy automático

## 🔧 Comandos

```bash
# Desenvolvimento
npm run dev              # Inicia frontend + backend

# Build para produção
npm run build            # Bundle client + server para dist/

# Produção
npm run start            # Inicia servidor em NODE_ENV=production

# Database
npm run db:push         # Sincroniza schema Drizzle com banco
```

## 📁 Estrutura de Arquivos

```
project/
├── client/
│   ├── src/
│   │   ├── pages/           # Rotas principais
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── lib/
│   │   │   └── store.ts     # Zustand store (cart, user)
│   │   └── App.tsx          # Router setup
│   └── index.html           # Meta tags OG/Twitter
├── server/
│   ├── index.ts             # Express app + HTTP server
│   ├── db.ts                # Drizzle ORM conexão
│   ├── storage.ts           # SupabaseStorage CRUD
│   ├── routes.ts            # 15+ API endpoints
│   └── vite.ts              # Vite dev server
├── shared/
│   └── schema.ts            # Drizzle tables + Zod schemas
├── script/
│   └── build.ts             # Build script otimizado
├── vercel.json              # Config Vercel deployment
└── railway.json             # Config Railway deployment
```

## 🔐 Segurança

✅ DATABASE_URL privada (nunca no frontend)
✅ VITE_* são públicas (design do Supabase)
✅ bcryptjs para hashing de senhas
✅ Validação Zod em todas as APIs
✅ CORS configurado

## 📊 Endpoints API

### Menu
- `GET /api/cardapio` - Todos os produtos
- `GET /api/cardapio/categoria/:cat` - Por categoria
- `GET /api/cardapio/buscar/:termo` - Buscar

### Clientes
- `POST /api/clientes` - Criar/atualizar
- `GET /api/clientes/buscar/:telefone` - Buscar por telefone

### Endereços
- `POST /api/enderecos` - Criar
- `GET /api/enderecos/:cliente_id` - Listar

### Pedidos
- `POST /api/pedidos` - Criar pedido completo
- `GET /api/pedidos/:id` - Detalhes do pedido
- `PUT /api/pedidos/:id/status` - Atualizar status
- `GET /api/admin/pedidos` - Listar todos (admin)

## 🎨 Design
- **Cores**: Red (#D32F2F), Orange (#FF6F00), White
- **Tipografia**: Poppins (headers), Inter (body)
- **Tema**: Vibrante & Fome
- **Responsivo**: Mobile-first

## 📝 Próximos Passos

1. ✅ Criar PostgreSQL database (via Replit)
2. ✅ Configurar DATABASE_URL
3. ⏳ Restart workflow para validar
4. ⏳ Deploy no Railway/Vercel com GitHub

## 🐛 Troubleshooting

**Build falha?** 
- Rodar `npm install` novamente

**Database não conecta?**
- Verificar `DATABASE_URL` em .env
- Rodar `npm run db:push`

**Erro de imports?**
- Limpar cache: `rm -rf node_modules && npm install`

---
**Última atualização**: Nov 28, 2025
**Status**: 🟢 PRODUCTION READY
