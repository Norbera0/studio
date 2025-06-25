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
