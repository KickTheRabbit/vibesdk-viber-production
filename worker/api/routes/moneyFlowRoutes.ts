/**
 * Money Flow API Routes
 */

import { Hono } from 'hono';
import type { RouteContext } from '../types/route-context';
import { getMoneyFlowEvents } from '../controllers/moneyFlow/controller';

const moneyFlowRoutes = new Hono<RouteContext>();

// GET /api/money-flow-events
moneyFlowRoutes.get('/money-flow-events', getMoneyFlowEvents);

export { moneyFlowRoutes };
