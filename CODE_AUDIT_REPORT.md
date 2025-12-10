# 🔍 Comprehensive Code Audit Report
## Wilson Pizzas - Full-Stack TypeScript/React Delivery Application

**Audit Date:** December 9, 2025  
**Repository:** Card-pio-Wilson-  
**Technology Stack:** TypeScript, React, Express, PostgreSQL (Drizzle ORM), Zod Validation

---

## Executive Summary

This audit identified **8 CRITICAL bugs**, **12 HIGH priority issues**, and **9 MEDIUM priority improvements**. The application has significant data flow inconsistencies, missing validations, and broken features that will cause runtime failures and data corruption.

**Impact Level:** 🔴 **CRITICAL** - Production deployment NOT recommended without fixes.

---

## 📊 CRITICAL BUGS (Blocking Issues)

### 1. ❌ CRITICAL: Address Data Structure Mismatch in Order Creation
**File:** `client/src/components/cart-drawer.tsx` (Lines 118-134)  
**Database:** `shared/schema.ts` (Line 53)

**Issue:**
```typescript
// FRONTEND sends:
endereco: {
  rua: address.split(',')[0] || 'Endereço do cliente',
  numero: '0',
  completo: address || 'A confirmar com cliente'
}

// DATABASE expects:
endereco_entrega: jsonb("endereco_entrega").notNull(),
// Schema shows fields: rua, numero, bairro, cidade, cep, complemento (from enderecos table)
```

**Root Cause:** Frontend creates object with `completo` field that doesn't match schema. Database expects structured address fields.

**Impact:** Orders will be saved with malformed address data. Admin cannot properly retrieve or display delivery addresses.

**Fix Approach:**
```typescript
// CORRECT structure matching schema:
endereco: {
  rua: address.split(',')[0] || 'Rua não informada',
  numero: address.match(/\d+/) ? address.match(/\d+/)[0] : '0',
  bairro: address.split(',')[2] || 'Bairro não informado',
  cidade: address.split(',')[3] || 'Ouricuri',
  cep: '',
  complemento: address
}
```

---

### 2. ❌ CRITICAL: Duplicate `orders` Property in Admin Store
**File:** `client/src/lib/admin-store.ts` (Lines 57, 64)

**Issue:**
```typescript
orders: initialOrders,  // Line 57
loadOrdersFromAPI: async () => { ... },
orders: initialOrders,  // Line 64 - DUPLICATE!
updateOrderStatus: (id, status) => set((state) => ({
  orders: state.orders.map(...)
})),
```

**Root Cause:** Property `orders` declared twice in same object literal.

**Impact:** TypeScript compilation warning/error. Second declaration will override first. Initial state setup is broken.

**Fix Approach:** Remove the duplicate `orders: initialOrders` on line 64.

---

### 3. ❌ CRITICAL: Missing Error Handling in Settings Form Submission
**File:** `client/src/pages/admin/settings.tsx` (Lines 130-168)

**Issue:**
```typescript
const response = await fetch("/api/configuracoes", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(settingsToSave),
});

if (!response.ok) {
  throw new Error("Falha ao salvar as configurações");
}
// NO validation of response data before use
```

**Root Cause:** API response is not validated. If backend returns invalid data, the form doesn't handle it.

**Impact:** Silent failures. Invalid configurations saved to database. Admin has no feedback on errors.

**Fix Approach:** Add Zod validation for response data and handle edge cases.

---

### 4. ❌ CRITICAL: Webhook URL Never Triggered on Order Creation
**File:** `server/routes.ts` (Lines 325-377)

**Issue:**
- Database schema stores `webhook_url` in `configuracoes` table
- API endpoint `/api/pedidos` creates orders but **NEVER calls the webhook**
- No integration with n8n for order processing

**Root Cause:** Webhook callback logic is missing entirely from order creation.

**Impact:** Orders created via web app won't trigger n8n automation. No IA processing, no WhatsApp notifications.

**Fix Approach:**
```typescript
app.post("/api/pedidos", async (req, res) => {
  try {
    // ... existing order creation code ...
    
    // Fetch webhook URL from configuracoes
    const config = await db.query.configuracoes.findFirst({
      where: eq(configuracoes.id, 1)
    });
    
    if (config?.webhook_url) {
      // Trigger webhook asynchronously
      fetch(config.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedido_id: pedido.id,
          numero_pedido: pedido.numero_pedido,
          cliente: { nome: cliente.nome, telefone: cliente.telefone },
          itens: itensFormatados,
          total: pedido.total,
          forma_pagamento
        })
      }).catch(err => console.error('Webhook trigger failed:', err));
    }
    
    res.status(201).json({...});
  } catch (error: any) { ... }
});
```

---

### 5. ❌ CRITICAL: WhatsApp Notification Toggle Not Implemented
**File:** `client/src/pages/admin/settings.tsx` (Line 165)  
**Database:** `shared/schema.ts` (Line 98)

**Issue:**
- Form saves `whatsapp_notification` boolean to database
- **No code exists to actually send WhatsApp notifications**
- Orders are created but notifications are never dispatched

**Root Cause:** Feature is partially implemented (UI + DB) but backend logic missing.

**Impact:** Orders won't generate automatic WhatsApp messages even if toggle is enabled.

**Fix Approach:** Implement WhatsApp notification service in `server/routes.ts` that:
1. Fetches `whatsapp_notification` setting from configuracoes
2. Integrates with Twilio or n8n WhatsApp integration
3. Sends formatted order updates to customer

---

### 6. ❌ CRITICAL: Form Data Not Persisted After Upload
**File:** `client/src/pages/admin/settings.tsx` (Lines 88-110)

**Issue:**
```typescript
const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  // ... upload logic ...
  setFormData(prev => ({ ...prev, logo_url: data.publicUrl }));
  
  toast({
    title: "Sucesso!",
    description: "Logo atualizada. Salve as alterações para aplicar.",
  });
};
```

**Root Cause:** Logo is updated in local state but only persisted when user clicks "Save". If user navigates away without saving, logo upload is lost.

**Impact:** Users get false success message but data isn't actually saved to database.

**Fix Approach:** Auto-save logo URL immediately after upload, or change UX to clarify data isn't persisted.

---

### 7. ❌ CRITICAL: Type Mismatch in Order Total Field
**File:** `server/routes.ts` (Line 349)  
**Database:** `shared/schema.ts` (Line 57)

**Issue:**
```typescript
// In routes.ts:
total: total.toString(), // Saved as STRING

// In schema.ts:
total: decimal("total", { precision: 10, scale: 2 }).notNull(), // Expects DECIMAL
```

**Root Cause:** Number converted to string before saving to decimal field.

**Impact:** Database may reject insertion or cause type coercion issues. Calculations on total become unreliable.

**Fix Approach:**
```typescript
total: new Decimal(total), // or just: total // Keep as number
```

---

### 8. ❌ CRITICAL: Unauthorized Access to Admin Settings
**File:** `server/routes.ts` (Lines 42-66)

**Issue:**
```typescript
app.get("/api/configuracoes", async (req, res) => {
  // NO authentication check
  const result = await db.query.configuracoes.findFirst({
    where: eq(configuracoes.id, 1)
  });
  res.json(result);
});

app.put("/api/configuracoes", async (req, res) => {
  // NO authentication check - anyone can modify!
  // ...
});
```

**Root Cause:** No middleware to verify admin privileges.

**Impact:** Any user can:
- Read sensitive config (Supabase keys, webhook URLs)
- Modify restaurant settings, webhook URLs, WhatsApp credentials
- Disable notifications, change address

**Fix Approach:**
```typescript
// Add authentication middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.userId || !req.session?.isAdmin) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

app.get("/api/configuracoes", requireAuth, async (req, res) => {
  // ...
});
```

---

## 🔴 HIGH PRIORITY ISSUES (Functional Problems)

### 1. Missing Checkout Flow Validation
**File:** `client/src/components/cart-drawer.tsx` (Lines 176-187)

**Issue:**
```typescript
<Button 
  onClick={handleCheckout}
  disabled={deliveryMethod === 'entrega' && !address}
  // Only validates if address is empty, not if it's valid
>
```

**Problem:** Address validation is too basic. Doesn't check for minimum valid format. Users can submit blank addresses after selecting retirada.

**Impact:** Malformed orders in database.

---

### 2. Hardcoded Phone Number in Cart
**File:** `client/src/components/cart-drawer.tsx` (Line 78)

**Issue:**
```typescript
const phoneNumber = "5587999480699"; // HARDCODED
```

**Problem:** Should come from `configuracoes` table. Currently ignores admin-configured phone.

**Impact:** Orders always go to hardcoded number, ignoring settings.

**Fix:**
```typescript
const [whatsappPhone, setWhatsappPhone] = useState("");

useEffect(() => {
  fetch('/api/configuracoes')
    .then(r => r.json())
    .then(config => setWhatsappPhone(config.telefone));
}, []);
```

---

### 3. State Sync Issue Between Admin Store and API
**File:** `client/src/lib/admin-store.ts` (Lines 33-60)

**Issue:**
```typescript
loadOrdersFromAPI: async () => {
  // Transforms API response to store format
  const transformedOrders = (Array.isArray(apiOrders) ? apiOrders : []).map((order: any) => ({
    // Maps database fields to store fields
    id: order.id,
    numero_pedido: order.numero_pedido,
    customerName: order.cliente_nome || 'Cliente',
    // ...
  }));
}
```

**Problem:** Manual transformation of every field. If database schema changes, store breaks. No real-time sync.

**Impact:** Admin sees stale order data. Updates don't reflect immediately.

---

### 4. No Pagination on Orders List
**File:** `server/routes.ts` (Lines 297-313)

**Issue:**
```typescript
app.get("/api/pedidos", async (req, res) => {
  const pedidosResult = await db.select().from(pedidos).orderBy(desc(pedidos.created_at));
  // Fetches ALL orders at once
  const pedidosComItens = await Promise.all(
    pedidosResult.map(async (pedido) => {
      const itens = await db.select().from(itens_pedido)...
    })
  );
```

**Problem:** 
- No limit/offset
- N+1 query problem (1 main query + 1 per order)
- For 1000 orders = 1001 database queries

**Impact:** Severe performance degradation. API response slow/timeout.

---

### 5. Missing Validation in PUT Cardápio Route
**File:** `server/routes.ts` (Lines 113-182)

**Issue:**
```typescript
app.put("/api/cardapio/:id", async (req, res) => {
  // Multiple lookup strategies but no validation that data is correct
  const data = insertCardapioSchema.partial().parse(req.body);
  // `.partial()` means NO required fields - accepts empty objects
```

**Problem:** Can save empty or invalid product data.

**Impact:** Corrupted menu items in database.

---

### 6. No Transaction Support for Order Creation
**File:** `server/routes.ts` (Lines 325-377)

**Issue:**
```typescript
const pedido = (await db.insert(pedidos).values({...}).returning())[0];
for (const item of itens) {
  await db.insert(itens_pedido).values({...}); // If this fails, pedido exists without items
}
```

**Problem:** If item insertion fails halfway, order exists without all items.

**Impact:** Inconsistent database state. Orphaned orders.

**Fix:** Use database transactions:
```typescript
const result = await db.transaction(async (tx) => {
  const pedido = (await tx.insert(pedidos).values({...}).returning())[0];
  for (const item of itens) {
    await tx.insert(itens_pedido).values({...});
  }
  return pedido;
});
```

---

### 7. Image Upload Without Size Validation
**File:** `server/routes.ts` (Lines 24-43)

**Issue:**
```typescript
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

app.post("/api/upload", upload.single("image"), async (req, res) => {
  // No file type validation (could be .exe, .zip, etc.)
  const file = req.file;
  const publicUrl = await uploadFileToSupabase(
    "imagens-cardapio",
    file.originalname, // Could be malicious filename
    file.buffer,
    file.mimetype, // Could be spoofed
  );
});
```

**Problem:** 
- No MIME type validation
- No image format verification
- No filename sanitization
- No virus scan

**Impact:** Malicious files uploaded to Supabase. XSS attacks possible.

**Fix:**
```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
if (!ALLOWED_TYPES.includes(file.mimetype)) {
  return res.status(400).json({ error: "Invalid file type" });
}

const sanitizedName = `${Date.now()}-${file.originalname.replace(/[^a-z0-9.-]/gi, '_')}`;
```

---

### 8. Client Not Tracking Order ID After Creation
**File:** `client/src/components/cart-drawer.tsx` (Lines 115-151)

**Issue:**
```typescript
const response = await fetch('/api/pedidos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(pedidoData)
});

if (response.ok) {
  console.log('✅ Pedido salvo no banco de dados');
  // Does NOT store the returned order ID
  // User has no way to track their order
}

window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
```

**Problem:** Order is created but order ID/number not returned to user or stored in local state.

**Impact:** User can't track their order status. No order confirmation number.

---

### 9. No SSL/HTTPS Enforcement
**File:** `server/index.ts`

**Issue:** Server serves API credentials in plain HTTP if not behind reverse proxy.

**Impact:** Supabase keys, database URLs exposed in transit.

---

### 10. Missing Rate Limiting
**File:** `server/routes.ts`

**Issue:** No rate limiting on API endpoints. Anyone can spam `/api/pedidos`.

**Impact:** Abuse possible. DOS attacks can overload database.

---

### 11. No CORS Configuration
**File:** `server/index.ts` 

**Issue:** Express app has no explicit CORS setup. Default behavior allows all origins.

**Impact:** API accessible from any website. Potential CSRF attacks.

---

### 12. Supabase Credentials in Frontend Environment
**File:** `client/src/pages/admin/settings.tsx`

**Issue:**
```typescript
supabaseUrl: data.supabase_url || '',
supabaseKey: data.supabase_key || '',
```

**Problem:** Admin credentials displayed in form. Could be visible in browser dev tools or localStorage.

**Impact:** Credentials exposed to malicious browser extensions.

---

## 🟡 MEDIUM PRIORITY ISSUES (Improvements Needed)

### 1. Inconsistent Error Messages
**Files:** Multiple routes in `server/routes.ts`

**Issue:**
```typescript
// Line 88:
res.status(500).json({ error: "Erro ao buscar cardápio" });
// Line 157:
res.status(500).json({ error: "Erro ao atualizar produto." });
// Line 185:
res.status(500).json({ error: "Erro ao atualizar produto", details: error.message });
```

**Problem:** Inconsistent error response format. Some include details, some don't.

**Impact:** Frontend error handling becomes complex.

---

### 2. Magic String for Configuracoes ID
**File:** `server/routes.ts` (Lines 42-66)

**Issue:**
```typescript
where: eq(configuracoes.id, 1)
```

**Problem:** Hard-coded `1` should be a constant.

**Fix:**
```typescript
const RESTAURANT_CONFIG_ID = 1;
```

---

### 3. Missing Logging in Critical Operations
**File:** `server/routes.ts`

**Issue:** No structured logging for:
- Order creation success/failure
- Webhook trigger attempts
- Payment processing
- User actions

**Impact:** Debugging in production is difficult.

---

### 4. No Environment Variable Validation at Startup
**File:** `server/index.ts`

**Issue:** Database connection checked in `db.ts`, but other critical vars like Supabase keys only validated when accessed.

**Impact:** App starts but fails at runtime when features accessed.

---

### 5. Redundant API Calls for Orders
**File:** `client/src/lib/admin-store.ts`

**Issue:**
```typescript
loadOrdersFromAPI: async () => {
  const response = await fetch('/api/pedidos');
  // Called when opening admin dashboard
  // Could be stale if multiple admins open dashboard
}
```

**Problem:** No cache invalidation. No polling or websocket for real-time updates.

**Impact:** Multiple admins see different order statuses. Conflicts.

---

### 6. Status Type Not Used in Pedidos Route
**File:** `shared/schema.ts` (Line 165)

**Issue:**
```typescript
export type OrderStatus = "pending" | "confirmed" | "production" | "ready" | "sent" | "delivered" | "cancelled";
```

**Problem:** Type defined but not used in validation. Routes accept any string as status.

**Impact:** Invalid statuses could be saved.

---

### 7. Horários Not Synced to Database
**File:** `client/src/pages/admin/settings.tsx` (Lines 129-135)

**Issue:**
```typescript
<Button variant="outline" className="w-full mt-4" onClick={() => 
  toast({ title: "Horários Sincronizados", description: "Tabela 'horarios_funcionamento' atualizada." })
}>
  Sincronizar Horários com Supabase
</Button>
```

**Problem:** Button just shows toast. Doesn't actually sync to database.

**Impact:** Operating hours changes don't persist.

---

### 8. Cart Persistence Not Implemented
**File:** `client/src/lib/store.ts`

**Issue:**
```typescript
useCartStore = create<CartState>((set) => ({
  items: [],
  // No persist middleware
}))
```

**Problem:** Cart clears on page refresh.

**Impact:** Users lose their selections.

**Fix:** Add persist middleware:
```typescript
create<CartState>()(
  persist(
    (set) => ({ ... }),
    { name: 'cart-store' }
  )
)
```

---

### 9. No "Viewed" Status Update for Orders
**File:** `server/routes.ts`

**Issue:**
```typescript
// Schema has 'viewed' field but no endpoint to update it
viewed: boolean("viewed").default(false),
```

**Problem:** Admin can't mark orders as viewed/read.

**Impact:** No way to track which orders have been seen.

---

## 📊 Data Flow Diagram: Issues & Critical Paths

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND ISSUES                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Cart Item                    ❌ Issue #1                       │
│  {flavors, size, price}       Address mismatch                 │
│        │                                                         │
│        ├─→ Cart Store (no persistence)                          │
│        │        │                                                │
│        └─→ Checkout Form                                        │
│             │                                                    │
│             ├─ Address Input ❌ Issue #2 (no validation)       │
│             ├─ Payment Method                                   │
│             ├─ Notes                                            │
│             │                                                    │
│             └─→ FORMAT: {address: {rua, numero, completo}} ❌   │
│                         (Schema expects: rua, numero, bairro,   │
│                          cidade, cep, complemento)              │
│                                                                  │
│                        API CALL                                 │
│                          │                                      │
│                          ▼                                      │
├─────────────────────────────────────────────────────────────────┤
│                      BACKEND ISSUES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  POST /api/pedidos                                              │
│    │                                                             │
│    ├─ Validate client ❌ Issue #3 (no auth)                    │
│    ├─ Create/Fetch Cliente                                      │
│    ├─ Calculate Total ❌ Issue #7 (convert to string)          │
│    ├─ Insert Pedido                                             │
│    │    └─ ❌ Issue #6 (no transaction - data can be orphaned) │
│    ├─ Insert N ItemPedidos ❌ Issue #4 (N+1 problem later)     │
│    │                                                             │
│    ├─ ❌ MISSING: Check config.webhook_url                     │
│    ├─ ❌ MISSING: Trigger n8n webhook                          │
│    ├─ ❌ MISSING: Queue WhatsApp notification                  │
│    │                                                             │
│    └─ Response: {id, numero_pedido} ❌ Issue #5 (client       │
│                  doesn't store this)                            │
│                                                                  │
│  DATABASE STATE:                                                │
│  ✓ pedidos table  → rows: [id, numero_pedido, total,          │
│                             endereco_entrega (JSON)]          │
│  ✓ itens_pedido   → rows with order details                   │
│  ✗ configuracoes  → webhook_url set but NEVER called           │
│  ✗ horarios_funcionamento → NOT updated from settings form    │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                      ADMIN PANEL ISSUES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Settings Form (admin/settings.tsx)                             │
│    │                                                             │
│    ├─ ❌ Issue #8: No auth required to edit                    │
│    │                                                             │
│    ├─ Upload Logo                                              │
│    │  ├─ ❌ Issue #9: No file validation                       │
│    │  └─ ❌ Issue #10: Only saved to local state              │
│    │                                                             │
│    ├─ Configuracoes Form                                        │
│    │  ├─ Nome, Endereco, Telefone                              │
│    │  ├─ Webhook URL                                           │
│    │  ├─ WhatsApp Notification toggle                          │
│    │  └─ PUT /api/configuracoes                                │
│    │                                                             │
│    ├─ Horários Form ❌ Issue #11: Only UI, doesn't save       │
│    │                                                             │
│    └─ No Auto-save (form data lost on navigation)              │
│                                                                  │
│  Orders List (admin/orders)                                     │
│    │                                                             │
│    ├─ GET /api/admin/pedidos ❌ Issue #12: No pagination      │
│    │                            ❌ N+1 queries                 │
│    │                                                             │
│    ├─ Display orders                                            │
│    │  ├─ Fetch from admin-store (stale data possible)          │
│    │  └─ NO real-time updates                                  │
│    │                                                             │
│    └─ Update Status                                             │
│       ├─ PUT /api/pedidos/:id/status                           │
│       ├─ ✓ Updates pedidos.status                              │
│       └─ ❌ NO webhook trigger for status updates              │
│          ❌ NO WhatsApp notification sent                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Recommended Fix Priority Order

### Phase 1 (IMMEDIATE - Day 1)
1. **Fix Critical Bug #1** - Address structure mismatch → Will prevent orders from saving correctly
2. **Fix Critical Bug #2** - Duplicate orders property → Breaks admin store initialization
3. **Fix Critical Bug #8** - Add authentication to admin routes → Security breach
4. **Fix Critical Bug #5** - Implement WhatsApp notification stub → Feature appears broken

### Phase 2 (URGENT - Day 2-3)
5. **Fix Critical Bug #3** - Add webhook trigger on order creation → Core automation fails
6. **Fix Critical Bug #7** - Fix total field type → Data corruption
7. **Fix Critical Bug #4** - Form data auto-save or clarify UX → Data loss
8. **Fix High Priority #1** - Add order pagination → Performance issue

### Phase 3 (IMPORTANT - Week 1)
9. Fix High Priority #3 - Proper address validation
10. Fix High Priority #6 - Add transaction support
11. Fix High Priority #7 - File upload validation
12. Fix Medium Priority Issues - Code quality and edge cases

---

## 📋 Testing Checklist After Fixes

- [ ] Create order via cart → address saved correctly in database
- [ ] Check `endereco_entrega` field structure in pedidos table
- [ ] Verify admin can view orders without seeing data loss
- [ ] Test webhook call fires after order creation
- [ ] Verify WhatsApp notification toggle works
- [ ] Test upload with non-image files (should reject)
- [ ] Load 100+ orders → check pagination and performance
- [ ] Test admin settings save → verify all fields persisted
- [ ] Attempt API access without auth → should get 401
- [ ] Check database for orphaned orders (orders without items)

---

## 📝 Migration Script Needed

After fixing address structure, existing orders with malformed `endereco_entrega` need cleanup:

```sql
-- Backup first!
UPDATE pedidos SET endereco_entrega = 
  jsonb_build_object(
    'rua', COALESCE((endereco_entrega->>'rua'), 'Não informado'),
    'numero', COALESCE((endereco_entrega->>'numero'), '0'),
    'bairro', COALESCE((endereco_entrega->>'bairro'), 'Não informado'),
    'cidade', 'Ouricuri',
    'cep', '',
    'complemento', COALESCE((endereco_entrega->>'completo'), '')
  )
WHERE endereco_entrega ? 'completo' OR endereco_entrega ? 'rua' IS NULL;
```

---

## 🎯 Summary Statistics

| Category  | Count  | Severity        |
| --------- | ------ | --------------- |
| CRITICAL  | 8      | 🔴 **MUST FIX**  |
| HIGH      | 12     | 🔴 **URGENT**    |
| MEDIUM    | 9      | 🟡 **IMPORTANT** |
| **TOTAL** | **29** |                 |

**Estimated Fix Time:** 40-60 hours for complete remediation

**Current Status:** ⛔ **NOT PRODUCTION READY**

