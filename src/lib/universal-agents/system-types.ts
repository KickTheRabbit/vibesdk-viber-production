/**
 * System Agent Type Definitions
 * 
 * All 11 built-in agent types with complete default configurations.
 * These definitions drive agent creation UI and default behaviors.
 * 
 * Version: 1.0.0
 * Date: 2025-01-01
 */

import {
  AgentTypeDefinition,
  SystemAgentType,
  AgentCategory,
  ComplexityLevel,
  OpenRouterModels
} from './agent-types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Blueprint Agent
 * Creates project structure plans from user requirements
 */
export const BlueprintTypeDefinition: AgentTypeDefinition = {
  type: SystemAgentType.BLUEPRINT,
  category: AgentCategory.PLANNING,
  displayName: 'Blueprint Agent',
  description: 'Analyzes requirements and creates detailed project structure plans with features, components, and dependencies.',
  icon: 'ICON',
  
  defaultLLM: {
    model: OpenRouterModels.CLAUDE_4_5_SONNET,
    temperature: 0.7,
    maxTokens: 16000,
    thinking: {
      enabled: true,
      budget: 2000
    },
    streaming: true
  },
  
  complexity: ComplexityLevel.MEDIUM,
  recommendApproval: true,
  estimatedCostRange: {
    min: 0.05,
    avg: 0.10,
    max: 0.30
  },
  
  triggers: {
    manual: true,
    autoEvents: ['new_project', 'major_feature_add']
  },
  
  author: 'system',
  tags: ['planning', 'architecture', 'project-structure'],
  version: '1.0.0'
};

/**
 * Template Selector Agent
 * Chooses appropriate project template based on requirements
 */
export const TemplateSelectorTypeDefinition: AgentTypeDefinition = {
  type: SystemAgentType.TEMPLATE_SELECTOR,
  category: AgentCategory.PLANNING,
  displayName: 'Template Selector',
  description: 'Analyzes project requirements and selects the most appropriate template or boilerplate.',
  icon: 'ICON',
  
  defaultLLM: {
    model: OpenRouterModels.CLAUDE_4_5_SONNET,
    temperature: 0.5,
    maxTokens: 4000,
    thinking: {
      enabled: false,
      budget: 0
    },
    streaming: true
  },
  
  complexity: ComplexityLevel.SIMPLE,
  recommendApproval: false,
  estimatedCostRange: {
    min: 0.01,
    avg: 0.03,
    max: 0.08
  },
  
  triggers: {
    manual: true,
    autoEvents: ['new_project']
  },
  
  author: 'system',
  tags: ['planning', 'templates', 'selection'],
  version: '1.0.0'
};

/**
 * Phase Generator Agent
 * Creates implementation phases from blueprint
 */
export const PhaseGeneratorTypeDefinition: AgentTypeDefinition = {
  type: SystemAgentType.PHASE_GENERATOR,
  category: AgentCategory.PLANNING,
  displayName: 'Phase Generator',
  description: 'Breaks down blueprint into manageable implementation phases with clear dependencies and priorities.',
  icon: 'ICON',
  
  defaultLLM: {
    model: OpenRouterModels.CLAUDE_4_5_SONNET,
    temperature: 0.6,
    maxTokens: 12000,
    thinking: {
      enabled: true,
      budget: 1500
    },
    streaming: true
  },
  
  complexity: ComplexityLevel.MEDIUM,
  recommendApproval: false,
  estimatedCostRange: {
    min: 0.04,
    avg: 0.08,
    max: 0.20
  },
  
  triggers: {
    manual: true,
    autoEvents: ['blueprint_ready']
  },
  
  author: 'system',
  tags: ['planning', 'phases', 'dependencies'],
  version: '1.0.0'
};

/**
 * Phase Implementation Agent
 * Generates code for a specific project phase
 */
export const PhaseImplementationTypeDefinition: AgentTypeDefinition = {
  type: SystemAgentType.PHASE_IMPLEMENTATION,
  category: AgentCategory.CODE_GENERATION,
  displayName: 'Phase Implementation',
  description: 'Generates complete, production-ready code for a project phase based on blueprint and phase specifications.',
  icon: 'âš™ï¸',
  
  defaultLLM: {
    model: OpenRouterModels.CLAUDE_4_5_SONNET,
    temperature: 0.2,
    maxTokens: 32000,
    thinking: {
      enabled: true,
      budget: 3000
    },
    streaming: true
  },
  
  complexity: ComplexityLevel.COMPLEX,
  recommendApproval: true,
  estimatedCostRange: {
    min: 0.20,
    avg: 0.50,
    max: 1.50
  },
  
  triggers: {
    manual: true,
    autoEvents: ['phase_ready']
  },
  
  author: 'system',
  tags: ['code-generation', 'implementation', 'files'],
  version: '1.0.0'
};

/**
 * File Regenerator Agent
 * Re-generates specific files with modifications
 */
export const FileRegeneratorTypeDefinition: AgentTypeDefinition = {
  type: SystemAgentType.FILE_REGENERATOR,
  category: AgentCategory.CODE_GENERATION,
  displayName: 'File Regenerator',
  description: 'Re-generates specific files with requested modifications while maintaining consistency with project architecture.',
  icon: 'ICON',
  
  defaultLLM: {
    model: OpenRouterModels.CLAUDE_4_5_SONNET,
    temperature: 0.2,
    maxTokens: 16000,
    thinking: {
      enabled: false,
      budget: 0
    },
    streaming: true
  },
  
  complexity: ComplexityLevel.MEDIUM,
  recommendApproval: false,
  estimatedCostRange: {
    min: 0.05,
    avg: 0.15,
    max: 0.40
  },
  
  triggers: {
    manual: true,
    autoEvents: []
  },
  
  author: 'system',
  tags: ['code-generation', 'file-modification', 'regeneration'],
  version: '1.0.0'
};

/**
 * Code Review Agent
 * Analyzes code for issues and improvements
 */
export const CodeReviewTypeDefinition: AgentTypeDefinition = {
  type: SystemAgentType.CODE_REVIEW,
  category: AgentCategory.ANALYSIS,
  displayName: 'Code Review',
  description: 'Performs comprehensive code review checking for security issues, performance problems, and code quality.',
  icon: 'ICON',
  
  defaultLLM: {
    model: OpenRouterModels.CLAUDE_4_5_SONNET,
    temperature: 0.3,
    maxTokens: 8000,
    thinking: {
      enabled: true,
      budget: 1000
    },
    streaming: true
  },
  
  complexity: ComplexityLevel.MEDIUM,
  recommendApproval: false,
  estimatedCostRange: {
    min: 0.03,
    avg: 0.08,
    max: 0.20
  },
  
  triggers: {
    manual: true,
    autoEvents: ['files_generated']
  },
  
  author: 'system',
  tags: ['analysis', 'code-review', 'quality'],
  version: '1.0.0'
};

/**
 * Screenshot Analyzer Agent
 * Analyzes UI screenshots for implementation guidance
 */
export const ScreenshotAnalyzerTypeDefinition: AgentTypeDefinition = {
  type: SystemAgentType.SCREENSHOT_ANALYZER,
  category: AgentCategory.ANALYSIS,
  displayName: 'Screenshot Analyzer',
  description: 'Analyzes UI screenshots or mockups to extract design specifications and implementation requirements.',
  icon: 'ICON',
  
  defaultLLM: {
    model: OpenRouterModels.CLAUDE_4_5_SONNET,  // Vision required
    temperature: 0.5,
    maxTokens: 8000,
    thinking: {
      enabled: true,
      budget: 1500
    },
    streaming: true
  },
  
  complexity: ComplexityLevel.MEDIUM,
  recommendApproval: false,
  estimatedCostRange: {
    min: 0.05,
    avg: 0.12,
    max: 0.30
  },
  
  triggers: {
    manual: true,
    autoEvents: []
  },
  
  author: 'system',
  tags: ['analysis', 'vision', 'ui', 'design'],
  version: '1.0.0'
};

/**
 * Code Fixer Agent
 * Fixes code issues and errors
 */
export const CodeFixerTypeDefinition: AgentTypeDefinition = {
  type: SystemAgentType.CODE_FIXER,
  category: AgentCategory.CODE_FIXING,
  displayName: 'Code Fixer',
  description: 'Analyzes errors and fixes code issues while maintaining code quality and architecture consistency.',
  icon: 'ICON',
  
  defaultLLM: {
    model: OpenRouterModels.CLAUDE_4_5_SONNET,
    temperature: 0.2,
    maxTokens: 16000,
    thinking: {
      enabled: true,
      budget: 2000
    },
    streaming: true
  },
  
  complexity: ComplexityLevel.MEDIUM,
  recommendApproval: false,
  estimatedCostRange: {
    min: 0.05,
    avg: 0.15,
    max: 0.40
  },
  
  triggers: {
    manual: true,
    autoEvents: ['error_detected']
  },
  
  author: 'system',
  tags: ['code-fixing', 'debugging', 'error-handling'],
  version: '1.0.0'
};

/**
 * Fast Code Fixer Agent
 * Quick, cheap fixes for simple errors
 */
export const FastCodeFixerTypeDefinition: AgentTypeDefinition = {
  type: SystemAgentType.FAST_CODE_FIXER,
  category: AgentCategory.CODE_FIXING,
  displayName: 'Fast Code Fixer',
  description: 'Quickly fixes simple code errors using a fast, lightweight model for common issues.',
  icon: 'âš¡',
  
  defaultLLM: {
    model: OpenRouterModels.GEMINI_2_5_FLASH_LITE,
    temperature: 0.1,
    maxTokens: 8000,
    thinking: {
      enabled: false,
      budget: 0
    },
    streaming: true
  },
  
  complexity: ComplexityLevel.SIMPLE,
  recommendApproval: false,
  estimatedCostRange: {
    min: 0.005,
    avg: 0.01,
    max: 0.03
  },
  
  triggers: {
    manual: true,
    autoEvents: ['simple_error']
  },
  
  author: 'system',
  tags: ['code-fixing', 'quick-fix', 'lightweight'],
  version: '1.0.0'
};

/**
 * Conversational Agent
 * Natural conversation and Q&A
 */
export const ConversationalTypeDefinition: AgentTypeDefinition = {
  type: SystemAgentType.CONVERSATIONAL,
  category: AgentCategory.COMMUNICATION,
  displayName: 'Conversational Assistant',
  description: 'Handles natural language conversations, questions, and explanations about the project.',
  icon: 'ICON',
  
  defaultLLM: {
    model: OpenRouterModels.GEMINI_2_5_FLASH_LITE,
    temperature: 0.7,
    maxTokens: 4000,
    thinking: {
      enabled: false,
      budget: 0
    },
    streaming: true
  },
  
  complexity: ComplexityLevel.SIMPLE,
  recommendApproval: false,
  estimatedCostRange: {
    min: 0.002,
    avg: 0.005,
    max: 0.02
  },
  
  triggers: {
    manual: true,
    autoEvents: ['user_message']
  },
  
  author: 'system',
  tags: ['communication', 'conversation', 'q-and-a'],
  version: '1.0.0'
};

// ============================================================================
// TYPE REGISTRY
// ============================================================================

/**
 * Central registry of all system agent type definitions
 */
export const SYSTEM_AGENT_TYPES: Record<SystemAgentType, AgentTypeDefinition> = {
  [SystemAgentType.BLUEPRINT]: BlueprintTypeDefinition,
  [SystemAgentType.TEMPLATE_SELECTOR]: TemplateSelectorTypeDefinition,
  [SystemAgentType.PHASE_GENERATOR]: PhaseGeneratorTypeDefinition,
  [SystemAgentType.PHASE_IMPLEMENTATION]: PhaseImplementationTypeDefinition,
  [SystemAgentType.FILE_REGENERATOR]: FileRegeneratorTypeDefinition,
  [SystemAgentType.CODE_REVIEW]: CodeReviewTypeDefinition,
  [SystemAgentType.SCREENSHOT_ANALYZER]: ScreenshotAnalyzerTypeDefinition,
  [SystemAgentType.CODE_FIXER]: CodeFixerTypeDefinition,
  [SystemAgentType.FAST_CODE_FIXER]: FastCodeFixerTypeDefinition,
  [SystemAgentType.CONVERSATIONAL]: ConversationalTypeDefinition,
  
  // Custom type is special - user provides all config
  [SystemAgentType.CUSTOM]: {
    type: SystemAgentType.CUSTOM,
    category: AgentCategory.CUSTOM,
    displayName: 'Custom Agent',
    description: 'User-defined agent with custom configuration',
    icon: 'âš™ï¸',
    
    // Defaults for custom - user should override
    defaultLLM: {
      model: OpenRouterModels.CLAUDE_4_5_SONNET,
      temperature: 0.5,
      maxTokens: 8000,
      thinking: {
        enabled: false,
        budget: 0
      },
      streaming: true
    },
    
    complexity: ComplexityLevel.MEDIUM,
    recommendApproval: false,
    estimatedCostRange: {
      min: 0.05,
      avg: 0.15,
      max: 0.50
    },
    
    triggers: {
      manual: true,
      autoEvents: []
    },
    
    author: 'system',
    tags: ['custom', 'user-defined'],
    version: '1.0.0'
  }
};

// ============================================================================
// REGISTRY ACCESS FUNCTIONS
// ============================================================================

/**
 * Get type definition by type
 */
export function getTypeDefinition(type: SystemAgentType): AgentTypeDefinition {
  return SYSTEM_AGENT_TYPES[type];
}

/**
 * Get all type definitions
 */
export function getAllTypeDefinitions(): AgentTypeDefinition[] {
  return Object.values(SYSTEM_AGENT_TYPES);
}

/**
 * Get all types in a category
 */
export function getTypesByCategory(category: AgentCategory): AgentTypeDefinition[] {
  return Object.values(SYSTEM_AGENT_TYPES)
    .filter(def => def.category === category);
}

/**
 * Get type definition by agent ID
 * Parses ID and returns matching type definition
 */
export function getTypeDefinitionFromId(agentId: string): AgentTypeDefinition | null {
  // Import parseAgentId from agent-types
  // Parse ID to get type
  const versionMatch = agentId.match(/-v(\d+\.\d+\.\d+)$/);
  if (!versionMatch) return null;
  
  const withoutVersion = agentId.slice(0, -(versionMatch[1].length + 2));
  const type = withoutVersion.split('-')[0] as SystemAgentType;
  
  return SYSTEM_AGENT_TYPES[type] || null;
}
