import { executeInference } from '../inferutils';
import type { BlueprintResult } from '../types';

interface BlueprintParams {
  prompt: string;
  templateName: string;
  templateFiles: Record<string, string>;
  language?: string;
  frameworks?: string[];
  env: any;
  agentId: string;
}

const queueCostEvent = async (event: any, agentId: string, env: any) => {
  console.log('[QUEUE_BLUEPRINT] Starting - agentId:', agentId, 'event:', JSON.stringify(event));
  try {
    const agentStub = env.CodeGenObject.get(env.CodeGenObject.idFromName(agentId));
    console.log('[QUEUE_BLUEPRINT] Got agentStub:', !!agentStub);
    await agentStub.queueCostEvent(event);
    console.log('[QUEUE_BLUEPRINT] Successfully queued');
  } catch (error) {
    console.error('[QUEUE_BLUEPRINT] ERROR:', error);
  }
};

export async function generateBlueprint({
  prompt,
  templateName,
  templateFiles,
  language = 'typescript',
  frameworks = [],
  env,
  agentId,
}: BlueprintParams): Promise<BlueprintResult> {
  console.log('Generating application blueprint');
  console.log(`Using template: ${templateName}`);
  console.log('[TRACKING] 🎯 blueprint - START');

  const frameworksList = frameworks.length > 0 ? frameworks.join(', ') : 'none';
  console.log(`Using language: ${language}, frameworks: ${frameworksList}`);

  const systemPrompt = `You are an expert software architect creating detailed application blueprints.

CRITICAL RULES:
1. The blueprint MUST be implementable using ONLY the files from the provided template
2. DO NOT suggest creating new files that don't exist in the template
3. Each phase must modify only files that exist in templateFiles
4. Respect the template's architecture and patterns

Template: ${templateName}
Available files to modify:
${Object.keys(templateFiles).join('\n')}

Create a blueprint with:
- Title: Clear, concise app name
- Overview: Brief description
- Technical Stack: Language and frameworks being used
- Phases: 2-4 implementation phases, each containing:
  * phase_name: Short descriptive name
  * description: What this phase accomplishes
  * tasks: Specific modifications to EXISTING template files
  * files_to_modify: ONLY files that exist in the template

Output valid JSON matching this structure:
{
  "title": "string",
  "overview": "string", 
  "technical_stack": {
    "language": "string",
    "frameworks": ["string"]
  },
  "phases": [{
    "phase_name": "string",
    "description": "string",
    "tasks": ["string"],
    "files_to_modify": ["string"]
  }]
}`;

  const userMessage = `Create a blueprint for: ${prompt}

Template being used: ${templateName}
Language: ${language}
Frameworks: ${frameworksList}

Remember: Only suggest modifications to files that exist in the template.`;

  const broadcastCost = async (type: string, data: any) => {
    if (type === 'money_flow_event') {
      await queueCostEvent(data, agentId, env);
    }
  };

  const result = await executeInference({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    agent: {
      actionKey: 'blueprint',
      env,
      broadcast: broadcastCost,
    },
    parseJson: true,
  });

  console.log('Successfully completed blueprint operation');

  return result as BlueprintResult;
}
