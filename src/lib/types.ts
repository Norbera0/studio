export interface Patient {
  id: number;
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  medicalHistory: string;
  dentalHistory: string;
  avatarUrl: string;
}

export interface Treatment {
  id: number;
  patientId: number;
  date: string;
  treatment: string;
  notes: string;
}

export interface DentalChartMarking {
  [toothId: number]: {
    condition: string;
    color: string;
  };
}

export interface DigitalFile {
  name: string;
  url: string; // data URI or a future GDrive URL
  type: 'image' | 'doc' | 'other';
  hint?: string;
  provider: 'gdrive' | 'local';
}
