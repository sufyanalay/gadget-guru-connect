
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import AcademicHelpForm from '@/components/academic/AcademicHelpForm';

const AcademicHelp = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Academic Help</h1>
        <p className="text-muted-foreground mb-8">
          Ask your academic questions and get assistance from qualified teachers and tutors.
        </p>
        
        <AcademicHelpForm />
      </div>
    </MainLayout>
  );
};

export default AcademicHelp;
