'use client';

import { useState, useRef, useEffect } from 'react';
import type { Patient, Treatment, DigitalFile } from '@/lib/types';
import { getAiDiagnosis, getPatientFiles, addPatientFile, shareFileAction } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Bot, BrainCircuit, Camera, FileText, Loader2, Sparkles, Stethoscope, Upload, User, ClipboardPlus, Share2, Copy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import type { AIDiagnosisAssistantOutput } from '@/ai/flows/ai-diagnosis-assistant';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const DENTAL_CONDITIONS = {
  healthy: { label: 'Healthy', color: 'bg-green-200 hover:bg-green-300 border-green-400' },
  caries: { label: 'Caries', color: 'bg-red-300 hover:bg-red-400 border-red-500' },
  filling: { label: 'Filling', color: 'bg-blue-300 hover:bg-blue-400 border-blue-500' },
  crown: { label: 'Crown', color: 'bg-yellow-300 hover:bg-yellow-400 border-yellow-500' },
  missing: { label: 'Missing', color: 'bg-gray-300 hover:bg-gray-400 border-gray-500 opacity-50' },
  extraction: { label: 'Extraction Needed', color: 'bg-purple-300 hover:bg-purple-400 border-purple-500' },
};

type ConditionKey = keyof typeof DENTAL_CONDITIONS;

const teethLayout = {
  upperRight: [1, 2, 3, 4, 5, 6, 7, 8],
  upperLeft: [9, 10, 11, 12, 13, 14, 15, 16],
  lowerLeft: [17, 18, 19, 20, 21, 22, 23, 24],
  lowerRight: [25, 26, 27, 28, 29, 30, 31, 32],
};

export function PatientProfileClientPage({ patient }: { patient: Patient }) {
  const [chartMarkings, setChartMarkings] = useState<{ [key: number]: ConditionKey }>({});

  const handleMarkingChange = (toothId: number, condition: ConditionKey) => {
    setChartMarkings(prev => ({ ...prev, [toothId]: condition }));
  };

  const chartMarkingsString = Object.entries(chartMarkings)
    .map(([tooth, condition]) => `Tooth ${tooth}: ${DENTAL_CONDITIONS[condition as ConditionKey].label}`)
    .join(', ');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <Avatar className="h-20 w-20 border">
            <AvatarImage src={patient.avatarUrl} data-ai-hint="person face" />
            <AvatarFallback className="text-3xl">{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-3xl font-bold font-headline">{patient.name}</h1>
            <p className="text-muted-foreground">{patient.email} &bull; {patient.phone}</p>
            <p className="text-sm text-muted-foreground">DOB: {patient.dateOfBirth}</p>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="chart"><Stethoscope className="w-4 h-4 mr-2" />Dental Chart</TabsTrigger>
          <TabsTrigger value="ai-assistant"><Sparkles className="w-4 h-4 mr-2" />AI Assistant</TabsTrigger>
          <TabsTrigger value="timeline"><ClipboardPlus className="w-4 h-4 mr-2" />Timeline</TabsTrigger>
          <TabsTrigger value="files"><FileText className="w-4 h-4 mr-2" />Files</TabsTrigger>
          <TabsTrigger value="profile"><User className="w-4 h-4 mr-2" />Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="mt-4">
          <DentalChart markings={chartMarkings} onMarkingChange={handleMarkingChange} />
        </TabsContent>
        <TabsContent value="ai-assistant" className="mt-4">
          <AiAssistant patient={patient} chartMarkings={chartMarkingsString} />
        </TabsContent>
        <TabsContent value="timeline" className="mt-4">
          <TreatmentTimeline patientId={patient.id} />
        </TabsContent>
        <TabsContent value="files" className="mt-4">
          <DigitalFiles patientId={patient.id} />
        </TabsContent>
        <TabsContent value="profile" className="mt-4">
          <PatientInfo patient={patient} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DentalChart({ markings, onMarkingChange }: { markings: { [key: number]: ConditionKey }, onMarkingChange: (toothId: number, condition: ConditionKey) => void }) {
  const Tooth = ({ id }: { id: number }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-10 h-12 flex-shrink-0 transition-all duration-300 border-2 ${markings[id] ? DENTAL_CONDITIONS[markings[id]].color : 'bg-card hover:bg-accent'}`}
        >
          {id}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-4">
          <h4 className="font-medium leading-none font-headline">Tooth #{id}</h4>
          <RadioGroup defaultValue={markings[id] || 'healthy'} onValueChange={(value) => onMarkingChange(id, value as ConditionKey)}>
            {Object.entries(DENTAL_CONDITIONS).map(([key, { label }]) => (
              <div key={key} className="flex items-center space-x-2">
                <RadioGroupItem value={key} id={`tooth-${id}-${key}`} />
                <Label htmlFor={`tooth-${id}-${key}`}>{label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Interactive Dental Chart</CardTitle>
        <CardDescription>Click on a tooth to mark conditions.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 p-4 rounded-lg bg-secondary/50">
          <div className="flex justify-center gap-1 w-full">
            {teethLayout.upperRight.map(id => <Tooth key={id} id={id} />)}
            <div className="w-4" />
            {teethLayout.upperLeft.map(id => <Tooth key={id} id={id} />)}
          </div>
          <div className="flex justify-center gap-1 w-full">
            {teethLayout.lowerRight.map(id => <Tooth key={id} id={id} />)}
             <div className="w-4" />
            {teethLayout.lowerLeft.map(id => <Tooth key={id} id={id} />)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AiAssistant({ patient, chartMarkings }: { patient: Patient, chartMarkings: string }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIDiagnosisAssistantOutput | null>(null);
  const [history, setHistory] = useState(patient.dentalHistory);

  const handleSubmit = async () => {
    setIsLoading(true);
    setResult(null);
    const response = await getAiDiagnosis({
      patientHistory: history,
      chartMarkings: chartMarkings || 'No markings on chart.',
    });
    setIsLoading(false);
    if ('error' in response) {
      toast({
        variant: 'destructive',
        title: 'AI Assistant Error',
        description: response.error,
      });
    } else {
      setResult(response);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <BrainCircuit /> AI Diagnosis Assistant
        </CardTitle>
        <CardDescription>
          Suggests potential diagnoses and treatments based on patient data and chart markings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="patient-history">Patient Dental History</Label>
          <Textarea id="patient-history" value={history} onChange={e => setHistory(e.target.value)} rows={4} />
        </div>
        <div>
          <Label htmlFor="chart-markings">Current Chart Markings</Label>
          <Textarea id="chart-markings" value={chartMarkings} readOnly rows={3} className="bg-muted" />
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Get AI Suggestions
        </Button>
        {result && (
          <Card className="w-full bg-secondary/50">
            <CardHeader>
              <CardTitle className="font-headline text-lg flex items-center gap-2"><Bot /> AI-Generated Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Potential Diagnoses</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.potentialDiagnoses}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Suggested Treatments</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.suggestedTreatments}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Confidence Level</h4>
                <p className="text-sm font-medium text-primary">{result.confidenceLevel}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </CardFooter>
    </Card>
  );
}

function PatientInfo({ patient }: { patient: Patient }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Patient Information</CardTitle>
                <CardDescription>Detailed medical and dental history.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold">Medical History</h4>
                    <p className="text-muted-foreground text-sm whitespace-pre-wrap">{patient.medicalHistory}</p>
                </div>
                 <div>
                    <h4 className="font-semibold">Dental History</h4>
                    <p className="text-muted-foreground text-sm whitespace-pre-wrap">{patient.dentalHistory}</p>
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline">Edit Profile</Button>
            </CardFooter>
        </Card>
    );
}

function TreatmentTimeline({ patientId }: { patientId: number }) {
  const [treatments, setTreatments] = useState<Omit<Treatment, 'id' | 'patientId'>[]>([]);
  const [newTreatment, setNewTreatment] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const handleAddTreatment = () => {
    if (!newTreatment) return;
    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      treatment: newTreatment,
      notes: newNotes,
    };
    setTreatments(prev => [newEntry, ...prev]);
    setNewTreatment('');
    setNewNotes('');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Treatment Timeline</CardTitle>
        <CardDescription>A chronological log of all treatments and notes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg space-y-3 bg-secondary/30">
            <h4 className="font-semibold">Add New Entry</h4>
            <Input 
              placeholder="Treatment description (e.g., 'Composite filling on #14')" 
              value={newTreatment}
              onChange={(e) => setNewTreatment(e.target.value)}
            />
            <Textarea 
              placeholder="Additional notes (optional)" 
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              rows={3}
            />
            <Button onClick={handleAddTreatment}>Add to Timeline</Button>
          </div>
          <ScrollArea className="h-[300px] w-full pr-4">
            <div className="space-y-4">
              {treatments.length === 0 && <p className="text-muted-foreground text-center py-8">No treatments recorded yet.</p>}
              {treatments.map((treatment, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    <div className="flex-1 w-px bg-border" />
                  </div>
                  <div className="pb-6 w-full">
                    <p className="font-semibold">{treatment.treatment}</p>
                    <p className="text-sm text-muted-foreground">{treatment.date}</p>
                    {treatment.notes && <p className="text-sm mt-1 bg-muted p-2 rounded-md">{treatment.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}

function DigitalFiles({ patientId }: { patientId: number }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const [files, setFiles] = useState<DigitalFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    getPatientFiles(patientId).then(data => {
      setFiles(data);
      setIsLoading(false);
    });
  }, [patientId]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const processAndUploadFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const dataUrl = reader.result as string;
      const fileType = file.type.startsWith('image/') ? 'image' : (file.type === 'application/pdf' ? 'doc' : 'other');
      
      setIsUploading(true);
      try {
        const newFile = await addPatientFile(patientId, { name: file.name, url: dataUrl, type: fileType, hint: 'uploaded file' });
        setFiles(prev => [...prev, newFile]);
         toast({ title: "File Uploaded", description: `Successfully uploaded ${file.name}.` });
      } catch (e) {
        toast({ variant: 'destructive', title: "Upload Failed", description: "Could not upload the file." });
      } finally {
        setIsUploading(false);
      }
    };
     reader.onerror = () => {
      toast({ variant: 'destructive', title: "Read Failed", description: "Could not read the file." });
    };
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processAndUploadFile(file);
    }
  };

  const openCamera = async () => {
    setHasCameraPermission(null);
    setIsCameraOpen(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings.',
        });
      }
    } else {
      setHasCameraPermission(false);
       toast({
          variant: 'destructive',
          title: 'Camera Not Supported',
          description: 'Your browser does not support camera access.',
        });
    }
  };
  
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
    setHasCameraPermission(null);
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      canvas.toBlob(async (blob) => {
        if(blob){
          const capturedFile = new File([blob], `Capture - ${new Date().toISOString()}.png`, { type: 'image/png' });
          processAndUploadFile(capturedFile);
        }
      }, 'image/png');
      
      closeCamera();
    }
  };

  const handleShare = async (file: DigitalFile) => {
    const { success, url, error } = await shareFileAction(file);
    if(success && url) {
        navigator.clipboard.writeText(url);
        toast({ title: "Link Copied!", description: "Shareable link copied to clipboard." });
    } else {
        toast({ variant: 'destructive', title: "Sharing Failed", description: error || "This file cannot be shared." });
    }
  }


  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Digital Files</CardTitle>
          <CardDescription>Upload and manage patient photos, X-rays, and documents.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 border-2 border-dashed rounded-lg text-center bg-secondary/30">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*,application/pdf,.doc,.docx"
                disabled={isUploading}
              />
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <Button onClick={handleUploadClick} disabled={isUploading}>
                    {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Upload className="w-4 h-4 mr-2" />}
                    {isUploading ? 'Uploading...' : 'Upload File'}
                  </Button>
                  <Button onClick={openCamera} variant="outline" disabled={isUploading}>
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Supports images and documents.</p>
          </div>
          <div className="mt-6">
            {isLoading ? (
                <div className="text-center p-8 text-muted-foreground flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading files...
                </div>
            ) : files.length === 0 ? (
                <p className="text-muted-foreground text-center py-8 col-span-full">No files uploaded yet.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {files.map((file, index) => (
                  <div key={index} className="relative group aspect-square">
                    {file.type === 'image' ? (
                      <Image src={file.url} alt={file.name} layout="fill" className="rounded-lg object-cover" data-ai-hint={file.hint} />
                    ) : (
                      <div className="w-full h-full bg-muted rounded-lg flex flex-col items-center justify-center p-2">
                        <FileText className="w-12 h-12 text-muted-foreground"/>
                        <span className="text-xs text-center mt-2 text-muted-foreground break-words">{file.name}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <p className="text-white text-center text-xs font-semibold">{file.name}</p>
                       <Button variant="secondary" size="sm" className="mt-2" onClick={() => handleShare(file)}>
                          {file.provider === 'gdrive' ? <Share2 className="mr-2" /> : <Copy className="mr-2" />}
                          {file.provider === 'gdrive' ? 'Share' : 'Copy Data'}
                        </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCameraOpen} onOpenChange={(open) => !open && closeCamera()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-headline">Capture Photo</DialogTitle>
          </DialogHeader>
            <div className="min-h-[400px] flex items-center justify-center bg-secondary rounded-md">
            {hasCameraPermission === null && (
                <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="mt-2 text-muted-foreground">Requesting camera access...</p>
                </div>
            )}
            {hasCameraPermission === false && (
                <Alert variant="destructive" className="w-auto">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Camera Access Denied</AlertTitle>
                <AlertDescription>
                    Please allow camera access in your browser settings.
                </AlertDescription>
                </Alert>
            )}
            <div className={hasCameraPermission ? 'block w-full' : 'hidden'}>
                <video ref={videoRef} className="w-full aspect-video rounded-md bg-black" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="hidden" />
            </div>
            </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={closeCamera}>Cancel</Button>
            <Button onClick={handleCapture} disabled={!hasCameraPermission}>
                <Camera className="w-4 h-4 mr-2" />
                Capture
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
