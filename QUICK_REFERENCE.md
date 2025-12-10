# ⚡ Quick Reference Card

## 8 CRITICAL BUGS - Fix in This Order

### 1️⃣ ADDRESS STRUCTURE MISMATCH
```
File: client/src/components/cart-drawer.tsx:118-134
Time: 30 min | Risk: 🔴 HIGH

THE PROBLEM:
Frontend: { rua, numero, completo }
Database: { rua, numero, bairro, cidade, cep, complemento }

THE FIX:
Replace 'completo' with proper fields
Use parseAddress() helper function
Test: Create order → Check DB

CODE:
// OLD (WRONG):
endereco: {
  rua: address.split(',')[0],
  numero: '0',
  completo: address  // ❌ WRONG
}

// NEW (RIGHT):
const parseAddress = (addr: string) => ({
  rua: addr.split(',')[0],
  numero: addr.match(/\d+/)?.[0] || '0',
  bairro: addr.split(',')[1] || 'N/A',
  cidade: addr.split(',')[2] || 'Ouricuri',
  cep: '',
  complemento: addr
});
```

---

### 2️⃣ DUPLICATE ORDERS PROPERTY
```
File: client/src/lib/admin-store.ts:64
Time: 5 min | Risk: 🔴 HIGH

THE PROBLEM:
orders: initialOrders,  // Line 57
...
orders: initialOrders,  // Line 64 - DUPLICATE!

THE FIX:
Delete line 64, keep only first declaration
Move orders to beginning of state object

TEST:
npm run check → No TypeScript errors
Open admin dashboard → Orders load
```

---

### 3️⃣ NO AUTHENTICATION ON ADMIN ROUTES
```
File: server/routes.ts:42-66
Time: 45 min | Risk: 🔴 SECURITY CRITICAL

THE PROBLEM:
app.get("/api/configuracoes", async (req, res) => {
  // NO AUTH CHECK! Anyone can read this
  const result = await db.query.configuracoes.findFirst(...);
  res.json(result); // Sends Supabase keys!
});

THE FIX:
Add auth middleware
app.get("/api/configuracoes", requireAuth, async (req, res) => {

Test:
fetch('/api/configuracoes') → Should get 401
fetch with valid session → Should work

MIDDLEWARE CODE:
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
```

---

### 4️⃣ WEBHOOK NEVER TRIGGERED
```
File: server/routes.ts:325-377
Time: 60 min | Risk: 🔴 HIGH (automation broken)

THE PROBLEM:
Orders created but webhook_url never called
n8n never receives order data
Automation system never runs

THE FIX:
After order creation:
1. Fetch webhook URL from configuracoes
2. POST order data to webhook
3. Trigger asynchronously (don't wait)

CODE SNIPPET:
const config = await db.query.configuracoes.findFirst({
  where: eq(configuracoes.id, 1)
});

if (config?.webhook_url) {
  fetch(config.webhook_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pedido_id, itens, total, ... })
  }).catch(err => console.error('Webhook failed:', err));
}
```

---

### 5️⃣ WHATSAPP NOTIFICATIONS NOT IMPLEMENTED
```
File: admin-store.ts, routes.ts (multiple)
Time: 90 min | Risk: 🟠 HIGH (feature broken)

THE PROBLEM:
whatsapp_notification toggle exists in UI
But no code sends actual WhatsApp messages
Customers never get notified

THE FIX:
Create server/whatsapp-service.ts
Implement sendWhatsAppNotification(phone, message)
Call after order creation and status updates

WHICH SERVICE?
1. Twilio (recommended) - reliable
2. n8n webhook - already integrated
3. Custom provider - your choice

EXAMPLE:
async function sendWhatsAppNotification(phone: string, msg: string) {
  const config = await db.query.configuracoes.findFirst(...);
  if (!config?.whatsapp_notification) return;
  
  // Send via Twilio/n8n/etc
  const response = await fetch(...);
}
```

---

### 6️⃣ LOGO UPLOAD NOT PERSISTED
```
File: client/src/pages/admin/settings.tsx:88-110
Time: 20 min | Risk: 🟠 MEDIUM (data loss)

THE PROBLEM:
Logo uploaded successfully
Shows "saved" message
User navigates away
Logo resets on refresh (not in DB)

THE FIX:
After successful upload:
1. Update local state
2. Immediately call PUT /api/configuracoes
3. Show actual save confirmation

CODE:
const handleLogoUpload = async (file) => {
  // Upload to Supabase
  const { publicUrl } = await uploadResponse.json();
  
  // Update local state
  const newData = { ...formData, logo_url: publicUrl };
  setFormData(newData);
  
  // IMMEDIATELY SAVE (this is the key!)
  const saveResponse = await fetch('/api/configuracoes', {
    method: 'PUT',
    body: JSON.stringify({ ...newData })
  });
  
  if (saveResponse.ok) {
    toast({ description: "Logo saved to database!" });
  }
};
```

---

### 7️⃣ TOTAL FIELD TYPE MISMATCH
```
File: server/routes.ts:349
Time: 10 min | Risk: 🔴 HIGH (data corruption)

THE PROBLEM:
JavaScript Number converted to STRING
Saved to Decimal field in PostgreSQL
Type coercion issues possible

THE FIX:
Change:
total: total.toString()  // ❌ Wrong

To:
total: new Decimal(total).toString()  // or keep as number

Or even better:
import { Decimal } from 'decimal.js';
total: new Decimal(total)  // Let Drizzle handle serialization
```

---

### 8️⃣ UNAUTHORIZED ACCESS TO ADMIN SETTINGS
```
File: server/routes.ts:42-66
Time: 45 min | Risk: 🔴 SECURITY CRITICAL

THE PROBLEM:
No authentication on GET/PUT /api/configuracoes
Anyone can:
- Read Supabase credentials
- Read webhook URLs
- Modify phone numbers
- Change all settings

THE FIX:
1. Add authentication middleware (same as #3)
2. Apply to all admin routes
3. Verify in token/session

ROUTES TO PROTECT:
[ ] GET /api/configuracoes
[ ] PUT /api/configuracoes
[ ] POST /api/cardapio
[ ] PUT /api/cardapio/:id
[ ] GET /api/admin/pedidos
```

---

## Additional HIGH PRIORITY Issues (Quick Fixes)

### 9. NO PAGINATION ON ORDERS
**File:** `routes.ts:297-313`  
**Issue:** Fetches ALL orders at once + N+1 queries  
**Fix:** Add `limit` and `offset` parameters  
**Time:** 90 min

```typescript
// Add pagination
const page = parseInt(req.query.page) || 1;
const limit = 20;
const offset = (page - 1) * limit;

const orders = await db.select()
  .from(pedidos)
  .limit(limit)
  .offset(offset);
```

### 10. HARDCODED PHONE NUMBER
**File:** `cart-drawer.tsx:78`  
**Issue:** `"5587999480699"` hardcoded, ignores admin config  
**Fix:** Load from `/api/configuracoes`  
**Time:** 30 min

```typescript
useEffect(() => {
  fetch('/api/configuracoes')
    .then(r => r.json())
    .then(config => setWhatsappPhone(config.telefone));
}, []);
```

### 11. NO TRANSACTION SUPPORT
**File:** `routes.ts:325-377`  
**Issue:** If item insert fails, order exists without items  
**Fix:** Wrap in `db.transaction()`  
**Time:** 60 min

```typescript
const result = await db.transaction(async (tx) => {
  const pedido = await tx.insert(pedidos).values(...);
  for (const item of itens) {
    await tx.insert(itens_pedido).values(...);
  }
  return pedido;
});
```

### 12. IMAGE UPLOAD VALIDATION
**File:** `routes.ts:24-43`  
**Issue:** No MIME type validation, accepts any file  
**Fix:** Validate file type and sanitize filename  
**Time:** 45 min

```typescript
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
if (!ALLOWED.includes(file.mimetype)) {
  return res.status(400).json({ error: "Invalid file type" });
}
```

---

## Testing Checklist (After Each Fix)

```
✅ FIX #1: Create order with address
   [ ] Check pedidos.endereco_entrega in DB
   [ ] Verify all 6 fields present
   
✅ FIX #2: Open admin dashboard
   [ ] No console errors
   [ ] Orders load correctly
   
✅ FIX #3: Try API without session
   [ ] GET /api/configuracoes → 401
   [ ] PUT /api/configuracoes → 401
   
✅ FIX #4: Create order
   [ ] Check n8n logs for webhook
   [ ] Verify payload received
   
✅ FIX #5: Create order with WhatsApp enabled
   [ ] Check WhatsApp messages
   [ ] Verify content
   
✅ FIX #6: Upload logo
   [ ] Refresh page
   [ ] Verify logo still there
   
✅ FIX #7: Create order
   [ ] Check total in DB
   [ ] Verify it's numeric type
   
✅ FIX #8: Same as #3
```

---

## Estimated Timeline

```
Phase 1 (TODAY): 4-5 hours
├─ Fix #1-8 (critical bugs)
├─ Basic testing
└─ Commit changes

Phase 2 (TOMORROW): 7-8 hours
├─ Fix #9-12 (high priority)
├─ Performance testing
└─ Security audit

Phase 3 (THIS WEEK): 5-6 hours
├─ Medium priority improvements
├─ Code cleanup
└─ Documentation
```

---

## Deploy Checklist

Before pushing to production:

```
Security:
[ ] No hardcoded credentials
[ ] All admin routes protected
[ ] File upload validated
[ ] CORS configured
[ ] Rate limiting enabled

Data:
[ ] All fields correct type
[ ] No orphaned records possible
[ ] Transactions working
[ ] Addresses stored correctly

Functionality:
[ ] Webhook triggers
[ ] WhatsApp sends
[ ] Orders display in admin
[ ] Pagination works
[ ] No N+1 queries

Testing:
[ ] 100+ orders created
[ ] All fields in DB correct
[ ] API response times good
[ ] Admin dashboard responsive
[ ] No console errors
```

---

## Questions?

1. **How urgent?** 🔴 CRITICAL - Deploy blocked until fixes
2. **How risky?** 🔴 HIGH - Data loss/corruption possible
3. **How much work?** ~16-19 hours for complete fix
4. **Start when?** Immediately - each day of delay = more risk
5. **How to prioritize?** Follow Fix #1-8 order

---

**Last Updated:** December 9, 2025  
**Status:** Ready for Implementation  
**Confidence:** High (detailed code review completed)

