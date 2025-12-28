import { executeInference } from '../inferutils';

interface TemplateSelectorParams {
  userPrompt: string;
  templates: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  env: any;
  agentId: string;
}

interface TemplateSelectionResult {
  templateId: string;
  reasoning: string;
}

const queueCostEvent = async (event: any, agentId: string, env: any) => {
  console.log('[QUEUE_TEMPLATE] Starting - agentId:', agentId, 'event:', JSON.stringify(event));
  try {
    const agentStub = env.CodeGenObject.get(env.CodeGenObject.idFromName(agentId));
    console.log('[QUEUE_TEMPLATE] Got agentStub:', !!agentStub);
    await agentStub.queueCostEvent(event);
    console.log('[QUEUE_TEMPLATE] Successfully queued');
  } catch (error) {
    console.error('[QUEUE_TEMPLATE] ERROR:', error);
  }
};

export async function selectTemplate({
  userPrompt,
  templates,
  env,
  agentId,
}: TemplateSelectorParams): Promise<TemplateSelectionResult> {
  console.log('Asking AI to select a template');

  const templateList = templates
    .map((t, i) => `Template #${i + 1}: ${t.id}\nDescription: ${t.description}`)
    .join('\n\n');

  const systemPrompt = `You are a template selection expert. Analyze the user's request and select the most appropriate template.

Available templates:
${templateList}

Select the template that best matches the user's needs. Consider:
- The type of application they want to build
- Required features and functionality
- Technical complexity
- Infrastructure needs

Respond with JSON:
{
  "templateId": "selected-template-id",
  "reasoning": "Brief explanation of why this template is the best fit"
}`;

  const broadcastCost = async (type: string, data: any) => {
    if (type === 'money_flow_event') {
      await queueCostEvent(data, agentId, env);
    }
  };

  const result = await executeInference({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    agent: {
      actionKey: 'templateSelection',
      env,
      broadcast: broadcastCost,
    },
    parseJson: true,
  });

  console.log('Successfully completed templateSelection operation');

  return result as TemplateSelectionResult;
}
