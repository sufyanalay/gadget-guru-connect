
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import AssignmentForm from '@/components/assignment/AssignmentForm';

const AssignmentWriting = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Assignment Writing</h1>
        <p className="text-muted-foreground mb-8">
          Upload your assignments, presentations, or projects and get help from our qualified experts.
        </p>
        
        <AssignmentForm />
      </div>
    </MainLayout>
  );
};

export default AssignmentWriting;
