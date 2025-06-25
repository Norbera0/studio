'use server';

import {
  aiDiagnosisAssistant,
  type AIDiagnosisAssistantInput,
  type AIDiagnosisAssistantOutput,
} from '@/ai/flows/ai-diagnosis-assistant';

export async function getAiDiagnosis(
  input: AIDiagnosisAssistantInput
): Promise<AIDiagnosisAssistantOutput | { error: string }> {
  try {
    const result = await aiDiagnosisAssistant(input);
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'An error occurred while getting AI diagnosis.' };
  }
}
