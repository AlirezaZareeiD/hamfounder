import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MapPin, Briefcase, MessageCircle, Star } from 'lucide-react';
import type { Member } from '@/types';

interface MemberCardProps {
  member: Member;
  onViewProfile: (member: Member) => void;
  onConnect: (member: Member) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onViewProfile, onConnect }) => {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {member.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{member.name}</h3>
            <div className="min-h-[40px]">
                <p className="text-sm text-muted-foreground flex items-center">
                <Briefcase className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="line-clamp-2">{member.role}</span>
                </p>
                <p className="text-sm text-muted-foreground flex items-center mt-1">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                {member.location}
                </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{member.rating}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
        
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs">
            {member.industry}
          </Badge>
          
          <div className="flex flex-wrap gap-1">
            {member.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {member.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{member.skills.length - 3}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground pt-2">
          {member.projectsCompleted} projects completed
        </div>
      </CardContent>

      <CardFooter className="pt-3 space-x-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewProfile(member)}>
          View Profile
        </Button>
        <Button size="sm" className="flex-1" onClick={() => onConnect(member)}>
          <MessageCircle className="h-4 w-4 mr-1" />
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MemberCard;
