# 🍕 Como Importar as Tools Supabase

## ⚡ Passo 1: Baixe o Arquivo
```
Arquivo: n8n-supabase-tools-completas.json
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

### Para cada tool, faça:
```
1. Clique na tool
2. Vá em: Credentials
3. Clique no campo "supabase" 
4. Selecione sua API: "pizzaria" (ou a que você criou)
5. Done!
```

## ✅ Tools que Vão Aparecer

| # | Tool | Operação |
|----|------|----------|
| 1 | BuscarCliente | Buscar por ID, nome ou telefone |
| 2 | AdicionarCliente | Criar novo cliente |
| 3 | AtualizarCliente | Editar dados do cliente |
| 4 | ConsultarCardapio | Listar todos os produtos |
| 5 | BuscarEndereço | Listar endereços de um cliente |
| 6 | AdicionarEndereco | Criar novo endereço |
| 7 | AtualizarEndereco | Editar endereço existente |
| 8 | ConsultarItensPedido | Listar items dos pedidos |
| 9 | CriarPedido | Criar novo pedido |
| 10 | AtualizarPedido | Atualizar status/dados do pedido |
| 11 | DeletarPedido | Remover pedido |
| 12 | ConsultarHorario | Ver horários de funcionamento |

## 🔗 Como Conectar ao Agente

1. Crie um nó de IA (Claude, GPT, etc)
2. Conecte as tools ao nó:
   ```
   Tool Node → AI Node (input "ai_tool")
   ```
3. Pronto! Agora o agente pode usar as tools

## 🧪 Teste Rápido

Faça uma pergunta no agente:
```
"Crie um cliente chamado João com telefone 11987654321"
```

O agente deve usar a tool **AdicionarCliente** automaticamente ✅

## ❓ Se Não Funcionar

| Problema | Solução |
|----------|---------|
| ⚠️ Credentials não encontradas | Clique na tool e selecione sua API Supabase |
| ⚠️ Tools não aparecem | Tente importar novamente |
| ⚠️ Erro ao executar | Verifique se seus dados no Supabase existem |

---

**Pronto! Agora é só copiar e colar no seu n8n!** 🎉
