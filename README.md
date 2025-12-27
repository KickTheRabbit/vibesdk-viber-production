# Money Flow Tracker v33 - Fixed & Working

## Was ist das?

Ein einfacher Money Flow Tracker der **automatisch** die Kosten jeder AI-Operation trackt und live anzeigt.

**Keine Callbacks, keine 12 Stellen ändern, keine OpenRouter API abfragen.**

## Installation

### 1. Backend (2 Files)

**Ersetze diese Files:**
1. `worker/agents/inferutils/core.ts`
2. `worker/agents/inferutils/infer.ts`

**Was wurde geändert:**
- `core.ts`: Cost Tracking Logik hinzugefügt (Zeilen 678-704)
- `infer.ts`: `agent` Parameter hinzugefügt, `broadcastCost` Callback erstellt

### 2. Frontend (2 Files + Integration)

**Files hinzufügen:**
1. `src/types/moneyFlow.ts` - TypeScript Types
2. `src/components/MoneyFlowDisplay.tsx` - Display Component

**Integration in Operations:**

Die Operations müssen den `agent` Parameter an `executeInference` übergeben:

```typescript
// In jeder Operation (z.B. UserConversationProcessor.ts)
const result = await executeInference({
    env,
    messages,
    agentActionName: "conversationalResponse",
    context: options.inferenceContext,
    agent: options.agent,  // <-- Diese Zeile hinzufügen
    // ... rest of params
});
```

**Betroffen sind diese Files:**
- `worker/agents/operations/UserConversationProcessor.ts`
- `worker/agents/operations/PhaseGeneration.ts`
- `worker/agents/operations/PhaseImplementation.ts`
- `worker/agents/operations/CodeReview.ts`
- `worker/agents/operations/FileRegeneration.ts`
- `worker/agents/operations/FastCodeFixer.ts`
- `worker/agents/operations/ScreenshotAnalysis.ts`

**Frontend Integration in `src/routes/chat/chat.tsx`:**

```typescript
// 1. Import hinzufügen
import { MoneyFlowDisplay } from '@/components/MoneyFlowDisplay';

// 2. Component einbauen (ganz am Ende)
<MoneyFlowDisplay websocket={websocket} />
```

## Wie es funktioniert

```
User Action
    ↓
Operation (z.B. UserConversationProcessor)
    ↓
executeInference() mit agent parameter
    ↓
Erstellt broadcastCost callback
    ↓
infer() in core.ts  
    ↓
OpenRouter API Call
    ↓
Response mit usage Daten
    ↓
broadcastCost() wird aufgerufen
    ↓
agent.broadcast('money_flow_event', costEvent)
    ↓
WebSocket → Frontend
    ↓
MoneyFlowDisplay zeigt's an
```

## Features

✅ **Echtzeit** - Sofort wenn AI-Call fertig ist
✅ **Automatisch** - Cost wird in core.ts berechnet
✅ **Zentral** - Nur 2 Backend-Files + 7 Zeilen in Operations
✅ **Type-safe** - Alles sauber typisiert
✅ **Performance** - Nur last 10 Events anzeigen

## Warum dieser Ansatz?

- `env.AGENTS` existiert nicht in Cloudflare Env
- Direkter Broadcast aus `core.ts` nicht möglich
- **Lösung**: `agent` Parameter durchreichen, dann `agent.broadcast()` nutzen
- Operations haben eh schon Zugriff auf `options.agent`

Das wars! 🎉
