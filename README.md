# VibeSDK v50 - The Minestrone Fix 🍲

## 🎯 Das Problem (gefunden durch v46 Debug-Logs)


**Blueprint Events kamen nicht im Frontend an, weil:**

```
[QUEUE_COST_EVENT] blueprint - Getting agentStub for agentId: 
                                                               ↑↑↑ LEER!
```

Die agentId war **LEER** beim blueprint-Aufruf!

### Root Cause:

In `simpleGeneratorAgent.ts` Zeile 285:
```typescript
const blueprint = await generateBlueprint({
    // ...
    agentId: this.state.sessionId,  // ← PROBLEM!
```

**Warum war das falsch?**

1. `this.state.sessionId` wird mit `''` initialisiert (Zeile 164)
2. `generateBlueprint()` wird aufgerufen (Zeile 276)
3. `sessionId` wird DANACH erst gesetzt (Zeile 307)

→ Blueprint bekommt leere agentId → Event geht an falschen/keinen Agent → kommt nicht im Frontend an!

## ✅ Die Lösung: **1-Zeilen-Fix!**

### Geänderte Datei:
**worker/agents/core/simpleGeneratorAgent.ts** (Zeile 285)

```typescript
// ❌ VORHER (v45):
agentId: this.state.sessionId,  // Leer zum Zeitpunkt des Aufrufs!

// ✅ NACHHER (v50):
agentId: this.getAgentId(),  // Holt korrekte agentId aus inferenceContext!
```

### Warum funktioniert das?

`getAgentId()` ist bereits definiert und gibt die richtige ID zurück:
```typescript
getAgentId() {
    return this.state.inferenceContext.agentId  // ✅ Hat korrekten Wert!
}
```

Die `inferenceContext.agentId` wird VOR dem Blueprint-Aufruf gesetzt (Zeile 270) und hat immer den richtigen Wert!

## 📊 Erwartetes Ergebnis nach v50

### Vorher (v45/v46):
```
[QUEUE_COST_EVENT] blueprint - Getting agentStub for agentId: 
[QUEUE_COST_EVENT] blueprint - Got agentStub: true
[QUEUE_COST_EVENT] blueprint - Successfully queued event
```
❌ Event wird an falschen Agent geschickt → kommt nicht im Frontend an

### Nachher (v50):
```
[QUEUE_COST_EVENT] blueprint - Getting agentStub for agentId: ef4391fd-e03c-4eb5-a0ae-c54b8aeb0083
[QUEUE_COST_EVENT] blueprint - Got agentStub: true
[QUEUE_COST_EVENT] blueprint - Successfully queued event
```
✅ Event wird an richtigen Agent geschickt → **kommt im Frontend an!**

## 📋 Deployment

### 1. Datei ersetzen

```bash
# Im vibesdk-viber-production Repository:
cd worker/agents/core/

# Optional: Backup
cp simpleGeneratorAgent.ts simpleGeneratorAgent.ts.v45.backup

# v50 Datei kopieren
cp /path/to/v50-minestrone-fix/worker/agents/core/simpleGeneratorAgent.ts .
```

### 2. Build testen

```bash
# Im Repository Root:
bun run build
```

Sollte ohne Errors durchlaufen! ✅

### 3. Git Commit & Push

```bash
git add worker/agents/core/simpleGeneratorAgent.ts
git commit -m "v50: Fix blueprint agentId - use getAgentId() instead of empty sessionId"
git push origin main
```

### 4. Cloudflare Deploy

```bash
wrangler deploy --config wrangler.jsonc
```

### 5. Testen

1. ✅ Neues Projekt erstellen
2. ✅ Cloudflare Logs checken - blueprint sollte jetzt agentId haben!
3. ✅ Browser Console - **blueprint Event sollte jetzt ankommen!** 🎉

## 🔍 Was zu checken ist

### Cloudflare Logs:
```
[QUEUE_COST_EVENT] blueprint - Getting agentStub for agentId: xxx-yyy-zzz
                                                               ↑↑↑ SOLLTE JETZT WERT HABEN!
```

### Browser Console:
Jetzt sollten **10 von 12 Events** ankommen:
- ✅ templateSelection
- ✅ **blueprint** (NEU! 🎉)
- ❌ projectSetup (kommt 2x, eines fehlt noch)
- ❌ firstPhaseImplementation (fehlt noch)
- ✅ phaseImplementation
- ✅ codeReview (2x)
- ✅ fileRegeneration (4x)

## 🎯 Nächste Schritte

**Noch 2 Events fehlen:**
1. projectSetup (eines von zwei)
2. firstPhaseImplementation

Diese nutzen wahrscheinlich AUCH `this.state.sessionId` oder ähnliche Patterns. Können wir nach v50 Test angehen!

## 📝 Version Info

- **Version:** v50 "Minestrone" 🍲
- **Basis:** v45 + v46 Debug-Logs
- **Datum:** 2025-12-29
- **Fix:** 1 Zeile geändert
- **Betroffene Datei:** worker/agents/core/simpleGeneratorAgent.ts (Zeile 285)
- **Status:** Ready to deploy! 🚀
