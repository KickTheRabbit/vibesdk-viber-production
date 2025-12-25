/**
 * Money Flow Events Controller
 * Fetches generation data from OpenRouter API using server-side API key
 */

import type { Context } from 'hono';
import type { RouteContext } from '../types/route-context';

interface MoneyFlowEvent {
    action: string;
    cost: number;
    tokens: number;
    model: string;
    timestamp: string;
}

/**
 * GET /api/money-flow-events
 * Returns recent OpenRouter generations with external_user tags
 */
export async function getMoneyFlowEvents(c: Context<RouteContext>): Promise<Response> {
    try {
        const apiKey = c.env.OPENROUTER_API_KEY;
        
        if (!apiKey) {
            return c.json({ error: 'OpenRouter API key not configured' }, 500);
        }

        // Fetch from OpenRouter API
        const response = await fetch(
            'https://openrouter.ai/api/v1/generation?limit=50',
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.statusText}`);
        }

        const data = await response.json();
        const generations = data.data || [];
        
        // Filter and map to MoneyFlowEvent format
        const events: MoneyFlowEvent[] = generations
            .filter((g: any) => g.external_user) // Only events with action tags
            .map((g: any) => ({
                action: g.external_user,
                cost: g.usage,
                tokens: g.tokens_prompt + g.tokens_completion,
                model: g.model.split('/')[1] || g.model,
                timestamp: new Date(g.created_at).toLocaleTimeString(),
            }));

        return c.json(events);
        
    } catch (error) {
        console.error('[MoneyFlow] Error fetching events:', error);
        return c.json({ error: 'Failed to fetch money flow events' }, 500);
    }
}
