import { PatientDashboard } from '@/components/patient-dashboard';
import { getPatients } from '@/lib/data';

export default async function Home() {
  const patients = await getPatients();
  
  return (
      <PatientDashboard initialPatients={patients} />
  );
}
