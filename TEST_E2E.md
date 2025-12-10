# Testes E2E - Wilson Pizzas

## Setup Local

### Backend
```bash
cd Card-pio-Wilson-
npm install
npm run dev
# Deve estar rodando em http://localhost:5000 ou 8080
```

### Frontend
```bash
npm run dev
# Deve estar rodando em http://localhost:5173
```

## Testes a Executar

### 1. ✅ Upload de Imagem & PUT /api/cardapio
- [ ] Ir para Admin Panel
- [ ] Editar produto "Carne de Sol"
- [ ] Fazer upload de nova imagem
- [ ] Clicar "Salvar"
- [ ] Verificar:
  - [ ] Imagem atualizada no banco
  - [ ] Imagem refletida no frontend home page

**Esperado:** 200 OK, imagem substituída

---

### 2. ✅ POST /api/pedidos (Criar Pedido)
- [ ] Ir para home page
- [ ] Adicionar pizza ao carrinho
- [ ] Abrir sacola
- [ ] Clicar "Finalizar Pedido"
- [ ] Selecionar ENTREGA ou RETIRADA
- [ ] Se ENTREGA: informar endereço
- [ ] Se RETIRADA: verificar se mostra `Av. Antônio Pedro da Silva, 555, Centro, Ouricuri-PE`
- [ ] Selecionar pagamento (PIX)
- [ ] Clicar "Enviar Pedido"
- [ ] Verificar:
  - [ ] WhatsApp abre AUTOMATICAMENTE (não página intermediária)
  - [ ] Mensagem formatada corretamente
  - [ ] Admin Panel > Orders mostra novo pedido em 2 segundos

**Esperado:** 
- POST /api/pedidos retorna 201
- window.open() abre WhatsApp direto
- Pedido na fila do admin

---

### 3. ✅ Endereço de Retirada (GET /api/configuracoes)
- [ ] Verificar se GET /api/configuracoes retorna:
  ```json
  [{
    "id": 1,
    "nome_restaurante": "Wilson Pizza",
    "endereco": "Av. Antônio Pedro da Silva, 555, Centro, Ouricuri-PE",
    "telefone": "5587999480699"
  }]
  ```
- [ ] No checkout, selecionar RETIRADA
- [ ] Endereço deve aparecer como: "Av. Antônio Pedro da Silva, 555, Centro, Ouriculi-PE"

**Esperado:** Endereço carregado do banco, não mockado

---

### 4. ✅ WhatsApp Abre Direto
- [ ] Após clicar "Enviar Pedido", WhatsApp DEVE abrir automaticamente
- [ ] NÃO DEVE ir para página intermediária
- [ ] Mensagem pré-preenchida no WhatsApp

**Esperado:** `window.open('https://wa.me/...')` executado imediatamente

---

## Checklist de Correções

### Backend (server/routes.ts)
- [x] Importar `pedidos`, `itens_pedido` na linha 6
- [x] Importar `desc` de drizzle-orm
- [x] Adicionar GET /api/pedidos (retorna todos com itens)
- [x] POST /api/pedidos salva corretamente

### Frontend (client/)
- [x] admin-store.ts: adicionar `loadOrdersFromAPI()` 
- [x] admin/orders.tsx: chamar `loadOrdersFromAPI()` no useEffect
- [x] cart-drawer.tsx: carregar endereço de GET /api/configuracoes
- [x] handleCheckout: window.open() direto (já estava)

### Database
- [ ] Verificar se tabelas existem:
  - `pedidos`
  - `itens_pedido`
  - `configuracoes` (com endereço preenchido)

---

## Debug

### Se POST /api/pedidos falhar:
```bash
curl -X POST http://localhost:8080/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_nome": "Test",
    "cliente_telefone": "5587999480699",
    "cliente_email": "",
    "itens": [{"produto_nome": "Pizza", "categoria": "Salgadas", "tamanho": "M", "sabores": "Calabresa", "quantidade": 1, "preco_unitario": 40}],
    "endereco": {"rua": "Rua Test", "numero": "123", "completo": "Rua Test, 123"},
    "forma_pagamento": "PIX"
  }'
```

### Se GET /api/pedidos não traz dados:
```bash
curl http://localhost:8080/api/pedidos
```

### Se GET /api/configuracoes não carrega:
```bash
curl http://localhost:8080/api/configuracoes
```

---

## Status

- [ ] Todos testes passaram
- [ ] Pronto para Railway

