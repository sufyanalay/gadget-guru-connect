import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import ChatContactsList, { Contact } from '@/components/chat/ChatContactsList';
import ChatInterface from '@/components/chat/ChatInterface';
import { chatService } from '@/services/chatService';
import { expertService } from '@/services/expertService';
import { Expert } from '@/types/expert';
import { toast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Check, Search, MessageSquare, Phone, User, Users } from 'lucide-react';
import { UserRole } from '@/contexts/AuthContext';

// Mock data with Muslim Pakistani names (keep existing data)
const mockContacts: Contact[] = [
  {
    id: 'teacher1',
    name: 'Dr. Fatima Khan',
    role: 'teacher',
    lastMessage: 'I can help with your physics question',
    unread: 2,
  },
  {
    id: 'teacher2',
    name: 'Prof. Ahmad Malik',
    role: 'teacher',
    lastMessage: 'Let me know if you need more examples',
  },
  {
    id: 'technician1',
    name: 'Usman Ali',
    role: 'technician',
    lastMessage: 'Have you tried resetting the device?',
    unread: 1,
  },
  {
    id: 'technician2',
    name: 'Zainab Hussain',
    role: 'technician',
    lastMessage: 'I think we can fix that remotely',
  },
  {
    id: 'student1',
    name: 'Imran Ahmed',
    role: 'student',
    lastMessage: 'Thanks for your help!',
  },
];

// Additional mock users for the new chat dialog (keep existing data)
const mockUsers = [
  {
    id: 'user1',
    name: 'Ayesha Malik',
    role: 'student' as UserRole,
    avatar: null,
  },
  {
    id: 'user2',
    name: 'Omar Farooq',
    role: 'teacher' as UserRole,
    avatar: null,
  },
  {
    id: 'user3',
    name: 'Sana Javed',
    role: 'student' as UserRole,
    avatar: null,
  },
  {
    id: 'user4',
    name: 'Tariq Jameel',
    role: 'technician' as UserRole,
    avatar: null,
  },
  {
    id: 'user5',
    name: 'Rabia Khan',
    role: 'teacher' as UserRole,
    avatar: null,
  },
];

// Mock experts data for the experts tab
const mockChatExperts: Expert[] = [
  {
    id: 'exp1',
    name: 'Dr. Fatima Khan',
    role: 'teacher',
    bio: 'Experienced physics professor with 15 years of teaching at university level.',
    specializations: [{ id: 'phys', name: 'Physics' }],
    rating: { averageRating: 4.9, totalReviews: 124 },
    hourlyRate: 45,
    isOnline: true,
    experience: 15,
    location: 'Islamabad',
    languages: ['English', 'Urdu'],
    avatar: null,
  },
  {
    id: 'exp2',
    name: 'Usman Ali',
    role: 'technician',
    bio: 'Expert in smartphone and laptop repairs with certification from Apple and Samsung.',
    specializations: [{ id: 'tech', name: 'Smartphone Repair' }],
    rating: { averageRating: 4.8, totalReviews: 156 },
    hourlyRate: 35,
    isOnline: true,
    experience: 8,
    location: 'Karachi',
    languages: ['English', 'Urdu'],
    avatar: null,
  },
  {
    id: 'exp3',
    name: 'Prof. Ahmad Malik',
    role: 'teacher',
    bio: 'Mathematics professor specializing in calculus and algebra.',
    specializations: [{ id: 'math', name: 'Mathematics' }],
    rating: { averageRating: 4.7, totalReviews: 98 },
    hourlyRate: 40,
    isOnline: false,
    experience: 12,
    location: 'Lahore',
    languages: ['English', 'Urdu'],
    avatar: null,
  },
  {
    id: 'exp4',
    name: 'Zainab Hussain',
    role: 'technician',
    bio: 'Network specialist with expertise in home network setup, troubleshooting, and security.',
    specializations: [{ id: 'net', name: 'Network Setup' }],
    rating: { averageRating: 4.6, totalReviews: 87 },
    hourlyRate: 30,
    isOnline: true,
    experience: 6,
    location: 'Islamabad',
    languages: ['English', 'Urdu'],
    avatar: null,
  },
];

const Chat = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [isLoading, setIsLoading] = useState(false);
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('users');
  
  // In a real implementation, this would fetch contacts from the API
  useEffect(() => {
    const fetchContacts = async () => {
      // This would be an API call in a real implementation
      // For now, we'll use the mock data but simulate an API call
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, we would fetch contacts from the API:
        // const data = await chatService.getUserChats();
        // const formattedContacts = data.map(chat => ({...}));
        // setContacts(formattedContacts);
        
        // For now, we'll just use the mock data
        setContacts(mockContacts);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        toast({
          title: 'Error',
          description: 'Could not load contacts. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchContacts();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleSelectContact = async (contact: Contact) => {
    setSelectedContact(contact);
    
    // Mark messages as read when selecting a contact
    // In a real implementation, this would call the API
    if (contact.unread && contact.unread > 0) {
      try {
        // Simulate API call
        // await chatService.markMessagesAsRead(contact.id, []);
        
        // Update UI to remove unread count
        setContacts(prevContacts => 
          prevContacts.map(c => 
            c.id === contact.id ? { ...c, unread: 0 } : c
          )
        );
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  };

  const handleStartNewChat = () => {
    setNewChatDialogOpen(true);
    setActiveTab('users');
    setSelectedUser(null);
    setSelectedExpert(null);
    setPhoneNumber('');
  };

  const handleCreateChat = async () => {
    if (activeTab === 'users' && !selectedUser) return;
    if (activeTab === 'experts' && !selectedExpert) return;
    if (activeTab === 'phone' && !phoneNumber) return;

    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let newContact: any;
      
      if (activeTab === 'users') {
        newContact = mockUsers.find(u => u.id === selectedUser);
      } else if (activeTab === 'experts') {
        const expert = mockChatExperts.find(e => e.id === selectedExpert);
        if (expert) {
          newContact = {
            id: expert.id,
            name: expert.name,
            role: expert.role,
            avatar: expert.avatar,
          };
        }
      } else if (activeTab === 'phone') {
        // Create a contact from a phone number
        newContact = {
          id: `phone-${Date.now()}`,
          name: phoneNumber,
          role: 'contact' as UserRole,
          avatar: null,
        };
      }
      
      if (newContact) {
        const contact: Contact = {
          id: newContact.id,
          name: newContact.name,
          role: newContact.role,
          lastMessage: '',
          avatar: newContact.avatar,
        };
        
        setContacts(prev => [contact, ...prev]);
        setSelectedContact(contact);
        
        toast({
          title: 'New chat created',
          description: `You can now chat with ${newContact.name}`,
        });
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast({
        title: 'Error',
        description: 'Could not create new chat. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setNewChatDialogOpen(false);
      setSelectedUser(null);
      setSelectedExpert(null);
      setPhoneNumber('');
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2 rounded-lg mr-3">
            <MessageSquare size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-0">Chat</h1>
            <p className="text-muted-foreground">
              Communicate directly with experts and other users
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-lg border shadow-sm">
            <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 rounded-t-lg">
              <h2 className="text-lg font-medium flex items-center gap-2">
                <Search size={18} className="text-emerald-600 dark:text-emerald-400" />
                Contacts
              </h2>
              <Button 
                onClick={handleStartNewChat} 
                size="sm" 
                className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1"
              >
                <UserPlus className="h-4 w-4" />
                New Chat
              </Button>
            </div>
            <div className="p-2">
              <ChatContactsList 
                contacts={contacts}
                onSelectContact={handleSelectContact}
                selectedContactId={selectedContact?.id}
                isLoading={isLoading}
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            {selectedContact ? (
              <ChatInterface 
                recipientId={selectedContact.id}
                recipientName={selectedContact.name}
                recipientRole={selectedContact.role}
                recipientAvatar={selectedContact.avatar}
              />
            ) : (
              <div className="flex items-center justify-center h-[70vh] bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 rounded-md border">
                <div className="text-center p-8 max-w-md">
                  <div className="mx-auto bg-emerald-100 dark:bg-emerald-900 h-20 w-20 rounded-full flex items-center justify-center mb-6">
                    <MessageSquare size={32} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-4">Select a Contact</h3>
                  <p className="text-muted-foreground mb-6">
                    Choose a contact from the list to start chatting or create a new conversation
                  </p>
                  <Button 
                    onClick={handleStartNewChat} 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Start New Chat
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Chat Dialog with Tabs */}
      <Dialog open={newChatDialogOpen} onOpenChange={setNewChatDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Start a New Chat</DialogTitle>
            <DialogDescription>
              Connect with people, experts, or add a phone number to start chatting
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger value="experts" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Experts</span>
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Phone</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Search for users..." />
                <CommandEmpty>No user found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-72">
                    {mockUsers.map((user) => (
                      <CommandItem
                        key={user.id}
                        value={user.name}
                        onSelect={() => setSelectedUser(user.id)}
                        aria-selected={selectedUser === user.id}
                        className={`flex items-center gap-2 p-3 ${selectedUser === user.id ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}
                      >
                        <div className={`flex items-center gap-3 flex-1 ${selectedUser === user.id ? 'font-medium' : ''}`}>
                          <Avatar className="h-10 w-10 border-2 border-emerald-200 dark:border-emerald-800">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-800 dark:to-teal-900 text-emerald-700 dark:text-emerald-300">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span>{user.name}</span>
                            <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                          </div>
                        </div>
                        {selectedUser === user.id && (
                          <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </Command>
            </TabsContent>
            
            <TabsContent value="experts">
              <Command className="rounded-lg border shadow-md">
                <CommandInput placeholder="Search for experts..." />
                <CommandEmpty>No expert found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-72">
                    {mockChatExperts.map((expert) => (
                      <CommandItem
                        key={expert.id}
                        value={expert.name}
                        onSelect={() => setSelectedExpert(expert.id)}
                        aria-selected={selectedExpert === expert.id}
                        className={`flex items-center gap-2 p-3 ${selectedExpert === expert.id ? 'bg-emerald-50 dark:bg-emerald-900/20' : ''}`}
                      >
                        <div className={`flex items-center gap-3 flex-1 ${selectedExpert === expert.id ? 'font-medium' : ''}`}>
                          <Avatar className="h-10 w-10 border-2 border-emerald-200 dark:border-emerald-800">
                            <AvatarImage src={expert.avatar || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-800 dark:to-teal-900 text-emerald-700 dark:text-emerald-300">
                              {expert.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span>{expert.name}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-muted-foreground capitalize">{expert.role}</span>
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1"></span>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-right flex flex-col items-end">
                          <div className="flex items-center">
                            <span className="text-amber-500 mr-1">★</span>
                            <span>{expert.rating.averageRating}</span>
                          </div>
                          <span className="text-muted-foreground">${expert.hourlyRate}/hr</span>
                        </div>
                        {selectedExpert === expert.id && (
                          <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </Command>
            </TabsContent>
            
            <TabsContent value="phone">
              <div className="space-y-4">
                <div>
                  <label htmlFor="phone-number" className="text-sm font-medium block mb-2">
                    Enter Phone Number
                  </label>
                  <Input
                    id="phone-number"
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter number with country code (e.g., +92 for Pakistan)
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-md p-3">
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    The recipient will receive an invitation to chat if they have a WhatsApp account with this number.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setNewChatDialogOpen(false);
                setSelectedUser(null);
                setSelectedExpert(null);
                setPhoneNumber('');
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateChat} 
              disabled={(activeTab === 'users' && !selectedUser) || 
                        (activeTab === 'experts' && !selectedExpert) || 
                        (activeTab === 'phone' && !phoneNumber) || 
                        isLoading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isLoading ? "Creating..." : "Start Chat"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Chat;
