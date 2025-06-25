// src/ai/flows/ai-diagnosis-assistant.ts
'use server';

/**
 * @fileOverview AI-powered tool to suggest potential diagnoses or treatment options based on recorded patient history and marked conditions in the dental chart.
 *
 * - aiDiagnosisAssistant - A function that handles the AI diagnosis process.
 * - AIDiagnosisAssistantInput - The input type for the aiDiagnosisAssistant function.
 * - AIDiagnosisAssistantOutput - The return type for the aiDiagnosisAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIDiagnosisAssistantInputSchema = z.object({
  patientHistory: z
    .string()
    .describe('The complete medical and dental history of the patient.'),
  chartMarkings: z
    .string()
    .describe(
      'Description of the current conditions or treatments marked on the dental chart.'
    ),
});
export type AIDiagnosisAssistantInput = z.infer<typeof AIDiagnosisAssistantInputSchema>;

const AIDiagnosisAssistantOutputSchema = z.object({
  potentialDiagnoses: z
    .string()
    .describe('A list of potential diagnoses based on the provided information.'),
  suggestedTreatments: z
    .string()
    .describe('A list of suggested treatment options for the potential diagnoses.'),
  confidenceLevel: z
    .string()
    .describe(
      'A level of confidence in the AI diagnosis, such as high, medium, or low.'
    ),
});
export type AIDiagnosisAssistantOutput = z.infer<typeof AIDiagnosisAssistantOutputSchema>;

export async function aiDiagnosisAssistant(
  input: AIDiagnosisAssistantInput
): Promise<AIDiagnosisAssistantOutput> {
  return aiDiagnosisAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiDiagnosisAssistantPrompt',
  input: {schema: AIDiagnosisAssistantInputSchema},
  output: {schema: AIDiagnosisAssistantOutputSchema},
  prompt: `You are an AI-powered dental diagnosis assistant. Analyze the patient\'s dental history and current chart markings to suggest potential diagnoses and treatment options.

Patient History: {{{patientHistory}}}
Chart Markings: {{{chartMarkings}}}

Based on the provided information, please provide potential diagnoses, suggested treatments, and a confidence level for your suggestions.

Format your response as follows:
Potential Diagnoses: [list of potential diagnoses]
Suggested Treatments: [list of suggested treatment options]
Confidence Level: [high, medium, or low]`,
});

const aiDiagnosisAssistantFlow = ai.defineFlow(
  {
    name: 'aiDiagnosisAssistantFlow',
    inputSchema: AIDiagnosisAssistantInputSchema,
    outputSchema: AIDiagnosisAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
