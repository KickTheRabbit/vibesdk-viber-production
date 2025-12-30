# Cost Tracking Integration for core.ts

## Changes Required in worker/agents/inferutils/core.ts

### 1. Add imports at top of file (around line 1-26)

Add after existing imports:
```typescript
import { calculateCost, TokenUsage } from './costTracking';
import { WebSocketMessageResponses } from '../constants';
```

### 2. Modify the infer() function signature

The function needs access to a broadcast callback to send cost events.
Current signature (around line 306):
```typescript
export async function infer<T extends z.AnyZodObject = z.AnyZodObject>(
```

Add optional parameter to InferArgsBase interface (around line 306):
```typescript
type InferArgsBase = {
    env: Env;
    metadata: InferenceMetadata;
    actionKey: AgentActionKey | 'testModelConfig';
    messages: Message[];
    maxTokens?: number;
    modelName: AIModels | string;
    reasoning_effort?: ReasoningEffort;
    temperature?: number;
    stream?: {
        chunk_size: number;
        onChunk: (chunk: string) => void;
    };
    tools?: ToolDefinition<any, any>[];
    providerOverride?: 'cloudflare' | 'direct';
    userApiKeys?: Record<string, string>;
    // NEW: Add cost tracking callback
    onCostEvent?: (event: {
        action: AgentActionKey | 'testModelConfig';
        model: string;
        tokens: TokenUsage;
        cost: number;
        timestamp: number;
    }) => void;
};
```

### 3. Extract usage data and calculate cost

Around line 664-666 where token usage is logged:
```typescript
// CURRENT CODE:
const totalTokens = (response as OpenAI.ChatCompletion).usage?.total_tokens;
console.log(`Total tokens used in prompt: ${totalTokens}`);

// REPLACE WITH:
const usage = (response as OpenAI.ChatCompletion).usage;
if (usage) {
    const totalTokens = usage.total_tokens;
    console.log(`Total tokens used in prompt: ${totalTokens}`);
    
    // Calculate cost
    const tokenUsage: TokenUsage = {
        prompt_tokens: usage.prompt_tokens || 0,
        completion_tokens: usage.completion_tokens || 0,
        total_tokens: totalTokens || 0
    };
    
    const costData = calculateCost(tokenUsage, modelName);
    console.log(`Cost for ${actionKey}: $${costData.cost.toFixed(4)} (${modelName})`);
    
    // Broadcast cost event if callback provided
    if (onCostEvent) {
        onCostEvent({
            action: actionKey,
            model: modelName,
            tokens: tokenUsage,
            cost: costData.cost,
            timestamp: Date.now()
        });
    }
}
```

### 4. Handle streaming case

For streaming responses, we need to extract usage after the stream completes.
Around line 612-642 (end of streaming block), add:

```typescript
// After stream completes, get usage if available
// Note: Some providers don't return usage in streaming mode
// In that case, we'd need to estimate or skip cost tracking for streams
```

## Note on Streaming

OpenAI's streaming API doesn't always return token usage in the final chunk.
For now, we'll focus on non-streaming responses where usage is reliably available.
Streaming cost tracking can be added later by:
1. Estimating tokens during stream
2. Or waiting for final usage in last chunk (provider-dependent)

## Testing

After integration:
1. Make a simple API call
2. Check console logs for "Cost for X: $Y.ZZZZ"
3. Verify cost calculation matches expected (tokens * model price)
