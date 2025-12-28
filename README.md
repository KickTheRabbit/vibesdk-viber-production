# VibeSDK v46 - Money Flow Debug Enhancement

## 🔍 Problem Summary
Von 12 Events die an OpenRouter gesendet werden, kommen nur 9 im Frontend (WebSocket) an.

**Fehlende Events:**
- ❌ blueprint
- ❌ firstPhaseImplementation  
- ❌ projectSetup (zweites Event fehlt)

**Muster:** Alle fehlenden Events nutzen `queueCostEvent()` statt direktem `agent.broadcast()`

## 🎯 Änderungen in v46

### Debug Logging hinzugefügt
Beide Dateien (`blueprint.ts` und `templateSelector.ts`) erhalten **umfangreiches Debug-Logging** in der `queueCostEvent` Funktion:

```typescript
const queueCostEvent = async (event: any) => {
    console.log('[QUEUE_COST_EVENT] blueprint - Starting', {
        agentId,
        eventKeys: Object.keys(event || {}),
        eventSample: event ? JSON.stringify(event).substring(0, 200) : 'null'
    });
    
    try {
        console.log('[QUEUE_COST_EVENT] blueprint - Getting agentStub for agentId:', agentId);
        const agentStub = env.CodeGenObject.get(env.CodeGenObject.idFromName(agentId));
        console.log('[QUEUE_COST_EVENT] blueprint - Got agentStub:', !!agentStub);
        
        console.log('[QUEUE_COST_EVENT] blueprint - Calling queueCostEvent on stub');
        await agentStub.queueCostEvent(event);
        console.log('[QUEUE_COST_EVENT] blueprint - Successfully queued event');
    } catch (error) {
        console.error('[QUEUE_COST_EVENT] blueprint - ERROR:', {
            error: error,
            errorMessage: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : undefined,
            agentId
        });
    }
};
```

Zusätzliches Logging in `broadcastCost`:
```typescript
const broadcastCost = async (type: string, data: any) => {
    console.log('[BROADCAST_COST] blueprint - Called with type:', type, 'hasData:', !!data);
    if (type === 'money_flow_event') {
        console.log('[BROADCAST_COST] blueprint - Calling queueCostEvent');
        await queueCostEvent(data);
    }
};
```

### Geänderte Dateien
1. **worker/agents/planning/blueprint.ts**
   - Erweiterte Debug-Logs in `queueCostEvent()`
   - Erweiterte Debug-Logs in `broadcastCost()`

2. **worker/agents/planning/templateSelector.ts**
   - Erweiterte Debug-Logs in `queueCostEvent()`
   - Erweiterte Debug-Logs in `broadcastCost()`

## 📋 Deployment-Anleitung

### 1. Dateien nach GitHub hochladen
```bash
# In deinem lokalen vibesdk-viber-production Repository:
cd worker/agents/planning/

# Backup der alten Dateien (optional)
cp blueprint.ts blueprint.ts.v45.backup
cp templateSelector.ts templateSelector.ts.v45.backup

# Neue Dateien aus v46 kopieren
# (Dateien aus diesem v46-money-flow-debug Ordner)
cp /path/to/v46-money-flow-debug/worker/agents/planning/blueprint.ts .
cp /path/to/v46-money-flow-debug/worker/agents/planning/templateSelector.ts .

# Commit und Push
git add worker/agents/planning/blueprint.ts worker/agents/planning/templateSelector.ts
git commit -m "v46: Add comprehensive debug logging to queueCostEvent in blueprint and templateSelector"
git push origin main
```

### 2. Cloudflare Build Cache löschen
⚠️ **KRITISCH:** Cloudflare Build Cache **MUSS** gelöscht werden!

```bash
# Im vibesdk-viber-production Root-Verzeichnis:
wrangler deploy --config wrangler.jsonc
```

Falls das nicht hilft:
```bash
# Cache manuell löschen
rm -rf .wrangler
wrangler deploy --config wrangler.jsonc
```

### 3. Neues Projekt erstellen und Logs prüfen

Nach dem Deploy:
1. ✅ Gehe zu https://vibesdk.viber.lol
2. ✅ Erstelle ein **neues Projekt** (z.B. "make a simple todo app")
3. ✅ Öffne **Cloudflare Dashboard** → Workers & Pages → viber-production → Logs
4. ✅ **Live Logs** aktivieren

## 🔎 Erwartete Log-Ausgaben

Nach dem Erstellen eines neuen Projekts solltest du in den Cloudflare Logs sehen:

### Für templateSelection:
```
[BROADCAST_COST] templateSelection - Called with type: money_flow_event hasData: true
[BROADCAST_COST] templateSelection - Calling queueCostEvent
[QUEUE_COST_EVENT] templateSelection - Starting { agentId: '...', eventKeys: [...], eventSample: '...' }
[QUEUE_COST_EVENT] templateSelection - Getting agentStub for agentId: xxx-yyy-zzz
[QUEUE_COST_EVENT] templateSelection - Got agentStub: true
[QUEUE_COST_EVENT] templateSelection - Calling queueCostEvent on stub
[QUEUE_COST_EVENT] templateSelection - Successfully queued event
```

### Für blueprint:
```
[BROADCAST_COST] blueprint - Called with type: money_flow_event hasData: true
[BROADCAST_COST] blueprint - Calling queueCostEvent
[QUEUE_COST_EVENT] blueprint - Starting { agentId: '...', eventKeys: [...], eventSample: '...' }
[QUEUE_COST_EVENT] blueprint - Getting agentStub for agentId: xxx-yyy-zzz
[QUEUE_COST_EVENT] blueprint - Got agentStub: true
[QUEUE_COST_EVENT] blueprint - Calling queueCostEvent on stub
[QUEUE_COST_EVENT] blueprint - Successfully queued event
```

## ❓ Diagnose-Szenarien

### Szenario 1: Logs erscheinen NICHT
**Bedeutet:** `broadcastCost` wird nicht aufgerufen
**Problem:** executeInference ruft broadcast callback nicht auf

### Szenario 2: "[BROADCAST_COST] ... Called" erscheint, aber "[QUEUE_COST_EVENT] ..." fehlt
**Bedeutet:** broadcastCost wird aufgerufen, aber queueCostEvent nicht
**Problem:** `if (type === 'money_flow_event')` Bedingung schlägt fehl

### Szenario 3: "[QUEUE_COST_EVENT] ... Starting" erscheint, dann ERROR
**Bedeutet:** queueCostEvent wird aufgerufen, schlägt aber fehl
**Problem:** Fehler beim Holen von agentStub oder beim Aufruf von queueCostEvent
**→ Error-Details zeigen wo genau es fehlschlägt**

### Szenario 4: "Successfully queued event" erscheint, Event kommt trotzdem nicht im Frontend an
**Bedeutet:** queueCostEvent wird erfolgreich aufgerufen, Event geht danach verloren
**Problem:** Liegt in CodeGenObject.queueCostEvent() oder WebSocket-Broadcast

## 📊 Browser Console Check

Parallel solltest du auch die **Browser Console** prüfen:
1. ✅ F12 → Console Tab öffnen
2. ✅ Filtern nach "money_flow_event" oder "Unhandled message"
3. ✅ Zählen welche Events ankommen

## 🎯 Nächste Schritte nach v46

Sobald du die v46 Logs geprüft hast, können wir basierend auf den Ergebnissen entscheiden:

1. **Wenn `broadcastCost` nicht aufgerufen wird:**
   - Problem liegt in `executeInference` oder `core.ts`
   - Agent-Objekt kommt nicht richtig durch

2. **Wenn `queueCostEvent` fehlschlägt:**
   - Problem liegt bei `CodeGenObject.get()` oder `agentStub.queueCostEvent()`
   - Möglicherweise timing issue oder falscher agentId

3. **Wenn alles erfolgreich ist, Event aber nicht ankommt:**
   - Problem liegt im CodeGenObject Durable Object
   - WebSocket Broadcast funktioniert nicht wie erwartet

## 📝 Version Info
- **Version:** v46
- **Änderungsdatum:** 2025-12-29
- **Hauptziel:** Debugging von queueCostEvent für blueprint & templateSelector
- **Betroffene Dateien:** 2 (blueprint.ts, templateSelector.ts)
