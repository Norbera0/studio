import type { Patient } from './types';
import fs from 'fs/promises';
import path from 'path';

const jsonFilePath = path.join(process.cwd(), 'src', 'lib', 'patients.json');

async function readPatients(): Promise<Patient[]> {
  try {
    const fileContent = await fs.readFile(jsonFilePath, 'utf-8');
    return JSON.parse(fileContent) as Patient[];
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      // If file doesn't exist, create it with an empty array.
      await writePatients([]);
      return [];
    }
    console.error('Error reading patients file:', error);
    throw error;
  }
}

async function writePatients(patients: Patient[]): Promise<void> {
  try {
    await fs.writeFile(jsonFilePath, JSON.stringify(patients, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing patients file:', error);
    throw error;
  }
}

export async function getPatients(): Promise<Patient[]> {
  return await readPatients();
}

export async function getPatientById(id: number): Promise<Patient | undefined> {
  const patients = await readPatients();
  return patients.find(p => p.id === id);
}

export async function addPatient(patientData: Omit<Patient, 'id' | 'avatarUrl'>): Promise<Patient> {
    const patients = await readPatients();
    const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
    
    const newPatient: Patient = {
        ...patientData,
        id: newId,
        avatarUrl: 'https://placehold.co/100x100.png',
    };

    const updatedPatients = [...patients, newPatient];
    await writePatients(updatedPatients);
    return newPatient;
}
