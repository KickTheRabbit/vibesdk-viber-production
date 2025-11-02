/**
 * Config Types - Pure type definitions only
 * Extracted from config.ts to avoid importing logic code into frontend
 */

import { ReasoningEffort } from "openai/resources.mjs";
// import { LLMCallsRateLimitConfig } from "../../services/rate-limit/config";

export enum AIModels {
    DISABLED = 'disabled',

    // ============ GOOGLE GEMINI (via OpenRouter) ============
    // Very popular, great price/performance!
    OPENROUTER_GEMINI_2_5_FLASH = 'openrouter/google/gemini-2.5-flash',
    OPENROUTER_GEMINI_2_5_FLASH_LITE = 'openrouter/google/gemini-2.5-flash-lite',
    OPENROUTER_GEMINI_2_0_FLASH = 'openrouter/google/gemini-2.0-flash-001',
    OPENROUTER_GEMINI_2_5_PRO = 'openrouter/google/gemini-2.5-pro',
    
    // ============ ANTHROPIC CLAUDE (via OpenRouter) ============
    // Neueste Models!
    OPENROUTER_CLAUDE_4_5_SONNET = 'openrouter/anthropic/claude-4.5-sonnet-20250929',
    OPENROUTER_CLAUDE_4_SONNET = 'openrouter/anthropic/claude-4-sonnet-20250522',
    OPENROUTER_CLAUDE_4_5_HAIKU = 'openrouter/anthropic/claude-4.5-haiku-20251001',
    OPENROUTER_CLAUDE_4_OPUS = 'openrouter/anthropic/claude-4-opus-20250514',
    
    // ============ OPENAI GPT (via OpenRouter) ============
    OPENROUTER_GPT_5 = 'openrouter/openai/gpt-5-2025-08-07',
    OPENROUTER_GPT_5_MINI = 'openrouter/openai/gpt-5-mini-2025-08-07',
    OPENROUTER_GPT_4_1 = 'openrouter/openai/gpt-4.1-2025-04-14',
    OPENROUTER_GPT_4_1_MINI = 'openrouter/openai/gpt-4.1-mini-2025-04-14',
    OPENROUTER_GPT_4O_MINI = 'openrouter/openai/gpt-4o-mini',
    OPENROUTER_CHATGPT_4O = 'openrouter/openai/chatgpt-4o-latest',
    
    // ============ DEEPSEEK (via OpenRouter) ============
    // Great for reasoning & debugging!
    OPENROUTER_DEEPSEEK_V3 = 'openrouter/deepseek/deepseek-chat-v3-0324',
    OPENROUTER_DEEPSEEK_R1 = 'openrouter/deepseek/deepseek-r1',
    
    // ============ QWEN CODER (via OpenRouter) ============
    // EXCELLENT for coding tasks! 262K context!
    OPENROUTER_QWEN3_CODER = 'openrouter/qwen/qwen3-coder-480b',
    
    // ============ X.AI GROK (via OpenRouter) ============
    // #1 on OpenRouter for coding!
    OPENROUTER_GROK_CODE_FAST = 'openrouter/x-ai/grok-code-fast-1',
    
    // ============ OTHER TOP MODELS ============
    OPENROUTER_GLM_4_6 = 'openrouter/z-ai/glm-4.6',
    OPENROUTER_KIMI_K2 = 'openrouter/moonshotai/kimi-k2',
	
	GEMINI_2_0_FLASH = 'google-ai-studio/gemini-2.0-flash',
	GEMINI_2_5_PRO = 'google-ai-studio/gemini-2.5-pro',
	GEMINI_2_5_FLASH = 'google-ai-studio/gemini-2.5-flash',
	GEMINI_2_5_FLASH_LITE = 'google-ai-studio/gemini-2.5-flash-lite',

	GEMINI_1_5_FLASH_8B = 'google-ai-studio/gemini-1.5-flash-8b-latest',
    GEMINI_2_5_FLASH_LATEST = 'google-ai-studio/gemini-2.5-flash-latest',
    GEMINI_2_5_FLASH_LITE_LATEST = 'google-ai-studio/gemini-2.5-flash-lite-latest',
    GEMINI_2_5_PRO_LATEST = 'google-ai-studio/gemini-2.5-pro-latest',

	GEMINI_2_5_PRO_PREVIEW_05_06 = 'google-ai-studio/gemini-2.5-pro-preview-05-06',
	GEMINI_2_5_FLASH_PREVIEW_04_17 = 'google-ai-studio/gemini-2.5-flash-preview-04-17',
	GEMINI_2_5_FLASH_PREVIEW_05_20 = 'google-ai-studio/gemini-2.5-flash-preview-05-20',
	GEMINI_2_5_PRO_PREVIEW_06_05 = 'google-ai-studio/gemini-2.5-pro-preview-06-05',

	CLAUDE_3_5_SONNET_LATEST = 'anthropic/claude-3-5-sonnet-latest',
	CLAUDE_3_7_SONNET_20250219 = 'anthropic/claude-3-7-sonnet-20250219',
	CLAUDE_4_OPUS = 'anthropic/claude-opus-4-20250514',
	CLAUDE_4_SONNET = 'anthropic/claude-sonnet-4-20250514',

	OPENAI_O3 = 'openai/o3',
	OPENAI_O4_MINI = 'openai/o4-mini',
	OPENAI_CHATGPT_4O_LATEST = 'openai/chatgpt-4o-latest',
	OPENAI_4_1 = 'openai/gpt-4.1-2025-04-14',
    OPENAI_5 = 'openai/gpt-5',
    OPENAI_5_MINI = 'openai/gpt-5-mini',
    OPENAI_OSS = 'openai/gpt-oss-120b',

    // OPENROUTER_QWEN_3_CODER = '[openrouter]qwen/qwen3-coder',
    // OPENROUTER_KIMI_2_5 = '[openrouter]moonshotai/kimi-k2',

    // Cerebras models
    CEREBRAS_GPT_OSS = 'cerebras/gpt-oss-120b',
    CEREBRAS_QWEN_3_CODER = 'cerebras/qwen-3-coder-480b',
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
