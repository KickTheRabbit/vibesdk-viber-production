/**
 * Universal Agent Type System
 * 
 * Defines all system agent types with defaults and category mappings.
 * Foundation for Universal Agent Config Schema.
 * 
 * Version: 1.0.0
 * Date: 2025-01-01
 */

// ============================================================================
// CORE ENUMS
// ============================================================================

/**
 * Agent Categories - High-level grouping
 */
export enum AgentCategory {
  PLANNING = 'Planning',
  CODE_GENERATION = 'Code Generation',
  CODE_FIXING = 'Code Fixing',
  ANALYSIS = 'Analysis',
  COMMUNICATION = 'Communication',
  CUSTOM = 'Custom'
}

/**
 * System Agent Types - Built-in types
 */
export enum SystemAgentType {
  BLUEPRINT = 'blueprint',
  TEMPLATE_SELECTOR = 'template-selector',
  PHASE_GENERATOR = 'phase-generator',
  PHASE_IMPLEMENTATION = 'phase-implementation',
  FILE_REGENERATOR = 'file-regenerator',
  CODE_REVIEW = 'code-review',
  SCREENSHOT_ANALYZER = 'screenshot-analyzer',
  CODE_FIXER = 'code-fixer',
  FAST_CODE_FIXER = 'fast-code-fixer',
  CONVERSATIONAL = 'conversational',
  CUSTOM = 'custom'
}

/**
 * Complexity Levels - For approval mode recommendations
 */
export enum ComplexityLevel {
  SIMPLE = 'Simple',      // Quick, low-cost
  MEDIUM = 'Medium',      // Standard operation
  COMPLEX = 'Complex'     // Expensive, risky
}

// ============================================================================
// LLM CONFIGURATION
// ============================================================================

/**
 * Default LLM Configuration per agent type
 */
export interface DefaultLLMConfig {
  model: string;              // OpenRouter model string
  temperature: number;        // 0.0 - 1.0
  maxTokens: number;          // Output token limit
  thinking?: {
    enabled: boolean;
    budget: number;
  };
  streaming: boolean;         // Show response as it generates
  topP?: number;              // Nucleus sampling
  frequencyPenalty?: number;  // Reduce repetition
  presencePenalty?: number;   // Encourage new topics
  stopSequences?: string[];   // Stop generation at these strings
}

/**
 * OpenRouter Model Identifiers
 * Full list: https://openrouter.ai/docs#models
 */
export const OpenRouterModels = {
  // Anthropic
  CLAUDE_OPUS_4_1: 'anthropic/claude-opus-4.1',
  CLAUDE_SONNET_4_5: 'anthropic/claude-sonnet-4.5',
  CLAUDE_HAIKU_4_5: 'anthropic/claude-haiku-4.5',
  
  // Google
  GEMINI_2_5_PRO: 'google/gemini-2.5-pro',
  GEMINI_2_5_FLASH: 'google/gemini-2.5-flash',
  GEMINI_2_5_FLASH_LITE: 'google/gemini-2.5-flash-lite',
  
  // OpenAI
  GPT_4O: 'openai/gpt-4o',
  GPT_4O_MINI: 'openai/gpt-4o-mini',
  
  // Meta
  LLAMA_3_3_70B: 'meta-llama/llama-3.3-70b-instruct',
  
  // DeepSeek
  DEEPSEEK_V3: 'deepseek/deepseek-v3',
  
  // Mistral
  MISTRAL_LARGE: 'mistralai/mistral-large-2411'
} as const;

// ============================================================================
// AGENT TYPE DEFINITION
// ============================================================================

/**
 * Complete Agent Type Definition
 * Maps system type to category, defaults, and metadata
 */
export interface AgentTypeDefinition {
  // Identity
  type: SystemAgentType;
  category: AgentCategory;
  displayName: string;
  description: string;
  icon: string;                   // Emoji or icon ID
  
  // Default Configuration
  defaultLLM: DefaultLLMConfig;
  
  // Governance Recommendations
  complexity: ComplexityLevel;
  recommendApproval: boolean;
  estimatedCostRange: {
    min: number;                  // Minimum cost in USD
    avg: number;                  // Average cost in USD
    max: number;                  // Maximum cost in USD
  };
  
  // Orchestration Hints
  triggers: {
    manual: boolean;              // Can be triggered manually
    autoEvents?: string[];        // Auto-trigger on these events
  };
  
  // Metadata
  author: 'system';               // System types always authored by system
  tags: string[];
  version: string;                // Current version of this type definition
}

// ============================================================================
// TYPE â†' CATEGORY MAPPING
// ============================================================================

/**
 * Auto-assign category based on agent type
 */
export const TYPE_CATEGORY_MAP: Record<SystemAgentType, AgentCategory> = {
  [SystemAgentType.BLUEPRINT]: AgentCategory.PLANNING,
  [SystemAgentType.TEMPLATE_SELECTOR]: AgentCategory.PLANNING,
  [SystemAgentType.PHASE_GENERATOR]: AgentCategory.PLANNING,
  [SystemAgentType.PHASE_IMPLEMENTATION]: AgentCategory.CODE_GENERATION,
  [SystemAgentType.FILE_REGENERATOR]: AgentCategory.CODE_GENERATION,
  [SystemAgentType.CODE_REVIEW]: AgentCategory.ANALYSIS,
  [SystemAgentType.SCREENSHOT_ANALYZER]: AgentCategory.ANALYSIS,
  [SystemAgentType.CODE_FIXER]: AgentCategory.CODE_FIXING,
  [SystemAgentType.FAST_CODE_FIXER]: AgentCategory.CODE_FIXING,
  [SystemAgentType.CONVERSATIONAL]: AgentCategory.COMMUNICATION,
  [SystemAgentType.CUSTOM]: AgentCategory.CUSTOM
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get category for a given agent type
 */
export function getCategoryForType(type: SystemAgentType): AgentCategory {
  return TYPE_CATEGORY_MAP[type];
}

/**
 * Generate agent ID from type, variant, and version
 * Format: {type}-{variant?}-v{version}
 * 
 * @param type - System agent type
 * @param variant - Optional variant name (lowercase-with-hyphens)
 * @param version - Semantic version (default: 1.0.0)
 * 
 * @example
 * generateAgentId('blueprint', null, '1.0.0')
 * // => 'blueprint-v1.0.0'
 * 
 * generateAgentId('blueprint', 'senior-expert', '1.0.0')
 * // => 'blueprint-senior-expert-v1.0.0'
 * 
 * generateAgentId('custom', 'security-scanner', '2.1.0')
 * // => 'custom-security-scanner-v2.1.0'
 */
export function generateAgentId(
  type: SystemAgentType | string,
  variant: string | null = null,
  version: string = '1.0.0'
): string {
  const parts = [type];
  
  if (variant) {
    // Validate variant format: lowercase-with-hyphens
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(variant)) {
      throw new Error(
        `Invalid variant name: "${variant}". Must be lowercase-with-hyphens (e.g., "senior-expert")`
      );
    }
    parts.push(variant);
  }
  
  parts.push(`v${version}`);
  
  return parts.join('-');
}

/**
 * Validate variant name format
 */
export function isValidVariantName(variant: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(variant);
}

/**
 * Parse agent ID into components
 * 
 * @example
 * parseAgentId('blueprint-v1.0.0')
 * // => { type: 'blueprint', variant: null, version: '1.0.0' }
 * 
 * parseAgentId('blueprint-senior-expert-v1.0.0')
 * // => { type: 'blueprint', variant: 'senior-expert', version: '1.0.0' }
 */
export function parseAgentId(agentId: string): {
  type: string;
  variant: string | null;
  version: string;
} {
  // Pattern: type-[variant-]vX.Y.Z
  const versionMatch = agentId.match(/-v(\d+\.\d+\.\d+)$/);
  
  if (!versionMatch) {
    throw new Error(`Invalid agent ID format: "${agentId}". Must end with -vX.Y.Z`);
  }
  
  const version = versionMatch[1];
  const withoutVersion = agentId.slice(0, -(version.length + 2)); // Remove -vX.Y.Z
  
  const parts = withoutVersion.split('-');
  const type = parts[0];
  const variant = parts.length > 1 ? parts.slice(1).join('-') : null;
  
  return { type, variant, version };
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Check if a type is a system type
 */
export function isSystemType(type: string): type is SystemAgentType {
  return Object.values(SystemAgentType).includes(type as SystemAgentType);
}

/**
 * Validate semantic version format
 */
export function isValidVersion(version: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(version);
}
