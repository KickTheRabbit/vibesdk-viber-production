# Money Flow Tracker v32 - Simple & Clean

## Was ist das?

Ein einfacher Money Flow Tracker der **automatisch** die Kosten jeder AI-Operation trackt und live anzeigt.

**Keine Callbacks, keine 12 Stellen ändern, keine OpenRouter API abfragen.**

## Installation

### 1. Backend (1 File)

**`worker/agents/inferutils/core.ts`**
- Ersetze das komplette File mit der Version aus diesem Package
- Das ist die EINZIGE Backend-Änderung

**Was passiert:**
- Bei jedem AI-Call werden automatisch die `usage` Daten abgegriffen
- Cost wird berechnet mit `costTracking.ts` (die du schon hast)
- Event wird per WebSocket ans Frontend gesendet
- Alles passiert an EINER zentralen Stelle

### 2. Frontend (2 Files + Integration)

**Files hinzufügen:**
1. `src/types/moneyFlow.ts` - TypeScript Types
2. `src/components/MoneyFlowDisplay.tsx` - Display Component

**Integration in `src/routes/chat/chat.tsx`:**

```typescript
// 1. Import hinzufügen (oben)
import { MoneyFlowDisplay } from '@/components/MoneyFlowDisplay';

// 2. Component einbauen (ganz am Ende vor </div>)
<MoneyFlowDisplay websocket={websocket} />
```

**Das wars!** 🎉

## Wie es funktioniert

### Backend Flow:
```
User fragt was
    ↓
executeInference() → infer() in core.ts
    ↓
OpenRouter API Call
    ↓
Response kommt zurück mit `usage` Daten
    ↓
Cost berechnen (Zeile 673-701 in core.ts)
    ↓
WebSocket broadcast an Frontend
```

### Frontend Flow:
```
MoneyFlowDisplay Component
    ↓
Hört auf WebSocket 'money_flow_event'
    ↓
Event kommt rein
    ↓
State updaten (sessionTotal + events)
    ↓
Re-render → User sieht neue Kosten
```

## Was wird angezeigt?

**Floating Panel** unten rechts:
```
┌─────────────────────────┐
│ Session Cost    $0.0156 │
├─────────────────────────┤
│ conversationalResponse  │
│ claude-sonnet • 1,234   │
│                 $0.0045 │
│                         │
│ phaseGeneration         │
│ claude-opus • 2,456     │
│                 $0.0089 │
│                         │
│ ... (last 10)           │
└─────────────────────────┘
```

## Features

✅ **Echtzeit** - Sofort wenn AI-Call fertig ist
✅ **Automatisch** - Keine manuelle Arbeit
✅ **Zentral** - Nur eine Stelle im Code
✅ **Simpel** - Minimales UI
✅ **Performance** - Nur last 10 Events anzeigen
✅ **Kollisions-frei** - Nutzt bestehende WebSocket Infrastruktur

## Troubleshooting

**Keine Events sichtbar?**
1. Check Browser Console - kommen WebSocket Messages an?
2. Check Cloudflare Logs - wird cost geloggt? `[COST] ...`
3. Check ob `websocket` prop nicht null ist

**Build Fehler?**
- Stelle sicher dass `worker/agents/inferutils/costTracking.ts` existiert
- Das ist die Model Pricing Tabelle die wir behalten haben

**Kosten stimmen nicht?**
- Check in `costTracking.ts` ob dein Model drin ist
- Falls nicht, füge es hinzu mit dem richtigen Preis

## Next Steps (Optional)

Wenn du willst kannst du später:
- Größeres Panel mit mehr Details
- Export zu CSV
- Filter nach Action Type
- Graphen / Charts
- Persistent speichern in DB

Aber erstmal: **Keep it simple!** ✨
