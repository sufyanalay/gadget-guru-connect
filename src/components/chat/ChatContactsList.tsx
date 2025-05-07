
import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserRole } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

export interface Contact {
  id: string;
  name: string;
  role: UserRole;
  lastMessage?: string;
  avatar?: string;
  unread?: number;
  lastActive?: Date;
  isOnline?: boolean;
}

interface ChatContactsListProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  selectedContactId?: string;
  isLoading?: boolean;
}

const ChatContactsList: React.FC<ChatContactsListProps> = ({ 
  contacts,
  onSelectContact,
  selectedContactId,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  
  const filteredContacts = contacts.filter(contact => {
    // Apply search filter
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply role filter
    const matchesRole = filterRole === 'all' || contact.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const renderContactSkeletons = () => {
    return Array(5).fill(0).map((_, index) => (
      <div key={index} className="flex items-center gap-3 p-3 rounded-md">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col border rounded-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="font-medium mb-4">Conversations</h2>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <RadioGroup
          className="flex gap-4"
          defaultValue="all"
          onValueChange={(value) => setFilterRole(value as UserRole | 'all')}
          disabled={isLoading}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="cursor-pointer">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="teacher" id="teacher" />
            <Label htmlFor="teacher" className="cursor-pointer">Teachers</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="technician" id="technician" />
            <Label htmlFor="technician" className="cursor-pointer">Technicians</Label>
          </div>
        </RadioGroup>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            renderContactSkeletons()
          ) : filteredContacts.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No contacts found
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                  selectedContactId === contact.id
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted'
                }`}
                onClick={() => onSelectContact(contact)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-sm truncate">{contact.name}</h3>
                    {contact.unread && contact.unread > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs capitalize text-muted-foreground">{contact.role}</span>
                    {contact.lastMessage && (
                      <>
                        <span className="text-muted-foreground px-1">•</span>
                        <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatContactsList;
