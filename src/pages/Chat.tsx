
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import ChatContactsList, { Contact } from '@/components/chat/ChatContactsList';
import ChatInterface from '@/components/chat/ChatInterface';

// Mock data with Muslim Pakistani names
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

const Chat = () => {
  const { isAuthenticated } = useAuth();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Chat</h1>
        <p className="text-muted-foreground mb-8">
          Communicate directly with experts and other users.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ChatContactsList 
              contacts={mockContacts}
              onSelectContact={setSelectedContact}
              selectedContactId={selectedContact?.id}
            />
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
              <div className="flex items-center justify-center h-[70vh] bg-card rounded-md border">
                <div className="text-center p-8">
                  <h3 className="text-xl font-medium mb-2">Select a Contact</h3>
                  <p className="text-muted-foreground">
                    Choose a contact from the list to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Chat;
