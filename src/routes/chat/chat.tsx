import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type FormEvent,
} from 'react';
import { ArrowRight, Image as ImageIcon } from 'react-feather';
import { useParams, useSearchParams, useNavigate } from 'react-router';
import { MonacoEditor } from '../../components/monaco-editor/monaco-editor';
import { AnimatePresence, motion } from 'framer-motion';
import { Expand, Github, LoaderCircle, RefreshCw } from 'lucide-react';
import { Blueprint } from './components/blueprint';
import { FileExplorer } from './components/file-explorer';
import { UserMessage, AIMessage } from './components/messages';
import { PhaseTimeline } from './components/phase-timeline';
import { PreviewIframe } from './components/preview-iframe';
import { ViewModeSwitch } from './components/view-mode-switch';
import { DebugPanel, type DebugMessage } from './components/debug-panel';
import { DeploymentControls } from './components/deployment-controls';
import { useChat, type FileType } from './hooks/use-chat';
import { type ModelConfigsData, type BlueprintType, SUPPORTED_IMAGE_MIME_TYPES } from '@/api-types';
import { Copy } from './components/copy';
import { useFileContentStream } from './hooks/use-file-content-stream';
import { logger } from '@/utils/logger';
import { useApp } from '@/hooks/use-app';
import { AgentModeDisplay } from '@/components/agent-mode-display';
import { useGitHubExport } from '@/hooks/use-github-export';
import { GitHubExportModal } from '@/components/github-export-modal';
import { ModelConfigInfo } from './components/model-config-info';
import { useAutoScroll } from '@/hooks/use-auto-scroll';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useDragDrop } from '@/hooks/use-drag-drop';
import { ImageAttachmentPreview } from '@/components/image-attachment-preview';
import { createAIMessage } from './utils/message-helpers';

export default function Chat() {
	const { chatId: urlChatId } = useParams();

	const [searchParams] = useSearchParams();
	const userQuery = searchParams.get('query');
	const agentMode = searchParams.get('agentMode') || 'deterministic';
	
	// Extract images from URL params if present
	const userImages = useMemo(() => {
		const imagesParam = searchParams.get('images');
		if (!imagesParam) return undefined;
		try {
			return JSON.parse(decodeURIComponent(imagesParam));
		} catch (error) {
			console.error('Failed to parse images from URL:', error);
			return undefined;
		}
	}, [searchParams]);

	// Load existing app data if chatId is provided
	const { app, loading: appLoading } = useApp(urlChatId);

	// If we have an existing app, use its data
	const displayQuery = app ? app.originalPrompt || app.title : userQuery || '';
	const appTitle = app?.title;

	// Manual refresh trigger for preview
	const [manualRefreshTrigger, setManualRefreshTrigger] = useState(0);

	// Debug message utilities
	const addDebugMessage = useCallback(
		(
			type: DebugMessage['type'],
			message: string,
			details?: string,
			source?: string,
			messageType?: string,
			rawMessage?: unknown,
		) => {
			const debugMessage: DebugMessage = {
				id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
				timestamp: Date.now(),
				type,
				message,
				details,
				source,
				messageType,
				rawMessage,
			};

			setDebugMessages((prev) => [...prev, debugMessage]);
		},
		[],
	);

	const clearDebugMessages = useCallback(() => {
		setDebugMessages([]);
	}, []);

	const {
		messages,
		edit,
		bootstrapFiles,
		chatId,
		query,
		files,
		isGeneratingBlueprint,
		isBootstrapping,
		totalFiles,
		websocket,
		sendUserMessage,
		sendAiMessage,
		blueprint,
		previewUrl,
		clearEdit,
		projectStages,
		phaseTimeline,
		isThinking,
		onCompleteBootstrap,
		// Deployment and generation control
		isDeploying,
		cloudflareDeploymentUrl,
		deploymentError,
		isRedeployReady,
		isGenerationPaused,
		isGenerating,
		handleStopGeneration,
		handleResumeGeneration,
		handleDeployToCloudflare,
		// Preview refresh control
		shouldRefreshPreview,
		// Preview deployment state
		isPreviewDeploying,
	} = useChat({
		chatId: urlChatId,
		query: userQuery,
		images: userImages,
		agentMode: agentMode as 'deterministic' | 'smart',
		onDebugMessage: addDebugMessage,
	});

	// GitHub export functionality - use urlChatId directly from URL params
	const githubExport = useGitHubExport(websocket, urlChatId);

	const navigate = useNavigate();

	const [activeFilePath, setActiveFilePath] = useState<string>();
	const [view, setView] = useState<'editor' | 'preview' | 'blueprint' | 'terminal'>(
		'editor',
	);

	// Terminal state
	// const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);

	// Debug panel state
	const [debugMessages, setDebugMessages] = useState<DebugMessage[]>([]);
	const deploymentControlsRef = useRef<HTMLDivElement>(null);

	// Money Flow Tracker state

	// Model config info state
	const [modelConfigs, setModelConfigs] = useState<{
		agents: Array<{ key: string; name: string; description: string; }>;
		userConfigs: ModelConfigsData['configs'];
		defaultConfigs: ModelConfigsData['defaults'];
	} | undefined>();
	const [loadingConfigs, setLoadingConfigs] = useState(false);

	// Handler for model config info requests
	const handleRequestConfigs = useCallback(() => {
		if (!websocket) return;

		setLoadingConfigs(true);
		websocket.send(JSON.stringify({
			type: 'get_model_configs'
		}));
	}, [websocket]);

	// Listen for model config info WebSocket messages
	useEffect(() => {
		if (!websocket) return;

		const handleMessage = (event: MessageEvent) => {
			try {
				const message = JSON.parse(event.data);
				if (message.type === 'model_configs_info') {
					setModelConfigs(message.configs);
					setLoadingConfigs(false);
				} else if (message.type === 'money_flow_event') {
