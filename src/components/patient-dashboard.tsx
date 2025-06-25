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
import { PlusCircle, Search } from 'lucide-react';
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
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className='font-headline'>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter the patient's details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" placeholder="Jane Doe" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">Phone</Label>
            <Input id="phone" placeholder="555-0101" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" placeholder="jane.d@example.com" className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dob" className="text-right">Date of Birth</Label>
            <Input id="dob" type="date" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="medical-history" className="text-right pt-2">Medical History</Label>
            <Textarea id="medical-history" placeholder="Any known allergies, conditions..." className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="dental-history" className="text-right pt-2">Dental History</Label>
            <Textarea id="dental-history" placeholder="Previous treatments, concerns..." className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit">Save Patient</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
