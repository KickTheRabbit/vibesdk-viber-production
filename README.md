# 💰 MONEY TRACKER v21 - OPENROUTER METADATA

## 🎯 WAS IST v21?

**OpenRouter Metadata im Request Body statt Header!**

Jetzt sollte in OpenRouter Dashboard die "App" Column gefüllt sein mit:
- blueprint
- phaseGeneration
- projectSetup
- etc.

---

## 📦 ÄNDERUNG:

### worker/agents/inferutils/core.ts (Line ~548)

**VORHER (v12):**
```typescript
response = await client.chat.completions.create({
    model: modelName,
    messages: [...],
    // ... kein metadata im body
}, {
    headers: {
        "cf-aig-metadata": JSON.stringify({ actionKey, ... })
    }
});
```

**NACHHER (v21):**
```typescript
response = await client.chat.completions.create({
    model: modelName,
    messages: [...],
    // OpenRouter metadata - visible in dashboard!
    metadata: {
        action: actionKey,  // ← blueprint, phaseGeneration, etc
        chatId: metadata.agentId,
        userId: metadata.userId,
        schemaName: schemaName || 'none'
    }
}, {
    headers: {
        "cf-aig-metadata": JSON.stringify({ ... })  // Bleibt für Cloudflare
    }
});
```

---

## 🧪 TEST:

1. Deploy v21
2. Neues Projekt erstellen
3. **OpenRouter Dashboard → Activity**
4. **Check "App" Column**

**Du solltest sehen:**
```
App: blueprint
App: phaseGeneration
App: projectSetup
...
```

---

## ✅ WENN DAS FUNKTIONIERT:

Dann können wir im nächsten Schritt den Money Flow Tracker bauen der die OpenRouter API ausliest und die Kosten pro "action" anzeigt!

---

**Version:** v21  
**Date:** 2024-12-21  
**Purpose:** OpenRouter Metadata Tags sichtbar machen  
**Files:** 1 (core.ts)
