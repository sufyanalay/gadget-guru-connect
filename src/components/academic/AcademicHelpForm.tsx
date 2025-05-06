
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

const formSchema = z.object({
  subject: z.string().min(1, { message: 'Please select a subject' }),
  topic: z.string().min(3, { message: 'Please enter a specific topic' }),
  questionTitle: z.string().min(3, { message: 'Please provide a brief title for your question' }),
  questionDetails: z.string().min(20, { message: 'Please describe your question in detail (min 20 characters)' }),
  academicLevel: z.enum(['primary', 'secondary', 'high_school', 'undergraduate', 'graduate']),
  // We'll handle file validation separately
});

type FormValues = z.infer<typeof formSchema>;

const AcademicHelpForm: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      topic: '',
      questionTitle: '',
      questionDetails: '',
      academicLevel: 'undergraduate',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const newFiles: File[] = [];
    const newPreviewUrls: string[] = [];
    const invalidFiles: string[] = [];

    Array.from(fileList).forEach(file => {
      // Check file type
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        invalidFiles.push(`${file.name} (invalid file type)`);
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} (exceeds 5MB)`);
        return;
      }

      newFiles.push(file);
      
      // Create preview URLs for images only
      if (file.type.startsWith('image/')) {
        newPreviewUrls.push(URL.createObjectURL(file));
      } else {
        // For PDFs, just store the name
        newPreviewUrls.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid files",
        description: `These files couldn't be added: ${invalidFiles.join(', ')}`,
        variant: "destructive",
      });
    }

    setFiles([...files, ...newFiles]);
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const removeFile = (index: number) => {
    // Only revoke URL if it's an object URL (for images)
    if (files[index].type.startsWith('image/')) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    
    setFiles(files.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate sending data to backend API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Academic help request data:', { ...data, files });
      
      toast({
        title: "Question submitted successfully",
        description: "A teacher or tutor will respond to your question shortly.",
      });
      
      // Reset form
      form.reset();
      setFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error('Error submitting academic help request:', error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ask an Academic Question</CardTitle>
        <CardDescription>
          Get help from qualified teachers and tutors in any subject
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="math">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="computer_science">Computer Science</SelectItem>
                        <SelectItem value="literature">Literature</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="geography">Geography</SelectItem>
                        <SelectItem value="economics">Economics</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
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
                          <SelectValue placeholder="Select academic level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="primary">Primary School</SelectItem>
                        <SelectItem value="secondary">Secondary School</SelectItem>
                        <SelectItem value="high_school">High School</SelectItem>
                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="graduate">Graduate / Post-Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specific Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Calculus, Organic Chemistry, Shakespeare" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="questionTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. How to solve quadratic equations?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="questionDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Details</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your question in detail. Include what you've tried so far and where you're stuck."
                      rows={5}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Upload Files (Optional)</FormLabel>
              <div className="border border-input rounded-md p-4">
                <Input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="mb-4"
                />
                <p className="text-xs text-muted-foreground mb-4">
                  Upload images, screenshots, or PDF documents related to your question. Max 5MB per file.
                </p>
                
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        {files[index].type.startsWith('image/') ? (
                          <img 
                            src={url} 
                            alt={`Preview ${index}`}
                            className="h-24 w-full object-cover rounded-md" 
                          />
                        ) : (
                          <div className="h-24 w-full rounded-md bg-muted flex items-center justify-center p-2">
                            <span className="text-xs text-center truncate">
                              {files[index].name}
                            </span>
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFile(index)}
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Question'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AcademicHelpForm;
