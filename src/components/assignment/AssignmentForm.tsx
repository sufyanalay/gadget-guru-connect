
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, FileText, File, Upload } from 'lucide-react';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
];

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  description: z.string().min(20, { message: 'Please provide a detailed description (min 20 characters)' }),
  subjectArea: z.string().min(1, { message: 'Please select a subject area' }),
  academicLevel: z.string().min(1, { message: 'Please select an academic level' }),
  deadline: z.string().min(1, { message: 'Please select a deadline' }),
  preferredExpertRole: z.string().optional(),
  additionalRequirements: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AssignmentForm: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [uploaded, setUploaded] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      subjectArea: '',
      academicLevel: '',
      deadline: '',
      preferredExpertRole: '',
      additionalRequirements: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const newFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(fileList).forEach(file => {
      // Check file type
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        invalidFiles.push(`${file.name} (invalid file type)`);
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} (exceeds 10MB)`);
        return;
      }

      newFiles.push(file);
    });

    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid files",
        description: `These files couldn't be added: ${invalidFiles.join(', ')}`,
        variant: "destructive",
      });
    }

    setFiles([...files, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
    if (files.length === 0) {
      toast({
        title: "No files uploaded",
        description: "Please upload at least one file for your assignment",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate sending data to backend API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Assignment data:', { ...data, files });
      
      toast({
        title: "Assignment submitted successfully",
        description: "Our experts will review your request shortly.",
        variant: "default",
      });
      
      setUploaded(true);
      
      // Reset form
      form.reset();
      setFiles([]);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your assignment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (['doc', 'docx'].includes(extension || '')) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    } else if (['ppt', 'pptx'].includes(extension || '')) {
      return <FileText className="h-5 w-5 text-orange-500" />;
    } else if (['pdf'].includes(extension || '')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  if (uploaded) {
    return (
      <Card className="w-full text-center p-8">
        <CardContent className="pt-10 flex flex-col items-center">
          <div className="mb-5 p-4 bg-green-100 rounded-full inline-block">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Assignment Submitted Successfully!</h3>
          <p className="text-muted-foreground mb-6">
            Our experts will review your assignment and provide a response shortly.
            You can track the status of your assignment in your dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => setUploaded(false)}>Submit Another Assignment</Button>
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Submit Assignment</CardTitle>
        <CardDescription>
          Upload your assignment and provide details for our experts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Marketing Analysis Paper, Physics Problem Set" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="subjectArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Area</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="computerScience">Computer Science</SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="literature">Literature</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="economics">Economics</SelectItem>
                        <SelectItem value="law">Law</SelectItem>
                        <SelectItem value="psychology">Psychology</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="academicLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="highSchool">High School</SelectItem>
                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="masters">Master's</SelectItem>
                        <SelectItem value="doctorate">Doctorate</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select deadline" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="6hours">6 Hours</SelectItem>
                        <SelectItem value="12hours">12 Hours</SelectItem>
                        <SelectItem value="24hours">24 Hours</SelectItem>
                        <SelectItem value="2days">2 Days</SelectItem>
                        <SelectItem value="3days">3 Days</SelectItem>
                        <SelectItem value="5days">5 Days</SelectItem>
                        <SelectItem value="7days">1 Week</SelectItem>
                        <SelectItem value="14days">2 Weeks</SelectItem>
                        <SelectItem value="30days">1 Month</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your assignment requirements in detail. Include any specific instructions, grading criteria, or references that need to be used."
                      rows={5}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredExpertRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Expert Type (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Any expert type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="teacher">Teacher/Professor</SelectItem>
                      <SelectItem value="researcher">Researcher</SelectItem>
                      <SelectItem value="professional">Industry Professional</SelectItem>
                      <SelectItem value="any">No Preference</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Requirements (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional requirements or notes for the expert"
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Upload Assignment Files</FormLabel>
              <div className="border-2 border-dashed border-input rounded-md p-6 flex flex-col items-center justify-center">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="mb-2 text-sm font-medium">Drag and drop files or click to upload</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Accepted file types: PDF, DOC, DOCX, PPT, PPTX, TXT (Max 10MB per file)
                </p>
                <Input 
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  onChange={handleFileChange}
                  className="max-w-sm"
                />
              </div>
            </div>
            
            {files.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploaded Files</p>
                <div className="border rounded-md divide-y">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.name)}
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || files.length === 0}
              size="lg"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AssignmentForm;
