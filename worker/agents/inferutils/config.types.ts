/**
 * Config Types - Pure type definitions only
 * Extracted from config.ts to avoid importing logic code into frontend
 */

import { ReasoningEffort } from "openai/resources.mjs";
// import { LLMCallsRateLimitConfig } from "../../services/rate-limit/config";

export enum AIModels {
	// ============ SPECIAL ============
	DISABLED = 'disabled',

	// ============ ORIGINAL MODELS (Direct Access) ============
	CLAUDE_4_SONNET = 'anthropic/claude-sonnet-4-20250514',
	
	// ============ GOOGLE GEMINI DIRECT (Alle Original-Varianten) ============
	GEMINI_1_5_FLASH_8B = 'google-ai-studio/gemini-1.5-flash-8b',
	GEMINI_2_0_FLASH = 'google-ai-studio/gemini-2.0-flash-exp',
	GEMINI_2_5_FLASH = 'google-ai-studio/gemini-2.5-flash',
	GEMINI_2_5_FLASH_LATEST = 'google-ai-studio/gemini-2.5-flash-latest',
	GEMINI_2_5_FLASH_LITE = 'google-ai-studio/gemini-2.5-flash-lite',
	GEMINI_2_5_FLASH_LITE_LATEST = 'google-ai-studio/gemini-2.5-flash-lite-latest',
	GEMINI_2_5_FLASH_PREVIEW_04_17 = 'google-ai-studio/gemini-2.5-flash-preview-04-17',
	GEMINI_2_5_FLASH_PREVIEW_05_20 = 'google-ai-studio/gemini-2.5-flash-preview-05-20',
	GEMINI_2_5_PRO = 'google-ai-studio/gemini-2.5-pro',
	GEMINI_2_5_PRO_LATEST = 'google-ai-studio/gemini-2.5-pro-latest',
	GEMINI_2_5_PRO_PREVIEW_05_06 = 'google-ai-studio/gemini-2.5-pro-preview-05-06',
	GEMINI_2_5_PRO_PREVIEW_06_05 = 'google-ai-studio/gemini-2.5-pro-preview-06-05',

	// ============ ANTHROPIC CLAUDE (Latest) ============
	OPENROUTER_CLAUDE_4_5_OPUS = 'openrouter/anthropic/claude-opus-4.5',
	OPENROUTER_CLAUDE_4_5_SONNET = 'openrouter/anthropic/claude-sonnet-4.5',
	OPENROUTER_CLAUDE_4_5_HAIKU = 'openrouter/anthropic/claude-haiku-4.5',
	OPENROUTER_CLAUDE_4_1_OPUS = 'openrouter/anthropic/claude-opus-4.1',
	OPENROUTER_CLAUDE_3_7_SONNET = 'openrouter/anthropic/claude-3.7-sonnet',

	// ============ OPENAI GPT (Latest) ============
	OPENAI_5_MINI = 'openai/gpt-5-mini',
	OPENROUTER_GPT_5_2_PRO = 'openrouter/openai/gpt-5.2-pro',
	OPENROUTER_GPT_5_2 = 'openrouter/openai/gpt-5.2',
	OPENROUTER_GPT_5_1_CODEX_MAX = 'openrouter/openai/gpt-5.1-codex-max',
	OPENROUTER_GPT_5_1_CODEX = 'openrouter/openai/gpt-5.1-codex',
	OPENROUTER_GPT_5_PRO = 'openrouter/openai/gpt-5-pro',
	OPENROUTER_GPT_5 = 'openrouter/openai/gpt-5',
	OPENROUTER_GPT_5_MINI = 'openrouter/openai/gpt-5-mini',
	OPENROUTER_GPT_4O = 'openrouter/openai/gpt-4o',
	OPENROUTER_GPT_4O_MINI = 'openrouter/openai/gpt-4o-mini',

	// ============ OPENAI REASONING ============
	OPENROUTER_O3_PRO = 'openrouter/openai/o3-pro',
	OPENROUTER_O3 = 'openrouter/openai/o3',
	OPENROUTER_O3_MINI = 'openrouter/openai/o3-mini',
	OPENROUTER_O1 = 'openrouter/openai/o1',

	// ============ GOOGLE GEMINI (via OpenRouter) ============
	OPENROUTER_GEMINI_3_PRO = 'openrouter/google/gemini-3-pro-preview',
	OPENROUTER_GEMINI_2_5_PRO = 'openrouter/google/gemini-2.5-pro',
	OPENROUTER_GEMINI_2_5_FLASH = 'openrouter/google/gemini-2.5-flash',
	OPENROUTER_GEMINI_2_5_FLASH_LITE = 'openrouter/google/gemini-2.5-flash-lite',

	// ============ DEEPSEEK (Latest) ============
	OPENROUTER_DEEPSEEK_V3_2 = 'openrouter/deepseek/deepseek-v3.2',
	OPENROUTER_DEEPSEEK_R1 = 'openrouter/deepseek/deepseek-r1',
	OPENROUTER_DEEPSEEK_R1_DISTILL_QWEN_32B = 'openrouter/deepseek/deepseek-r1-distill-qwen-32b',

	// ============ QWEN (Latest & Best) ============
	OPENROUTER_QWEN3_MAX = 'openrouter/qwen/qwen3-max',
	OPENROUTER_QWEN3_CODER_PLUS = 'openrouter/qwen/qwen3-coder-plus',
	OPENROUTER_QWEN3_CODER_480B = 'openrouter/qwen/qwen3-coder',
	OPENROUTER_QWEN3_235B_INSTRUCT = 'openrouter/qwen/qwen3-235b-a22b-2507',
	OPENROUTER_QWEN2_5_72B = 'openrouter/qwen/qwen-2.5-72b-instruct',

	// ============ MISTRAL (Latest) ============
	OPENROUTER_MISTRAL_LARGE_2512 = 'openrouter/mistralai/mistral-large-2512',
	OPENROUTER_DEVSTRAL_2512 = 'openrouter/mistralai/devstral-2512',
	OPENROUTER_CODESTRAL_2508 = 'openrouter/mistralai/codestral-2508',
	OPENROUTER_PIXTRAL_LARGE = 'openrouter/mistralai/pixtral-large-2411',

	// ============ META LLAMA (Latest) ============
	OPENROUTER_LLAMA_4_MAVERICK = 'openrouter/meta-llama/llama-4-maverick',
	OPENROUTER_LLAMA_3_3_70B = 'openrouter/meta-llama/llama-3.3-70b-instruct',
	OPENROUTER_LLAMA_3_1_405B = 'openrouter/meta-llama/llama-3.1-405b-instruct',

	// ============ XAI GROK (Latest) ============
	OPENROUTER_GROK_4_1_FAST = 'openrouter/x-ai/grok-4.1-fast',
	OPENROUTER_GROK_4 = 'openrouter/x-ai/grok-4',

	// ============ SPECIALIZED BEST ============
	OPENROUTER_NOVA_PREMIER = 'openrouter/amazon/nova-premier-v1',
	OPENROUTER_COMMAND_A = 'openrouter/cohere/command-a',
	OPENROUTER_SONAR_PRO = 'openrouter/perplexity/sonar-pro',
	OPENROUTER_GLM_4_6V = 'openrouter/z-ai/glm-4.6v',
	OPENROUTER_HERMES_4_405B = 'openrouter/nousresearch/hermes-4-405b',
	OPENROUTER_PHI_4 = 'openrouter/microsoft/phi-4',
	OPENROUTER_MINIMAX_M2 = 'openrouter/minimax/minimax-m2',
	
	// ============ OTHER ============
	CEREBRAS_GPT_OSS = 'cerebras/gpt-oss',
}

export interface ModelConfig {
    name: AIModels | string;
    reasoning_effort?: ReasoningEffort;
    max_tokens?: number;
    temperature?: number;
    fallbackModel?: AIModels | string;
}

export interface AgentConfig {
    templateSelection: ModelConfig;
    blueprint: ModelConfig;
    projectSetup: ModelConfig;
    phaseGeneration: ModelConfig;
    phaseImplementation: ModelConfig;
    firstPhaseImplementation: ModelConfig;
    codeReview: ModelConfig;
    fileRegeneration: ModelConfig;
    screenshotAnalysis: ModelConfig;
    realtimeCodeFixer: ModelConfig;
    fastCodeFixer: ModelConfig;
    conversationalResponse: ModelConfig;
}

// Provider and reasoning effort types for validation
export type ProviderOverrideType = 'cloudflare' | 'direct';
export type ReasoningEffortType = 'low' | 'medium' | 'high';

export type AgentActionKey = keyof AgentConfig;

export type InferenceMetadata = {
    agentId: string;
    userId: string;
    // llmRateLimits: LLMCallsRateLimitConfig;
}

export interface InferenceContext extends InferenceMetadata {
    userModelConfigs?: Record<AgentActionKey, ModelConfig>;
    enableRealtimeCodeFix: boolean;
    enableFastSmartCodeFix: boolean;
}
