/**
 * Universal Agent Type Definitions
 * 
 * Complete TypeScript type definitions for the Universal Agent system.
 * 
 * Version: 1.0.0
 */

import type {
	SystemAgentType,
	AgentCategory,
	ComplexityLevel,
	DefaultLLMConfig
} from '@/lib/universal-agents/agent-types';

// ============================================================================
// System Prompt Types
// ============================================================================

export type PromptBlockSource = 'library' | 'custom';
export type ConstraintSeverity = 'MUST' | 'SHOULD' | 'AVOID';
export type ValidationMode = 'strict' | 'loose' | 'none';
export type ErrorHandlingStrategy = 'retry' | 'ask_user' | 'use_fallback' | 'fail';

export interface CommunicationRules {
	source: PromptBlockSource;
	library?: string[];
	custom?: string;
}

export interface Constraint {
	type: ConstraintSeverity;
	description: string;
	conditional?: string | null;
}

export interface Example {
	input: string;
	output: string;
	description?: string;
}

export interface CustomBlock {
	name: string;
	content: string;
	position: 'before_task' | 'after_task' | 'before_constraints' | 'after_constraints' | 'at_end';
	conditional?: string | null;
}

export interface ContextSlot {
	slotName: string;
	dataSource: string;
	formatTemplate: string;
	conditional?: string | null;
}

export interface SystemPrompt {
	role: string;
	task: string;
	outputFormat: 'json' | 'code' | 'text' | 'markdown' | 'mixed';
	communicationRules: CommunicationRules | null;
	securityGuidelines: string[] | null;
	constraints: Constraint[];
	domainKnowledge: string | null;
	examples: Example[];
	customBlocks: CustomBlock[];
	contextInjection: ContextSlot[];
}

// ============================================================================
// Input/Output Types
// ============================================================================

export type InputFieldType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'file' | 'files';

export interface InputValidation {
	minLength?: number;
	maxLength?: number;
	minValue?: number;
	maxValue?: number;
	pattern?: string;
	allowedValues?: any[];
}

export interface InputField {
	name: string;
	type: InputFieldType;
	description: string;
	validation: InputValidation;
	defaultValue?: any;
	example: any;
}

export interface MultimodalConfig {
	images: {
		enabled: boolean;
		maxCount: number;
		formats: string[];
		maxSize: number;
	};
	files: {
		enabled: boolean;
		allowedTypes: string[];
		maxCount: number;
		maxSize: number;
	};
}

export interface InputSpecification {
	required: InputField[];
	optional: InputField[];
	multimodal: MultimodalConfig;
}

export interface JSONSchema {
	type: string;
	properties?: Record<string, any>;
	required?: string[];
	[key: string]: any;
}

export interface OutputValidation {
	mode: ValidationMode;
	onError: ErrorHandlingStrategy;
}

export interface OutputStorage {
	location: 'agent_state' | 'project_state' | 'temporary' | 'output_directory';
	broadcast: string;
	shareWith: string[];
}

export interface OutputSpecification {
	type: 'json' | 'single_file' | 'multiple_files' | 'text' | 'markdown' | 'mixed';
	schema?: JSONSchema;
	validation: OutputValidation;
	fileNamingPattern?: string;
	fileStructure?: 'flat' | 'nested' | 'custom';
	fileTypes?: string[];
	storage: OutputStorage;
}

// ============================================================================
// Orchestration Types
// ============================================================================

export interface Triggers {
	manual: boolean;
	auto: string[];
	afterAgent: string[];
	onError: string[];
}

export interface Dependencies {
	requiresAgents: string[];
	requiresState: string[];
	producesFor: string[];
}

// ============================================================================
// Testing Types
// ============================================================================

export interface TestExpectations {
	maxCost?: number;
	warnAtCost?: number;
	maxDuration?: number;
}

export interface TestCase {
	name: string;
	input: any;
	expectedOutput: any;
	expectations: TestExpectations;
}

export interface TestingConfig {
	enabled: boolean;
	testCases: TestCase[];
}

// ============================================================================
// Versioning Types
// ============================================================================

export interface ChangelogEntry {
	version: string;
	date: string;
	author: string;
	changes: string;
	breaking: boolean;
}

// ============================================================================
// Main Agent Config Type
// ============================================================================

export interface UniversalAgentConfig {
	// Identity
	id: string;
	type: SystemAgentType | 'custom';
	category: AgentCategory;
	variant?: string;
	displayName: string;
	version: string;
	author: 'system' | 'user' | 'community';
	description: string;
	tags: string[];
	icon: string;
	
	// System Prompt
	systemPrompt: SystemPrompt;
	
	// Input/Output
	input: InputSpecification;
	output: OutputSpecification;
	
	// LLM Configuration
	llm: DefaultLLMConfig;
	
	// Orchestration
	triggers: Triggers;
	dependencies: Dependencies;
	
	// Governance (recommendations)
	complexity: ComplexityLevel;
	recommendApproval: boolean;
	estimatedCostRange: {
		min: number;
		avg: number;
		max: number;
	};
	warningMessages: string[];
	
	// Testing
	testing: TestingConfig;
	
	// Versioning
	changelog: ChangelogEntry[];
	deprecated: boolean;
	replacementAgentId?: string;
	deprecationReason?: string;
	
	// Metadata
	visibility: 'private' | 'team' | 'organization' | 'public';
	license?: string;
	documentation?: string;
	createdAt: string;
	updatedAt: string;
}

// ============================================================================
// Form State Types (for UI)
// ============================================================================

export interface AgentConfigFormState extends UniversalAgentConfig {
	// Additional UI state if needed
}
