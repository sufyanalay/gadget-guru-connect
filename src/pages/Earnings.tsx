
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Laptop, BookOpen } from 'lucide-react';

// Mock data for demonstration
const earningsData = [
  { id: '1', type: 'repair', title: 'Fixed MacBook battery issue', amount: 45, date: '2025-05-03' },
  { id: '2', type: 'academic', title: 'Calculus tutoring session', amount: 35, date: '2025-05-02' },
  { id: '3', type: 'repair', title: 'iPhone screen replacement guidance', amount: 40, date: '2025-04-28' },
  { id: '4', type: 'academic', title: 'Chemistry exam preparation', amount: 50, date: '2025-04-26' },
  { id: '5', type: 'repair', title: 'Laptop troubleshooting', amount: 30, date: '2025-04-25' },
  { id: '6', type: 'academic', title: 'Literature essay review', amount: 25, date: '2025-04-20' },
];

const Earnings = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Only teachers and technicians can access this page
  if (user?.role !== 'teacher' && user?.role !== 'technician') {
    return <Navigate to="/dashboard" />;
  }

  const repairEarnings = earningsData.filter(item => item.type === 'repair');
  const academicEarnings = earningsData.filter(item => item.type === 'academic');

  const getTotalEarnings = (items: typeof earningsData) => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">My Earnings</h1>
        <p className="text-muted-foreground mb-8">
          Track your earnings from completed services
        </p>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">${getTotalEarnings(earningsData)}</p>
              <p className="text-sm text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Laptop className="h-5 w-5" />
                Repair Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">${getTotalEarnings(repairEarnings)}</p>
              <p className="text-sm text-muted-foreground">From {repairEarnings.length} services</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Academic Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">${getTotalEarnings(academicEarnings)}</p>
              <p className="text-sm text-muted-foreground">From {academicEarnings.length} services</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Detailed Earnings */}
        <Card>
          <CardHeader>
            <CardTitle>Earnings History</CardTitle>
            <CardDescription>
              Detailed breakdown of your earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="all" className="flex-1">All Services</TabsTrigger>
                <TabsTrigger value="repair" className="flex-1">Repair Services</TabsTrigger>
                <TabsTrigger value="academic" className="flex-1">Academic Services</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <EarningsTable earnings={earningsData} />
              </TabsContent>
              
              <TabsContent value="repair">
                <EarningsTable earnings={repairEarnings} />
              </TabsContent>
              
              <TabsContent value="academic">
                <EarningsTable earnings={academicEarnings} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

// Earnings Table Component
interface EarningsTableProps {
  earnings: Array<{
    id: string;
    type: string;
    title: string;
    amount: number;
    date: string;
  }>;
}

const EarningsTable: React.FC<EarningsTableProps> = ({ earnings }) => {
  if (earnings.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No earnings to display
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-3 px-4 text-left font-medium">Service</th>
            <th className="py-3 px-4 text-left font-medium">Type</th>
            <th className="py-3 px-4 text-left font-medium">Date</th>
            <th className="py-3 px-4 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {earnings.map((earning) => (
            <tr key={earning.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-4">{earning.title}</td>
              <td className="py-3 px-4 capitalize">
                <div className="flex items-center gap-2">
                  {earning.type === 'repair' ? (
                    <Laptop className="h-4 w-4 text-primary" />
                  ) : (
                    <BookOpen className="h-4 w-4 text-accent" />
                  )}
                  {earning.type}
                </div>
              </td>
              <td className="py-3 px-4">{earning.date}</td>
              <td className="py-3 px-4 text-right font-medium">${earning.amount}</td>
            </tr>
          ))}
          <tr className="bg-muted/20">
            <td colSpan={3} className="py-3 px-4 text-right font-bold">Total</td>
            <td className="py-3 px-4 text-right font-bold">
              ${earnings.reduce((sum, item) => sum + item.amount, 0)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Earnings;
