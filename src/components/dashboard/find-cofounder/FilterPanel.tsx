import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Search, Filter } from 'lucide-react';

interface FilterState {
  searchTerm: string;
  industry: string;
  skills: string[];
  experience: string;
  location: string;
  role: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, onClearFilters }) => {
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Gaming', 'Food & Beverage', 'Real Estate', 'Marketing', 'Entertainment'
  ];

  const skillOptions = [
    'React', 'Node.js', 'Python', 'Marketing', 'Sales', 'Design', 'Product Management', 'Data Science', 'Mobile Development', 'DevOps'
  ];

  const addSkill = (skill: string) => {
    if (!filters.skills.includes(skill)) {
      onFiltersChange({
        ...filters,
        skills: [...filters.skills, skill]
      });
    }
  };

  const removeSkill = (skill: string) => {
    onFiltersChange({
      ...filters,
      skills: filters.skills.filter(s => s !== skill)
    });
  };

  const handleInputChange = (field: keyof FilterState, value: string) => {
    // اگر مقدار "all" بود، آن را به رشته خالی تبدیل می کنیم تا با منطق فعلی فیلتر در FindCofounderPage سازگار باشد
    const finalValue = value === 'all' ? '' : value;
    onFiltersChange({
      ...filters,
      [field]: finalValue
    });
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Find Your Perfect Co-Founder</h3>
        </div>
        <Button variant="outline" size="sm" onClick={onClearFilters}>
          Clear All
        </Button>
      </div>

      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by name, skills, or bio..."
            value={filters.searchTerm}
            onChange={(e) => handleInputChange('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <Label>Industry</Label>
        {/* اصلاح value برای نمایش Placeholder */}
        <Select value={filters.industry || 'all'} onValueChange={(value) => handleInputChange('industry', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            {/* اصلاح value="" به value="all" */}
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry.toLowerCase()}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label>Looking For</Label>
         {/* اصلاح value برای نمایش Placeholder */}
        <Select value={filters.role || 'all'} onValueChange={(value) => handleInputChange('role', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select role type" />
          </SelectTrigger>
          <SelectContent>
            {/* اصلاح value="" به value="all" */}
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="technical">Technical Co-Founder</SelectItem>
            <SelectItem value="business">Business Co-Founder</SelectItem>
            <SelectItem value="marketing">Marketing Co-Founder</SelectItem>
            <SelectItem value="design">Design Co-Founder</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Experience Level */}
      <div className="space-y-2">
        <Label>Experience Level</Label>
         {/* اصلاح value برای نمایش Placeholder */}
        <Select value={filters.experience || 'all'} onValueChange={(value) => handleInputChange('experience', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select experience" />
          </SelectTrigger>
          <SelectContent>
             {/* اصلاح value="" به value="all" */}
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
            <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
            <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
            <SelectItem value="expert">Expert Level (10+ years)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <Label>Skills</Label>
        <Select onValueChange={addSkill}>
          <SelectTrigger>
            <SelectValue placeholder="Add skills" />
          </SelectTrigger>
          <SelectContent>
            {skillOptions.map((skill) => (
              <SelectItem key={skill} value={skill}>
                {skill}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {filters.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {filters.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                {skill}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeSkill(skill)}
                />
              </Badge>
            ))}
          </div>
        )}
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
    </div>
  );
};

export default FilterPanel;
