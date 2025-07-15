import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
  skills: string[];
  location: string;
  isOnline: boolean;
}

interface CoFounderCircleProps {
  members: Member[];
  onMemberClick: (member: Member) => void;
  title: string;
}

const CoFounderCircle: React.FC<CoFounderCircleProps> = ({ members, onMemberClick, title }) => {
  const centerRadius = 120;
  const memberRadius = 40;

  const getPosition = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total;
    const x = centerRadius * Math.cos(angle);
    const y = centerRadius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <h3 className="text-xl font-semibold text-center">{title}</h3>
      
      <div className="relative" style={{ width: '300px', height: '300px' }}>
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">CF</span>
        </div>
        
        {/* Member avatars in circle */}
        {members.slice(0, 8).map((member, index) => {
          const position = getPosition(index, Math.min(members.length, 8));
          return (
            <div
              key={member.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `calc(50% + ${position.x}px)`,
                top: `calc(50% + ${position.y}px)`,
              }}
              onClick={() => onMemberClick(member)}
            >
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-background shadow-lg group-hover:scale-110 transition-transform">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                {member.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                )}
                
                {/* Hover tooltip */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                  <p className="font-medium text-sm">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {members.length > 8 && (
        <Badge variant="secondary" className="mt-4">
          +{members.length - 8} more members
        </Badge>
      )}
    </div>
  );
};

export default CoFounderCircle;
