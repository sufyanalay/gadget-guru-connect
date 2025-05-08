
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-16 px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md text-center mb-8">
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-center text-muted-foreground">
              Login to access your Gadget Guru Connect account and continue where you left off
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;
