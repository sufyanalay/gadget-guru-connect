
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Login to Your Account</h1>
        <LoginForm />
      </div>
    </MainLayout>
  );
};

export default Login;
