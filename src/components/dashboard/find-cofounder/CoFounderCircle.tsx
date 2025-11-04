
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3-force';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import type { Member } from '@/types';

// Helper to generate initials from a name
const getInitials = (name: string = '') => {
  if (!name) return '';
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};


interface CoFounderCircleProps {
  members: Member[];
  currentUser: { name: string; avatar: string; id: string };
  onMemberClick: (member: Member) => void;
  onMoreMembersClick: () => void;
  title: string;
}

interface SimulationNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  avatar: string;
  size: number;
}

const CoFounderCircle: React.FC<CoFounderCircleProps> = ({ members, currentUser, onMemberClick, onMoreMembersClick, title }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<SimulationNode[]>([]);

  const width = 500;
  const height = 400;
  const center = { x: width / 2, y: height / 2 };
  const centralAvatarRadius = 40; // FINAL FIX: Increased size for emphasis
  const baseSatelliteRadius = 28;
  const safeZoneRadius = centralAvatarRadius + baseSatelliteRadius + 30;

  useEffect(() => {
    if (!svgRef.current || members.length === 0) {
        setNodes([]);
        return;
    }

    const satelliteNodes: SimulationNode[] = members.slice(0, 18).map((m, i) => {
      const angle = (i / members.slice(0, 18).length) * 2 * Math.PI;
      const radius = safeZoneRadius + 10 + Math.random() * 50;
      const size = baseSatelliteRadius * (0.9 + Math.random() * 0.3);
      return {
        ...m,
        x: center.x + radius * Math.cos(angle) + (Math.random() - 0.5) * 40,
        y: center.y + radius * Math.sin(angle) + (Math.random() - 0.5) * 40,
        size: size,
      };
    });

    const simulation = d3.forceSimulation(satelliteNodes)
      .force('collide', d3.forceCollide<SimulationNode>().radius(d => d.size + 8).strength(1).iterations(2))
      .on('tick', () => {
        setNodes([...simulation.nodes()]);
      });

    return () => {
      simulation.stop();
    };
  }, [members, currentUser]);

  const clipPathId = (id: string) => `clip-path-id-${id}`.replace(/[^a-zA-Z0-9]/g, '-');

  const AvatarComponent = ({ id, avatar, name, radius }: { id: string, avatar?: string, name: string, radius: number }) => (
    <g>
      {avatar ? (
        <image
          href={avatar}
          x={-radius}
          y={-radius}
          height={radius * 2}
          width={radius * 2}
          clipPath={`url(#${clipPathId(id)})`} // FINAL FIX: Using stable ID for clip-path
        />
      ) : (
        <>
          <circle r={radius} fill="hsl(var(--muted))" />
          <text
            textAnchor="middle"
            dy=".3em"
            fill="hsl(var(--muted-foreground))"
            fontSize={radius * 0.8}
            fontFamily="sans-serif"
            fontWeight="bold"
          >
            {getInitials(name)}
          </text>
        </>
      )}
      <circle r={radius} fill="transparent" stroke={avatar ? "hsl(var(--primary) / 0.7)" : "hsl(var(--border))"} strokeWidth={avatar ? "2" : "1.5"}/>
    </g>
  );

  return (
    <div className="bg-card p-4 md:p-6 rounded-lg shadow-sm w-full">
      <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      <div className="relative w-full h-[400px] overflow-hidden">
        <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            {/* FINAL FIX: Using stable IDs for all clip paths */}
            <clipPath id={clipPathId(currentUser.id)}><circle r={centralAvatarRadius} /></clipPath>
            {nodes.map(node => (
              <clipPath key={`clip-${node.id}`} id={clipPathId(node.id)}><circle r={node.size} /></clipPath>
            ))}
          </defs>

          {nodes.map(node => (
            <g
              key={node.id}
              transform={`translate(${node.x || center.x}, ${node.y || center.y})`}
              className="cursor-pointer group animate-fade-in"
              onClick={() => onMemberClick(node as Member)}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AvatarComponent id={node.id} avatar={node.avatar} name={node.name} radius={node.size} />
                  </TooltipTrigger>
                  <TooltipContent><p>{node.name}</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </g>
          ))}

          <g transform={`translate(${center.x}, ${center.y})`} className="group">
             <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                   <AvatarComponent id={currentUser.id} avatar={currentUser.avatar} name={currentUser.name} radius={centralAvatarRadius} />
                </TooltipTrigger>
                 <TooltipContent><p>{currentUser.name} (You)</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </g>
        </svg>
      </div>
       <div className="text-center mt-4">
        {members.length > 18 && (
             <Button onClick={onMoreMembersClick} variant="ghost">+ {members.length - 18} more members</Button>
        )}
       </div>
    </div>
  );
};

export default CoFounderCircle;
