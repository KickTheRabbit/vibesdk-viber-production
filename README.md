# v36 - Stream Usage Fix

## Das Problem

Cost tracking funktionierte nur für **non-streaming** Operations.

Streaming Operations (UserConversationProcessor, PhaseImplementation) hatten kein usage tracking.

Deshalb sahst du nur `projectSetup` (non-streaming).

## Die Lösung

**1. Stream Options aktiviert:**
```typescript
stream_options: stream ? { include_usage: true } : undefined
```

OpenAI/OpenRouter sendet jetzt usage im letzten Stream Chunk.

**2. Usage aus Stream gesammelt:**
```typescript
let streamUsage: { prompt_tokens, completion_tokens, total_tokens } | undefined;
// Im Stream Loop:
if ((event as any).usage) {
    streamUsage = (event as any).usage;
}
```

**3. Unified Cost Tracking:**
```typescript
const usage = stream ? streamUsage : (response as OpenAI.ChatCompletion).usage;
// Jetzt für BEIDE Fälle!
```

## Installation

Ersetze:
- `worker/agents/inferutils/core.ts`

## Das sollte es sein

Jetzt solltest du Cost Events für **ALLE** Operations sehen:
- conversationalResponse (streaming)
- phaseGeneration (non-streaming)
- phaseImplementation (streaming)
- codeReview (non-streaming)
- fastCodeFixer (non-streaming)
- screenshotAnalysis (non-streaming)
- projectSetup (non-streaming)
