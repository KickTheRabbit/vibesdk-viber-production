/**
 * useOpenRouterMoneyFlow Hook
 * Fetches from backend endpoint - no API key needed in frontend
 */

import { useEffect, useRef } from 'react';

interface MoneyFlowEvent {
    action: string;
    cost: number;
    tokens: number;
    model: string;
    timestamp: string;
}

export function useOpenRouterMoneyFlow() {
    const hasLogged = useRef(false);

    useEffect(() => {
        if (hasLogged.current) return;
        
        console.log('[MoneyFlow] 🚀 Starting Money Flow fetch...');
        
        const fetchAndLog = async () => {
            try {
                // Call our backend endpoint instead of OpenRouter directly
                const response = await fetch('/api/money-flow-events');

                if (!response.ok) {
                    throw new Error(`API Error: ${response.statusText}`);
                }

                const events: MoneyFlowEvent[] = await response.json();
                
                console.log(`[MoneyFlow] ✅ Fetched ${events.length} events with actions!`);
                console.table(events);
                
                // Gesamtkosten
                const totalCost = events.reduce((sum, e) => sum + e.cost, 0);
                console.log(`[MoneyFlow] 💰 Total Cost: $${totalCost.toFixed(4)}`);
                
                // Kosten pro Action
                const costByAction: Record<string, number> = {};
                events.forEach(e => {
                    costByAction[e.action] = (costByAction[e.action] || 0) + e.cost;
                });
                
                console.log('[MoneyFlow] 📊 Cost by Action:');
                console.table(costByAction);
                
                hasLogged.current = true;
                
            } catch (error) {
                console.error('[MoneyFlow] ❌ Error:', error);
            }
        };

        fetchAndLog();
    }, []);
}
