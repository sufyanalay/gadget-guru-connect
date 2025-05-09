
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import AcademicHelpForm from '@/components/academic/AcademicHelpForm';
import { BookOpen, GraduationCap, School } from 'lucide-react';

const AcademicHelp = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-10">
          <div className="flex items-center justify-center mb-6">
            <div className="academic-icon-bg p-4 rounded-full">
              <GraduationCap size={36} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-red-500">Academic Help</h1>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
            Ask your academic questions and get assistance from qualified teachers and tutors who can help you excel in your studies.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-card p-6 rounded-xl border border-amber-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <BookOpen className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-center">Get Expert Guidance</h3>
            <p className="text-muted-foreground text-center">
              Connect with qualified teachers and tutors who specialize in various academic subjects.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-amber-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <School className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-center">Any Subject</h3>
            <p className="text-muted-foreground text-center">
              From mathematics to literature, get help with any academic subject at any level of education.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-amber-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <GraduationCap className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-center">Improve Your Grades</h3>
            <p className="text-muted-foreground text-center">
              Get the assistance you need to understand difficult concepts and excel in your academic journey.
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl shadow-md">
          <AcademicHelpForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default AcademicHelp;
