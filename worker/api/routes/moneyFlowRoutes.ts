/**
 * Money Flow API Routes
 */

import { Hono } from 'hono';
import { getMoneyFlowEvents } from '../controllers/moneyFlow/controller';

const moneyFlowRoutes = new Hono();

// GET /api/money-flow-events
moneyFlowRoutes.get('/money-flow-events', getMoneyFlowEvents);

export { moneyFlowRoutes };
