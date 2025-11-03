import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useMediaQuery } from '@/hooks/use-media-query';
import type { Member } from '@/types';

interface CurrentUser {
    name: string;
    avatar: string;
}

interface CoFounderCircleProps {
  members: Member[];
  currentUser: CurrentUser;
  onMemberClick: (member: Member) => void;
  title: string;
}

interface Planet extends Member {
    x: number;
    y: number;
    size: number;
    animationDelay: string;
    animationDuration: string;
}

const CoFounderCircle: React.FC<CoFounderCircleProps> = ({ members, currentUser, onMemberClick, title }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [layout, setLayout] = useState<Planet[]>([]);

  useEffect(() => {
    const generateLayout = () => {
        const containerSize = isDesktop ? 500 : 300;

        let positions: { x: number, y: number, size: number, id: string }[] = [];

        const iterations = 100;
        const repulsionForce = isDesktop ? 1.2 : 0.8;
        const centerAttraction = 0.01;

        members.slice(0, 9).forEach(member => {
            const angle = Math.random() * 2 * Math.PI;
            const distance = (containerSize / 4) + Math.random() * (containerSize / 4);
            positions.push({
                x: distance * Math.cos(angle),
                y: distance * Math.sin(angle) * 0.8,
                size: 40 + Math.random() * (isDesktop ? 24 : 16),
                id: member.id
            });
        });

        for (let i = 0; i < iterations; i++) {
            for (let j = 0; j < positions.length; j++) {
                for (let k = j + 1; k < positions.length; k++) {
                    const pos1 = positions[j];
                    const pos2 = positions[k];
                    const dx = pos1.x - pos2.x;
                    const dy = pos1.y - pos2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDistance = (pos1.size / 2) + (pos2.size / 2) + (isDesktop ? 20 : 10);

                    if (distance < minDistance) {
                        const force = (minDistance - distance) * repulsionForce;
                        const angle = Math.atan2(dy, dx);
                        const fx = Math.cos(angle) * force;
                        const fy = Math.sin(angle) * force;
                        positions[j].x += fx;
                        positions[j].y += fy;
                        positions[k].x -= fx;
                        positions[k].y -= fy;
                    }
                }

                const centerDx = positions[j].x;
                const centerDy = positions[j].y;
                positions[j].x -= centerDx * centerAttraction;
                positions[j].y -= centerDy * centerAttraction;
            }
        }

        const finalLayout = members.slice(0, 9).map((member) => {
            const pos = positions.find(p => p.id === member.id)!;
            return {
                ...member,
                x: pos.x,
                y: pos.y,
                size: pos.size,
                animationDelay: `${(Math.random() * 3).toFixed(2)}s`,
                animationDuration: `${(10 + Math.random() * 10).toFixed(2)}s`,
            };
        });

        setLayout(finalLayout);
    };

    if (members.length > 0) {
        generateLayout();
    }
  }, [members, isDesktop]);

  return (
    <div className="flex flex-col items-center space-y-4 md:space-y-6 w-full">
        <h3 className="text-xl font-semibold text-center">{title}</h3>
      
        <div 
            className="relative w-full flex items-center justify-center"
            style={{ minHeight: isDesktop ? '500px' : '350px' }}
        >
            <div className="relative z-20 group cursor-pointer" onClick={() => alert('This is you!')}>
                <Avatar className={`border-4 border-primary shadow-2xl transition-all`} style={{height: isDesktop ? 96: 80, width: isDesktop ? 96: 80}}>
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                 <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                    <p className="font-bold text-sm">You</p>
                </div>
            </div>

            {layout.map((member) => (
                <div
                    key={member.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group animate-float z-10"
                    style={{
                        left: `calc(50% + ${member.x}px)`,
                        top: `calc(50% + ${member.y}px)`,
                        animationDelay: member.animationDelay,
                        animationDuration: member.animationDuration,
                    }}
                    onClick={() => onMemberClick(member)}
                >
                    <div className="relative">
                        <Avatar style={{ width: member.size, height: member.size }} className={`border-2 border-background shadow-lg group-hover:scale-110 transition-transform`}>
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <FallbackWithThreeDots name={member.name} />
                        </Avatar>
                        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-popover text-popover-foreground px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-30 whitespace-nowrap">
                            <p className="font-medium text-sm">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {members.length > 9 && (
            <Badge variant="secondary">
            +{members.length - 9} more members
            </Badge>
        )}
    </div>
  );
};

const FallbackWithThreeDots: React.FC<{name: string}> = ({name}) => {
    const fallback = name.slice(0,2).toUpperCase();
    return (
        <AvatarFallback>
            {fallback}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-0.5">
                <span className="h-0.5 w-0.5 bg-muted-foreground rounded-full"></span>
                <span className="h-0.5 w-0.5 bg-muted-foreground rounded-full"></span>
                <span className="h-0.5 w-0.5 bg-muted-foreground rounded-full"></span>
            </div>
        </AvatarFallback>
    )
}


export default CoFounderCircle;
