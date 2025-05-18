
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Laptop, BookOpen, MessageCircle, Clock, CheckCircle, AlertCircle, UserSearch, FileText } from 'lucide-react';

// Mock data for demonstration
const pendingRequests = [
  { id: '1', type: 'repair', title: 'iPhone screen cracked', status: 'pending', date: '2025-05-05' },
  { id: '2', type: 'academic', title: 'Physics homework help', status: 'pending', date: '2025-05-04' },
  { id: '3', type: 'assignment', title: 'Marketing Analysis Essay', status: 'pending', date: '2025-05-06' },
];

const completedRequests = [
  { id: '4', type: 'repair', title: 'Laptop won\'t boot', status: 'completed', date: '2025-05-01' },
  { id: '5', type: 'academic', title: 'Math exam prep', status: 'completed', date: '2025-04-28' },
  { id: '6', type: 'assignment', title: 'Research Paper on Climate Change', status: 'completed', date: '2025-04-30' },
];

// For teachers/technicians
const earningsData = [
  { id: '1', type: 'repair', title: 'Fixed MacBook battery issue', amount: 45, date: '2025-05-03' },
  { id: '2', type: 'academic', title: 'Calculus tutoring session', amount: 35, date: '2025-05-02' },
  { id: '3', type: 'assignment', title: 'Wrote research paper on renewable energy', amount: 75, date: '2025-05-04' },
];

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const isExpert = user?.role === 'teacher' || user?.role === 'technician';

  const renderStatusIcon = (status: string) => {
    if (status === 'pending') {
      return <Clock className="h-5 w-5 text-amber-500" />;
    } else if (status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const renderTypeIcon = (type: string) => {
    if (type === 'repair') {
      return <Laptop className="h-5 w-5 text-primary" />;
    } else if (type === 'academic') {
      return <BookOpen className="h-5 w-5 text-accent" />;
    } else if (type === 'assignment') {
      return <FileText className="h-5 w-5 text-indigo-500" />;
    } else {
      return <MessageCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.full_name}!</h1>
        <p className="text-muted-foreground mb-8">
          {isExpert 
            ? 'Here\'s an overview of your requests and earnings.' 
            : 'Here\'s an overview of your support requests.'}
        </p>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Button 
            onClick={() => navigate('/gadget-repair')}
            className="flex items-center gap-2 h-auto py-6"
          >
            <Laptop className="h-5 w-5" />
            <span>{isExpert ? 'View Repair Requests' : 'Request Gadget Repair'}</span>
          </Button>
          <Button 
            onClick={() => navigate('/academic-help')}
            className="flex items-center gap-2 h-auto py-6"
            variant="secondary"
          >
            <BookOpen className="h-5 w-5" />
            <span>{isExpert ? 'View Academic Questions' : 'Ask Academic Question'}</span>
          </Button>
          <Button 
            onClick={() => navigate('/assignment-writing')}
            className="flex items-center gap-2 h-auto py-6"
            variant="default"
          >
            <FileText className="h-5 w-5" />
            <span>{isExpert ? 'View Assignment Requests' : 'Assignment Writing'}</span>
          </Button>
          <Button 
            onClick={() => navigate('/chat')}
            className="flex items-center gap-2 h-auto py-6"
            variant="outline"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Open Chat</span>
          </Button>
          <Button 
            onClick={() => navigate('/experts')}
            className="flex items-center gap-2 h-auto py-6"
            variant="default"
          >
            <UserSearch className="h-5 w-5" />
            <span>Find Experts</span>
          </Button>
        </div>

        {/* Pending Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Pending Requests
              </CardTitle>
              <CardDescription>
                Your active requests waiting for assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <p className="text-muted-foreground text-center py-6">
                  No pending requests
                </p>
              ) : (
                <ul className="space-y-3">
                  {pendingRequests.map(request => (
                    <li key={request.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-3">
                        {renderTypeIcon(request.type)}
                        <div>
                          <p className="font-medium">{request.title}</p>
                          <p className="text-xs text-muted-foreground">Submitted on {request.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStatusIcon(request.status)}
                        <span className="text-sm capitalize">{request.status}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Completed Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Completed Requests
              </CardTitle>
              <CardDescription>
                Your requests that have been resolved
              </CardDescription>
            </CardHeader>
            <CardContent>
              {completedRequests.length === 0 ? (
                <p className="text-muted-foreground text-center py-6">
                  No completed requests
                </p>
              ) : (
                <ul className="space-y-3">
                  {completedRequests.map(request => (
                    <li key={request.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-3">
                        {renderTypeIcon(request.type)}
                        <div>
                          <p className="font-medium">{request.title}</p>
                          <p className="text-xs text-muted-foreground">Completed on {request.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStatusIcon(request.status)}
                        <span className="text-sm capitalize">{request.status}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Earnings Section (for teachers/technicians only) */}
        {isExpert && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Recent Earnings
              </CardTitle>
              <CardDescription>
                Your recent earnings from completed services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {earningsData.map(earning => (
                  <li key={earning.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-3">
                      {renderTypeIcon(earning.type)}
                      <div>
                        <p className="font-medium">{earning.title}</p>
                        <p className="text-xs text-muted-foreground">Completed on {earning.date}</p>
                      </div>
                    </div>
                    <div className="font-semibold text-lg">
                      ${earning.amount}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="font-medium">Total Earnings:</span>
                <span className="font-bold text-xl">${earningsData.reduce((sum, item) => sum + item.amount, 0)}</span>
              </div>
              <div className="mt-4">
                <Button
                  onClick={() => navigate('/earnings')}
                  variant="outline"
                  className="w-full"
                >
                  View All Earnings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
