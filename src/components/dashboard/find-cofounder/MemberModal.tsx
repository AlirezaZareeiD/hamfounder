import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, MapPin, Lightbulb, BarChart2, Star, MessageSquare, UserPlus, Check, FolderKanban } from "lucide-react";
import { Member } from '@/types';
import { ConnectionStatus } from '@/pages/dashboard/find-cofounder/FindCofounderPage';
import { Link } from 'react-router-dom';

interface MemberModalProps {
  member: Member;
  isOpen: boolean;
  onClose: () => void;
  onConnect: (member: Member, message?: string) => void;
  connectionStatus: ConnectionStatus;
  projectsCount: number;
  isMyProfile?: boolean; // Make isMyProfile optional
}

const ConnectionButton: React.FC<{ status: ConnectionStatus; onClick: () => void }> = ({ status, onClick }) => {
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
            <UserPlus className="mr-2 h-4 w-4" /> Send Connection Request
          </Button>
        );
    }
  };

const MemberModal: React.FC<MemberModalProps> = ({ member, isOpen, onClose, onConnect, connectionStatus, projectsCount, isMyProfile = false }) => {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleConnectClick = () => {
    onConnect(member, message);
    setMessage(''); // Clear message after sending
  };

  const projectCountDisplay = projectsCount > 0 ? (
    <Link to={`/dashboard/user/${member.id}/projects`} className="font-semibold text-primary hover:underline">
      {projectsCount}
    </Link>
  ) : (
    <span className="font-semibold">{projectsCount}</span>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[95vw] h-[95vh] max-h-[800px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 flex-shrink-0 border-b">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-transparent">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-grow pt-2">
              <DialogTitle className="text-2xl sm:text-3xl font-bold">{member.name}</DialogTitle>
              <p className="text-md sm:text-lg text-muted-foreground">{member.role}</p>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
                <MapPin className="h-4 w-4" />
                <span>{member.location}</span>
              </div>
            </div>
          </div>
        </DialogHeader>
       
        <div className="flex-grow overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary" />Professional Bio</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{member.bio}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-primary" />Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {member.skills.map((skill: string, index: number) => (
                                <Badge key={index} variant="secondary">{skill}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="space-y-4 bg-muted/50 p-4 rounded-lg h-fit">
                     <h3 className="font-semibold text-lg mb-2 flex items-center"><BarChart2 className="mr-2 h-5 w-5 text-primary" />Professional Details</h3>
                     <ul className="text-sm space-y-2">
                        <li className="flex justify-between"><strong>Industry:</strong> <span>{member.industry}</span></li>
                        <li className="flex justify-between"><strong>Business Stage:</strong> <span>{member.experience}</span></li>
                        <li className="flex justify-between"><strong>Looking For:</strong> <span>{member.lookingFor}</span></li>
                        <li className="flex justify-between items-center">
                            <strong className="flex items-center"><FolderKanban className="mr-2 h-4 w-4" />Projects:</strong>
                            {projectCountDisplay}
                        </li>
                     </ul>
                      <h3 className="font-semibold text-lg mb-2 mt-4 flex items-center"><Star className="mr-2 h-5 w-5 text-primary" />Key Achievements</h3>
                       <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                          {member.achievements?.map((ach: string, index: number) => <li key={index}>{ach}</li>)}
                          {!member.achievements?.length && <li>No achievements listed.</li>}
                      </ul>
                </div>
            </div>

            {!isMyProfile && connectionStatus === 'none' && (
                 <div className="space-y-2 mt-6">
                    <label htmlFor="connect-message" className="font-semibold">Include a message (optional)</label>
                    <Textarea
                        id="connect-message"
                        placeholder={`Hi ${member.name.split(' ')[0]}, I'd love to connect...`}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                 </div>
            )}
        </div>

        <DialogFooter className="p-4 sm:p-6 flex-shrink-0 border-t bg-background">
            <Button variant="outline" onClick={onClose}>Close</Button>
            {!isMyProfile && <ConnectionButton status={connectionStatus} onClick={handleConnectClick} />}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MemberModal;
