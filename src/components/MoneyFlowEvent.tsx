/**
 * MoneyFlowEvent Component
 * Displays a single cost tracking event with expandable details
 */

import { useState } from 'react';
import { MoneyFlowEvent as MoneyFlowEventType, ACTION_COLORS, ACTION_NAMES } from '../types/moneyFlow';

interface MoneyFlowEventProps {
    event: MoneyFlowEventType;
    onTimestampClick?: (timestamp: string) => void;
}

export function MoneyFlowEvent({ event, onTimestampClick }: MoneyFlowEventProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('de-DE', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
    };
    
    const formatCost = (cost: number) => {
        if (cost < 0.01) {
            return `$${cost.toFixed(4)}`;
        } else if (cost < 1) {
            return `$${cost.toFixed(3)}`;
        } else {
            return `$${cost.toFixed(2)}`;
        }
    };
    
    const formatTokens = (tokens: number) => {
        if (tokens < 1000) {
            return `${tokens}`;
        } else if (tokens < 1_000_000) {
            return `${(tokens / 1000).toFixed(1)}K`;
        } else {
            return `${(tokens / 1_000_000).toFixed(2)}M`;
        }
    };
    
    const formatDuration = (ms?: number) => {
        if (!ms) return null;
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(1)}s`;
    };
    
    const actionColor = ACTION_COLORS[event.action] || '#6B7280';
    const actionName = ACTION_NAMES[event.action] || event.action;
    
    return (
        <div 
            className="border-l-4 px-3 py-2 mb-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            style={{ borderLeftColor: actionColor }}
        >
            {/* Header - Always visible */}
            <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2 flex-1">
                    {/* Timestamp */}
                    <button
                        className="text-xs text-gray-500 dark:text-gray-400 font-mono hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={(e) => {
                            e.stopPropagation();
                            onTimestampClick?.(event.timestamp);
                        }}
                    >
                        [{formatTime(event.timestamp)}]
                    </button>
                    
                    {/* Action name */}
                    <span className="text-sm font-medium" style={{ color: actionColor }}>
                        {actionName}
                    </span>
                </div>
                
                {/* Cost */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        {formatCost(event.cost.totalCost)}
                    </span>
                    <span className="text-xs text-gray-500">
                        {isExpanded ? '▼' : '▶'}
                    </span>
                </div>
            </div>
            
            {/* Expanded Details */}
            {isExpanded && (
                <div className="mt-2 pl-4 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    {/* Token info */}
                    <div className="flex justify-between">
                        <span>Tokens:</span>
                        <span className="font-mono">
                            {formatTokens(event.tokens.total)} 
                            <span className="text-gray-400 ml-1">
                                ({formatTokens(event.tokens.prompt)}↑ / {formatTokens(event.tokens.completion)}↓)
                            </span>
                        </span>
                    </div>
                    
                    {/* Model */}
                    <div className="flex justify-between">
                        <span>Model:</span>
                        <span className="font-mono text-xs">{event.model}</span>
                    </div>
                    
                    {/* Duration */}
                    {event.duration && (
                        <div className="flex justify-between">
                            <span>Duration:</span>
                            <span className="font-mono">{formatDuration(event.duration)}</span>
                        </div>
                    )}
                    
                    {/* Breakdown */}
                    {event.breakdown && event.breakdown.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <div className="font-semibold mb-1">Breakdown:</div>
                            {event.breakdown.map((item, idx) => (
                                <div key={idx} className="flex justify-between pl-2">
                                    <span className="text-gray-500">└─ {item.name}</span>
                                    <span className="font-mono">
                                        {formatCost(item.cost)} 
                                        <span className="text-gray-400 ml-1">
                                            ({formatTokens(item.tokens)})
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Context (if any meaningful data) */}
                    {event.context && Object.keys(event.context).length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <details>
                                <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                                    Context
                                </summary>
                                <pre className="mt-1 text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                                    {JSON.stringify(event.context, null, 2)}
                                </pre>
                            </details>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
