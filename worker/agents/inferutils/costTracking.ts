/**
 * Cost Tracking Module
 * Tracks token usage and calculates costs for OpenRouter API calls
 */

/**
 * Pricing per Million Tokens (MTok) - Updated 2024-12
 * Format: [input_cost, output_cost] per 1M tokens
 */
export const MODEL_PRICING: Record<string, { input: number; output: number }> = {
    // Anthropic Claude (Direct)
    'anthropic/claude-sonnet-4-20250514': { input: 3.0, output: 15.0 },
    
    // Google Gemini (Direct via AI Studio)
    'google-ai-studio/gemini-1.5-flash-8b': { input: 0.0375, output: 0.15 },
    'google-ai-studio/gemini-2.0-flash-exp': { input: 0.0, output: 0.0 }, // Free during preview
    'google-ai-studio/gemini-2.5-flash': { input: 0.075, output: 0.30 },
    'google-ai-studio/gemini-2.5-flash-latest': { input: 0.075, output: 0.30 },
    'google-ai-studio/gemini-2.5-flash-lite': { input: 0.01, output: 0.04 },
    'google-ai-studio/gemini-2.5-flash-lite-latest': { input: 0.01, output: 0.04 },
    'google-ai-studio/gemini-2.5-flash-preview-04-17': { input: 0.075, output: 0.30 },
    'google-ai-studio/gemini-2.5-flash-preview-05-20': { input: 0.075, output: 0.30 },
    'google-ai-studio/gemini-2.5-pro': { input: 1.25, output: 5.0 },
    'google-ai-studio/gemini-2.5-pro-latest': { input: 1.25, output: 5.0 },
    'google-ai-studio/gemini-2.5-pro-preview-05-06': { input: 1.25, output: 5.0 },
    'google-ai-studio/gemini-2.5-pro-preview-06-05': { input: 1.25, output: 5.0 },
    
    // Anthropic Claude (via OpenRouter)
    'openrouter/anthropic/claude-opus-4.5': { input: 5.0, output: 25.0 },
    'openrouter/anthropic/claude-sonnet-4.5': { input: 3.0, output: 15.0 },
    'openrouter/anthropic/claude-haiku-4.5': { input: 0.80, output: 4.0 },
    'openrouter/anthropic/claude-opus-4.1': { input: 15.0, output: 75.0 },
    'openrouter/anthropic/claude-3.7-sonnet': { input: 3.0, output: 15.0 },
    
    // OpenAI (via OpenRouter)
    'openrouter/openai/gpt-5.2-pro': { input: 10.0, output: 40.0 },
    'openrouter/openai/gpt-5.2': { input: 5.0, output: 20.0 },
    'openrouter/openai/gpt-5.1-codex-max': { input: 8.0, output: 32.0 },
    'openrouter/openai/gpt-5.1-codex': { input: 5.0, output: 20.0 },
    'openrouter/openai/gpt-5-pro': { input: 7.0, output: 28.0 },
    'openrouter/openai/gpt-5': { input: 4.0, output: 16.0 },
    'openrouter/openai/gpt-5-mini': { input: 0.60, output: 2.40 },
    'openrouter/openai/gpt-4o': { input: 2.50, output: 10.0 },
    'openrouter/openai/gpt-4o-mini': { input: 0.15, output: 0.60 },
    
    // OpenAI Reasoning (via OpenRouter)
    'openrouter/openai/o3-pro': { input: 50.0, output: 200.0 },
    'openrouter/openai/o3': { input: 20.0, output: 80.0 },
    'openrouter/openai/o3-mini': { input: 1.0, output: 4.0 },
    'openrouter/openai/o1': { input: 15.0, output: 60.0 },
    
    // Google Gemini (via OpenRouter)
    'openrouter/google/gemini-3-pro-preview': { input: 2.5, output: 10.0 },
    'openrouter/google/gemini-2.5-pro': { input: 1.25, output: 5.0 },
    'openrouter/google/gemini-2.5-flash': { input: 0.075, output: 0.30 },
    'openrouter/google/gemini-2.5-flash-lite': { input: 0.01, output: 0.04 },
    
    // DeepSeek (via OpenRouter)
    'openrouter/deepseek/deepseek-v3.2': { input: 0.27, output: 1.10 },
    'openrouter/deepseek/deepseek-r1': { input: 0.55, output: 2.19 },
    'openrouter/deepseek/deepseek-r1-distill-qwen-32b': { input: 0.14, output: 0.55 },
    
    // Qwen (via OpenRouter)
    'openrouter/qwen/qwen3-max': { input: 1.0, output: 4.0 },
    'openrouter/qwen/qwen3-coder-plus': { input: 0.40, output: 1.60 },
    'openrouter/qwen/qwen3-coder': { input: 0.80, output: 3.20 },
    'openrouter/qwen/qwen3-235b-a22b-2507': { input: 0.60, output: 2.40 },
    'openrouter/qwen/qwen-2.5-72b-instruct': { input: 0.35, output: 1.40 },
    
    // Add more models as needed...
};

export interface TokenUsage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}

export interface CostCalculation {
    tokens: TokenUsage;
    cost: number;
    model: string;
    breakdown: {
        inputCost: number;
        outputCost: number;
    };
}

/**
 * Calculate cost for a given model and token usage
 */
export function calculateCost(
    tokens: TokenUsage,
    model: string
): CostCalculation {
    const pricing = MODEL_PRICING[model];
    
    if (!pricing) {
        console.warn(`No pricing found for model: ${model}, using default $0`);
        return {
            tokens,
            cost: 0,
            model,
            breakdown: {
                inputCost: 0,
                outputCost: 0
            }
        };
    }
    
    // Calculate costs per million tokens
    const inputCost = (tokens.prompt_tokens / 1_000_000) * pricing.input;
    const outputCost = (tokens.completion_tokens / 1_000_000) * pricing.output;
    const totalCost = inputCost + outputCost;
    
    return {
        tokens,
        cost: totalCost,
        model,
        breakdown: {
            inputCost,
            outputCost
        }
    };
}

/**
 * Format cost for display (e.g., "$0.0045" or "$0.45")
 */
export function formatCost(cost: number): string {
    if (cost < 0.01) {
        return `$${cost.toFixed(4)}`;
    } else if (cost < 1) {
        return `$${cost.toFixed(3)}`;
    } else {
        return `$${cost.toFixed(2)}`;
    }
}

/**
 * Format token count for display (e.g., "1.2K" or "45K")
 */
export function formatTokens(tokens: number): string {
    if (tokens < 1000) {
        return `${tokens}`;
    } else if (tokens < 1_000_000) {
        return `${(tokens / 1000).toFixed(1)}K`;
    } else {
        return `${(tokens / 1_000_000).toFixed(2)}M`;
    }
}
