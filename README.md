# VibeSDK v46 - Money Flow Debug Enhancement (KORRIGIERT)


## 🔍 Problem Summary
Von 12 Events die an OpenRouter gesendet werden, kommen nur 9 im Frontend (WebSocket) an.

**Fehlende Events:**
- ❌ blueprint
- ❌ firstPhaseImplementation  
- ❌ projectSetup (zweites Event fehlt)

**Muster:** Alle fehlenden Events nutzen `queueCostEvent()` statt direktem `agent.broadcast()`

## ✅ Was ist v46?

**v46 = v45 + Debug-Logging**

Diese Version basiert auf der **funktionierenden v45** und fügt NUR Debug-Logging hinzu.
**KEINE** strukturellen Änderungen, **KEINE** neuen Imports, **KEINE** Type-Änderungen.

## 🎯 Änderungen in v46

### Debug Logging in queueCostEvent()

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

### Debug Logging in broadcastCost()

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
1. **worker/agents/planning/blueprint.ts** (basiert auf v45)
   - Erweiterte Debug-Logs in `queueCostEvent()`
   - Erweiterte Debug-Logs in `broadcastCost()`

2. **worker/agents/planning/templateSelector.ts** (basiert auf v45)
   - Erweiterte Debug-Logs in `queueCostEvent()`
   - Erweiterte Debug-Logs in `broadcastCost()`

## 📋 Deployment-Anleitung

### 1. Dateien ersetzen

```bash
# Im vibesdk-viber-production Repository:
cd worker/agents/planning/

# Optional: Backup
cp blueprint.ts blueprint.ts.v45.backup
cp templateSelector.ts templateSelector.ts.v45.backup

# v46 Dateien kopieren
cp /path/to/v46-money-flow-debug/worker/agents/planning/blueprint.ts .
cp /path/to/v46-money-flow-debug/worker/agents/planning/templateSelector.ts .
```

### 2. Build testen (lokal)

```bash
# Im Repository Root:
bun run build
```

**Sollte ohne Errors durchlaufen!** Falls Errors → v46 nicht korrekt kopiert.

### 3. Git Commit & Push

```bash
git add worker/agents/planning/blueprint.ts worker/agents/planning/templateSelector.ts
git commit -m "v46: Add debug logging to queueCostEvent (based on v45)"
git push origin main
```

### 4. Cloudflare Deploy

```bash
wrangler deploy --config wrangler.jsonc
```

**WICHTIG:** Build Cache wird automatisch gecleart beim Deploy.

### 5. Testen

1. ✅ Gehe zu https://vibesdk.viber.lol
2. ✅ Erstelle **neues Projekt** (z.B. "make a simple todo app")
3. ✅ Cloudflare Dashboard → Workers & Pages → viber-production → Logs
4. ✅ **Live Logs** aktivieren

## 🔎 Erwartete Log-Ausgaben

### templateSelection:
```
[BROADCAST_COST] templateSelection - Called with type: money_flow_event hasData: true
[BROADCAST_COST] templateSelection - Calling queueCostEvent
[QUEUE_COST_EVENT] templateSelection - Starting { agentId: '...', eventKeys: [...] }
[QUEUE_COST_EVENT] templateSelection - Getting agentStub for agentId: xxx-yyy-zzz
[QUEUE_COST_EVENT] templateSelection - Got agentStub: true
[QUEUE_COST_EVENT] templateSelection - Calling queueCostEvent on stub
[QUEUE_COST_EVENT] templateSelection - Successfully queued event
```

### blueprint:
```
[BROADCAST_COST] blueprint - Called with type: money_flow_event hasData: true
[BROADCAST_COST] blueprint - Calling queueCostEvent
[QUEUE_COST_EVENT] blueprint - Starting { agentId: '...', eventKeys: [...] }
[QUEUE_COST_EVENT] blueprint - Getting agentStub for agentId: xxx-yyy-zzz
[QUEUE_COST_EVENT] blueprint - Got agentStub: true
[QUEUE_COST_EVENT] blueprint - Calling queueCostEvent on stub
[QUEUE_COST_EVENT] blueprint - Successfully queued event
```

## ❓ Diagnose-Szenarien

### 1. Keine Logs
→ `broadcastCost` wird nicht aufgerufen  
→ Problem in `executeInference` / `core.ts`

### 2. "[BROADCAST_COST]" aber kein "[QUEUE_COST_EVENT]"
→ Type-Check `type === 'money_flow_event'` schlägt fehl  
→ Falscher Event-Type wird übergeben

### 3. "[QUEUE_COST_EVENT] Starting" dann ERROR
→ Fehler beim Holen von agentStub oder queueCostEvent  
→ Error-Details zeigen exakte Fehlerstelle

### 4. "Successfully queued" aber kein Frontend Event
→ queueCostEvent funktioniert, Event geht danach verloren  
→ Problem in CodeGenObject oder WebSocket-Broadcast

## 🎯 Version Info

- **Version:** v46 (KORRIGIERT)
- **Basis:** v45 (funktionierende Version)
- **Datum:** 2025-12-29
- **Änderung:** NUR Debug-Logging hinzugefügt
- **Betroffene Dateien:** 2 (blueprint.ts, templateSelector.ts)
- **TypeScript Kompatibilität:** ✅ 100% kompatibel mit v45
