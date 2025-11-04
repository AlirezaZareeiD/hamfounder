import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, UserPlus, ArrowRight, Check } from "lucide-react";
import { Member } from '@/types';
import { ConnectionStatus } from '@/pages/dashboard/find-cofounder/FindCofounderPage';

interface MemberCardProps {
  member: Member;
  onViewProfile: (member: Member) => void;
  onConnect: (member: Member) => void;
  connectionStatus: ConnectionStatus;
}

// Corrected the onClick type definition to accept the event
const ConnectionButton: React.FC<{ status: ConnectionStatus; onClick: (e: React.MouseEvent) => void }> = ({ status, onClick }) => {
  switch (status) {
    case 'connected':
      return (
        <Button onClick={onClick} className="w-full bg-blue-600 hover:bg-blue-700">
          <MessageSquare className="mr-2 h-4 w-4" /> Message
        </Button>
      );
    case 'pending_sent':
      return (
        <Button disabled className="w-full">
          <Check className="mr-2 h-4 w-4" /> Request Sent
        </Button>
      );
    case 'pending_received':
        return (
          <Button onClick={onClick} className="w-full bg-green-600 hover:bg-green-700">
             Accept Request
          </Button>
        );
    default:
      return (
        <Button onClick={onClick} className="w-full">
          <UserPlus className="mr-2 h-4 w-4" /> Connect
        </Button>
      );
  }
};

const MemberCard: React.FC<MemberCardProps> = ({ member, onViewProfile, onConnect, connectionStatus }) => {

  const handleConnectClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    onConnect(member);
  };

  const handleViewProfileClick = () => {
    onViewProfile(member);
  };

  return (
    <Card 
      className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={handleViewProfileClick}
    >
      <CardHeader className="flex flex-col items-center text-center p-4">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-transparent group-hover:border-primary transition-colors">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {member.isOnline && <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />} 
        </div>
        <CardTitle className="mt-4 text-xl">{member.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{member.role}</p>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <p className="text-sm text-center text-muted-foreground mb-4 line-clamp-2 h-10">
          {member.bio}
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {member.skills.slice(0, 3).map((skill: string, index: number) => (
            <Badge key={index} variant="secondary">{skill}</Badge>
          ))}
          {member.skills.length > 3 && (
            <Badge variant="outline">+{member.skills.length - 3} more</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 p-4 pt-0">
        <ConnectionButton status={connectionStatus} onClick={handleConnectClick} />
        <Button variant="outline" className="w-full">
          View Profile <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MemberCard;
