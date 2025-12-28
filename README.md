# v42 - Queue Fix (broadcast signature)

## Option 3: Event Queue System

**ALLE 7 Events werden getrackt:**
- templateSelection ✅
- blueprint ✅
- firstPhaseImplementation ✅
- phaseImplementation ✅
- codeReview ✅
- fileRegeneration ✅
- projectSetup ✅

## Wie es funktioniert

**Pre-Generation Events (templateSelection, blueprint):**
1. Events werden in Queue geschrieben (Agent State)
2. Wenn Agent startet → Queue wird geflusht → Events broadcasted
3. Delay: ~150ms (irrelevant)

**Runtime Events (alle anderen):**
- Werden direkt gebroadcastet (wie bisher)

## Files (8 Total)

**Backend:**
1. `worker/agents/core/state.ts` - costEventQueue hinzugefügt
2. `worker/agents/core/simpleGeneratorAgent.ts` - queueCostEvent + flushCostQueue
3. `worker/agents/index.ts` - agentId durchgereicht
4. `worker/agents/planning/blueprint.ts` - Event Queuing
5. `worker/agents/planning/templateSelector.ts` - Event Queuing
6. `worker/agents/assistants/realtimeCodeFixer.ts` - fileRegeneration tracking
7. `worker/agents/operations/FileRegeneration.ts` - agent durchgereicht
8. `worker/api/controllers/agent/controller.ts` - agentId durchgereicht

## Installation

Alle 8 Files ersetzen → Build → FERTIG!

**Dann v37 Frontend für das Panel.**

## Architektur

**Sauber:**
- Planning files kennen nur Queue
- Agent koordiniert Broadcasting
- Events in richtiger Reihenfolge
- Kein tight coupling

1:1 Match mit OpenRouter Billing! 🎉
