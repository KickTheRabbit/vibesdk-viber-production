# OpenAgent V1

Universal Agent Configuration System für VibeSDK Enhanced

**Version:** 1.0.0  
**Datum:** 2025-01-01  
**Status:** Initial Release

---

## Was ist OpenAgent?

OpenAgent ist das Universal Agent System für VibeSDK. Es ermöglicht:

✅ **Agent-Konfiguration via UI** - Keine Code-Änderungen nötig  
✅ **11 System-Types vordefiniert** - Blueprint, Code-Fixer, Review, etc.  
✅ **Custom Agents erstellen** - Eigene Agents per Formular  
✅ **Lokale Speicherung** - localStorage (später Backend-Integration)  
✅ **OpenRouter Multi-Model** - 20+ LLMs wählbar

---

## Lieferumfang V1

### Neue Dateien

```
src/
├── components/
│   ├── agent-config-panel.tsx          # Settings Tab Component
│   └── agent-config-modal.tsx          # Agent Config Dialog
├── lib/
│   └── universal-agents/
│       ├── agent-types.ts              # Type System & Helpers
│       └── system-types.ts             # 11 System Type Definitions
└── types/
    └── universal-agent.ts              # TypeScript Interfaces
```

### Dokumentation

```
README.md                               # Diese Datei
INTEGRATION_GUIDE.md                    # Settings Integration
```

**WICHTIG:** Keine package.json Änderungen nötig - alle Dependencies existieren bereits!

---

## Installation

### 1. Dateien Kopieren

Kopiere alle Dateien aus diesem Paket in dein VibeSDK Projekt:

```bash
# Von diesem Mini-Repo:
cp -r src/* /path/to/vibesdk/src/
```

### 2. Settings Integration

Öffne `src/routes/settings/index.tsx` und füge hinzu:

**Import (oben):**
```typescript
import { AgentConfigPanel } from '@/components/agent-config-panel';
```

**Component (im return, nach Model Configurations Card):**
```tsx
{/* Universal Agents */}
<AgentConfigPanel />
```

Details siehe `INTEGRATION_GUIDE.md`

### 3. TypeScript Check

```bash
npm run typecheck
# oder
tsc --noEmit
```

Sollte keine Fehler geben.

---

## Features V1

### ✅ Was funktioniert

**Agent Management:**
- Liste aller konfigurierten Agents
- Create / Edit / Delete / Duplicate
- Default Blueprint Agent vorinstalliert

**Agent Config Dialog:**
- 3 Tabs: Basics, Prompt, LLM Config
- Agent Type Selection (11 System Types + Custom)
- Auto-Category Assignment
- Model Selection (6 Haupt-Modelle)
- Temperature Slider
- Token Limit

**Type System:**
- 11 vordefinierte System Types
- Auto-ID Generation (type-variant-vX.Y.Z)
- Category Auto-Mapping
- Complexity Levels
- Default LLM Configs pro Type

**Storage:**
- localStorage (temporary)
- Vollständige Agent Configs gespeichert
- JSON Import/Export ready

### âš ï¸ Was noch NICHT funktioniert (V2+)

- Backend API Integration
- Universal Agent Engine (Execution)
- Advanced Prompt Blocks (Constraints, Examples, etc.)
- Input/Output Config UI
- Testing Framework UI
- Orchestration Flow UI
- Real Money Tracking Integration

---

## Verwendung

### Agent erstellen

1. Settings öffnen
2. Scroll zu "Universal Agents"
3. "New Agent" klicken
4. Formular ausfüllen:
   - **Agent Type:** z.B. `custom`
   - **Display Name:** "Security Checker"
   - **Description:** "Scans code for vulnerabilities"
   - **Role:** "You are a security expert..."
   - **Task:** "Analyze code for SQL injection, XSS..."
   - **Model:** Claude Sonnet 4.5
   - **Temperature:** 0.3
5. "Create Agent" klicken

### Agent bearbeiten

1. Click Edit-Icon (Stift)
2. Änderungen machen
3. "Save Changes"

### Agent löschen

1. Click Trash-Icon
2. Bestätigen

---

## System Types

V1 liefert 11 vordefinierte Agent Types:

| Type | Category | Default Model | Default Temp | Avg Cost |
|------|----------|---------------|--------------|----------|
| `blueprint` | Planning | Sonnet 4.5 | 0.7 | $0.10 |
| `template-selector` | Planning | Sonnet 4.5 | 0.5 | $0.03 |
| `phase-generator` | Planning | Sonnet 4.5 | 0.6 | $0.08 |
| `phase-implementation` | Code Gen | Sonnet 4.5 | 0.2 | $0.50 |
| `file-regenerator` | Code Gen | Sonnet 4.5 | 0.2 | $0.15 |
| `code-review` | Analysis | Sonnet 4.5 | 0.3 | $0.08 |
| `screenshot-analyzer` | Analysis | Sonnet 4.5 | 0.5 | $0.12 |
| `code-fixer` | Code Fixing | Sonnet 4.5 | 0.2 | $0.15 |
| `fast-code-fixer` | Code Fixing | Flash Lite | 0.1 | $0.01 |
| `conversational` | Communication | Flash Lite | 0.7 | $0.005 |
| `custom` | Custom | User Choice | User Choice | - |

---

## Agent ID Format

```
{type}-{variant?}-v{version}
```

**Beispiele:**
- `blueprint-v1.0.0`
- `blueprint-senior-expert-v1.0.0`
- `custom-security-scanner-v2.1.0`

**Regeln:**
- Type: System Type oder "custom"
- Variant: Optional, lowercase-with-hyphens
- Version: Semantic Versioning (X.Y.Z)

---

## Datenstruktur

Agents werden als JSON in localStorage gespeichert:

```typescript
interface UniversalAgentConfig {
  // Identity
  id: string;
  type: SystemAgentType | 'custom';
  category: AgentCategory;
  displayName: string;
  version: string;
  
  // System Prompt
  systemPrompt: {
    role: string;
    task: string;
    outputFormat: 'json' | 'code' | ...;
    // ... more
  };
  
  // LLM Config
  llm: {
    model: string;
    temperature: number;
    maxTokens: number;
    // ... more
  };
  
  // ... more fields
}
```

Siehe `src/types/universal-agent.ts` für vollständige Definition.

---

## Roadmap

### V2 - Advanced Config UI
- Input/Output Field Editor
- Constraint Builder
- Example Manager
- Context Injection Editor

### V3 - Orchestration
- Trigger Config UI
- Dependency Graph Visualizer
- Flow Designer

### V4 - Testing & Execution
- Test Case Editor
- Universal Agent Engine
- Live Testing
- Cost Estimation

### V5 - Backend Integration
- API statt localStorage
- R2 Storage
- Multi-User
- Versioning & Migration

---

## Technische Details

### Dependencies

**Existing:**
- React 18+
- shadcn/ui components
- TypeScript 5+

**Neu benötigt:**
- Keine! Nutzt vorhandene UI Components

### Browser Support

- localStorage API (alle modernen Browser)
- JSON.stringify/parse (standard)

### Performance

- Lazy Loading: Agent Configs nur bei Settings-Besuch geladen
- Small Footprint: ~3KB gzipped für Type System
- No Runtime Overhead: Nur UI, keine Agent Execution

---

## Migration Path

### Von Current VibeSDK

1. **Aktuell:** Hardcoded Agent Functions
2. **V1:** Config UI erstellt Agents
3. **V2-V3:** Configs werden editable
4. **V4:** Universal Agent Engine ersetzt Functions
5. **V5:** Alte Functions deprecated

**Parallel laufen:**
- V1-V3: Alte Agent Functions bleiben
- V4: Feature Flag für neue Engine
- V5: Old code removal

---

## Support & Feedback

**Issues:** Sammle in `decisions-log.md`  
**Questions:** Dokumentiere in `user-questions.md`  
**Learning:** Track in `tried-and-learned.md`

---

## Changelog

### V1.0.0 - 2025-01-01

**Added:**
- Agent Config Panel Component
- Agent Config Modal (3 Tabs)
- Type System (11 System Types)
- Default Blueprint Agent
- localStorage Persistence
- Integration Guide

**Not Included (Future):**
- Backend API Integration
- Universal Agent Engine
- Advanced Config UI
- Testing Framework
- Orchestration UI

---

## Credits

**Built for:** Ralph's VibeSDK Enhanced  
**Philosophy:** "Viben ≠ Kontrollverlust"  
**Goal:** No-code agent configuration with full transparency

---

**Status:** Ready to integrate ✅  
**Next Step:** Copy to VibeSDK, integrate into Settings, test in browser
