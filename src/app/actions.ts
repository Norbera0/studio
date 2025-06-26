'use server';

import {
  aiDiagnosisAssistant,
  type AIDiagnosisAssistantInput,
  type AIDiagnosisAssistantOutput,
} from '@/ai/flows/ai-diagnosis-assistant';
import { addPatient as addPatientData } from '@/lib/data';
import { addPatientFile as addPatientFileData, getPatientFiles as getPatientFilesData, shareFileWithSpecialist as shareFile } from '@/lib/file-storage';
import type { Patient, DigitalFile } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { config } from '@/lib/config';

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

export async function getPatientFiles(patientId: number): Promise<DigitalFile[]> {
    return getPatientFilesData(patientId);
}

export async function addPatientFile(patientId: number, file: Omit<DigitalFile, 'provider'>): Promise<DigitalFile> {
    const newFile = await addPatientFileData(patientId, file);
    revalidatePath(`/patients/${patientId}`);
    return newFile;
}

export async function shareFileAction(file: DigitalFile): Promise<{success: boolean, url?: string, error?: string}> {
    try {
        return await shareFile(file);
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Failed to share file.' };
    }
}


export async function getAuthConfig() {
  return config.auth;
}
