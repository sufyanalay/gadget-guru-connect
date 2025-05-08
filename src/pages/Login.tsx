
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-center text-muted-foreground mb-8">Login to access your Gadget Guru Connect account</p>
        <LoginForm />
      </div>
    </MainLayout>
  );
};

export default Login;
