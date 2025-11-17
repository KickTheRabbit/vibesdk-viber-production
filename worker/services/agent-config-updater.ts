/**
 * Agent Config Updater Service
 * Updates model configs in running agent instances when user changes settings
 */

import { getAgentStub } from '../agents/index';
import { ModelConfigService } from '../database/services/ModelConfigService';
import { AppService } from '../database/services/AppService';
import { createLogger } from '../logger';

const logger = createLogger('AgentConfigUpdater');

/**
 * Update model configs in all running agents for a user
 */
export async function updateUserAgentsModelConfigs(
    userId: string,
    env: Env
): Promise<void> {
    try {
        logger.info(`Updating model configs for user ${userId}'s agents`);
        
        // 1. Load fresh configs from DB
        const modelConfigService = new ModelConfigService(env);
        const freshConfigs = await modelConfigService.getUserModelConfigs(userId);
        
        // 2. Find all apps (agents) for this user
        const appService = new AppService(env);
        const userApps = await appService.getUserAppsWithFavorites(userId, { limit: 1000 });
        
        logger.info(`Found ${userApps.length} agents for user ${userId}`);
        
        // 3. Update each agent's state
        const updatePromises = userApps.map(async (appData) => {
		    try {
		        const agentStub = await getAgentStub(env, appData.id, true, logger);
                
                // Check if agent is initialized
                if (!await agentStub.isInitialized()) {
                    logger.info(`Agent ${appData.id} not initialized, skipping`);
                    return;
                }
                
                // Get current state
                const currentState = await agentStub.getFullState() as any;
                
                // Update only the userModelConfigs in inferenceContext
                const updatedState = {
                    ...currentState,
                    inferenceContext: {
                        ...currentState.inferenceContext,
                        userModelConfigs: Object.fromEntries(
                            Object.entries(freshConfigs).map(([key, config]) => [
                                key,
                                {
                                    name: config.name,
                                    max_tokens: config.max_tokens,
                                    temperature: config.temperature,
                                    reasoning_effort: config.reasoning_effort,
                                    fallbackModel: config.fallbackModel
                                }
                            ])
                        )
                    }
                };
                
                // Set the updated state
                await agentStub.setState(updatedState);
                
                logger.info(`Updated agent ${appData.id} with fresh model configs`);
            } catch (error) {
                logger.error(`Failed to update agent ${appData.id}:`, error);
                // Continue with other agents even if one fails
            }
        });
        
        await Promise.all(updatePromises);
        
        logger.info(`Successfully updated model configs for user ${userId}`);
    } catch (error) {
        logger.error(`Error updating user agents model configs:`, error);
        throw error;
    }
}
