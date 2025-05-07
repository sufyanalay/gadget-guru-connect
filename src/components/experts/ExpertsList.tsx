
import React, { useState } from 'react';
import { Expert } from '@/types/expert';
import ExpertCard from './ExpertCard';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Search, Filter, SlidersHorizontal, Check, Star } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ExpertsListProps {
  experts: Expert[];
  isLoading?: boolean;
}

const ExpertsList: React.FC<ExpertsListProps> = ({ experts, isLoading = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  
  // Get unique specializations from all experts
  const allSpecializations = experts
    .flatMap(expert => expert.specializations)
    .reduce((unique: { id: string, name: string }[], item) => {
      return unique.some(spec => spec.id === item.id) 
        ? unique 
        : [...unique, item];
    }, []);
  
  const handleSpecializationToggle = (specId: string) => {
    if (selectedSpecializations.includes(specId)) {
      setSelectedSpecializations(selectedSpecializations.filter(id => id !== specId));
    } else {
      setSelectedSpecializations([...selectedSpecializations, specId]);
    }
  };
  
  const filteredExperts = experts
    .filter(expert => {
      // Apply search filter
      const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.specializations.some(spec => spec.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (expert.bio && expert.bio.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Apply role filter
      const matchesRole = roleFilter === 'all' || expert.role === roleFilter;
      
      // Apply specialization filter
      const matchesSpecialization = selectedSpecializations.length === 0 || 
        expert.specializations.some(spec => selectedSpecializations.includes(spec.id));
      
      return matchesSearch && matchesRole && matchesSpecialization;
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
      <Card key={index} className="overflow-hidden">
        <CardContent className="p-0">
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
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    ));
  };

  const applyingFilters = roleFilter !== 'all' || selectedSpecializations.length > 0;
  const foundExpertsText = filteredExperts.length === 1 
    ? '1 expert found' 
    : `${filteredExperts.length} experts found`;

  return (
    <div>
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
            Search and Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search experts by name, specialization, or description..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <Accordion type="single" collapsible defaultValue="filters">
              <AccordionItem value="filters">
                <AccordionTrigger className="py-2">
                  <span className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters & Sort Options
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-4">
                      <div>
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
                        <div className="text-sm font-medium mb-2">Specializations</div>
                        <div className="flex flex-wrap gap-2">
                          {allSpecializations.map((spec) => {
                            const isSelected = selectedSpecializations.includes(spec.id);
                            return (
                              <Badge 
                                key={spec.id} 
                                variant={isSelected ? "default" : "outline"}
                                className={`cursor-pointer hover:bg-accent/20 ${isSelected ? 'bg-primary' : ''}`}
                                onClick={() => handleSpecializationToggle(spec.id)}
                              >
                                {isSelected && <Check className="h-3 w-3 mr-1" />}
                                {spec.name}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4" /> Sort By
                      </div>
                      <Select
                        value={sortBy}
                        onValueChange={setSortBy}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-full">
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {applyingFilters && (
              <div className="flex items-center justify-between text-sm pt-2">
                <div className="text-muted-foreground">{foundExpertsText}</div>
                <button
                  onClick={() => {
                    setRoleFilter('all');
                    setSelectedSpecializations([]);
                  }}
                  className="text-primary hover:underline text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
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
