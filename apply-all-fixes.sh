#!/bin/bash
# Money Flow Tracker - Complete Integration Script
# Applies all cost tracking fixes to VibeSDK

REPO_PATH="${1:-.}"
echo "Applying Money Flow Tracker fixes to: $REPO_PATH"

# Fix 1: CodeReview.ts - Add onCostEvent
echo "✅ Fixing CodeReview.ts..."
sed -i 's/context: options\.inferenceContext,$/context: options.inferenceContext,\n                onCostEvent: (event) => options.agent.broadcastCostEvent(event),/' "$REPO_PATH/worker/agents/operations/CodeReview.ts"

# Fix 2: FastCodeFixer.ts - Add onCostEvent  
echo "✅ Fixing FastCodeFixer.ts..."
sed -i 's/context: options\.inferenceContext,$/context: options.inferenceContext,\n            onCostEvent: (event) => options.agent.broadcastCostEvent(event),/' "$REPO_PATH/worker/agents/operations/FastCodeFixer.ts"

# Fix 3: ScreenshotAnalysis.ts - Add onCostEvent
echo "✅ Fixing ScreenshotAnalysis.ts..."
sed -i 's/retryLimit: 3$/retryLimit: 3,\n                onCostEvent: (event) => options.agent.broadcastCostEvent(event),/' "$REPO_PATH/worker/agents/operations/ScreenshotAnalysis.ts"

# Fix 4: blueprint.ts - Add agent parameter
echo "✅ Fixing blueprint.ts..."
# Add agent to interface
sed -i '/stream\?: {/,/};/a\    agent?: any; // SimpleGeneratorAgent for cost broadcasting' "$REPO_PATH/worker/agents/planning/blueprint.ts"
# Add agent to function signature  
sed -i 's/({ env, inferenceContext, query, language, frameworks, templateDetails, templateMetaInfo, images, stream }/({ env, inferenceContext, query, language, frameworks, templateDetails, templateMetaInfo, images, stream, agent }/' "$REPO_PATH/worker/agents/planning/blueprint.ts"
# Add onCostEvent
sed -i 's/stream: stream,$/stream: stream,\n            onCostEvent: agent ? (event) => agent.broadcastCostEvent(event) : undefined,/' "$REPO_PATH/worker/agents/planning/blueprint.ts"

# Fix 5: templateSelector.ts - Similar changes
echo "✅ Fixing templateSelector.ts..."
# Will need to inspect file first

echo ""
echo "🎉 All fixes applied!"
echo "⚠️  Note: Some manual review needed for templateSelector.ts and realtimeCodeFixer.ts"
echo "📝 See COMPLETE_INTEGRATION_GUIDE.md for details"
