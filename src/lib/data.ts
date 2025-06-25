import type { Patient } from './types';

const patients: Patient[] = [
  {
    id: 1,
    name: 'Jane Doe',
    phone: '555-0101',
    email: 'jane.doe@example.com',
    dateOfBirth: '1985-05-23',
    medicalHistory: 'No known allergies. Non-smoker.',
    dentalHistory: 'Regular check-ups. Previous filling on tooth 14.',
    avatarUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: 2,
    name: 'John Smith',
    phone: '555-0102',
    email: 'john.smith@example.com',
    dateOfBirth: '1978-11-12',
    medicalHistory: 'Allergic to penicillin.',
    dentalHistory: 'Wisdom teeth removed in 2005. Grinds teeth at night.',
    avatarUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: 3,
    name: 'Emily Johnson',
    phone: '555-0103',
    email: 'emily.j@example.com',
    dateOfBirth: '1992-02-29',
    medicalHistory: 'Asthma, uses an inhaler as needed.',
    dentalHistory: 'Orthodontic treatment (braces) from 2008-2010.',
    avatarUrl: 'https://placehold.co/100x100.png',
  },
  {
    id: 4,
    name: 'Michael Brown',
    phone: '555-0104',
    email: 'michael.b@example.com',
    dateOfBirth: '1965-09-15',
    medicalHistory: 'High blood pressure, managed with medication.',
    dentalHistory: 'Crown on tooth 3, bridge from 4-6.',
    avatarUrl: 'https://placehold.co/100x100.png',
  },
    {
    id: 5,
    name: 'Sarah Wilson',
    phone: '555-0105',
    email: 'sarah.w@example.com',
    dateOfBirth: '2001-07-21',
    medicalHistory: 'None.',
    dentalHistory: 'Sealants on molars.',
    avatarUrl: 'https://placehold.co/100x100.png',
  },
];

export function getPatients() {
  return patients;
}

export function getPatientById(id: number) {
  return patients.find(p => p.id === id);
}
