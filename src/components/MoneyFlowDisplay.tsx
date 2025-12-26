import { useEffect, useState } from 'react';
import { MoneyFlowEvent, MoneyFlowState } from '@/types/moneyFlow';

interface MoneyFlowDisplayProps {
    websocket: WebSocket | null;
}

export function MoneyFlowDisplay({ websocket }: MoneyFlowDisplayProps) {
    const [state, setState] = useState<MoneyFlowState>({
        sessionTotal: 0,
        events: []
    });

    useEffect(() => {
        if (!websocket) return;

        const handleMessage = (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data);
                if (message.type === 'money_flow_event') {
                    const costEvent = message as MoneyFlowEvent;
                    setState(prev => ({
                        sessionTotal: prev.sessionTotal + costEvent.cost,
                        events: [...prev.events, costEvent].slice(-10) // Keep last 10
                    }));
                }
            } catch (error) {
                console.error('Error parsing money flow message:', error);
            }
        };

        websocket.addEventListener('message', handleMessage);
        return () => websocket.removeEventListener('message', handleMessage);
    }, [websocket]);

    if (state.events.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-background/95 backdrop-blur border rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-3 pb-2 border-b">
                <h3 className="font-semibold text-sm">Session Cost</h3>
                <span className="font-mono text-lg font-bold">
                    ${state.sessionTotal.toFixed(4)}
                </span>
            </div>
            
            <div className="space-y-2">
                {state.events.slice().reverse().map((event) => (
                    <div key={event.id} className="flex items-center justify-between text-xs">
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground/90 truncate">
                                {event.action}
                            </div>
                            <div className="text-muted-foreground">
                                {event.model.split('/')[1] || event.model} • {event.tokens.total.toLocaleString()} tokens
                            </div>
                        </div>
                        <div className="ml-2 font-mono font-semibold whitespace-nowrap">
                            ${event.cost.toFixed(4)}
                        </div>
                    </div>
                ))}
            </div>
            
            {state.events.length >= 10 && (
                <div className="mt-2 pt-2 border-t text-xs text-muted-foreground text-center">
                    Showing last 10 operations
                </div>
            )}
        </div>
    );
}
