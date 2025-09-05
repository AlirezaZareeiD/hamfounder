
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, MapPin, Briefcase, Lightbulb, Target, Award, Link as LinkIcon, Globe, Twitter, Linkedin } from 'lucide-react';

// Define the type for the profile data prop
interface UserProfileCardProps {
  profile: any; // Using 'any' for now, but a specific type is better
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile }) => {
  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Profile Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This user has not created a profile yet.</p>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || 'U';
  };

  return (
    <div className="font-sans max-w-2xl mx-auto p-4 bg-background text-foreground">
      <div className="flex items-start space-x-4 mb-6">
        <Avatar className="w-24 h-24 border-4 border-primary/20">
          <AvatarImage src={profile.profileImageUrl} alt={profile.displayName} />
          <AvatarFallback className="text-3xl bg-muted">
            {getInitials(profile.firstName, profile.lastName)}
          </AvatarFallback>
        </Avatar>
        <div className="pt-2">
          <h1 className="text-3xl font-bold">{profile.displayName || 'Unnamed User'}</h1>
          <p className="text-lg text-muted-foreground">{profile.role || 'Role not specified'}</p>
          {profile.location && (
            <div className="flex items-center text-muted-foreground mt-2">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{profile.location}</span>
            </div>
          )}
        </div>
      </div>

      {profile.personalSummary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center"><User className="h-5 w-5 mr-2 text-primary" /> About</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">{profile.personalSummary}</p>
        </div>
      )}

      {profile.lookingFor && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center"><Briefcase className="h-5 w-5 mr-2 text-primary" /> Looking For</h2>
          <p className="text-muted-foreground">{profile.lookingFor}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {profile.businessStage && (
          <div>
            <h3 className="font-semibold mb-2">Industry / Stage</h3>
            <Badge variant="outline" className="text-sm">{profile.businessStage}</Badge>
          </div>
        )}
        {profile.companyName && (
             <div>
                <h3 className="font-semibold mb-2">Startup</h3>
                 <p className="text-muted-foreground">{profile.companyName}</p>
             </div>
        )}
      </div>

      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center"><Target className="h-5 w-5 mr-2 text-primary" /> Skills & Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill: string) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </div>
      )}
      
      {profile.interests && profile.interests.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 flex items-center"><Lightbulb className="h-5 w-5 mr-2 text-primary" /> Interests</h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest: string) => (
              <Badge key={interest} variant="secondary">{interest}</Badge>
            ))}
          </div>
        </div>
      )}

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Links</h2>
        <div className="flex flex-wrap gap-4">
            {profile.companyWebsiteUrl && (
                <a href={profile.companyWebsiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                    <Globe className="h-4 w-4 mr-2" /> Website
                </a>
            )}
            {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
                </a>
            )}
            {profile.twitterUrl && (
                <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                    <Twitter className="h-4 w-4 mr-2" /> Twitter
                </a>
            )}
        </div>
      </div>

    </div>
  );
};

export default UserProfileCard;

