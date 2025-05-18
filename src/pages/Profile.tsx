
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState(user?.full_name || '');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState(user?.email || '');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleSaveProfile = () => {
    // Simulate profile update
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    }, 1000);
  };

  const roleLabel = () => {
    switch (user?.role) {
      case 'student':
        return 'Student';
      case 'teacher':
        return 'Teacher';
      case 'technician':
        return 'Technician';
      default:
        return 'User';
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground mb-8">
          Manage your profile information and settings
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-2xl">
                    {user?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{user?.full_name}</CardTitle>
              <CardDescription className="capitalize">{roleLabel()}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Member since May 2025
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-xs text-muted-foreground">Requests</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Activity
              </Button>
            </CardFooter>
          </Card>

          {/* Tabs Section */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="account">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
                <TabsTrigger value="preferences" className="flex-1">Preferences</TabsTrigger>
                <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
              </TabsList>

              {/* Account Tab */}
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>
                          Update your personal details
                        </CardDescription>
                      </div>
                      {!isEditing ? (
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                          Edit
                        </Button>
                      ) : (
                        <Button variant="ghost" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input 
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        readOnly={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Role</label>
                      <Input 
                        value={roleLabel()}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bio</label>
                      <Textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        readOnly={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                  {isEditing && (
                    <CardFooter>
                      <Button onClick={handleSaveProfile} className="w-full">
                        Save Changes
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Manage how you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      Notification preferences coming soon
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your password and account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      Security settings coming soon
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
