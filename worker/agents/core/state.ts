import type { Blueprint, ClientReportedErrorType, PhaseConceptType ,
    FileOutputType,
} from '../schemas';
import type { TemplateDetails } from '../../services/sandbox/sandboxTypes';
// import type { ScreenshotData } from './types';
import type { ConversationMessage } from '../inferutils/common';
import type { InferenceContext, AgentActionKey } from '../inferutils/config.types';

export interface FileState extends FileOutputType {
    lasthash: string;
    lastmodified: number;
    unmerged: string[];
    lastDiff: string;
}

export interface PhaseState extends PhaseConceptType {
    // deploymentNeeded: boolean;
    completed: boolean;
}

export enum CurrentDevState {
    IDLE,
    PHASE_GENERATING,
    PHASE_IMPLEMENTING,
    REVIEWING,
    FILE_REGENERATING,
    FINALIZING,
}

export const MAX_PHASES = 12;

/**
 * Cost tracking for Money Flow Tracker
 */
export interface CostTrackingEvent {
    id: string;
    timestamp: string; // ISO timestamp string
    action: AgentActionKey; // Which agent action (phaseImplementation, codeReview, etc)
    model: string; // Model used
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
        name: string; // e.g., "auth.ts", "Phase 1", etc
        cost: number;
        tokens: number;
    }>;
    duration: number; // Duration in ms
    context: string; // Additional context (phase name, files, etc)
}

export interface MoneyFlowState {
    sessionTotal: number; // Total cost for this session
    events: CostTrackingEvent[]; // All cost events
    lastEventId?: string; // ID of most recent event
}

export interface CodeGenState {
    blueprint: Blueprint;
    query: string;
    generatedFilesMap: Record<string, FileState >;
    generationPromise?: Promise<void>;
    generatedPhases: PhaseState[];
    commandsHistory?: string[]; // History of commands run
    lastPackageJson?: string; // Last package.json file contents
    templateDetails: TemplateDetails;   // TODO: Remove this from state and rely on directly fetching from sandbox
    sandboxInstanceId?: string;
    // previewURL?: string;
    // tunnelURL?: string;
    clientReportedErrors: ClientReportedErrorType[];
    // latestScreenshot?: ScreenshotData; // Store captured screenshot
    shouldBeGenerating: boolean; // Persistent flag indicating generation should be active
    mvpGenerated: boolean;
    reviewingInitiated: boolean;
    agentMode: 'deterministic' | 'smart';
    sessionId: string;
    hostname: string;
    phasesCounter: number;

    pendingUserInputs: string[];
    currentDevState: CurrentDevState;
    reviewCycles?: number; // Number of review cycles for code review phase
    currentPhase?: PhaseConceptType; // Current phase being worked on
    
    conversationMessages: ConversationMessage[];
    projectUpdatesAccumulator: string[];
    inferenceContext: InferenceContext;
    
    // Money Flow Tracker
    costTracking?: MoneyFlowState;
} 
