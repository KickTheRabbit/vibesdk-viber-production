/**
 * MoneyFlowTracker Component
 * Right-side panel displaying cost tracking events (Kassenzettel)
 */

import { useState, useEffect, useRef } from 'react';
import { MoneyFlowEvent as MoneyFlowEventComponent } from './MoneyFlowEvent';
import { MoneyFlowState } from '../types/moneyFlow';

interface MoneyFlowTrackerProps {
    state: MoneyFlowState;
    onReset: () => void;
    onEventClick: (timestamp: string) => void;
}

export function MoneyFlowTracker({ state, onReset, onEventClick }: MoneyFlowTrackerProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [autoScroll, setAutoScroll] = useState(true);
    
    // Auto-scroll to latest event
    useEffect(() => {
        if (autoScroll && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [state.events.length, autoScroll]);
    
    // WebSocket connection - to be implemented
    useEffect(() => {
        // TODO: Connect to WebSocket and listen for MONEY_FLOW_EVENT
        // Placeholder for development
        console.log('MoneyFlowTracker mounted - WebSocket connection to be implemented');
        
        return () => {
            console.log('MoneyFlowTracker unmounted');
        };
    }, []);
    
    const formatCost = (cost: number) => {
        if (cost < 1) {
            return `$${cost.toFixed(3)}`;
        } else {
            return `$${cost.toFixed(2)}`;
        }
    };
    
    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            // If user scrolled away from bottom, disable auto-scroll
            const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
            setAutoScroll(isAtBottom);
        }
    };
    
    const handleReset = () => {
        if (confirm('Reset session costs? This will clear all tracking data.')) {
            onReset();
        }
    };
    
    const handleExport = () => {
        // Export as CSV
        const csv = [
            'Timestamp,Action,Model,Tokens,Cost',
            ...state.events.map(e => 
                `${e.timestamp},${e.action},${e.model},${e.tokens.total},${e.cost.totalCost}`
            )
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `money-flow-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };
    
    if (isCollapsed) {
        return (
            <div className="w-12 bg-gray-100 dark:bg-gray-900 border-l border-gray-300 dark:border-gray-700 flex flex-col items-center py-4">
                <button
                    onClick={() => setIsCollapsed(false)}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rotate-180"
                    title="Expand Money Flow Tracker"
                >
                    ◀
                </button>
                <div className="mt-4 writing-mode-vertical text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {formatCost(state.sessionTotal)}
                </div>
            </div>
        );
    }
    
    return (
        <div className="w-96 bg-white dark:bg-gray-900 border-l border-gray-300 dark:border-gray-700 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Money Flow
                    </h2>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                        {formatCost(state.sessionTotal)}
                    </div>
                </div>
                
                <button
                    onClick={() => setIsCollapsed(true)}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    title="Collapse panel"
                >
                    ▶
                </button>
            </div>
            
            {/* Event List */}
            <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-2"
            >
                {state.events.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
                        <p className="text-sm">No cost events yet</p>
                        <p className="text-xs mt-2">
                            Events will appear here as<br/>
                            AI operations are performed
                        </p>
                    </div>
                ) : (
                    state.events.map(event => (
                        <MoneyFlowEventComponent
                            key={event.id}
                            event={event}
                            onTimestampClick={onEventClick}
                        />
                    ))
                )}
                
                {!autoScroll && state.events.length > 0 && (
                    <button
                        onClick={() => {
                            setAutoScroll(true);
                            if (scrollRef.current) {
                                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                            }
                        }}
                        className="sticky bottom-0 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 text-sm"
                    >
                        ↓ Scroll to latest
                    </button>
                )}
            </div>
            
            {/* Footer - Summary Stats */}
            {state.events.length > 0 && (
                <div className="p-4 border-t border-gray-300 dark:border-gray-700 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Operations:</span>
                        <span className="font-mono">{state.events.length}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Most expensive:</span>
                        <span className="font-mono">
                            {(() => {
                                const maxEvent = state.events.reduce((max, e) => 
                                    e.cost.totalCost > max.cost.totalCost ? e : max
                                , state.events[0]);
                                return `${formatCost(maxEvent.cost.totalCost)}`;
                            })()}
                        </span>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={handleExport}
                            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            Export CSV
                        </button>
                        <button
                            onClick={handleReset}
                            className="flex-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-3 py-1 rounded text-sm hover:bg-red-200 dark:hover:bg-red-800"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
