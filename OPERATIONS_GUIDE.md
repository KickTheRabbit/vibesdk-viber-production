# Operations Integration - 7 Files zu ändern

Jede Operation muss den `agent` Parameter an `executeInference()` übergeben.

## Die Änderung

**VORHER:**
```typescript
const result = await executeInference({
    env: env,
    messages: messagesForInference,
    agentActionName: "conversationalResponse",
    context: options.inferenceContext,
    // ... weitere params
});
```

**NACHHER:**
```typescript
const result = await executeInference({
    env: env,
    messages: messagesForInference,
    agentActionName: "conversationalResponse",
    context: options.inferenceContext,
    agent: options.agent,  // <-- Diese EINE Zeile hinzufügen
    // ... weitere params
});
```

## Files die geändert werden müssen

1. `worker/agents/operations/UserConversationProcessor.ts` - Suche nach `executeInference`
2. `worker/agents/operations/PhaseGeneration.ts` - Suche nach `executeInference`
3. `worker/agents/operations/PhaseImplementation.ts` - Suche nach `executeInference`
4. `worker/agents/operations/CodeReview.ts` - Suche nach `executeInference`
5. `worker/agents/operations/FileRegeneration.ts` - Suche nach `executeInference`
6. `worker/agents/operations/FastCodeFixer.ts` - Suche nach `executeInference`
7. `worker/agents/operations/ScreenshotAnalysis.ts` - Suche nach `executeInference`

## Wie machen?

**Option 1: Manuell** (GitHub Web Interface)
- Öffne jedes File
- Suche nach `executeInference({`
- Füge `agent: options.agent,` hinzu
- Commit

**Option 2: Lokal mit Find & Replace**
Wenn du lokal arbeitest, kannst du alle auf einmal ändern.

Das wars! Nach diesen 7 kleinen Änderungen funktioniert Money Flow Tracking. 🎉
