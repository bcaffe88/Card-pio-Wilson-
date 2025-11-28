# 🍕 Criar Tools N8N Manualmente - Copiar e Colar

## ⚡ Setup Inicial (FAÇA PRIMEIRO)

### 1. Crie uma Variável de Ambiente
```
Settings → Variables → New
Nome: API_BASE_URL
Valor: http://localhost:5000
(Ou seu domínio em produção)
```

### 2. Crie um novo Workflow
```
Dashboard → New Workflow
(Nomeie como: "Wilson Pizza - Tools")
```

---

## 🔧 CRIAR CADA TOOL (Copiar e Colar os Valores)

### ✅ Tool 1: BuscarCliente
```
Click: + Add Tool Node
Type: HTTP Request

CONFIGURE:
- URL: {{ $env.API_BASE_URL }}/api/clientes/buscar/{{ $fromAI('telefone', '', 'string') }}
- Method: GET
- Authentication: None
- Send Query: OFF
- Send Body: OFF
- Response Format: JSON

EM TOOLS MENU:
- Tool Name: BuscarCliente
- Description: Search for a client by phone number
```

---

### ✅ Tool 2: AdicionarCliente
```
Click: + Add Tool Node
Type: HTTP Request

CONFIGURE:
- URL: {{ $env.API_BASE_URL }}/api/clientes
- Method: POST
- Authentication: None
- Send Query: OFF
- Send Body: ON

BODY PARAMETERS (Add 3):
1. nome = {{ $fromAI('nome', '', 'string') }}
2. telefone = {{ $fromAI('telefone', '', 'string') }}
3. email = {{ $fromAI('email', '', 'string') }}

Response Format: JSON

EM TOOLS MENU:
- Tool Name: AdicionarCliente
- Description: Create a new client in the database
```

---

### ✅ Tool 3: AtualizarCliente
```
Click: + Add Tool Node
Type: HTTP Request

CONFIGURE:
- URL: {{ $env.API_BASE_URL }}/api/clientes/{{ $fromAI('cliente_id', '', 'string') }}
- Method: PUT
- Authentication: None
- Send Query: OFF
- Send Body: ON

BODY PARAMETERS (Add 3):
1. nome = {{ $fromAI('nome', '', 'string') }}
2. email = {{ $fromAI('email', '', 'string') }}
3. endereco_padrao = {{ $fromAI('endereco_padrao', '', 'string') }}

Response Format: JSON

EM TOOLS MENU:
- Tool Name: AtualizarCliente
- Description: Update client information
```

---

### ✅ Tool 4: ConsultarCardapio
```
Click: + Add Tool Node
Type: HTTP Request

CONFIGURE:
- URL: {{ $env.API_BASE_URL }}/api/cardapio
- Method: GET
- Authentication: None
- Send Query: OFF
- Send Body: OFF
- Response Format: JSON

EM TOOLS MENU:
- Tool Name: ConsultarCardapio
- Description: Get all menu items
```

---

### ✅ Tool 5: ConsultarCardapioPorCategoria
```
Click: + Add Tool Node
Type: HTTP Request

CONFIGURE:
- URL: {{ $env.API_BASE_URL }}/api/cardapio/categoria/{{ $fromAI('categoria', '', 'string') }}
- Method: GET
- Authentication: None
- Send Query: OFF
- Send Body: OFF
- Response Format: JSON

EM TOOLS MENU:
- Tool Name: ConsultarCardapioPorCategoria
- Description: Search menu items by category
```

---

### ✅ Tool 6: BuscarCardapio
```
Click: + Add Tool Node
Type: HTTP Request

CONFIGURE:
- URL: {{ $env.API_BASE_URL }}/api/cardapio/buscar/{{ $fromAI('termo', '', 'string') }}
- Method: GET
- Authentication: None
- Send Query: OFF
- Send Body: OFF
- Response Format: JSON

EM TOOLS MENU:
- Tool Name: BuscarCardapio
- Description: Search menu items by name
```

---

### ✅ Tool 7: BuscarEndereço
```
Click: + Add Tool Node
Type: HTTP Request

CONFIGURE:
- URL: {{ $env.API_BASE_URL }}/api/enderecos/{{ $fromAI('cliente_id', '', 'string') }}
- Method: GET
- Authentication: None
- Send Query: OFF
- Send Body: OFF
- Response Format: JSON

EM TOOLS MENU:
- Tool Name: BuscarEndereço
- Description: Get all addresses for a client
```

---

### ✅ Tool 8: AdicionarEndereco
```
Click: + Add Tool Node
Type: HTTP Request

CONFIGURE:
- URL: {{ $env.API_BASE_URL }}/api/enderecos
- Method: POST
- Authentication: None
- Send Query: OFF
- Send Body: ON

BODY PARAMETERS (Add 7):
1. cliente_id = {{ $fromAI('cliente_id', '', 'string') }}
2. rua = {{ $fromAI('rua', '', 'string') }}
3. numero = {{ $fromAI('numero', '', 'number') }}
4. bairro = {{ $fromAI('bairro', '', 'string') }}
5. cidade = {{ $fromAI('cidade', '', 'string') }}
6. cep = {{ $fromAI('cep', '', 'string') }}
7. complemento = {{ $fromAI('complemento', '', 'string') }}

Response Format: JSON

EM TOOLS MENU:
- Tool Name: AdicionarEndereco
- Description: Create a new address for a client
```

---

### ✅ Tool 9: AtualizarEndereco
```
Click: + Add Tool Node
Type: HTTP Request

CONFIGURE:
- URL: {{ $env.API_BASE_URL }}/api/enderecos/{{ $fromAI('endereco_id', '', 'string') }}
- Method: PUT
- Authentication: None
- Send Query: OFF
- Send Body: ON

BODY PARAMETERS (Add 6):
1. rua = {{ $fromAI('rua', '', 'string') }}
2. numero = {{ $fromAI('numero', '', 'number') }}
3. bairro = {{ $fromAI('bairro', '', 'string') }}
4. cidade = {{ $fromAI('cidade', '', 'string') }}
5. cep = {{ $fromAI('cep', '', 'string') }}
6. complemento = {{ $fromAI('complemento', '', 'string') }}

Response Format: JSON

EM TOOLS MENU:
- Tool Name: AtualizarEndereco
- Description: Update an existing address
```

---

### ✅ Tool 10: DeletarEndereco
```
Click: + Add Tool Node
Type: HTTP Request

CONFIGURE:
- URL: {{ $env.API_BASE_URL }}/api/enderecos/{{ $fromAI('endereco_id', '', 'string') }}
- Method: DELETE
- Authentication: None
- Send Query: OFF
- Send Body: OFF
- Response Format: JSON

EM TOOLS MENU:
- Tool Name: DeletarEndereco
- Description: Delete an address
```

---

### ✅ Tool 11: CriarPedido
```
Click: + Add Tool Node
Type: HTTP Request

CONFIGURE:
- URL: {{ $env.API_BASE_URL }}/api/pedidos
- Method: POST
- Authentication: None
- Send Query: OFF
- Send Body: ON

BODY PARAMETERS (Add 7):
1. cliente_nome = {{ $fromAI('cliente_nome', '', 'string') }}
2. cliente_telefone = {{ $fromAI('cliente_telefone', '', 'string') }}
3. cliente_email = {{ $fromAI('cliente_email', '', 'string') }}
4. itens = {{ $fromAI('itens', '', 'object') }}
5. endereco = {{ $fromAI('endereco', '', 'object') }}
6. forma_pagamento = {{ $fromAI('forma_pagamento', '', 'string') }}
7. observacoes = {{ $fromAI('observacoes', '', 'string') }}

Response Format: JSON

EM TOOLS MENU:
- Tool Name: CriarPedido
- Description: Create a complete order with items
```

---

### ✅ Tool 12: ConsultarPedidoDetalhes
```
Click: + Add Tool Node
Type: HTTP Request

CONFIGURE:
- URL: {{ $env.API_BASE_URL }}/api/pedidos/{{ $fromAI('pedido_id', '', 'string') }}
- Method: GET
- Authentication: None
- Send Query: OFF
- Send Body: OFF
- Response Format: JSON

EM TOOLS MENU:
- Tool Name: ConsultarPedidoDetalhes
- Description: Get order details including all items
```

---

### ✅ Tool 13: ConsultarPedidosCliente
```
Click: + Add Tool Node
Type: HTTP Request

CONFIGURE:
- URL: {{ $env.API_BASE_URL }}/api/pedidos/cliente/{{ $fromAI('cliente_id', '', 'string') }}
- Method: GET
- Authentication: None
- Send Query: OFF
- Send Body: OFF
- Response Format: JSON

EM TOOLS MENU:
- Tool Name: ConsultarPedidosCliente
- Description: Get all orders for a client
```

---

### ✅ Tool 14: AtualizarPedido
```
Click: + Add Tool Node
Type: HTTP Request

CONFIGURE:
- URL: {{ $env.API_BASE_URL }}/api/pedidos/{{ $fromAI('pedido_id', '', 'string') }}/status
- Method: PUT
- Authentication: None
- Send Query: OFF
- Send Body: ON

BODY PARAMETERS (Add 1):
1. status = {{ $fromAI('status', '', 'string') }}

Response Format: JSON

EM TOOLS MENU:
- Tool Name: AtualizarPedido
- Description: Update order status
```

---

### ✅ Tool 15: DeletarPedido
```
Click: + Add Tool Node
Type: HTTP Request

CONFIGURE:
- URL: {{ $env.API_BASE_URL }}/api/pedidos/{{ $fromAI('pedido_id', '', 'string') }}
- Method: DELETE
- Authentication: None
- Send Query: OFF
- Send Body: OFF
- Response Format: JSON

EM TOOLS MENU:
- Tool Name: DeletarPedido
- Description: Delete an order
```

---

### ✅ Tool 16: ConsultarPedidosAdmin
```
Click: + Add Tool Node
Type: HTTP Request

CONFIGURE:
- URL: {{ $env.API_BASE_URL }}/api/admin/pedidos
- Method: GET
- Authentication: None
- Send Query: OFF
- Send Body: OFF
- Response Format: JSON

EM TOOLS MENU:
- Tool Name: ConsultarPedidosAdmin
- Description: Get all orders (admin panel)
```

---

### ✅ Tool 17: ConsultarHorario
```
Click: + Add Tool Node
Type: HTTP Request

CONFIGURE:
- URL: {{ $env.API_BASE_URL }}/api/horarios-funcionamento
- Method: GET
- Authentication: None
- Send Query: OFF
- Send Body: OFF
- Response Format: JSON

EM TOOLS MENU:
- Tool Name: ConsultarHorario
- Description: Get restaurant operating hours
```

---

### ✅ Tool 18: AtualizarHorario
```
Click: + Add Tool Node
Type: HTTP Request

CONFIGURE:
- URL: {{ $env.API_BASE_URL }}/api/horarios-funcionamento/{{ $fromAI('horario_id', '', 'string') }}
- Method: PUT
- Authentication: None
- Send Query: OFF
- Send Body: ON

BODY PARAMETERS (Add 3):
1. abertura = {{ $fromAI('abertura', '', 'string') }}
2. fechamento = {{ $fromAI('fechamento', '', 'string') }}
3. aberto = {{ $fromAI('aberto', '', 'boolean') }}

Response Format: JSON

EM TOOLS MENU:
- Tool Name: AtualizarHorario
- Description: Update restaurant operating hours
```

---

## ✅ PRONTO!

Você tem 18 tools prontas para usar no seu agente de IA!

### Próximo passo:
1. Conecte essas tools a um nó AI
2. Configura o prompt do seu agente para usar as tools
3. Teste criando um pedido!

---

## 🐛 Se algo não funcionar:

1. **Erro "Connection refused"** → Backend não está rodando (`npm run dev`)
2. **Erro "404 Not Found"** → `API_BASE_URL` está errada
3. **Erro "400 Bad Request"** → Dados enviados estão inválidos

Consulte `n8n-api-payloads.json` para ver exemplos de dados corretos!
