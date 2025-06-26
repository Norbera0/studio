// src/lib/file-storage.ts
'use server';

/**
 * @fileOverview This module handles file storage operations.
 * It provides an abstraction layer that can switch between a local JSON-based
 * storage system and a future Google Drive integration.
 */

import fs from 'fs/promises';
import path from 'path';
import type { DigitalFile } from './types';
import { config } from './config';

const filesJsonPath = path.join(process.cwd(), 'src', 'lib', 'files.json');

type FilesDb = {
  [patientId: number]: DigitalFile[];
};

async function readFilesDb(): Promise<FilesDb> {
  try {
    const data = await fs.readFile(filesJsonPath, 'utf-8');
    return JSON.parse(data) as FilesDb;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return {}; // File doesn't exist, return empty DB
    }
    throw error;
  }
}

async function writeFilesDb(db: FilesDb): Promise<void> {
  await fs.writeFile(filesJsonPath, JSON.stringify(db, null, 2), 'utf-8');
}

// --- Local File Storage Implementation ---

async function getLocalPatientFiles(patientId: number): Promise<DigitalFile[]> {
  const db = await readFilesDb();
  return db[patientId] || [];
}

async function addLocalPatientFile(patientId: number, file: DigitalFile): Promise<DigitalFile> {
  const db = await readFilesDb();
  if (!db[patientId]) {
    db[patientId] = [];
  }
  db[patientId].push(file);
  await writeFilesDb(db);
  return file;
}


// --- Google Drive Placeholder Implementation ---

async function getGDrivePatientFiles(patientId: number): Promise<DigitalFile[]> {
  console.log(`[GDrive TODO] Fetching files for patient ${patientId} from Google Drive.`);
  // In a real implementation, you would use the Google Drive API here.
  // Returning mock data for demonstration.
  return [
    { name: 'panoramic_xray_gdrive.jpg', url: 'https://placehold.co/400x400.png', type: 'image', hint: 'dental x-ray', provider: 'gdrive' },
    { name: 'referral_letter_gdrive.pdf', url: '', type: 'doc', provider: 'gdrive' },
  ];
}

async function addGDrivePatientFile(patientId: number, file: DigitalFile): Promise<DigitalFile> {
  console.log(`[GDrive TODO] Uploading file "${file.name}" for patient ${patientId} to Google Drive.`);
  // This would involve:
  // 1. Finding or creating a folder for the patient.
  // 2. Uploading the file data to that folder.
  // 3. Getting a shareable URL.
  // 4. Storing metadata in a database.
  return { ...file, url: 'https://placehold.co/400x400.png', provider: 'gdrive' };
}


// --- Public Service Interface ---

export async function getPatientFiles(patientId: number): Promise<DigitalFile[]> {
  if (config.gdrive.enabled) {
    return getGDrivePatientFiles(patientId);
  }
  return getLocalPatientFiles(patientId);
}

export async function addPatientFile(patientId: number, file: Omit<DigitalFile, 'provider'>): Promise<DigitalFile> {
   if (config.gdrive.enabled) {
    return addGDrivePatientFile(patientId, file as DigitalFile);
  }
  const newFile: DigitalFile = { ...file, provider: 'local' };
  return addLocalPatientFile(patientId, newFile);
}

export async function shareFileWithSpecialist(file: DigitalFile): Promise<{success: boolean, url?: string}> {
    if (file.provider === 'gdrive') {
        console.log(`[GDrive TODO] Sharing file "${file.name}" via Google Workspace.`);
        // Here you would use the Google Drive API to change file permissions
        // and generate a shareable link.
        return { success: true, url: 'https://docs.google.com/a/example.com/file/d/mock_id/view?usp=sharing_eip_se_im' };
    }
    console.log(`[Local] Sharing is not available for local files.`);
    return { success: false };
}
