/**
 * Money Flow Tracker - Frontend Types
 */

import { AgentActionKey } from '../../worker/agents/inferutils/config.types';

export interface MoneyFlowEvent {
    id: string;
    timestamp: string; // ISO timestamp string
    action: AgentActionKey;
    model: string;
    tokens: {
        prompt: number;
        completion: number;
        total: number;
    };
    cost: {
        totalCost: number;
        inputCost: number;
        outputCost: number;
    };
    breakdown: Array<{
        name: string;
        cost: number;
        tokens: number;
    }>;
    duration: number;
    context: string;
}

export interface MoneyFlowState {
    sessionTotal: number;
    events: MoneyFlowEvent[];
    lastEventId?: string;
}

/**
 * Color mapping for agent actions
 */
export const ACTION_COLORS: Record<string, string> = {
    conversationalResponse: '#3B82F6', // blue
    templateSelection: '#FBBF24',      // yellow
    blueprint: '#F97316',              // orange
    phaseGeneration: '#10B981',        // green
    phaseImplementation: '#EF4444',    // red
    firstPhaseImplementation: '#DC2626', // dark red
    codeReview: '#8B5CF6',             // purple
    fileRegeneration: '#92400E',       // brown
    screenshotAnalysis: '#EC4899',     // pink
    realtimeCodeFixer: '#6B7280',      // gray
    fastCodeFixer: '#6B7280',          // gray
    projectSetup: '#14B8A6',           // teal
};

/**
 * Display names for agent actions
 */
export const ACTION_NAMES: Record<string, string> = {
    conversationalResponse: 'Conversation',
    templateSelection: 'Template Select',
    blueprint: 'Blueprint',
    phaseGeneration: 'Phase Planning',
    phaseImplementation: 'Phase Implementation',
    firstPhaseImplementation: 'Initial Implementation',
    codeReview: 'Code Review',
    fileRegeneration: 'File Regeneration',
    screenshotAnalysis: 'Screenshot Analysis',
    realtimeCodeFixer: 'Realtime Fix',
    fastCodeFixer: 'Fast Fix',
    projectSetup: 'Project Setup',
};
