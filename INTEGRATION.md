# CustomVibeAgent V7 - Integration Guide

## What's Included

All 21 OpenRouter models from your VibeSDK setup in a Settings UI panel.

## How to Integrate

### Step 1: Add Import

In `src/routes/settings/index.tsx`, add this import at the top (around line 13):

```typescript
import { AgentConfigPanel } from '@/components/agent-config-panel';
```

### Step 2: Add Component

Find this section (around line 678):

```typescript
				</CardContent>
			</Card>

			{/* User Secrets Section */}
			<Card id="secrets">
```

Add the AgentConfigPanel BEFORE "User Secrets Section":

```typescript
				</CardContent>
			</Card>

			{/* Universal Agent Configurations */}
			<AgentConfigPanel />

			{/* User Secrets Section */}
			<Card id="secrets">
```

## What You'll See

New card "Universal Agent Configurations" with:
- Pre-installed Blueprint agent
- Create/Edit/Delete/Duplicate buttons
- All 21 models in dropdown when creating agents

## Models Available

**Coding:** Qwen3 Coder, Grok Code Fast
**Claude:** 4 Opus, 4.5 Sonnet, 4 Sonnet, 4.5 Haiku, 3.5 Sonnet
**Gemini:** 2.5 Pro/Flash/Flash Lite, 2.0 Flash
**GPT:** 5 Mini, 4o, 4o Mini, O1, O1 Mini
**Reasoning:** DeepSeek R1, DeepSeek Chat v3.5
**Other:** Mistral Large, Llama 3.3 70B

Total: 21 models
