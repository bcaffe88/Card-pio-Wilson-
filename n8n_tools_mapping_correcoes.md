# CORREÇÕES DAS TOOLS DO N8N - Wilson Pizza

## Status Atual Análise

Seu workflow tem as tools corretas configuradas. Agora precisa sincronizar os dados e validar os filtros.

---

## TOOL 1: BuscarCliente ✅
**Tabela:** `clientes`
**Operação:** getAll (SELECT)
**Filtros Configurados:** id, nome, telefone
**Status:** ✅ Correto

**Para usar no Wilson (Agente Principal):**
```
"Busque cliente por telefone: {{ $json.telefone }}"
Vai retornar todos os campos: id, nome, telefone, email, endereco_padrao
```

---

## TOOL 2: AdicionarCliente ✅
**Tabela:** `clientes`
**Operação:** create (INSERT)
**Campos Esperados:** nome, telefone, email, endereco_padrao
**Status:** ✅ Correto

**Para usar:**
```
Input: {
  "nome": "João Silva",
  "telefone": "5587999999999",
  "email": "joao@email.com",
  "endereco_padrao": "Rua das Flores, 123"
}
Output: Cliente criado com UUID gerado
```

---

## TOOL 3: AtualizarCliente ✅
**Tabela:** `clientes`
**Operação:** update
**Filtro:** Qualquer campo (id, nome, telefone)
**Campos Atualizáveis:** nome, telefone, email, endereco_padrao
**Status:** ✅ Correto

---

## TOOL 4: BuscarEndereco ✅
**Tabela:** `enderecos`
**Operação:** getAll
**Status:** ✅ Correto (retorna todos os endereços)

**Para filtrar por cliente, use:**
```
Filter: cliente_id = {{ cliente_id }}
Retorna: rua, numero, bairro, cidade, cep, complemento
```

---

## TOOL 5: AdicionarEndereco ✅
**Tabela:** `enderecos`
**Operação:** create
**Campos Esperados:** cliente_id, rua, numero, bairro, cidade, cep, complemento
**Status:** ✅ Correto

---

## TOOL 6: AtualizarEndereco ⚠️ PRECISA AJUSTE
**PROBLEMA:** Os filtros (nome, id, telefone) estão errados.
**SOLUÇÃO:** Altere os filtros para:
- `cliente_id` = {{ cliente_id }}
- `id` = {{ endereco_id }}

**Corrija em:**
Node → Parameters → Filters → Conditions
```
[
  {
    "keyName": "cliente_id",
    "condition": "eq",
    "keyValue": "{{ cliente_id }}"
  },
  {
    "keyName": "id",
    "condition": "eq",
    "keyValue": "{{ endereco_id }}"
  }
]
```

---

## TOOL 7: ConsultarCardapio ✅
**Tabela:** `cardapio`
**Operação:** getAll
**Status:** ✅ Correto (retorna todos os produtos)

**Campos retornados:**
- id, nome_item, categoria, descricao, imagem_url, precos (JSON), disponivel

**Para filtrar (ex: apenas Salgadas disponíveis):**
```
Filters:
- categoria = "Salgadas"
- disponivel = true
```

---

## TOOL 8: CriarPedido ✅
**Tabela:** `pedidos`
**Operação:** create
**Campos Esperados:**
```
{
  "cliente_id": "uuid-xxx",
  "cliente_nome": "João Silva",
  "cliente_telefone": "5587999999999",
  "status": "pending",
  "total": 89.50,
  "endereco_entrega": "Rua das Flores, 123, Centro",
  "forma_pagamento": "pix",
  "observacoes": "Sem cebola"
}
```
**Status:** ✅ Correto

---

## TOOL 9: ConsultarPedido ⚠️ OTIMIZAR
**Tabela:** `itens_pedido`
**Problema:** Está retornando ITENS quando deveria retornar PEDIDOS também.

**SOLUÇÃO:** Crie dois queries separados:

### 9A. BuscarPedidoPorId (NOVO)
```
Tabela: pedidos
Filtro: id = {{ pedido_id }}
Retorna: Dados do pedido
```

### 9B. BuscarItensPedido (USE O ATUAL)
```
Tabela: itens_pedido
Filtro: pedido_id = {{ pedido_id }}
Retorna: Lista de itens do pedido
```

**Fluxo:**
1. Wilson pede: "Busque pedido #123"
2. SDR chama BuscarPedidoPorId(123) → Retorna dados do pedido
3. SDR chama BuscarItensPedido(123) → Retorna itens
4. SDR monta resposta estruturada

---

## TOOL 10: AtualizarPedido ✅
**Tabela:** `pedidos`
**Operação:** update
**Filtro:** id = {{ pedido_id }}
**Campos Atualizáveis:** status, endereco_entrega, observacoes, etc.
**Status:** ✅ Correto

---

## TOOL 11: removerPedido ✅
**Tabela:** `pedidos`
**Operação:** delete
**Filtro:** id = {{ pedido_id }}
**Status:** ✅ Correto (apenas muda status para 'cancelled', não deleta)

---

## TOOL 12: ConsultarHorario ⚠️ PRECISA AJUSTE
**PROBLEMA:** Filtros errados (nome, telefone, id)
**SOLUÇÃO:** Altere para:
```
Filtro: dia_semana = {{ dia_semana }}

Retorna: abertura, fechamento, aberto (boolean)
```

**Exemplo de uso:**
```
Wilson: "Estamos abertos?"
SDR: ConsultarHorario(dia_semana = "Segunda")
Retorna: { abertura: "10:00", fechamento: "23:00", aberto: true }
```

---

## RESUMO DE MUDANÇAS NECESSÁRIAS

### No n8n Workflow (Acesse: https://n8n-docker-production-6703.up.railway.app/workflow/H5VKBLg9Ne0rGXhe)

1. **AtualizarEndereco (Node ID: 5207db30-d18d-47f4-a3ce-b5389bedc51a)**
   - Trocar filtros: cliente_id, id

2. **ConsultarHorario (Node ID: c4ac2524-460d-4ca8-bb6f-60a508574aef)**
   - Trocar filtros: dia_semana
   - Remover nome, telefone, id

3. **(NOVO) BuscarPedidoPorId**
   - Tabela: pedidos
   - Filtro: id
   - Operação: getAll

4. **Renovar Connection Supabase**
   - Validar que a credencial "pizzaria" está ativa
   - Rodar Query de População (veja arquivo `supabase_complete_schema.sql`)

---

## COMO POPULAR O BANCO

1. **Acesse seu Supabase Dashboard**
2. **SQL Editor → Crie nova Query**
3. **Cole o conteúdo de:** `supabase_complete_schema.sql`
4. **Execute (Cmd+Enter)**
5. **Valide:** Vá em cada tabela (clientes, cardapio, horarios_funcionamento, etc) e confirme os dados

---

## FLUXO FINAL (APÓS CORRIGIR)

```
Cliente no WhatsApp
↓
Envia mensagem (formatada do App)
↓
Wilson (Agente Principal) recebe
↓
Wilson chama: "SDR, processar pedido formatado"
↓
SDR executa:
  1. BuscarCliente(telefone)
  2. Se novo → AdicionarCliente
  3. CriarPedido
  4. (Loop) Criar cada ITEM_PEDIDO
  5. Retorna: "Pedido #123 criado"
↓
Wilson responde ao cliente
```

---

## CHECKLIST FINAL

- [ ] Rodar SQL de População (supabase_complete_schema.sql)
- [ ] Corrigir AtualizarEndereco
- [ ] Corrigir ConsultarHorario
- [ ] Criar BuscarPedidoPorId (novo)
- [ ] Testar BuscarCliente com dados reais
- [ ] Testar CriarPedido com dado simulado
- [ ] Validar n8n workflow está ativo
