# 💰 MONEY TRACKER v23 - EINDEUTIGE APP-NAMEN!

## 🎯 WAS IST v23?

**Jede Action bekommt einen EINDEUTIGEN App-Namen!**

Problem in v22: OpenRouter überschreibt alle Calls mit dem letzten X-Title
Lösung in v23: Jede Action ist eine separate "App"

---

## 📦 ÄNDERUNG:

### worker/agents/inferutils/core.ts (Line ~558)

**v22 (FALSCH):**
```typescript
headers: {
    "X-Title": actionKey  // ← Alle bekommen den gleichen Namen!
}
```

**v23 (RICHTIG):**
```typescript
headers: {
    "HTTP-Referer": `https://vibesdk.com/${actionKey}`,  // ← blueprint, phaseGeneration, etc
    "X-Title": `VibeSDK: ${actionKey}`                   // ← Eindeutig pro Action!
}
```

---

## 🧪 TEST:

1. Deploy v23
2. Neues Projekt erstellen
3. **OpenRouter Dashboard → Activity**

**Du solltest sehen:**
```
App
────────────────────────────
VibeSDK: templateSelection
VibeSDK: blueprint
VibeSDK: phaseGeneration
VibeSDK: projectSetup
VibeSDK: phaseImplementation
VibeSDK: codeReview
...
```

**UND sie bleiben FIX!** Werden nicht mehr überschrieben!

---

## ✅ WARUM DAS FUNKTIONIERT:

- Unterschiedliche `HTTP-Referer` URLs = Unterschiedliche Apps
- Unterschiedliche `X-Title` = Unterschiedliche App-Namen
- OpenRouter kann sie nicht mehr verwechseln!

---

## 🎯 DANN:

**Wenn das klappt → v24 mit Money Flow Tracker UI!**

Der liest die OpenRouter Daten aus und zeigt sie schön an!

---

**Version:** v23  
**Date:** 2024-12-21  
**Purpose:** Fix OpenRouter App-Name Overwriting  
**Files:** 1 (core.ts)
