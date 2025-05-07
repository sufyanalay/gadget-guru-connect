
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageCircle, Star, Clock, MapPin, Globe, GraduationCap, Check, Languages, Calendar } from 'lucide-react';
import { Expert } from '@/types/expert';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface ExpertCardProps {
  expert: Expert;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleStartChat = () => {
    if (isAuthenticated) {
      // In a real implementation, this would create a chat session and navigate to it
      navigate(`/chat?expertId=${expert.id}`);
    } else {
      toast({
        title: "Authentication Required",
        description: "Please login to start a chat with this expert",
      });
      navigate('/login');
    }
  };
  
  const handleViewProfile = () => {
    // In a real implementation, this would navigate to the expert's profile
    navigate(`/experts/${expert.id}`);
  };
  
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'bg-blue-100 text-blue-800';
      case 'technician':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'Teacher';
      case 'technician':
        return 'Technician';
      default:
        return 'Expert';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20">
      <CardContent className="p-0">
        <div className={`${expert.role === 'teacher' ? 'bg-blue-50/50' : 'bg-green-50/50'} p-4 relative`}>
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className={`${getRoleColor(expert.role)}`}>
              {getRoleLabel(expert.role)}
            </Badge>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                <AvatarImage src={expert.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=random`} />
                <AvatarFallback className="text-lg bg-primary/10">{expert.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {expert.isOnline && (
                <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-background animate-pulse"></span>
              )}
            </div>
            <h3 className="text-lg font-semibold">{expert.name}</h3>
            <div className="flex items-center gap-1 text-amber-500 mt-1">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-medium">{expert.rating.averageRating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">
                ({expert.rating.totalReviews} reviews)
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-3">{expert.bio}</p>
          
          <div className="flex flex-wrap gap-1 mb-4">
            {expert.specializations.slice(0, 3).map((spec) => (
              <Badge key={spec.id} variant="outline" className="bg-accent/10 hover:bg-accent/20">
                {spec.name}
              </Badge>
            ))}
            {expert.specializations.length > 3 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="bg-accent/10 hover:bg-accent/20">
                      +{expert.specializations.length - 3} more
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      {expert.specializations.slice(3).map((spec) => (
                        <div key={spec.id}>{spec.name}</div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{expert.experience} years exp.</span>
            </div>
            <div className="flex items-center gap-1 text-foreground">
              <span className="font-semibold">${expert.hourlyRate}/hr</span>
            </div>
            {expert.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{expert.location}</span>
              </div>
            )}
            {expert.education && (
              <div className="flex items-center gap-1">
                <GraduationCap className="h-3 w-3" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="truncate cursor-help">{expert.education}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{expert.education}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
            {expert.languages && expert.languages.length > 0 && (
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span>{expert.languages.join(', ')}</span>
              </div>
            )}
            {expert.availability && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="truncate cursor-help">{expert.availability}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{expert.availability}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={handleStartChat}
              className="flex items-center gap-2"
              variant="default"
            >
              <MessageCircle className="h-4 w-4" />
              Chat Now
            </Button>
            <Button
              onClick={handleViewProfile}
              className="flex items-center gap-2"
              variant="outline"
            >
              View Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertCard;
