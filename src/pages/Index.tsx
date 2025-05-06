
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { Laptop, BookOpen, MessageCircle, CheckCircle, Clock, ShieldCheck } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Gadget Guru Connect
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Your one-stop platform for device repair assistance and academic support, connecting you with experts who can help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button onClick={() => navigate('/register')} size="lg" className="text-lg px-8">
              Get Started
            </Button>
            <Button onClick={() => navigate('/login')} variant="outline" size="lg" className="text-lg px-8">
              Sign In
            </Button>
          </div>
          
          {/* Feature illustration */}
          <div className="relative mx-auto w-full max-w-4xl h-64 md:h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
                <div className="bg-background/90 backdrop-blur-sm p-4 rounded-lg shadow-lg animate-float">
                  <Laptop className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="text-center font-medium">Device Repair</p>
                </div>
                <div className="bg-background/90 backdrop-blur-sm p-4 rounded-lg shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                  <BookOpen className="h-10 w-10 text-accent mx-auto mb-2" />
                  <p className="text-center font-medium">Academic Help</p>
                </div>
                <div className="bg-background/90 backdrop-blur-sm p-4 rounded-lg shadow-lg animate-float" style={{ animationDelay: '2s' }}>
                  <MessageCircle className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="text-center font-medium">Expert Chat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How We Can Help You</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card p-6 rounded-lg shadow-sm border card-hover">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Laptop className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Gadget Repair</h3>
              <p className="text-muted-foreground mb-4">
                Get expert help with diagnosing and fixing issues with your electronic devices, from smartphones to laptops.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Submit repair requests with photos</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Get solutions from certified technicians</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Step-by-step repair guidance</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-card p-6 rounded-lg shadow-sm border card-hover">
              <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-medium mb-2">Academic Support</h3>
              <p className="text-muted-foreground mb-4">
                Connect with qualified teachers and tutors to get help with your academic questions and challenges.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Ask questions in any subject</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Get explanations from expert tutors</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Share study materials and get feedback</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-card p-6 rounded-lg shadow-sm border card-hover">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Real-time Chat</h3>
              <p className="text-muted-foreground mb-4">
                Communicate directly with experts through our real-time messaging system for immediate assistance.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Instant messaging with experts</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Share images and files in chat</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Get immediate answers to your questions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Create an Account</h3>
              <p className="text-muted-foreground">
                Sign up as a student, teacher, or technician to access the platform.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Submit Your Request</h3>
              <p className="text-muted-foreground">
                Describe your issue in detail and upload relevant images or files.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Get Expert Help</h3>
              <p className="text-muted-foreground">
                Connect with qualified experts who will help solve your problem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-muted/50">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Gadget Guru Connect</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Verified Experts</h3>
                <p className="text-muted-foreground">
                  All our teachers and technicians are thoroughly vetted for their qualifications and expertise.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Quick Response</h3>
                <p className="text-muted-foreground">
                  Get timely answers to your questions and solutions to your technical problems.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Quality Solutions</h3>
                <p className="text-muted-foreground">
                  Our experts provide thorough, reliable solutions tailored to your specific needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/90 to-accent/90 text-white">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join Gadget Guru Connect today and get the support you need for your devices and academic challenges.
          </p>
          <Button 
            onClick={() => navigate('/register')} 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 text-lg px-8"
          >
            Create Your Account
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
