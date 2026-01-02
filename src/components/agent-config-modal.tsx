/**
 * Agent Config Modal
 * 
 * Simplified modal for creating/editing Universal Agent configs.
 * V1: Basic form with essential fields only.
 * 
 * Version: 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import type { UniversalAgentConfig } from '@/types/universal-agent';
import {
	SystemAgentType,
	AgentCategory,
	ComplexityLevel,
	generateAgentId,
	getCategoryForType,
} from '@/lib/universal-agents/agent-types';
import {
	SYSTEM_AGENT_TYPES,
	getTypeDefinition,
	OpenRouterModels,
} from '@/lib/universal-agents/system-types';

interface AgentConfigModalProps {
	config: UniversalAgentConfig | null;
	onSave: (config: UniversalAgentConfig) => void;
	onClose: () => void;
}

export function AgentConfigModal({ config, onSave, onClose }: AgentConfigModalProps) {
	const isEditing = !!config;
	
	// Form state
	const [agentType, setAgentType] = useState<SystemAgentType | 'custom'>(
		config?.type || SystemAgentType.CUSTOM
	);
	const [category, setCategory] = useState<AgentCategory>(
		config?.category || AgentCategory.CUSTOM
	);
	const [variant, setVariant] = useState(config?.variant || '');
	const [displayName, setDisplayName] = useState(config?.displayName || '');
	const [description, setDescription] = useState(config?.description || '');
	const [icon, setIcon] = useState(config?.icon || 'âš™ï¸');
	const [tags, setTags] = useState(config?.tags.join(', ') || '');
	
	// LLM config
	const [model, setModel] = useState(config?.llm.model || OpenRouterModels.ANTHROPIC_SONNET_4_5);
	const [temperature, setTemperature] = useState(config?.llm.temperature || 0.7);
	const [maxTokens, setMaxTokens] = useState(config?.llm.maxTokens || 16000);
	
	// System prompt (simplified)
	const [role, setRole] = useState(config?.systemPrompt.role || '');
	const [task, setTask] = useState(config?.systemPrompt.task || '');

	// Auto-update category when type changes
	useEffect(() => {
		if (agentType !== 'custom' && agentType in SystemAgentType) {
			const autoCategory = getCategoryForType(agentType as SystemAgentType);
			setCategory(autoCategory);
			
			// Load defaults from type definition
			const typeDef = getTypeDefinition(agentType as SystemAgentType);
			if (typeDef && !isEditing) {
				setModel(typeDef.defaultLLM.model);
				setTemperature(typeDef.defaultLLM.temperature);
				setMaxTokens(typeDef.defaultLLM.maxTokens);
			}
		}
	}, [agentType, isEditing]);

	const handleSave = () => {
		// Validation
		if (!displayName.trim()) {
			toast.error('Display name is required');
			return;
		}
		if (!description.trim()) {
			toast.error('Description is required');
			return;
		}
		if (!role.trim() || !task.trim()) {
			toast.error('System prompt role and task are required');
			return;
		}

		// Generate ID
		const version = config?.version || '1.0.0';
		const id = config?.id || generateAgentId(
			agentType,
			variant || undefined,
			version
		);

		// Get type definition for defaults
		const typeDef = agentType !== 'custom' 
			? getTypeDefinition(agentType as SystemAgentType)
			: null;

		const agentConfig: UniversalAgentConfig = {
			// Identity
			id,
			type: agentType,
			category,
			variant: variant || undefined,
			displayName: displayName.trim(),
			version,
			author: config?.author || 'user',
			description: description.trim(),
			tags: tags.split(',').map(t => t.trim()).filter(Boolean),
			icon,
			
			// System Prompt (simplified)
			systemPrompt: {
				role: role.trim(),
				task: task.trim(),
				outputFormat: 'json',
				communicationRules: null,
				securityGuidelines: ['Core Security Rules'],
				constraints: [],
				domainKnowledge: null,
				examples: [],
				customBlocks: [],
				contextInjection: []
			},
			
			// Input/Output (defaults)
			input: config?.input || {
				required: [
					{
						name: 'userPrompt',
						type: 'string',
						description: 'User input',
						validation: {},
						example: 'Example input'
					}
				],
				optional: [],
				multimodal: {
					images: { enabled: false, maxCount: 0, formats: [], maxSize: 0 },
					files: { enabled: false, allowedTypes: [], maxCount: 0, maxSize: 0 }
				}
			},
			
			output: config?.output || {
				type: 'json',
				schema: { type: 'object', properties: {} },
				validation: { mode: 'loose', onError: 'retry' },
				storage: {
					location: 'agent_state',
					broadcast: 'agent_complete',
					shareWith: []
				}
			},
			
			// LLM Configuration
			llm: {
				model,
				temperature,
				maxTokens,
				thinking: config?.llm.thinking || { enabled: false, budget: 0 },
				streaming: config?.llm.streaming ?? true,
				topP: config?.llm.topP || 1.0,
				frequencyPenalty: config?.llm.frequencyPenalty || 0,
				presencePenalty: config?.llm.presencePenalty || 0,
				stopSequences: config?.llm.stopSequences || []
			},
			
			// Orchestration
			triggers: config?.triggers || {
				manual: true,
				auto: [],
				afterAgent: [],
				onError: []
			},
			
			dependencies: config?.dependencies || {
				requiresAgents: [],
				requiresState: [],
				producesFor: []
			},
			
			// Governance
			complexity: typeDef?.complexity || ComplexityLevel.MEDIUM,
			recommendApproval: typeDef?.recommendApproval ?? false,
			estimatedCostRange: typeDef?.estimatedCostRange || {
				min: 0.05,
				avg: 0.10,
				max: 0.20
			},
			warningMessages: config?.warningMessages || [],
			
			// Testing
			testing: config?.testing || {
				enabled: false,
				testCases: []
			},
			
			// Versioning
			changelog: config?.changelog || [
				{
					version: '1.0.0',
					date: new Date().toISOString(),
					author: 'user',
					changes: 'Initial version',
					breaking: false
				}
			],
			deprecated: config?.deprecated || false,
			
			// Metadata
			visibility: config?.visibility || 'private',
			createdAt: config?.createdAt || new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

		onSave(agentConfig);
	};

	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? 'Edit Agent Configuration' : 'Create New Agent'}
					</DialogTitle>
					<DialogDescription>
						Configure your Universal Agent settings
					</DialogDescription>
				</DialogHeader>

				<Tabs defaultValue="basics" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="basics">Basics</TabsTrigger>
						<TabsTrigger value="prompt">Prompt</TabsTrigger>
						<TabsTrigger value="llm">LLM Config</TabsTrigger>
					</TabsList>

					{/* Tab 1: Basics */}
					<TabsContent value="basics" className="space-y-4 mt-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Agent Type</Label>
								<Select
									value={agentType}
									onValueChange={(v) => setAgentType(v as SystemAgentType | 'custom')}
									disabled={isEditing}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{SYSTEM_AGENT_TYPES.map((type) => (
											<SelectItem key={type} value={type}>
												{type}
											</SelectItem>
										))}
										<SelectItem value="custom">custom</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label>Category</Label>
								<Select
									value={category}
									onValueChange={(v) => setCategory(v as AgentCategory)}
									disabled={agentType !== 'custom'}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{Object.values(AgentCategory).map((cat) => (
											<SelectItem key={cat} value={cat}>
												{cat}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{agentType !== 'custom' && (
									<p className="text-xs text-text-tertiary">
										Auto-assigned by type
									</p>
								)}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Variant (optional)</Label>
								<Input
									value={variant}
									onChange={(e) => setVariant(e.target.value)}
									placeholder="e.g., senior-expert"
									disabled={isEditing}
								/>
								<p className="text-xs text-text-tertiary">
									lowercase-with-hyphens only
								</p>
							</div>

							<div className="space-y-2">
								<Label>Icon</Label>
								<Input
									value={icon}
									onChange={(e) => setIcon(e.target.value)}
									placeholder="icon"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Display Name *</Label>
							<Input
								value={displayName}
								onChange={(e) => setDisplayName(e.target.value)}
								placeholder="My Custom Agent"
							/>
						</div>

						<div className="space-y-2">
							<Label>Description *</Label>
							<Textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="What does this agent do?"
								rows={3}
							/>
						</div>

						<div className="space-y-2">
							<Label>Tags (comma-separated)</Label>
							<Input
								value={tags}
								onChange={(e) => setTags(e.target.value)}
								placeholder="planning, architecture"
							/>
						</div>
					</TabsContent>

					{/* Tab 2: System Prompt */}
					<TabsContent value="prompt" className="space-y-4 mt-4">
						<div className="space-y-2">
							<Label>Role Definition *</Label>
							<Textarea
								value={role}
								onChange={(e) => setRole(e.target.value)}
								placeholder="You are an expert..."
								rows={2}
							/>
						</div>

						<div className="space-y-2">
							<Label>Task Description *</Label>
							<Textarea
								value={task}
								onChange={(e) => setTask(e.target.value)}
								placeholder="Analyze user requirements and..."
								rows={4}
							/>
						</div>

						<div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
							<p className="text-sm text-text-tertiary">
								V1 uses simplified prompts. Advanced features (constraints, examples, etc.)
								coming in future versions.
							</p>
						</div>
					</TabsContent>

					{/* Tab 3: LLM Config */}
					<TabsContent value="llm" className="space-y-4 mt-4">
						<div className="space-y-2">
							<Label>Model</Label>
							<Select value={model} onValueChange={setModel}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={OpenRouterModels.ANTHROPIC_OPUS_4_1}>
										Claude Opus 4.1
									</SelectItem>
									<SelectItem value={OpenRouterModels.ANTHROPIC_SONNET_4_5}>
										Claude Sonnet 4.5
									</SelectItem>
									<SelectItem value={OpenRouterModels.ANTHROPIC_HAIKU_4_5}>
										Claude Haiku 4.5
									</SelectItem>
									<SelectItem value={OpenRouterModels.GOOGLE_GEMINI_2_5_PRO}>
										Gemini 2.5 Pro
									</SelectItem>
									<SelectItem value={OpenRouterModels.GOOGLE_GEMINI_2_5_FLASH_LITE}>
										Gemini 2.5 Flash Lite
									</SelectItem>
									<SelectItem value={OpenRouterModels.OPENAI_GPT_4O}>
										GPT-4o
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label>Temperature: {temperature}</Label>
								<input
									type="range"
									min="0"
									max="1"
									step="0.1"
									value={temperature}
									onChange={(e) => setTemperature(parseFloat(e.target.value))}
									className="w-full"
								/>
								<p className="text-xs text-text-tertiary">
									{temperature < 0.3 && 'Deterministic, precise'}
									{temperature >= 0.3 && temperature < 0.7 && 'Balanced'}
									{temperature >= 0.7 && 'Creative, varied'}
								</p>
							</div>

							<div className="space-y-2">
								<Label>Max Tokens</Label>
								<Input
									type="number"
									value={maxTokens}
									onChange={(e) => setMaxTokens(parseInt(e.target.value) || 16000)}
									min="100"
									max="200000"
								/>
							</div>
						</div>
					</TabsContent>
				</Tabs>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleSave}>
						{isEditing ? 'Save Changes' : 'Create Agent'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
