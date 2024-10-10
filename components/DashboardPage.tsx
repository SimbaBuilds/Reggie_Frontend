"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, Mail, FileSpreadsheet, Info, Plus, FileText } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@clerk/nextjs";
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  // If the user is not authenticated, redirect to the login page
  if (isLoaded && !userId) {
    redirect('/login');
  }

  const [studentCsv, setStudentCsv] = useState<File | null>(null);
  const [staffCsv, setStaffCsv] = useState<File | null>(null);
  const [templateContent, setTemplateContent] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templates, setTemplates] = useState<Array<{ content: string; description: string }>>([]);
  const [fileTaggingOption, setFileTaggingOption] = useState('');
  const [coverPageOrder, setCoverPageOrder] = useState('');
  const [firstPageDescription, setFirstPageDescription] = useState('');
  const [rosterUpdateOption, setRosterUpdateOption] = useState('');
  const [newPersonType, setNewPersonType] = useState('');
  const [newPersonFirstName, setNewPersonFirstName] = useState('');
  const [newPersonLastName, setNewPersonLastName] = useState('');
  const [newPersonDOB, setNewPersonDOB] = useState('');
  const [transcriptPdf, setTranscriptPdf] = useState<File | null>(null);

  // Add these new state variables
  const [status, setStatus] = useState({
    rostersUploaded: false,
    recordsDigitized: false,
    recordsOrganized: false,
    transcriptsUploaded: false,
    emailLabelsCreated: false,
    emailTemplateCreated: false
  });

  const handleStudentCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setStudentCsv(e.target.files[0]);
    }
  };

  const handleStaffCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setStaffCsv(e.target.files[0]);
    }
  };

  const handleAddTemplate = () => {
    setTemplates([...templates, { content: templateContent, description: templateDescription }]);
    setTemplateContent('');
    setTemplateDescription('');
  };

  const handleTranscriptPdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setTranscriptPdf(e.target.files[0]);
    }
  };

  const totalStudents = 5678;
  const totalStaff = 38; // Example value, adjust as needed

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <Tabs defaultValue="digitize" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="digitize">Digitize Records</TabsTrigger>
          <TabsTrigger value="update">Update Roster</TabsTrigger>
          <TabsTrigger value="templates">Set Email Templates</TabsTrigger>
          <TabsTrigger value="transcripts">Upload Transcripts</TabsTrigger>
        </TabsList>
        <TabsContent value="digitize">
          <Card>
            <CardHeader>
              <CardTitle>Digitize and Organize School Records</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="studentCsv">Upload Student List CSV</Label>
                <Input id="studentCsv" type="file" accept=".csv" onChange={handleStudentCsvUpload} className="border border-input bg-background hover:bg-accent hover:text-accent-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium cursor-pointer" />
                
              </div>
              <div>
                <Label htmlFor="staffCsv">Upload Staff List CSV (Optional)</Label>
                <Input id="staffCsv" type="file" accept=".csv" onChange={handleStaffCsvUpload} className="border border-input bg-background hover:bg-accent hover:text-accent-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium cursor-pointer" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Choose a File Tagging Option:</h3>
                <RadioGroup onValueChange={setFileTaggingOption} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="coverPages" id="option1" />
                    <Label htmlFor="option1">Use downloadable cover pages (recommended)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="consistent" id="option2" />
                    <Label htmlFor="option2">Use consistent first page</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>If you can scan in your records such that the first page clearly displays the person's first name, last name, and date of birth, this is an option</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </RadioGroup>
              </div>
              {fileTaggingOption === 'coverPages' && (
                <div>
                  <Label htmlFor="coverPageOrder">Select cover page order:</Label>
                  <Select onValueChange={setCoverPageOrder}>
                    <SelectTrigger id="coverPageOrder">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="azAsc">A-Z</SelectItem>
                      <SelectItem value="azDesc">Z-A</SelectItem>
                      <SelectItem value="gradeAzAsc">By grade A-Z</SelectItem>
                      <SelectItem value="gradeAzDesc">By grade Z-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {fileTaggingOption === 'consistent' && (
                <div>
                  <Label htmlFor="firstPageDescription">Describe where to find first name, last name, and date of birth on the first page:</Label>
                  <Textarea 
                    id="firstPageDescription" 
                    placeholder="Enter description (max 100 characters)"
                    value={firstPageDescription}
                    onChange={(e) => setFirstPageDescription(e.target.value.slice(0, 100))}
                    maxLength={100}
                  />
                </div>
              )}
              <Button>Start Digitization Process</Button>
              
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  My records are already digitized, but I want Reggie's help to organize them in Google Drive so I can use this service.
                </p>
                <Button variant="outline">
                  Organize Records
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="update">
          <Card>
            <CardHeader>
              <CardTitle>Update Person Roster</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Update the person roster via email to Reggie including person first name, last name, and date of birth or use the form below.</p>
              <RadioGroup onValueChange={setRosterUpdateOption} className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="studentCsv" id="studentCsv" />
                  <Label htmlFor="studentCsv">Upload a new student roster CSV</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="staffCsv" id="staffCsv" />
                  <Label htmlFor="staffCsv">Upload a new staff roster CSV</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="addDelete" id="addDelete" />
                  <Label htmlFor="addDelete">Add or delete a person</Label>
                </div>
              </RadioGroup>
              {rosterUpdateOption === 'studentCsv' && (
                <div>
                  <Label htmlFor="newStudentRoster">Upload New Student Roster CSV</Label>
                  <Input id="newStudentRoster" type="file" accept=".csv" />
                </div>
              )}
              {rosterUpdateOption === 'staffCsv' && (
                <div>
                  <Label htmlFor="newStaffRoster">Upload New Staff Roster CSV</Label>
                  <Input id="newStaffRoster" type="file" accept=".csv" />
                </div>
              )}
              {rosterUpdateOption === 'addDelete' && (
                <div className="space-y-4">
                  <Select onValueChange={setNewPersonType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select person type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="First Name"
                    value={newPersonFirstName}
                    onChange={(e) => setNewPersonFirstName(e.target.value)}
                  />
                  <Input
                    placeholder="Last Name"
                    value={newPersonLastName}
                    onChange={(e) => setNewPersonLastName(e.target.value)}
                  />
                  <Input
                    type="date"
                    placeholder="Date of Birth"
                    value={newPersonDOB}
                    onChange={(e) => setNewPersonDOB(e.target.value)}
                  />
                </div>
              )}
              <Button className="mt-4">Update Roster</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Set Email Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="templateContent">Template Content</Label>
                  <Textarea
                    id="templateContent"
                    placeholder="Enter your email template content here..."
                    value={templateContent}
                    onChange={(e) => setTemplateContent(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="templateDescription">Template Description</Label>
                  <Input
                    id="templateDescription"
                    placeholder="Enter a brief description of the template"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddTemplate}>Add Template</Button>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Existing Templates</h3>
                {templates.map((template, index) => (
                  <div key={index} className="mb-4 p-4 border rounded">
                    <h4 className="font-semibold">{template.description}</h4>
                    <Button variant="ghost" size="sm" className="mt-2" onClick={() => {
                      // Logic to show template content
                    }}>
                      <Plus className="mr-2 h-4 w-4" /> View Content
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transcripts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2" />
                Upload Transcripts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
              Upload a batch report of your current students' transcripts below. <br />
                This will allow Reggie to add your students' transcripts to their respective records folder and fetch the transcript to draft records request fulfillments. <br />
                Students' first name, last name, and date of birth must be present on the first page of each transcript. <br />
                Your SIS should have a transcript batch report tool. <br />
                Upload as one large pdf with 1-2 students per page.
              </p>
              <div>
                <Label htmlFor="transcriptPdf">Upload Transcript PDF</Label>
                <Input 
                  id="transcriptPdf" 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleTranscriptPdfUpload}
                  className="border border-input bg-background hover:bg-accent hover:text-accent-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium cursor-pointer"
                />
              </div>
              <p className="text-sm text-muted-foreground italic">
                Note: This must be done once per semester.
              </p>
              <Button>Upload Transcripts</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Status section */}
      <div className="mt-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(status).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${value ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalStudents}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2" />
              Email Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{templates.length}</p>
          </CardContent>
        </Card>
        {totalStaff > 0 && (
          <Card>
            <CardHeader>              
              <CardTitle className="flex items-center">
                <Users className="mr-2" />
                Total Staff
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalStaff}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}