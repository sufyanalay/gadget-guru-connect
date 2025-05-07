
import React, { useState } from 'react';
import { Expert } from '@/types/expert';
import ExpertCard from './ExpertCard';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface ExpertsListProps {
  experts: Expert[];
  isLoading?: boolean;
}

const ExpertsList: React.FC<ExpertsListProps> = ({ experts, isLoading = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  
  const filteredExperts = experts
    .filter(expert => {
      // Apply search filter
      const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.specializations.some(spec => spec.name.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Apply role filter
      const matchesRole = roleFilter === 'all' || expert.role === roleFilter;
      
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case 'rating':
          return b.rating.averageRating - a.rating.averageRating;
        case 'experience':
          return b.experience - a.experience;
        case 'price-low':
          return a.hourlyRate - b.hourlyRate;
        case 'price-high':
          return b.hourlyRate - a.hourlyRate;
        default:
          return 0;
      }
    });
  
  const renderExpertSkeletons = () => {
    return Array(6).fill(0).map((_, index) => (
      <div key={index} className="h-[350px]">
        <div className="bg-accent/20 p-4 flex flex-col items-center">
          <Skeleton className="h-24 w-24 rounded-full mb-2" />
          <Skeleton className="h-5 w-40 mb-1" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="p-4">
          <Skeleton className="h-10 w-full mb-3" />
          <div className="flex gap-1 mb-3">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-9 w-full" />
        </div>
      </div>
    ));
  };

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search experts by name or specialization..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1">
            <div className="text-sm font-medium mb-2 flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filter by Role
            </div>
            <RadioGroup
              className="flex gap-4"
              defaultValue="all"
              value={roleFilter}
              onValueChange={setRoleFilter}
              disabled={isLoading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="cursor-pointer">All Experts</Label>
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
          
          <div>
            <div className="text-sm font-medium mb-2">Sort By</div>
            <Select
              value={sortBy}
              onValueChange={setSortBy}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          renderExpertSkeletons()
        ) : filteredExperts.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <h3 className="text-lg font-medium mb-2">No experts found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find experts
            </p>
          </div>
        ) : (
          filteredExperts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))
        )}
      </div>
    </div>
  );
};

export default ExpertsList;
