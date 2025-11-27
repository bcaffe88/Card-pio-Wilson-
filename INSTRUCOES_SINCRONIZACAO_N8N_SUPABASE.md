# 🚀 GUIA COMPLETO: SINCRONIZAÇÃO N8N + SUPABASE + WILSON PIZZA

## PASSO 1: POPULAR O BANCO SUPABASE

### 1.1 Acesse seu Supabase
- URL: `https://app.supabase.com`
- Projeto: Procure por "pizzaria" na lista

### 1.2 Execute o SQL de População
1. Clique em **SQL Editor** (lado esquerdo)
2. Clique em **+ New Query**
3. Cole todo o conteúdo do arquivo: **`supabase_complete_schema.sql`**
4. Clique em **▶ Run** (ou Cmd+Enter)
5. ✅ Confirme que as 7 tabelas foram criadas:
   - clientes
   - enderecos
   - cardapio (45+ pizzas inseridas)
   - horarios_funcionamento (7 dias)
   - pedidos
   - itens_pedido

### 1.3 Validar Dados
1. Clique em **Table Editor** (lado esquerdo)
2. Abra a tabela `cardapio` → Confirme 45+ pizzas
3. Abra a tabela `horarios_funcionamento` → Confirme 7 dias

---

## PASSO 2: AJUSTAR AS TOOLS NO N8N

### 2.1 Acessar seu Workflow
- URL: `https://n8n-docker-production-6703.up.railway.app/workflow/H5VKBLg9Ne0rGXhe`

### 2.2 Corrigir TOOL: AtualizarEndereco
**Node ID:** `5207db30-d18d-47f4-a3ce-b5389bedc51a`

```
ANTES (❌ Errado):
- Filters: nome, id, telefone

DEPOIS (✅ Correto):
- Filtro 1: cliente_id = {{ $fromAI('cliente_id', '', 'string') }}
- Filtro 2: id = {{ $fromAI('endereco_id', '', 'string') }}
```

**Como fazer:**
1. Clique no node "AtualizarEndereco"
2. Painel direito → Parameters → Filters → Conditions
3. Clique no ❌ ao lado de "nome" → REMOVA
4. Clique no ❌ ao lado de "telefone" → REMOVA
5. Clique em "+ Add Condition"
   - Field: `cliente_id`
   - Condition: `eq`
   - Value: `{{ $fromAI('cliente_id', '', 'string') }}`
6. Clique em "+ Add Condition"
   - Field: `id`
   - Condition: `eq`
   - Value: `{{ $fromAI('endereco_id', '', 'string') }}`

---

### 2.3 Corrigir TOOL: ConsultarHorario
**Node ID:** `c4ac2524-460d-4ca8-bb6f-60a508574aef`

```
ANTES (❌ Errado):
- Filters: id, nome, telefone (totalmente errados para horários!)

DEPOIS (✅ Correto):
- Apenas: dia_semana = {{ $fromAI('dia_semana', '', 'string') }}
```

**Como fazer:**
1. Clique no node "ConsultarHorario"
2. Painel direito → Parameters
   - **Mude a tabela de:** "horarios disponiveis" → **PARA:** "horarios_funcionamento"
3. Parameters → Filters → Conditions
4. REMOVA os 3 filtros: id, nome, telefone (clique no ❌)
5. Clique em "+ Add Condition"
   - Field: `dia_semana`
   - Condition: `eq`
   - Value: `{{ $fromAI('dia_semana', '', 'string') }}`

---

### 2.4 CRIAR NOVA TOOL: BuscarPedidoPorId
Você já tem `ConsultarPedido` (que busca itens). Crie uma segunda para buscar o PEDIDO em si.

**Não é obrigatório agora, mas recomendado para melhor estrutura.**

---

## PASSO 3: TESTAR A CONEXÃO

### 3.1 Verificar Credencial Supabase no n8n
1. Clique em **Credentials** (canto inferior esquerdo do editor)
2. Procure por **"pizzaria"** (credential do Supabase)
3. Se não existir, crie:
   - Nome: `pizzaria`
   - Host: `sua-project.supabase.co`
   - User: `postgres`
   - Password: (sua senha Supabase)
   - Database: `postgres`
   - Schema: `public`

### 3.2 Testar uma Tool
1. Clique no node "ConsultarCardapio"
2. Clique em ⚡ **Test** (canto inferior direito)
3. Você deve ver um JSON com as 45+ pizzas

---

## PASSO 4: ATUALIZAR OS PROMPTS DO AGENTE

Os prompts já estão em: `/prompts/novo_agente_principal_wilson.txt` e `/prompts/novo_agente_sdr_wilson.txt`

**Para aplicar no n8n:**
1. Node "Agendamentos_SDR" → Parameters → System Message
2. Copie o conteúdo completo de: `novo_agente_sdr_wilson.txt`
3. Cole no campo "System Message"

---

## PASSO 5: FLUXO COMPLETO DE TESTE

### Cliente envia mensagem:
```
*PEDIDO FOODFLOW DELIVERY*
--------------------------------
*ITENS:*
- 2x Pizza G Calabresa
- 1x Pizza M Frango c/ Catupiry

*TOTAL: R$ 102.00*
--------------------------------
*PAGAMENTO:* PIX
*ENTREGA:* Rua das Flores, 123, Centro
*OBS:* Sem cebola
```

### O que acontece:
1. ✅ Mensagem chega no webhook do n8n
2. ✅ Agente Wilson (Principal) valida e chama SDR
3. ✅ SDR executa:
   - BuscarCliente(telefone) 
   - AdicionarCliente (se novo)
   - CriarPedido
   - CriarItemPedido (2x)
4. ✅ Wilson responde:
   ```
   Recebi seu pedido! 📝
   🍕 2x Pizza G Calabresa
   🍕 1x Pizza M Frango c/ Catupiry
   💰 Total: R$ 102.00
   📍 Entrega: Rua das Flores, 123, Centro
   ✅ Pedido #123 confirmado!
   ```
5. ✅ Pedido salvo no Supabase com status "pending"

---

## CHECKLIST FINAL

- [ ] Supabase: SQL executado com sucesso
- [ ] Supabase: Tabela `cardapio` tem 45+ pizzas
- [ ] Supabase: Tabela `horarios_funcionamento` tem 7 dias
- [ ] N8N: AtualizarEndereco corrigido
- [ ] N8N: ConsultarHorario corrigido (tabela + filtro)
- [ ] N8N: Credencial "pizzaria" funciona
- [ ] N8N: Teste ConsultarCardapio retorna dados
- [ ] Prompts: Atualizados no System Message do agente

---

## DÚVIDAS?

Se algo não funcionar:
1. Verifique se a conexão Supabase está ativa
2. Confirme que o projeto está em "Development" (não "Paused")
3. Teste cada node individualmente (clique ⚡ Test)
4. Cheque os Logs do n8n (parte inferior)

**Sucesso! 🍕🚀**
