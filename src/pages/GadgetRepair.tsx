
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import RepairRequestForm from '@/components/gadget-repair/RepairRequestForm';
import { Laptop, Wrench, Tablet } from 'lucide-react';

const GadgetRepair = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="mb-10">
          <div className="flex items-center justify-center mb-6">
            <div className="tech-icon-bg p-4 rounded-full">
              <Wrench size={36} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Gadget Repair</h1>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto">
            Submit your device repair request and get expert help from our certified technicians to fix your technology issues.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-card p-6 rounded-xl border border-indigo-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Laptop className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-center">Any Device</h3>
            <p className="text-muted-foreground text-center">
              Get help with smartphones, laptops, tablets, and other electronic devices from expert technicians.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-indigo-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Wrench className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-center">Expert Solutions</h3>
            <p className="text-muted-foreground text-center">
              Our certified technicians will provide step-by-step guidance to fix your device issues.
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-xl border border-indigo-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Tablet className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-center">Quick Diagnosis</h3>
            <p className="text-muted-foreground text-center">
              Upload photos of your device issue and get fast, accurate diagnosis and repair instructions.
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl shadow-md">
          <RepairRequestForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default GadgetRepair;
