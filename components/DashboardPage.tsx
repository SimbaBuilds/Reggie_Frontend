"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUp, Users, FileSpreadsheet, Mail } from 'lucide-react';

export default function DashboardPage() {
  const [studentCsv, setStudentCsv] = useState<File | null>(null);
  const [staffCsv, setStaffCsv] = useState<File | null>(null);
  const [templateContent, setTemplateContent] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

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
    // TODO: Implement adding template logic
    console.log('Adding template:', { content: templateContent, description: templateDescription });
    // Reset form fields after submission
    setTemplateContent('');
    setTemplateDescription('');
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <Tabs defaultValue="digitize" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="digitize">Digitize Records</TabsTrigger>
          <TabsTrigger value="update">Update Roster</TabsTrigger>
          <TabsTrigger value="templates">Set Email Templates</TabsTrigger>
        </TabsList>
        <TabsContent value="digitize">
          <Card>
            <CardHeader>
              <CardTitle>Digitize School Records</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="studentCsv">Upload Student List CSV</Label>
                <Input id="studentCsv" type="file" accept=".csv" onChange={handleStudentCsvUpload} />
              </div>
              <div>
                <Label htmlFor="staffCsv">Upload Staff List CSV (Optional)</Label>
                <Input id="staffCsv" type="file" accept=".csv" onChange={handleStaffCsvUpload} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">File Tagging Options:</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="option1" name="fileTagging" value="consistent" />
                    <label htmlFor="option1">Use consistent first page</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="option2" name="fileTagging" value="coverPages" />
                    <label htmlFor="option2">Use downloadable cover pages</label>
                  </div>
                </div>
              </div>
              <Button>Start Digitization Process</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="update">
          <Card>
            <CardHeader>
              <CardTitle>Update Person Roster</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Update the person roster via email to Reggie or use the form below.</p>
              <Button>Send Email to Reggie</Button>
              <div className="mt-4">
                <Label htmlFor="rosterUpdate">Upload Updated Roster CSV</Label>
                <Input id="rosterUpdate" type="file" accept=".csv" />
              </div>
              <Button className="mt-2">Upload Roster</Button>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileUp className="mr-2" />
              Records Digitized
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,234</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">5,678</p>
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
            <p className="text-3xl font-bold">3</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}