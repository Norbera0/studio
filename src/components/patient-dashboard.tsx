'use client';

import { useState } from 'react';
import type { Patient } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, PlusCircle, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from './ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addPatient } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const addPatientSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  phone: z.string().min(1, { message: 'Phone number is required.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required.' }),
  medicalHistory: z.string().min(1, { message: 'Medical history is required. Enter "None" if not applicable.' }),
  dentalHistory: z.string().min(1, { message: 'Dental history is required. Enter "None" if not applicable.' }),
});

type AddPatientFormValues = z.infer<typeof addPatientSchema>;

export function PatientDashboard({ initialPatients }: { initialPatients: Patient[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  const filteredPatients = initialPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <CardTitle className="font-headline">All Patients</CardTitle>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setIsAddPatientOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id} className="cursor-pointer">
                <TableCell>
                  <Link href={`/patients/${patient.id}`} className="flex items-center gap-4 group">
                    <Avatar>
                      <AvatarImage src={patient.avatarUrl} data-ai-hint="person" />
                      <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium group-hover:text-primary transition-colors">{patient.name}</div>
                  </Link>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                   <Link href={`/patients/${patient.id}`} className="block w-full h-full">{patient.phone}</Link>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Link href={`/patients/${patient.id}`} className="block w-full h-full">{patient.email}</Link>
                </TableCell>
                 <TableCell>
                  <Link href={`/patients/${patient.id}`}>
                    <Button variant="outline" size="sm">View Profile</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         {filteredPatients.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No patients found.
          </div>
        )}
      </CardContent>
      <AddPatientDialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen} />
    </Card>
  );
}

function AddPatientDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<AddPatientFormValues>({
    resolver: zodResolver(addPatientSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      dateOfBirth: '',
      medicalHistory: '',
      dentalHistory: '',
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (isSubmitting) return;
    onOpenChange(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  const onSubmit = async (values: AddPatientFormValues) => {
    setIsSubmitting(true);
    const result = await addPatient(values);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Patient Added',
        description: `${result.patient?.name} has been successfully added.`,
      });
      handleOpenChange(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error Adding Patient',
        description: result.error || 'An unknown error occurred.',
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className='font-headline'>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter the patient's details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="555-0101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="jane.d@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="medicalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical History</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Any known allergies, conditions... (e.g., None)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dentalHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dental History</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Previous treatments, concerns... (e.g., None)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Patient
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
