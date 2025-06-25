import { getPatientById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { PatientProfileClientPage } from './client-page';
import type { Metadata } from 'next';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const patient = getPatientById(Number(params.id));

  return {
    title: patient ? `${patient.name} | DentalFlow` : 'Patient Not Found',
  };
}

export default function PatientProfilePage({ params }: Props) {
  const patient = getPatientById(Number(params.id));

  if (!patient) {
    notFound();
  }

  return <PatientProfileClientPage patient={patient} />;
}
