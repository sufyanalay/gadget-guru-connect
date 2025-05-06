
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import RepairRequestForm from '@/components/gadget-repair/RepairRequestForm';

const GadgetRepair = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Gadget Repair</h1>
        <p className="text-muted-foreground mb-8">
          Submit your device repair request and get help from our certified technicians.
        </p>
        
        <RepairRequestForm />
      </div>
    </MainLayout>
  );
};

export default GadgetRepair;
