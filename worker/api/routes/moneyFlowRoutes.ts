/**
 * Money Flow API Routes
 */

import { Hono } from 'hono';
import { AppEnv } from '../../types/appenv';
import { getMoneyFlowEvents } from '../controllers/moneyFlow/controller';

/**
 * Setup money flow routes
 */
export function setupMoneyFlowRoutes(app: Hono<AppEnv>): void {
    // GET /api/money-flow-events - Public endpoint
    app.get('/api/money-flow-events', async (c) => {
        return getMoneyFlowEvents(c.req.raw, c.env);
    });
}
