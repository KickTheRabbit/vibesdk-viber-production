/**
 * Agent Config Panel
 * 
 * Settings panel tab for managing Universal Agent configurations.
 * Allows users to view, create, edit, and delete agent configs.
 * 
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Copy, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AgentConfigModal } from './agent-config-modal';
import type { UniversalAgentConfig } from '@/types/universal-agent';

// Import agent type system
import {
	SystemAgentType,
	AgentCategory,
	ComplexityLevel,
} from '@/lib/universal-agents/agent-types';
import {
	SYSTEM_AGENT_TYPES,
	getTypeDefinition,
} from '@/lib/universal-agents/system-types';

interface AgentConfigPanelProps {
	// Future: API integration
}

export function AgentConfigPanel({}: AgentConfigPanelProps) {
	const [configs, setConfigs] = useState<UniversalAgentConfig[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingConfig, setEditingConfig] = useState<UniversalAgentConfig | null>(null);
	const [deletingConfig, setDeletingConfig] = useState<UniversalAgentConfig | null>(null);
	const [showConfigModal, setShowConfigModal] = useState(false);

	// Load configs from localStorage (temporary - later from API)
	useEffect(() => {
		loadConfigs();
	}, []);

	const loadConfigs = () => {
		try {
			setLoading(true);
			const saved = localStorage.getItem('universalAgentConfigs');
			if (saved) {
				setConfigs(JSON.parse(saved));
			} else {
				// Initialize with default Blueprint config
				const blueprintDefault = createDefaultBlueprintConfig();
				setConfigs([blueprintDefault]);
				localStorage.setItem('universalAgentConfigs', JSON.stringify([blueprintDefault]));
			}
		} catch (error) {
			console.error('Error loading agent configs:', error);
			toast.error('Failed to load agent configurations');
		} finally {
			setLoading(false);
		}
	};

	const createDefaultBlueprintConfig = (): UniversalAgentConfig => {
		const typeDef = getTypeDefinition(SystemAgentType.BLUEPRINT);
		
		return {
			// Identity
			id: 'blueprint-vibesdk-compatible-v1.0.0',
			type: SystemAgentType.BLUEPRINT,
			category: AgentCategory.PLANNING,
			variant: 'vibesdk-compatible',
			displayName: 'Blueprint (VibeSDK Compatible)',
			version: '1.0.0',
			author: 'system',
			description: 'Default blueprint agent compatible with current VibeSDK workflow',
			tags: ['planning', 'architecture', 'vibesdk-default'],
			icon: 'ðŸ"',
			
			// System Prompt (simplified for v1)
			systemPrompt: {
				role: 'You are an expert project architect and planner.',
				task: 'Analyze user requirements and create detailed project blueprints with features, components, and technical specifications.',
				outputFormat: 'JSON',
				communicationRules: null,
				securityGuidelines: ['Core Security Rules'],
				constraints: [
					{
						type: 'MUST',
						description: 'Follow template structure if provided',
						conditional: null
					}
				],
				domainKnowledge: null,
				examples: [],
				customBlocks: [],
				contextInjection: []
			},
			
			// Input/Output
			input: {
				required: [
					{
						name: 'userPrompt',
						type: 'string',
						description: 'User requirements and feature requests',
						validation: { minLength: 10 },
						example: 'Create a task management app with user authentication'
					}
				],
				optional: [
					{
						name: 'template',
						type: 'object',
						description: 'Selected template information',
						validation: {},
						example: null
					},
					{
						name: 'images',
						type: 'array',
						description: 'Reference images or mockups',
						validation: {},
						example: null
					}
				],
				multimodal: {
					images: {
						enabled: true,
						maxCount: 5,
						formats: ['png', 'jpg', 'webp'],
						maxSize: 5242880 // 5MB
					},
					files: {
						enabled: false,
						allowedTypes: [],
						maxCount: 0,
						maxSize: 0
					}
				}
			},
			
			output: {
				type: 'json',
				schema: {
					type: 'object',
					properties: {
						features: { type: 'array' },
						structure: { type: 'object' },
						dependencies: { type: 'array' }
					}
				},
				validation: {
					mode: 'loose',
					onError: 'retry'
				},
				storage: {
					location: 'agent_state',
					broadcast: 'blueprint_ready',
					shareWith: ['phase-generator', 'phase-implementation']
				}
			},
			
			// LLM Configuration
			llm: typeDef.defaultLLM,
			
			// Orchestration
			triggers: {
				manual: true,
				auto: ['new_project', 'major_feature_add'],
				afterAgent: [],
				onError: []
			},
			
			dependencies: {
				requiresAgents: [],
				requiresState: [],
				producesFor: ['phase-generator', 'phase-implementation']
			},
			
			// Governance (recommendations)
			complexity: typeDef.complexity,
			recommendApproval: typeDef.recommendApproval,
			estimatedCostRange: typeDef.estimatedCostRange,
			warningMessages: [],
			
			// Testing
			testing: {
				enabled: false,
				testCases: []
			},
			
			// Versioning
			changelog: [
				{
					version: '1.0.0',
					date: new Date().toISOString(),
					author: 'system',
					changes: 'Initial VibeSDK-compatible blueprint agent',
					breaking: false
				}
			],
			deprecated: false,
			
			// Metadata
			visibility: 'private',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};
	};

	const saveConfigs = (newConfigs: UniversalAgentConfig[]) => {
		try {
			localStorage.setItem('universalAgentConfigs', JSON.stringify(newConfigs));
			setConfigs(newConfigs);
			toast.success('Configuration saved');
		} catch (error) {
			console.error('Error saving configs:', error);
			toast.error('Failed to save configuration');
		}
	};

	const handleCreateNew = () => {
		setEditingConfig(null);
		setShowConfigModal(true);
	};

	const handleEdit = (config: UniversalAgentConfig) => {
		setEditingConfig(config);
		setShowConfigModal(true);
	};

	const handleDuplicate = (config: UniversalAgentConfig) => {
		const duplicate: UniversalAgentConfig = {
			...config,
			id: `${config.type}-copy-v1.0.0`,
			displayName: `${config.displayName} (Copy)`,
			version: '1.0.0',
			variant: config.variant ? `${config.variant}-copy` : 'copy',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};
		
		const newConfigs = [...configs, duplicate];
		saveConfigs(newConfigs);
	};

	const handleDelete = (config: UniversalAgentConfig) => {
		setDeletingConfig(config);
	};

	const confirmDelete = () => {
		if (!deletingConfig) return;
		
		const newConfigs = configs.filter(c => c.id !== deletingConfig.id);
		saveConfigs(newConfigs);
		setDeletingConfig(null);
	};

	const handleSaveConfig = (config: UniversalAgentConfig) => {
		const existing = configs.find(c => c.id === config.id);
		let newConfigs: UniversalAgentConfig[];
		
		if (existing) {
			// Update existing
			newConfigs = configs.map(c => c.id === config.id ? config : c);
		} else {
			// Add new
			newConfigs = [...configs, config];
		}
		
		saveConfigs(newConfigs);
		setShowConfigModal(false);
		setEditingConfig(null);
	};

	const getCategoryColor = (category: AgentCategory): string => {
		const colors: Record<AgentCategory, string> = {
			[AgentCategory.PLANNING]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
			[AgentCategory.CODE_GENERATION]: 'bg-green-500/10 text-green-500 border-green-500/20',
			[AgentCategory.CODE_FIXING]: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
			[AgentCategory.ANALYSIS]: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
			[AgentCategory.COMMUNICATION]: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
			[AgentCategory.CUSTOM]: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
		};
		return colors[category] || colors[AgentCategory.CUSTOM];
	};

	const getComplexityColor = (complexity: ComplexityLevel): string => {
		const colors: Record<ComplexityLevel, string> = {
			[ComplexityLevel.SIMPLE]: 'text-green-600 dark:text-green-400',
			[ComplexityLevel.MEDIUM]: 'text-yellow-600 dark:text-yellow-400',
			[ComplexityLevel.COMPLEX]: 'text-red-600 dark:text-red-400'
		};
		return colors[complexity];
	};

	if (loading) {
		return (
			<Card>
				<CardHeader>
					<div className="flex items-center gap-3 border-b w-full py-3">
						<SettingsIcon className="h-4 w-4" />
						<CardTitle>Universal Agents</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="px-6 mt-6">
					<div className="flex items-center gap-3">
						<SettingsIcon className="h-5 w-5 animate-spin text-text-tertiary" />
						<span className="text-sm text-text-tertiary">
							Loading agent configurations...
						</span>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Card id="universal-agents">
				<CardHeader variant="minimal">
					<div className="flex items-center justify-between border-b w-full py-3 text-text-primary">
						<div className="flex items-center gap-3">
							<SettingsIcon className="h-4 w-4" />
							<div>
								<CardTitle>Universal Agents</CardTitle>
								<p className="text-sm text-text-tertiary mt-1">
									Configure AI agents for your workflow
								</p>
							</div>
						</div>
						<Button onClick={handleCreateNew} size="sm">
							<Plus className="h-4 w-4 mr-2" />
							New Agent
						</Button>
					</div>
				</CardHeader>
				
				<CardContent className="px-6 mt-6">
					{configs.length === 0 ? (
						<div className="text-center py-12 border-2 border-dashed dark:border-bg-4 border-muted rounded-lg">
							<SettingsIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
							<h3 className="text-lg font-medium mb-2">No agents configured</h3>
							<p className="text-sm text-text-tertiary mb-4">
								Create your first Universal Agent to get started
							</p>
							<Button onClick={handleCreateNew}>
								<Plus className="h-4 w-4 mr-2" />
								Create Agent
							</Button>
						</div>
					) : (
						<div className="space-y-3">
							{configs.map((config) => (
								<div
									key={config.id}
									className="p-4 border rounded-lg bg-bg-3/50 hover:bg-bg-3/80 transition-colors"
								>
									<div className="flex items-start justify-between">
										<div className="flex items-start gap-3 flex-1">
											<div className="text-2xl">{config.icon}</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<h4 className="font-medium truncate">
														{config.displayName}
													</h4>
													<Badge
														variant="outline"
														className={`text-xs ${getCategoryColor(config.category)}`}
													>
														{config.category}
													</Badge>
													{config.deprecated && (
														<Badge variant="outline" className="text-xs text-red-500">
															Deprecated
														</Badge>
													)}
												</div>
												<p className="text-sm text-text-tertiary mb-2 line-clamp-1">
													{config.description}
												</p>
												<div className="flex items-center gap-4 text-xs text-text-tertiary">
													<span>
														Model: {config.llm.model.split('/').pop()}
													</span>
													<span className={getComplexityColor(config.complexity)}>
														{config.complexity}
													</span>
													<span>
														~${config.estimatedCostRange.avg.toFixed(2)}
													</span>
													<span>v{config.version}</span>
												</div>
											</div>
										</div>
										
										<div className="flex items-center gap-1 ml-4">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleEdit(config)}
												title="Edit configuration"
											>
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleDuplicate(config)}
												title="Duplicate agent"
											>
												<Copy className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleDelete(config)}
												title="Delete agent"
											>
												<Trash2 className="h-4 w-4 text-red-500" />
											</Button>
										</div>
									</div>
									
									{config.tags.length > 0 && (
										<div className="flex items-center gap-2 mt-3 flex-wrap">
											{config.tags.map((tag) => (
												<Badge
													key={tag}
													variant="secondary"
													className="text-xs"
												>
													{tag}
												</Badge>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					)}
					
					<div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
						<h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
							ðŸš€ CustomVibeAgent V1
						</h4>
						<p className="text-xs text-text-tertiary">
							Universal Agent system with configurable AI workflows. 
							Agents are stored locally and will integrate with VibeSDK backend in future versions.
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Config Modal */}
			{showConfigModal && (
				<AgentConfigModal
					config={editingConfig}
					onSave={handleSaveConfig}
					onClose={() => {
						setShowConfigModal(false);
						setEditingConfig(null);
					}}
				/>
			)}

			{/* Delete Confirmation */}
			<AlertDialog
				open={!!deletingConfig}
				onOpenChange={(open) => !open && setDeletingConfig(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Agent Configuration?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{deletingConfig?.displayName}"?
							This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className="bg-red-500 hover:bg-red-600"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
