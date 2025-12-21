# blueprint.ts - Required Changes

## Change 1: Add agent to BlueprintGenerationArgs interface

**Location:** Line ~158-172

**FIND:**
```typescript
interface BlueprintGenerationArgs {
    env: Env;
    inferenceContext: InferenceContext;
    query: string;
    language?: string;
    frameworks?: string;
    templateDetails: TemplateDetails;
    templateMetaInfo: TemplateSelection;
    images?: ProcessedImageAttachment[];
    stream?: {
        chunk_size: number;
        onChunk: (chunk: string) => void;
    };
}
```

**REPLACE WITH:**
```typescript
interface BlueprintGenerationArgs {
    env: Env;
    inferenceContext: InferenceContext;
    query: string;
    language?: string;
    frameworks?: string;
    templateDetails: TemplateDetails;
    templateMetaInfo: TemplateSelection;
    images?: ProcessedImageAttachment[];
    stream?: {
        chunk_size: number;
        onChunk: (chunk: string) => void;
    };
    agent: any; // SimpleGeneratorAgent instance for cost broadcasting
}
```

---

## Change 2: Add agent to function signature

**Location:** Line 178

**FIND:**
```typescript
export async function generateBlueprint({ env, inferenceContext, query, language, frameworks, templateDetails, templateMetaInfo, images, stream }: BlueprintGenerationArgs): Promise<Blueprint> {
```

**REPLACE WITH:**
```typescript
export async function generateBlueprint({ env, inferenceContext, query, language, frameworks, templateDetails, templateMetaInfo, images, stream, agent }: BlueprintGenerationArgs): Promise<Blueprint> {
```

---

## Change 3: Add onCostEvent to executeInference

**Location:** Line ~227-234

**FIND:**
```typescript
        const { object: results } = await executeInference({
            env,
            messages,
            agentActionName: "blueprint",
            schema: BlueprintSchema,
            context: inferenceContext,
            stream: stream,
        });
```

**REPLACE WITH:**
```typescript
        const { object: results } = await executeInference({
            env,
            messages,
            agentActionName: "blueprint",
            schema: BlueprintSchema,
            context: inferenceContext,
            stream: stream,
            onCostEvent: agent ? (event) => agent.broadcastCostEvent(event) : undefined,
        });
```

---

**Summary:** 3 small changes to enable cost tracking for blueprint generation.
