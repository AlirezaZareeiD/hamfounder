import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface FilterState {
  searchTerm: string;
  lookingFor: string;
  businessStage: string;
  skills: string; // Changed from string[] to string for simplicity
  location: string;
  role: string;
}

interface FilterPanelProps {
  filters: Omit<FilterState, 'searchTerm'>; // searchTerm is now managed in the parent
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, onClearFilters }) => {

  const handleInputChange = (field: keyof Omit<FilterState, 'searchTerm'>, value: string) => {
    const finalValue = value === 'all' ? '' : value;
    onFiltersChange({ [field]: finalValue });
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Filter Co-Founders</h3>
        </div>
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          Clear All
        </Button>
      </div>

      {/* Looking For (Previously Role) */}
      <div className="space-y-2">
        <Label>Looking For</Label>
        <Select value={filters.lookingFor || 'all'} onValueChange={(value) => handleInputChange('lookingFor', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select what you're looking for" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Co-founder">Co-founder</SelectItem>
            <SelectItem value="Mentorship">Mentorship</SelectItem>
            <SelectItem value="Investment">Investment</SelectItem>
            <SelectItem value="Talent">Talent</SelectItem>
            <SelectItem value="Networking">Networking</SelectItem>
            <SelectItem value="Advisory">Advisory</SelectItem>
            <SelectItem value="Collaboration">Collaboration</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Business Stage (Previously Experience Level) */}
      <div className="space-y-2">
        <Label>Business Stage</Label>
        <Select value={filters.businessStage || 'all'} onValueChange={(value) => handleInputChange('businessStage', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select business stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            <SelectItem value="Idea">Idea</SelectItem>
            <SelectItem value="Prototype">Prototype</SelectItem>
            <SelectItem value="MVP">MVP</SelectItem>
            <SelectItem value="Early Stage">Early Stage</SelectItem>
            <SelectItem value="Growth Stage">Growth Stage</SelectItem>
            <SelectItem value="Mature">Mature</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <Label htmlFor="skills">Skills</Label>
        <Input
          id="skills"
          placeholder="e.g. React, Marketing, AI"
          value={filters.skills}
          onChange={(e) => handleInputChange('skills', e.target.value)}
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="City, Country"
          value={filters.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
        />
      </div>

        {/* Role */}
        <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          placeholder="e.g. CEO, CTO, Founder"
          value={filters.role}
          onChange={(e) => handleInputChange('role', e.target.value)}
        />
      </div>

    </div>
  );
};

export default FilterPanel;
