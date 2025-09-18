import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { MapPin, Briefcase, Star, MessageCircle, Calendar, Globe, Award, Linkedin, Twitter } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
  skills: string[];
  location: string;
  isOnline?: boolean;
  bio: string;
  experience: string;
  industry: string;
  rating?: number;
  projectsCompleted?: number;
  joinedDate?: string;
  website?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  achievements?: string[];
  lookingFor: string;
}

interface MemberModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onConnect?: (member: Member, message: string) => void;
  isMyProfile?: boolean;
}

const MemberModal: React.FC<MemberModalProps> = ({ member, isOpen, onClose, onConnect, isMyProfile = false }) => {
  const [message, setMessage] = React.useState('');

  if (!member) return null;

  const handleConnect = () => {
    if (onConnect) {
        onConnect(member, message);
        setMessage('');
        onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isMyProfile ? "My Profile Preview" : "Co-Founder Profile"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-lg">{member.name ? member.name.slice(0, 2).toUpperCase() : '??'}</AvatarFallback>
              </Avatar>
              {member.isOnline && (
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-background"></div>
              )}
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{member.name}</h2>
              <p className="text-muted-foreground flex items-center mt-1">
                <Briefcase className="h-4 w-4 mr-2" />
                {member.role}
              </p>
              <p className="text-muted-foreground flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-2" />
                {member.location}
              </p>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-2">
                {member.rating !== undefined && (
                    <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{member.rating}</span>
                    </div>
                )}
                {member.projectsCompleted !== undefined && (
                    <div className="flex items-center space-x-1">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm">{member.projectsCompleted} projects</span>
                    </div>
                )}
                {member.joinedDate && (
                    <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Joined {member.joinedDate}</span>
                    </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Bio */}
          <div>
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{member.bio}</p>
          </div>

          {/* Looking For */}
          <div>
            <h3 className="font-semibold mb-2">Looking For</h3>
            <p className="text-muted-foreground">{member.lookingFor}</p>
          </div>

          {/* Industry & Experience */}
          <div className="grid grid-cols-2 gap-4">
            {member.industry && <div>
              <h3 className="font-semibold mb-2">Industry</h3>
              <Badge variant="outline">{member.industry}</Badge>
            </div>}
            {member.experience && <div>
              <h3 className="font-semibold mb-2">Experience</h3>
              <Badge variant="outline">{member.experience}</Badge>
            </div>}
          </div>

          {/* Skills */}
          {member.skills && member.skills.length > 0 && (
            <div>
                <h3 className="font-semibold mb-2">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                    {skill}
                    </Badge>
                ))}
                </div>
            </div>
          )}

          {/* Achievements */}
          {member.achievements && member.achievements.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Achievements</h3>
              <ul className="space-y-1">
                {member.achievements.map((achievement, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start">
                    <Award className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Social Links */}
          <div className="flex space-x-3 pt-2">
            {member.website && (
              <Button variant="outline" asChild>
                <a href={member.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" />
                  Website
                </a>
              </Button>)
            }
            {member.linkedinUrl && (
              <Button variant="outline" asChild>
                <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </a>
              </Button>)
            }
             {member.twitterUrl && (
              <Button variant="outline" asChild>
                <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </a>
              </Button>)
            }
          </div>

          {/* Connect Section - Hidden for own profile view */}
          {!isMyProfile && onConnect && (
            <>
                <Separator />
                <div>
                    <h3 className="font-semibold mb-2">Send Connection Request</h3>
                    <Textarea
                    placeholder={`Write a personalized message to introduce yourself to ${member.name}...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px]"
                    />
                </div>
                <div className="flex">
                    <Button onClick={handleConnect} className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send Connection Request
                    </Button>
                </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemberModal;
