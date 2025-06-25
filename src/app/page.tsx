import { PatientDashboard } from '@/components/patient-dashboard';
import { getPatients } from '@/lib/data';

export default function Home() {
  const patients = getPatients();
  
  return (
      <PatientDashboard initialPatients={patients} />
  );
}
