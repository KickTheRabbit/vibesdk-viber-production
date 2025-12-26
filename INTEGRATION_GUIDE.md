# Integration Guide - chat.tsx

## Änderungen für `src/routes/chat/chat.tsx`

### 1. Import hinzufügen

**Finde diese Imports (ca. Zeile 35):**
```typescript
import { ImageAttachmentPreview } from '@/components/image-attachment-preview';
import { createAIMessage } from './utils/message-helpers';
```

**Füge darunter hinzu:**
```typescript
import { MoneyFlowDisplay } from '@/components/MoneyFlowDisplay';
```

### 2. Component einbauen

**Finde das Ende der Component (ca. Zeile 1100+):**

Suche nach dem **letzten `</div>`** vor dem `return` Statement Ende.

**Füge VOR dem letzten `</div>` hinzu:**
```typescript
			{/* Money Flow Tracker */}
			<MoneyFlowDisplay websocket={websocket} />
		</div>
```

## Komplettes Beispiel

So sollte das Ende der Component aussehen:

```typescript
			{/* Existing content... */}
			
			{/* Money Flow Tracker */}
			<MoneyFlowDisplay websocket={websocket} />
		</div>
	);
}
```

**Das wars!** Nach dem Commit solltest du unten rechts das Money Flow Panel sehen wenn AI Calls gemacht werden.
