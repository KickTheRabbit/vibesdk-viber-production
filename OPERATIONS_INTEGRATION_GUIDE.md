# Money Flow Tracker - Operations Integration Guide

## ✅ Was wurde gefixt:

**File:** `worker/agents/inferutils/infer.ts`

### 1. Import hinzugefügt:
```typescript
import { CostTrackingEvent } from '../core/state';
```

### 2. Interface erweitert:
```typescript
interface InferenceParamsBase {
    // ... existing fields
    onCostEvent?: (event: CostTrackingEvent) => void;  // <-- ADDED
}
```

### 3. onCostEvent durchgereicht:
```typescript
export async function executeInference({
    // ... existing params
    onCostEvent  // <-- ADDED
}: InferenceParamsBase) {
    
    // In beiden infer() calls hinzugefügt:
    const result = schema ? await infer({
        // ... params
        onCostEvent,  // <-- ADDED
    }) : await infer({
        // ... params  
        onCostEvent,  // <-- ADDED
    });
}
```

---

## 🔧 Wie Operations jetzt onCostEvent nutzen:

### Beispiel: UserConversationProcessor.ts

**VORHER:**
```typescript
const result = await executeInference({
    env: env,
    messages: messagesForInference,
    agentActionName: "conversationalResponse",
    context: options.inferenceContext,
    tools,
    stream: {
        onChunk: (chunk) => { /* ... */ }
    }
});
```

**NACHHER:**
```typescript
const result = await executeInference({
    env: env,
    messages: messagesForInference,
    agentActionName: "conversationalResponse",
    context: options.inferenceContext,
    tools,
    stream: {
        onChunk: (chunk) => { /* ... */ }
    },
    onCostEvent: (event) => options.agent.broadcastCostEvent(event)  // <-- ADDED
});
```

---

## 📝 Operations die gefixt werden müssen:

Alle Operations die `executeInference` aufrufen müssen diese Zeile hinzufügen:

```typescript
onCostEvent: (event) => options.agent.broadcastCostEvent(event)
```

**Liste der Files:**
1. ✅ `worker/agents/operations/UserConversationProcessor.ts`
2. ✅ `worker/agents/operations/PhaseGeneration.ts`
3. ✅ `worker/agents/operations/PhaseImplementation.ts`
4. ✅ `worker/agents/operations/CodeReview.ts`
5. ✅ `worker/agents/operations/FileRegeneration.ts`
6. ✅ `worker/agents/operations/FastCodeFixer.ts`
7. ✅ `worker/agents/operations/ScreenshotAnalysis.ts`

---

## 🎯 Warum dieser Ansatz?

**Vorteile:**
- ✅ Zentral: Nur `infer.ts` ändern
- ✅ Opt-in: Operations können selbst entscheiden ob sie Costs tracken
- ✅ Testbar: onCostEvent kann gemockt werden
- ✅ Sauber: Agent behält Kontrolle über Broadcasting

**Alternative wäre gewesen:**
- ❌ Direct broadcast in core.ts → braucht Agent-Referenz (zu tight coupled)
- ❌ Global singleton → nicht testbar
- ❌ Event emitter → overkill

---

## 🚀 Deployment:

Diese eine Datei deployen:
```
worker/agents/inferutils/infer.ts
```

Dann Operations einzeln fixen (schrittweise möglich).

**Reihenfolge:**
1. `UserConversationProcessor` (für Chat)
2. `PhaseImplementation` (für Code Generation)
3. Rest nach Bedarf
