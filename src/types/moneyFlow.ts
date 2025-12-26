/**
 * Money Flow Tracker - Simple Cost Display
 * Shows real-time AI operation costs
 */

export interface MoneyFlowEvent {
    type: 'money_flow_event';
    id: string;
    timestamp: number;
    action: string;
    model: string;
    tokens: {
        prompt: number;
        completion: number;
        total: number;
    };
    cost: number;
}

export interface MoneyFlowState {
    sessionTotal: number;
    events: MoneyFlowEvent[];
}
