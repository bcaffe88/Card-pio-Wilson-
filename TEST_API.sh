#!/bin/bash

# ============================================
# TESTES E2E - WILSON PIZZAS API
# ============================================
# Executar: bash TEST_API.sh

BASE_URL="http://localhost:8080"

echo "🧪 INICIANDO TESTES E2E..."
echo ""

# ============================================
# 1. Teste GET /api/configuracoes
# ============================================
echo "📍 Teste 1: GET /api/configuracoes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "$BASE_URL/api/configuracoes" | jq .
echo ""
echo ""

# ============================================
# 2. Teste POST /api/pedidos
# ============================================
echo "📦 Teste 2: POST /api/pedidos (Criar pedido)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

PEDIDO_DATA='{
  "cliente_nome": "João Silva",
  "cliente_telefone": "5587999999999",
  "cliente_email": "joao@test.com",
  "itens": [
    {
      "produto_nome": "Pizza Calabresa",
      "categoria": "Salgadas",
      "tamanho": "M",
      "sabores": "Calabresa",
      "quantidade": 1,
      "preco_unitario": 40.00,
      "observacoes": "Sem cebola"
    }
  ],
  "endereco": {
    "rua": "Rua Teste",
    "numero": "123",
    "completo": "Rua Teste, 123, Centro"
  },
  "forma_pagamento": "PIX",
  "observacoes": "Pedido de teste"
}'

RESPONSE=$(curl -s -X POST "$BASE_URL/api/pedidos" \
  -H "Content-Type: application/json" \
  -d "$PEDIDO_DATA")

echo "$RESPONSE" | jq .
PEDIDO_ID=$(echo "$RESPONSE" | jq -r '.id')
echo "Pedido criado com ID: $PEDIDO_ID"
echo ""
echo ""

# ============================================
# 3. Teste GET /api/pedidos (buscar todos)
# ============================================
echo "📊 Teste 3: GET /api/pedidos (Listar todos)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "$BASE_URL/api/pedidos" | jq '.[0:2]'  # Mostrar apenas 2 primeiros
echo ""
echo ""

# ============================================
# 4. Teste GET /api/pedidos/:id
# ============================================
if [ ! -z "$PEDIDO_ID" ] && [ "$PEDIDO_ID" != "null" ]; then
  echo "🔍 Teste 4: GET /api/pedidos/:id (Buscar específico)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  curl -s "$BASE_URL/api/pedidos/$PEDIDO_ID" | jq .
  echo ""
  echo ""
fi

# ============================================
# 5. Teste GET /api/cardapio
# ============================================
echo "🍕 Teste 5: GET /api/cardapio (listar produtos)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s "$BASE_URL/api/cardapio" | jq '.[0:2]'  # Mostrar apenas 2 primeiros
echo ""
echo ""

echo "✅ TESTES COMPLETOS!"
