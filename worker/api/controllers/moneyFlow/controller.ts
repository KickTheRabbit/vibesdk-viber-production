/**
 * Money Flow Events Controller
 * Fetches generation data from OpenRouter API using server-side API key
 */

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
export async function getMoneyFlowEvents(
    request: Request,
    env: Env
): Promise<Response> {
    try {
        const apiKey = env.OPENROUTER_API_KEY;
        
        if (!apiKey) {
            return Response.json({ error: 'OpenRouter API key not configured' }, { status: 500 });
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
            const errorText = await response.text();
            console.error('[MoneyFlow] OpenRouter API error:', response.status, errorText);
            return Response.json({ 
                error: 'OpenRouter API error', 
                details: errorText 
            }, { status: 500 });
        }

        const data: any = await response.json();
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

        return Response.json(events);
        
    } catch (error) {
        console.error('[MoneyFlow] Error fetching events:', error);
        return Response.json({ 
            error: 'Failed to fetch money flow events',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
