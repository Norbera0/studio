'use server';

import {
  aiDiagnosisAssistant,
  type AIDiagnosisAssistantInput,
  type AIDiagnosisAssistantOutput,
} from '@/ai/flows/ai-diagnosis-assistant';
import { addPatient as addPatientData } from '@/lib/data';
import type { Patient } from '@/lib/types';
import { revalidatePath } from 'next/cache';

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

export async function addPatient(
  patientData: Omit<Patient, 'id' | 'avatarUrl'>
): Promise<{ success: boolean; error?: string; patient?: Patient }> {
  try {
    const newPatient = await addPatientData(patientData);
    revalidatePath('/');
    return { success: true, patient: newPatient };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to add patient.' };
  }
}
