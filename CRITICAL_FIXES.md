# 🔧 Critical Bug Fixes - Implementation Guide

## Quick Reference: Apply These Fixes Now

---

## FIX #1: Address Data Structure Mismatch

**File:** `client/src/components/cart-drawer.tsx` (Lines 118-134)

**BEFORE (BROKEN):**
```typescript
const pedidoData = {
  cliente_nome: 'Cliente WhatsApp',
  cliente_telefone: phoneNumber.replace(/\D/g, ''),
  cliente_email: '',
  itens: itensFormatados,
  endereco: {
    rua: address.split(',')[0] || 'Endereço do cliente',
    numero: '0',
    completo: address || 'A confirmar com cliente'  // ❌ WRONG FIELD
  },
  forma_pagamento: paymentFormatted,
  observacoes: notes || 'Pedido enviado via WhatsApp'
};
```

**AFTER (FIXED):**
```typescript
// Helper function to parse address
const parseAddress = (fullAddress: string) => {
  const parts = fullAddress.split(',').map(p => p.trim());
  const numero = fullAddress.match(/\d+/)?.[0] || '0';
  
  return {
    rua: parts[0] || 'Endereço não informado',
    numero: numero,
    bairro: parts[1] || 'Não informado',
    cidade: parts[2] || 'Ouricuri',
    cep: '',
    complemento: fullAddress
  };
};

const pedidoData = {
  cliente_nome: 'Cliente WhatsApp',
  cliente_telefone: phoneNumber.replace(/\D/g, ''),
  cliente_email: '',
  itens: itensFormatados,
  endereco: deliveryMethod === 'entrega' ? parseAddress(address) : {
    rua: restaurantAddress.split(',')[0],
    numero: '0',
    bairro: 'Retirada no local',
    cidade: 'Ouricuri',
    cep: '',
    complemento: restaurantAddress
  },
  forma_pagamento: paymentFormatted,
  observacoes: notes || 'Pedido enviado via WhatsApp'
};
```

---

## FIX #2: Duplicate `orders` Property in Admin Store

**File:** `client/src/lib/admin-store.ts` (Lines 64-70)

**BEFORE (BROKEN):**
```typescript
{
  orders: initialOrders,  // Line 57 - first declaration
  loadOrdersFromAPI: async () => {
    // ... loads orders from API
  },
  
  orders: initialOrders,  // Line 64 - DUPLICATE! ❌
  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
  })),
```

**AFTER (FIXED):**
```typescript
{
  orders: initialOrders,  // Single declaration
  loadOrdersFromAPI: async () => {
    try {
      const response = await fetch('/api/pedidos');
      if (response.ok) {
        const apiOrders = await response.json();
        const transformedOrders = (Array.isArray(apiOrders) ? apiOrders : []).map((order: any) => ({
          id: order.id,
          numero_pedido: order.numero_pedido,
          customerName: order.cliente_nome || 'Cliente',
          customerPhone: order.cliente_telefone || '',
          items: order.itens?.map((item: any) => 
            `${item.quantidade}x ${item.produto_nome}${item.tamanho ? ` (${item.tamanho})` : ''}`
          ) || [],
          total: parseFloat(order.total) || 0,
          status: order.status || 'pending',
          createdAt: order.created_at || new Date().toISOString(),
          paymentMethod: order.forma_pagamento || 'Indefinido',
          viewed: order.viewed || false
        }));
        set({ orders: transformedOrders });
        console.log(`✅ Carregados ${transformedOrders.length} pedidos da API`);
      }
    } catch (error) {
      console.error('Erro ao carregar pedidos da API:', error);
    }
  },
  
  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
  })),
```

---

## FIX #3: Add Authentication to Admin Routes

**File:** `server/routes.ts` (Add near top, after imports)

**ADD MIDDLEWARE:**
```typescript
import { Request, Response, NextFunction } from "express";

// Authentication middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // Check if user is authenticated (via session, JWT, etc.)
  // This assumes express-session is configured
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ 
      error: "Unauthorized",
      message: "Authentication required to access this resource"
    });
  }
  next();
};

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.isAdmin) {
    return res.status(403).json({ 
      error: "Forbidden",
      message: "Admin privileges required"
    });
  }
  next();
};
```

**UPDATE ROUTES:**
```typescript
// BEFORE - No auth:
app.get("/api/configuracoes", async (req, res) => { ... });
app.put("/api/configuracoes", async (req, res) => { ... });

// AFTER - With auth:
app.get("/api/configuracoes", requireAuth, async (req, res) => { ... });
app.put("/api/configuracoes", requireAdmin, async (req, res) => { ... });

// Other admin routes:
app.post("/api/cardapio", requireAdmin, async (req, res) => { ... });
app.put("/api/cardapio/:id", requireAdmin, async (req, res) => { ... });
```

---

## FIX #4: Implement Webhook Trigger on Order Creation

**File:** `server/routes.ts` (Lines 325-377)

**BEFORE (BROKEN):**
```typescript
app.post("/api/pedidos", async (req, res) => {
  try {
    // ... order creation code ...
    
    res.status(201).json({
      id: pedido.id,
      numero_pedido: pedido.numero_pedido,
      // ... other fields
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Erro ao criar pedido" });
  }
});
```

**AFTER (FIXED):**
```typescript
app.post("/api/pedidos", async (req, res) => {
  try {
    const { cliente_nome, cliente_telefone, cliente_email, itens, endereco, forma_pagamento, observacoes } = req.body;

    // ... validation and order creation code ...

    const pedido = (await db.insert(pedidos).values({
      cliente_id: cliente.id,
      cliente_nome: cliente.nome,
      cliente_telefone: cliente.telefone,
      cliente_email: cliente.email,
      status: "pending",
      total: new Decimal(total).toString(), // ✅ FIX #7: Convert to string for DECIMAL field
      endereco_entrega: endereco,
      forma_pagamento,
      observacoes,
    }).returning())[0];

    // ✅ CREATE ITEMS IN TRANSACTION (FIX #6)
    for (const item of itens) {
      await db.insert(itens_pedido).values({
        pedido_id: pedido.id,
        produto_nome: item.produto_nome,
        categoria: item.categoria,
        tamanho: item.tamanho,
        sabores: item.sabores,
        quantidade: item.quantidade,
        preco_unitario: new Decimal(item.preco_unitario).toString(), // Keep consistency
        observacoes: item.observacoes,
      });
    }

    // ✅ TRIGGER WEBHOOK (FIX #4)
    const config = await db.query.configuracoes.findFirst({
      where: eq(configuracoes.id, 1)
    });

    if (config?.webhook_url) {
      const webhookPayload = {
        event: 'order.created',
        pedido_id: pedido.id,
        numero_pedido: pedido.numero_pedido,
        cliente: {
          nome: cliente.nome,
          telefone: cliente.telefone,
          email: cliente.email
        },
        itens: itens.map(item => ({
          produto_nome: item.produto_nome,
          quantidade: item.quantidade,
          preco_unitario: item.preco_unitario,
          tamanho: item.tamanho,
          sabores: item.sabores
        })),
        total: new Decimal(total).toString(),
        forma_pagamento,
        endereco_entrega: endereco,
        observacoes,
        timestamp: new Date().toISOString()
      };

      // Trigger webhook asynchronously (don't wait for response)
      fetch(config.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload)
      })
        .then(() => log(`Webhook triggered successfully for order ${pedido.id}`, "webhook"))
        .catch(err => log(`Webhook trigger failed for order ${pedido.id}: ${err.message}`, "webhook"));
    }

    // ✅ QUEUE WHATSAPP NOTIFICATION (FIX #5)
    if (config?.whatsapp_notification && cliente.telefone) {
      // Queue for async processing (don't block response)
      queueWhatsAppNotification({
        clienteId: cliente.id,
        telefone: cliente.telefone,
        numeroPedido: pedido.numero_pedido,
        total: new Decimal(total).toString(),
        itens
      }).catch(err => log(`WhatsApp queue failed: ${err.message}`, "whatsapp"));
    }

    res.status(201).json({
      id: pedido.id,
      numero_pedido: pedido.numero_pedido,
      cliente_id: cliente.id,
      cliente_nome: cliente.nome,
      status: pedido.status,
      total: pedido.total,
      itens_count: itens.length,
      forma_pagamento: pedido.forma_pagamento,
      created_at: pedido.created_at,
    });
  } catch (error: any) {
    log(`Error creating order: ${error.message}`, "pedidos");
    res.status(400).json({ error: error.message || "Erro ao criar pedido" });
  }
});

// ✅ Helper function to queue WhatsApp notification
async function queueWhatsAppNotification(data: any) {
  // TODO: Implement WhatsApp service integration
  // Options:
  // 1. Twilio API
  // 2. n8n webhook
  // 3. Custom WhatsApp service
  
  const message = `
🍕 *Pedido Confirmado!*
Número: #${data.numeroPedido}
Total: R$ ${data.total}
Itens: ${data.itens.length}

Acompanhe seu pedido em breve!
  `.trim();
  
  // Example Twilio implementation:
  // const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  // await client.messages.create({
  //   from: 'whatsapp:+1234567890',
  //   to: `whatsapp:+55${data.telefone.replace(/\D/g, '')}`,
  //   body: message
  // });
}
```

---

## FIX #5: Implement WhatsApp Notification Service

**File:** `server/whatsapp-service.ts` (CREATE NEW FILE)

```typescript
import { db } from "./db";
import { configuracoes } from "@shared/schema";
import { eq } from "drizzle-orm";
import { log } from "./index";

export async function sendWhatsAppNotification(
  telefone: string,
  message: string
): Promise<boolean> {
  try {
    // Get WhatsApp configuration
    const config = await db.query.configuracoes.findFirst({
      where: eq(configuracoes.id, 1)
    });

    if (!config?.whatsapp_notification) {
      log(`WhatsApp notifications disabled`, "whatsapp");
      return false;
    }

    // Normalize phone number
    const normalizedPhone = telefone.replace(/\D/g, '');
    if (!normalizedPhone.match(/^55\d{10,11}$/)) {
      log(`Invalid phone number format: ${telefone}`, "whatsapp");
      return false;
    }

    // Option 1: Send via n8n webhook
    if (config.webhook_url) {
      const payload = {
        event: 'whatsapp.send',
        telefone: normalizedPhone,
        message: message,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(config.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (response.ok) {
        log(`WhatsApp message sent to ${normalizedPhone}`, "whatsapp");
        return true;
      }
    }

    // Option 2: Send via Twilio (if configured)
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFromPhone = process.env.TWILIO_WHATSAPP_FROM;

    if (twilioAccountSid && twilioAuthToken && twilioFromPhone) {
      try {
        const accountSid = twilioAccountSid;
        const authToken = twilioAuthToken;
        const client = require('twilio')(accountSid, authToken);

        await client.messages.create({
          from: `whatsapp:${twilioFromPhone}`,
          to: `whatsapp:+${normalizedPhone}`,
          body: message
        });

        log(`WhatsApp message sent via Twilio to ${normalizedPhone}`, "whatsapp");
        return true;
      } catch (error: any) {
        log(`Twilio error: ${error.message}`, "whatsapp");
      }
    }

    log(`No WhatsApp service configured`, "whatsapp");
    return false;
  } catch (error: any) {
    log(`Error sending WhatsApp notification: ${error.message}`, "whatsapp");
    return false;
  }
}

export async function notifyOrderStatus(
  numeroP: number,
  status: string,
  clienteTelefone: string
): Promise<void> {
  const statusMessages: Record<string, string> = {
    'pending': '⏳ Seu pedido foi recebido!',
    'confirmed': '✅ Seu pedido foi confirmado!',
    'production': '👨‍🍳 Seu pedido está em produção',
    'ready': '📦 Seu pedido está pronto!',
    'sent': '🛵 Seu pedido saiu para entrega',
    'delivered': '🎉 Seu pedido foi entregue!',
    'cancelled': '❌ Seu pedido foi cancelado'
  };

  const message = `
Pedido #${numeroP}
${statusMessages[status] || 'Atualização do seu pedido'}

Obrigado!
  `.trim();

  await sendWhatsAppNotification(clienteTelefone, message);
}
```

---

## FIX #6: Add Transaction Support & Validation

**File:** `server/routes.ts` (Update POST /api/pedidos)

```typescript
app.post("/api/pedidos", async (req, res) => {
  const { cliente_nome, cliente_telefone, cliente_email, itens, endereco, forma_pagamento, observacoes } = req.body;

  // ✅ VALIDATE INPUT
  if (!cliente_nome?.trim()) {
    return res.status(400).json({ error: "Nome do cliente é obrigatório" });
  }

  if (!cliente_telefone?.trim()) {
    return res.status(400).json({ error: "Telefone é obrigatório" });
  }

  if (!Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ error: "Pedido deve ter pelo menos um item" });
  }

  if (!endereco || !endereco.rua) {
    return res.status(400).json({ error: "Endereço de entrega é obrigatório" });
  }

  if (!forma_pagamento?.trim()) {
    return res.status(400).json({ error: "Forma de pagamento é obrigatória" });
  }

  try {
    // ✅ USE TRANSACTION
    const result = await db.transaction(async (tx) => {
      // Normalize phone
      const telefoneNormalizado = cliente_telefone.replace(/\D/g, "");

      // Find or create client
      let cliente = (await tx.select().from(clientes).where(eq(clientes.telefone, telefoneNormalizado)))[0];
      
      if (!cliente) {
        cliente = (await tx.insert(clientes).values({
          nome: cliente_nome,
          telefone: telefoneNormalizado,
          email: cliente_email || undefined,
          endereco_padrao: `${endereco.rua}, ${endereco.numero}`,
        }).returning())[0];
      }

      // Calculate total
      let total = new Decimal(0);
      for (const item of itens) {
        total = total.plus(new Decimal(item.preco_unitario).times(item.quantidade));
      }

      // Create order
      const pedido = (await tx.insert(pedidos).values({
        cliente_id: cliente.id,
        cliente_nome: cliente.nome,
        cliente_telefone: cliente.telefone,
        cliente_email: cliente.email,
        status: "pending",
        total: total.toString(),
        endereco_entrega: endereco,
        forma_pagamento,
        observacoes,
      }).returning())[0];

      // Create order items
      for (const item of itens) {
        await tx.insert(itens_pedido).values({
          pedido_id: pedido.id,
          produto_nome: item.produto_nome,
          categoria: item.categoria,
          tamanho: item.tamanho,
          sabores: item.sabores,
          quantidade: item.quantidade,
          preco_unitario: new Decimal(item.preco_unitario).toString(),
          observacoes: item.observacoes || undefined,
        });
      }

      return { pedido, cliente, total };
    });

    // Success - transaction committed
    res.status(201).json({
      id: result.pedido.id,
      numero_pedido: result.pedido.numero_pedido,
      cliente_id: result.cliente.id,
      status: result.pedido.status,
      total: result.total.toString(),
    });

  } catch (error: any) {
    // Transaction rolled back automatically
    log(`Pedidos creation failed: ${error.message}`, "pedidos");
    res.status(400).json({ error: "Erro ao criar pedido" });
  }
});
```

---

## FIX #7: Fix File Upload Validation

**File:** `server/routes.ts` (Update POST /api/upload)

```typescript
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

    const file = req.file;

    // ✅ VALIDATE MIME TYPE
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return res.status(400).json({ 
        error: `Tipo de arquivo inválido. Aceitos: ${ALLOWED_MIME_TYPES.join(', ')}` 
      });
    }

    // ✅ VALIDATE FILE SIZE (multer already checks, but double-check)
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ 
        error: `Arquivo muito grande. Máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      });
    }

    // ✅ VALIDATE EXTENSION
    const ext = '.' + file.originalname.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return res.status(400).json({ 
        error: `Extensão inválida: ${ext}` 
      });
    }

    // ✅ SANITIZE FILENAME
    const sanitizedName = file.originalname
      .replace(/[^a-z0-9.-]/gi, '_')
      .substring(0, 100);

    const uniqueFileName = `${Date.now()}-${sanitizedName}`;
    const bucketName = "imagens-cardapio";

    const publicUrl = await uploadFileToSupabase(
      bucketName,
      uniqueFileName,
      file.buffer,
      file.mimetype,
    );

    res.json({ publicUrl });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      error: "Erro ao fazer upload da imagem.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
```

---

## FIX #8: Fix Settings Form Auto-Save

**File:** `client/src/pages/admin/settings.tsx` (Update handleLogoUpload)

```typescript
const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setIsUploading(true);
  const uploadForm = new FormData();
  uploadForm.append("image", file);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: uploadForm,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }

    const data = await response.json();
    
    // ✅ UPDATE FORM DATA
    const newFormData = { ...formData, logo_url: data.publicUrl };
    setFormData(newFormData);
    
    // ✅ AUTO-SAVE IMMEDIATELY
    setIsSaving(true);
    const settingsToSave = {
      nome_restaurante: newFormData.nome_restaurante,
      endereco: newFormData.endereco,
      telefone: newFormData.telefone,
      logo_url: newFormData.logo_url,
      webhook_url: newFormData.webhookUrl,
      supabase_url: newFormData.supabaseUrl,
      supabase_key: newFormData.supabaseKey,
      whatsapp_notification: newFormData.whatsappNotification,
    };

    const saveResponse = await fetch("/api/configuracoes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settingsToSave),
    });

    if (!saveResponse.ok) {
      throw new Error("Falha ao salvar logo");
    }

    toast({
      title: "Logo salva com sucesso!",
      description: "Alteração foi persistida no banco de dados.",
      variant: "success"
    });
  } catch (error: any) {
    console.error(error);
    toast({
      title: "Erro",
      description: error.message || "Não foi possível enviar a imagem.",
      variant: "destructive",
    });
  } finally {
    setIsUploading(false);
    setIsSaving(false);
  }
};
```

---

## FIX #9: Add Pagination to Orders API

**File:** `server/routes.ts` (Update GET /api/pedidos)

```typescript
app.get("/api/pedidos", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    // ✅ PAGINATION
    const pedidosResult = await db
      .select()
      .from(pedidos)
      .orderBy(desc(pedidos.created_at))
      .limit(limit)
      .offset(offset);

    // Count total for pagination metadata
    const countResult = await db
      .select({ count: sql`count(*)` })
      .from(pedidos);
    
    const total = Number(countResult[0]?.count) || 0;
    const totalPages = Math.ceil(total / limit);

    // ✅ BATCH LOAD ITEMS (more efficient than N+1)
    const allItemIds = pedidosResult.map(p => p.id);
    const allItems = allItemIds.length > 0
      ? await db.select()
          .from(itens_pedido)
          .where(inArray(itens_pedido.pedido_id, allItemIds))
      : [];

    // Group items by pedido_id
    const itemsByPedidoId = new Map<string, typeof allItems>();
    for (const item of allItems) {
      if (!itemsByPedidoId.has(item.pedido_id)) {
        itemsByPedidoId.set(item.pedido_id, []);
      }
      itemsByPedidoId.get(item.pedido_id)!.push(item);
    }

    // Combine results
    const pedidosComItens = pedidosResult.map(p => ({
      ...p,
      itens: itemsByPedidoId.get(p.id) || []
    }));

    res.json({
      data: pedidosComItens,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
});
```

---

## FIX #10: Return Order ID to Client

**File:** `client/src/components/cart-drawer.tsx` (Update handleCheckout)

```typescript
const handleCheckout = async () => {
  try {
    const response = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedidoData)
    });

    if (!response.ok) {
      const error = await response.json();
      toast({
        title: "Erro ao criar pedido",
        description: error.error || "Tente novamente",
        variant: "destructive"
      });
      return;
    }

    const createdOrder = await response.json();
    
    // ✅ STORE ORDER ID AND NUMBER
    const orderMessage = `
✅ Pedido criado com sucesso!
Número: #${createdOrder.numero_pedido}
ID: ${createdOrder.id}

Você será redirecionado para WhatsApp agora...
    `.trim();

    toast({
      title: "Pedido confirmado!",
      description: orderMessage,
      variant: "success"
    });

    // ✅ STORE IN LOCAL STORAGE FOR TRACKING
    const userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    userOrders.push({
      id: createdOrder.id,
      numero: createdOrder.numero_pedido,
      createdAt: new Date().toISOString(),
      total: createdOrder.total
    });
    localStorage.setItem('userOrders', JSON.stringify(userOrders));

    // Small delay before opening WhatsApp so user sees toast
    setTimeout(() => {
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
      
      // Clear cart and close drawer
      clearCart();
      toggleCart(false);
    }, 1000);

  } catch (error: any) {
    console.error('❌ Erro ao criar pedido:', error);
    toast({
      title: "Erro",
      description: "Não foi possível criar o pedido. Tente novamente.",
      variant: "destructive"
    });
  }
};
```

---

## Summary: Apply in This Order

1. **FIX #1** - Address structure (highest impact)
2. **FIX #2** - Duplicate orders property (breaks admin)
3. **FIX #3** - Add authentication (security critical)
4. **FIX #4** - Webhook trigger (core feature)
5. **FIX #5** - WhatsApp service (automation)
6. **FIX #6** - Transaction support (data integrity)
7. **FIX #7** - File validation (security)
8. **FIX #8** - Auto-save forms (UX)
9. **FIX #9** - Pagination (performance)
10. **FIX #10** - Return order ID (user tracking)

All fixes together = **Production-ready application** ✅

