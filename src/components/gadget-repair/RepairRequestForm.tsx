
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'];

const formSchema = z.object({
  deviceType: z.string().min(1, { message: 'Please select a device type' }),
  deviceModel: z.string().min(1, { message: 'Please enter your device model' }),
  issueTitle: z.string().min(3, { message: 'Please provide a brief title for the issue' }),
  issueDescription: z.string().min(20, { message: 'Please describe your issue in detail (min 20 characters)' }),
  urgency: z.enum(['low', 'medium', 'high']),
  // We'll handle file validation separately
});

type FormValues = z.infer<typeof formSchema>;

const RepairRequestForm: React.FC = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deviceType: '',
      deviceModel: '',
      issueTitle: '',
      issueDescription: '',
      urgency: 'medium',
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
      newPreviewUrls.push(URL.createObjectURL(file));
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
    URL.revokeObjectURL(previewUrls[index]);
    
    setFiles(files.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate sending data to backend API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Repair request data:', { ...data, files });
      
      toast({
        title: "Request submitted successfully",
        description: "A technician will review your request shortly.",
      });
      
      // Reset form
      form.reset();
      setFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error('Error submitting repair request:', error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Submit a Repair Request</CardTitle>
        <CardDescription>
          Provide details about your device and the issue you're experiencing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="deviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select device type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="smartphone">Smartphone</SelectItem>
                        <SelectItem value="laptop">Laptop</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="desktop">Desktop Computer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deviceModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. iPhone 13, Dell XPS 15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="issueTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Screen cracked, Battery draining quickly" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issueDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please describe your issue in detail. Include when it started, what you've tried so far, etc."
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
              name="urgency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Urgency Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low - Not urgent</SelectItem>
                      <SelectItem value="medium">Medium - Need it fixed soon</SelectItem>
                      <SelectItem value="high">High - Urgent issue</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Upload Images or Videos (Optional)</FormLabel>
              <div className="border border-input rounded-md p-4">
                <Input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                  onChange={handleFileChange}
                  className="mb-4"
                />
                <p className="text-xs text-muted-foreground mb-4">
                  Upload photos or videos of the issue to help us diagnose the problem. Max 5MB per file.
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
                          <video 
                            src={url}
                            className="h-24 w-full object-cover rounded-md"
                            controls
                          />
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
              {isSubmitting ? 'Submitting...' : 'Submit Repair Request'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RepairRequestForm;
