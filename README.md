# v34 - Operations Patch

## Was ist das?

Alle 7 Operations mit `agent: options.agent,` gepatched.

## Files

6 Operations (FileRegeneration nutzt kein executeInference):

1. `UserConversationProcessor.ts` - 2 Calls gepatched
2. `PhaseGeneration.ts` - 1 Call gepatched
3. `PhaseImplementation.ts` - 2 Calls gepatched
4. `CodeReview.ts` - 1 Call gepatched
5. `FastCodeFixer.ts` - 1 Call gepatched
6. `ScreenshotAnalysis.ts` - 1 Call gepatched

## Installation

Ersetze alle 6 Files in `worker/agents/operations/`

## Das wars

Nach Upload + Deploy sollte Money Flow funktionieren.
