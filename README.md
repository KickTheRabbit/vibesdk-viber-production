# 💰 MONEY TRACKER v22 - X-TITLE HEADER!

## 🎯 WAS IST v22?

**OpenRouter App-Tagging via HTTP-Referer + X-Title Headers!**

Das ist der Standard-Weg wie OpenRouter Apps identifiziert!

---

## 📦 ÄNDERUNG:

### worker/agents/inferutils/core.ts (Line ~558)

**NEU:**
```typescript
headers: {
    // OpenRouter App ID tagging
    "HTTP-Referer": "https://vibesdk.com",
    "X-Title": actionKey || "unknown",  // ← blueprint, phaseGeneration, etc!
    
    // Cloudflare (bleibt)
    "cf-aig-metadata": JSON.stringify({ ... })
}
```

---

## 🧪 TEST:

1. Deploy v22
2. Neues Projekt erstellen
3. **OpenRouter Dashboard → Activity**
4. **Check "App" Column**

**Du solltest sehen:**
```
App
────────────────
blueprint
phaseGeneration
projectSetup
phaseImplementation
codeReview
fastCodeFixer
...
```

**Statt:**
```
App
────────────────
Unknown
Unknown
Unknown
```

---

## ✅ WARUM DAS FUNKTIONIERT:

- `X-Title` ist der OFFIZIELLE Weg für OpenRouter App-Namen
- Wird direkt als `app_id` oder App-Name verwendet
- KEINE manuelle Einrichtung nötig
- JEDER Call wird automatisch getaggt

---

## 🎯 WENN DAS KLAPPT:

Dann sehen wir in OpenRouter genau:
- Welcher Call war was
- Was hat wieviel gekostet
- Perfekte Basis für Money Flow Tracker!

---

**Version:** v22  
**Date:** 2024-12-21  
**Purpose:** OpenRouter X-Title Header Tags  
**Files:** 1 (core.ts)

---

## 🚀 NÄCHSTER SCHRITT (v23):

Wenn v22 funktioniert → Money Flow Tracker UI der OpenRouter API ausliest!
