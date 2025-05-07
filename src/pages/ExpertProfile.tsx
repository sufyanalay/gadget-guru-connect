
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Star, 
  Clock, 
  Calendar,
  GraduationCap, 
  MapPin,
  Globe,
  Languages,
  Check,
  FileText,
  User,
  Clock3
} from 'lucide-react';
import { Expert } from '@/types/expert';
import { expertService } from '@/services/expertService';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

const ExpertProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    const fetchExpertDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // In a real app, this would fetch from API
        // const data = await expertService.getExpertById(id);
        // For demo purposes, fetch from the mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simulate API call with mock data
        const mockExpert = mockExperts.find(e => e.id === id);
        
        if (mockExpert) {
          setExpert(mockExpert);
        } else {
          toast({
            title: 'Expert not found',
            description: 'The expert you are looking for does not exist.',
            variant: 'destructive',
          });
          navigate('/experts');
        }
      } catch (error) {
        console.error('Error fetching expert details:', error);
        toast({
          title: 'Error',
          description: 'Could not load expert details. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExpertDetails();
  }, [id, navigate]);
  
  const handleStartChat = () => {
    if (!expert) return;
    
    if (isAuthenticated) {
      navigate(`/chat?expertId=${expert.id}`);
    } else {
      toast({
        title: 'Authentication Required',
        description: 'Please login to start a chat with this expert',
      });
      navigate('/login');
    }
  };
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'bg-blue-100 text-blue-800';
      case 'technician':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'Teacher';
      case 'technician':
        return 'Technician';
      default:
        return 'Expert';
    }
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl mx-auto py-8 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-32 w-32 rounded-full mb-4" />
                    <Skeleton className="h-7 w-48 mb-2" />
                    <Skeleton className="h-5 w-36 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-5 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full mb-4" />
                  <Skeleton className="h-8 w-36 mb-2" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!expert) {
    return (
      <MainLayout>
        <div className="container max-w-6xl mx-auto py-8 px-4">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Expert Not Found</h2>
              <p className="text-muted-foreground mb-6">We couldn't find the expert you're looking for.</p>
              <Button onClick={() => navigate('/experts')}>Back to Experts</Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }
  
  // Reviews Mock Data
  const reviews = [
    {
      id: '1',
      author: 'Sarah Ahmed',
      rating: 5,
      content: 'Dr. Fatima Khan was exceptionally helpful with my quantum physics assignment. Her explanations were clear and she made complex concepts easy to understand.',
      date: '2025-04-27',
    },
    {
      id: '2',
      author: 'Muhammad Ali',
      rating: 4,
      content: 'Great expertise in the subject matter. Was able to solve my problems quickly. Would definitely recommend!',
      date: '2025-04-15',
    },
    {
      id: '3',
      author: 'Zainab Hussain',
      rating: 5,
      content: 'Exactly what I needed for my university project. Very professional and knowledgeable.',
      date: '2025-03-30',
    },
  ];

  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Expert info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-md">
                      <AvatarImage src={expert.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=random&size=200`} />
                      <AvatarFallback className="text-3xl bg-primary/10">{expert.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {expert.isOnline && (
                      <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-green-500 border-2 border-background animate-pulse"></span>
                    )}
                    <Badge variant="secondary" className={`absolute -top-2 -right-2 ${getRoleColor(expert.role)}`}>
                      {getRoleLabel(expert.role)}
                    </Badge>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-1">{expert.name}</h2>
                  
                  <div className="flex items-center gap-1 text-amber-500 mb-4">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="font-medium text-lg">{expert.rating.averageRating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({expert.rating.totalReviews} reviews)
                    </span>
                  </div>
                  
                  <Button 
                    onClick={handleStartChat}
                    className="w-full flex items-center gap-2 mb-4"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Start Chat
                  </Button>
                  
                  <Separator className="my-4" />
                  
                  <div className="w-full space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock3 className="h-4 w-4" />
                        <span>Experience</span>
                      </div>
                      <span className="font-medium">{expert.experience} years</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>Hourly Rate</span>
                      </div>
                      <span className="font-medium text-green-600">${expert.hourlyRate}/hour</span>
                    </div>
                    
                    {expert.location && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>Location</span>
                        </div>
                        <span className="font-medium">{expert.location}</span>
                      </div>
                    )}
                    
                    {expert.availability && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Availability</span>
                        </div>
                        <span className="font-medium">{expert.availability}</span>
                      </div>
                    )}
                    
                    {expert.languages && expert.languages.length > 0 && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Globe className="h-4 w-4" />
                          <span>Languages</span>
                        </div>
                        <span className="font-medium">{expert.languages.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3 mb-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="expertise">Expertise</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>About {expert.name}</CardTitle>
                    <CardDescription>
                      Professional background and expertise
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Biography</h3>
                      <p className="text-muted-foreground">{expert.bio}</p>
                    </div>
                    
                    {expert.education && (
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <GraduationCap className="h-5 w-5" />
                          Education
                        </h3>
                        <p className="text-muted-foreground">{expert.education}</p>
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-2">Specializations</h3>
                      <div className="flex flex-wrap gap-2">
                        {expert.specializations.map(spec => (
                          <Badge key={spec.id} className="bg-accent/10">{spec.name}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-blue-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Check className="h-5 w-5 text-green-600" />
                            <h3 className="font-medium">Quick Response Time</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Typically responds within 30 minutes during availability hours.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-blue-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Check className="h-5 w-5 text-green-600" />
                            <h3 className="font-medium">Verified Expert</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Credentials and qualifications have been verified.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-blue-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <h3 className="font-medium">Assignment Assistance</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Can help with academic assignments and research papers.
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-blue-50/50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageCircle className="h-5 w-5 text-blue-600" />
                            <h3 className="font-medium">Live Tutoring</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Available for one-on-one tutoring sessions via chat.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Reviews</CardTitle>
                    <CardDescription>
                      What others are saying about {expert.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No reviews yet. Be the first to review this expert!</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {reviews.map(review => (
                          <div key={review.id} className="border-b border-border pb-4 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">{review.author}</h3>
                                <p className="text-sm text-muted-foreground">{review.date}</p>
                              </div>
                              <div className="flex text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : ''}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm">{review.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="expertise" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Areas of Expertise</CardTitle>
                    <CardDescription>
                      Detailed breakdown of {expert.name}'s professional skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {expert.specializations.map(spec => (
                        <div key={spec.id} className="border-b border-border pb-4 last:border-0">
                          <h3 className="font-medium text-lg mb-2">{spec.name}</h3>
                          <div className="w-full bg-accent/20 rounded-full h-2.5 mb-2">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${Math.round(85 + Math.random() * 15)}%` }}></div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {expert.role === 'teacher' 
                              ? `Experienced in teaching ${spec.name} to students at various levels.`
                              : `Specialized in solving problems related to ${spec.name}.`}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Mock experts data with Muslim Pakistani names (same as in Experts.tsx)
const mockExperts: Expert[] = [
  {
    id: '1',
    name: 'Dr. Fatima Khan',
    role: 'teacher',
    bio: 'Experienced physics professor with 15 years of teaching at university level. Specializes in quantum mechanics and theoretical physics.',
    specializations: [
      { id: 't1', name: 'Physics' },
      { id: 't2', name: 'Quantum Mechanics' },
      { id: 't3', name: 'Mathematics' },
    ],
    rating: { averageRating: 4.9, totalReviews: 124 },
    hourlyRate: 45,
    isOnline: true,
    experience: 15,
    location: 'Islamabad',
    languages: ['English', 'Urdu', 'Arabic'],
    education: 'PhD in Physics from Oxford University',
    availability: 'Weekdays 2-8 PM'
  },
  {
    id: '2',
    name: 'Prof. Ahmad Malik',
    role: 'teacher',
    bio: 'Mathematics professor specializing in calculus and algebra. Offers clear explanations for complex concepts with real-world examples.',
    specializations: [
      { id: 't4', name: 'Mathematics' },
      { id: 't5', name: 'Calculus' },
      { id: 't6', name: 'Algebra' },
      { id: 't7', name: 'Statistics' },
    ],
    rating: { averageRating: 4.7, totalReviews: 98 },
    hourlyRate: 40,
    isOnline: false,
    experience: 12,
    location: 'Lahore',
    languages: ['English', 'Urdu'],
    education: 'Masters in Mathematics from Punjab University',
    availability: 'Weekends and evenings'
  },
  {
    id: '3',
    name: 'Usman Ali',
    role: 'technician',
    bio: 'Expert in smartphone and laptop repairs with certification from Apple and Samsung. Can diagnose and fix most hardware and software issues remotely.',
    specializations: [
      { id: 'r1', name: 'Smartphone Repair' },
      { id: 'r2', name: 'Laptop Repair' },
      { id: 'r3', name: 'Apple Devices' },
    ],
    rating: { averageRating: 4.8, totalReviews: 156 },
    hourlyRate: 35,
    isOnline: true,
    experience: 8,
    location: 'Karachi',
    languages: ['English', 'Urdu', 'Punjabi'],
  },
  {
    id: '4',
    name: 'Zainab Hussain',
    role: 'technician',
    bio: 'Network specialist with expertise in home network setup, troubleshooting, and security. Provides clear instructions for non-technical users.',
    specializations: [
      { id: 'r4', name: 'Network Setup' },
      { id: 'r5', name: 'WiFi Issues' },
      { id: 'r6', name: 'Cybersecurity' },
    ],
    rating: { averageRating: 4.6, totalReviews: 87 },
    hourlyRate: 30,
    isOnline: true,
    experience: 6,
    location: 'Islamabad',
    languages: ['English', 'Urdu'],
  },
  {
    id: '5',
    name: 'Dr. Hassan Abbasi',
    role: 'teacher',
    bio: 'Chemistry professor with specialization in organic chemistry and biochemistry. Makes complex concepts easy to understand with visual aids.',
    specializations: [
      { id: 't8', name: 'Chemistry' },
      { id: 't9', name: 'Organic Chemistry' },
      { id: 't10', name: 'Biochemistry' },
    ],
    rating: { averageRating: 4.8, totalReviews: 112 },
    hourlyRate: 42,
    isOnline: false,
    experience: 14,
    location: 'Peshawar',
    languages: ['English', 'Urdu', 'Pashto'],
    education: 'PhD in Chemistry from University of Manchester',
  },
  {
    id: '6',
    name: 'Ayesha Tariq',
    role: 'teacher',
    bio: 'English language and literature specialist. Provides help with academic writing, essay structure, grammar, and literary analysis.',
    specializations: [
      { id: 't11', name: 'English Literature' },
      { id: 't12', name: 'Academic Writing' },
      { id: 't13', name: 'Grammar' },
    ],
    rating: { averageRating: 4.9, totalReviews: 134 },
    hourlyRate: 38,
    isOnline: true,
    experience: 10,
    location: 'Lahore',
    languages: ['English', 'Urdu', 'Persian'],
    education: 'Masters in English Literature from Cambridge University',
  },
  {
    id: '7',
    name: 'Bilal Mahmood',
    role: 'technician',
    bio: 'Computer hardware specialist with expertise in building custom systems, upgrades, and troubleshooting. Can advise on parts selection and compatibility.',
    specializations: [
      { id: 'r7', name: 'PC Building' },
      { id: 'r8', name: 'Hardware Upgrades' },
      { id: 'r9', name: 'Troubleshooting' },
    ],
    rating: { averageRating: 4.7, totalReviews: 92 },
    hourlyRate: 32,
    isOnline: false,
    experience: 7,
    location: 'Multan',
    languages: ['English', 'Urdu', 'Saraiki'],
  },
  {
    id: '8',
    name: 'Sadia Yousuf',
    role: 'technician',
    bio: 'Software troubleshooter specialized in Windows, macOS, and common applications. Helps with system optimization, malware removal, and data recovery.',
    specializations: [
      { id: 'r10', name: 'Software Issues' },
      { id: 'r11', name: 'Malware Removal' },
      { id: 'r12', name: 'Data Recovery' },
    ],
    rating: { averageRating: 4.5, totalReviews: 76 },
    hourlyRate: 28,
    isOnline: true,
    experience: 5,
    location: 'Faisalabad',
    languages: ['English', 'Urdu', 'Punjabi'],
  },
];

export default ExpertProfile;
