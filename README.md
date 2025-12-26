# VibeSDK v31 - Build Fix

## Was ist drin:

**2 Files die du auf GitHub ersetzen musst:**

1. `src/routes/chat/chat.tsx`
2. `worker/agents/core/state.ts`

## Installation:

Öffne jedes File in GitHub und ersetze den Inhalt:

### 1. src/routes/chat/chat.tsx
- GitHub öffnen → File öffnen → Edit (Stift) → Alles löschen → Neuen Inhalt reinkopieren → Commit

### 2. worker/agents/core/state.ts  
- GitHub öffnen → File öffnen → Edit (Stift) → Alles löschen → Neuen Inhalt reinkopieren → Commit

## Was wurde gefixt:

### chat.tsx
- ❌ MoneyFlow Imports entfernt
- ❌ moneyFlowState entfernt
- ❌ money_flow_event Handler entfernt
- ❌ MoneyFlowTracker Component entfernt
- ✅ Fehlende Klammer gefixt (Zeile 184)

### state.ts
- ❌ Unused AgentActionKey Import entfernt

Dann sollte der Build laufen! ✅
