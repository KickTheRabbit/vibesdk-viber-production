# CustomVibeAgent V7 - Integration Instructions

## Where to Add the Component

In `src/routes/settings/index.tsx`:

### Step 1: Add Import (at top of file, around line 13)

```typescript
import { AgentConfigPanel } from '@/components/agent-config-panel';
```

### Step 2: Add Component (after Model Configurations card, around line 678)

Find this code:
```typescript
					</CardContent>
				</Card>

				{/* User Secrets Section */}
				<Card id="secrets">
```

Add AgentConfigPanel BEFORE the "User Secrets Section":

```typescript
					</CardContent>
				</Card>

				{/* Universal Agent Configurations */}
				<AgentConfigPanel />

				{/* User Secrets Section */}
				<Card id="secrets">
```

## That's it!

The AgentConfigPanel component will render as a new card between:
- "AI Model Configurations" card (above)
- "API Keys & Secrets" card (below)

## What You'll See

A new card titled "Universal Agent Configurations" with:
- List of all configured agents
- Default Blueprint agent pre-installed
- Buttons to Create/Edit/Delete/Duplicate agents
- Agent details (category, complexity, cost estimate)

## Next Steps

1. Upload these files to GitHub
2. Cloudflare auto-deploys
3. Go to Settings page
4. Scroll down - you'll see the new "Universal Agent Configurations" card
