
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Create Your Account</h1>
        <RegisterForm />
      </div>
    </MainLayout>
  );
};

export default Register;
