import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import ExpertsList from '@/components/experts/ExpertsList';
import { Expert } from '@/types/expert';
import { expertService } from '@/services/expertService';
import { toast } from '@/components/ui/use-toast';

// Mock experts data with Muslim Pakistani names
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

const Experts = () => {
  const { isAuthenticated } = useAuth();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // In a real implementation, this would fetch experts from the API
  useEffect(() => {
    const fetchExperts = async () => {
      // This would be an API call in a real implementation
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, we would fetch experts from the API:
        // const data = await expertService.getAllExperts();
        // setExperts(data);
        
        // For now, we'll just use the mock data
        setExperts(mockExperts);
      } catch (error) {
        console.error('Error fetching experts:', error);
        toast({
          title: 'Error',
          description: 'Could not load experts. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperts();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Experts</h1>
        <p className="text-muted-foreground mb-8">
          Connect with our qualified teachers and technicians to get the help you need.
        </p>
        
        <ExpertsList experts={experts} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
};

export default Experts;
