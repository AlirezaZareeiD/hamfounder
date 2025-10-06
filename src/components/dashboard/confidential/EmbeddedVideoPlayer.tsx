
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { PlayCircle } from 'lucide-react';

interface EmbeddedVideoPlayerProps {
  videoId: string;
  title: string;
  description: string;
}

export const EmbeddedVideoPlayer: React.FC<EmbeddedVideoPlayerProps> = ({ videoId, title, description }) => {
  // Corrected the video source URL to be the simplest, most reliable embed URL.
  const videoSrc = `https://www.youtube.com/embed/${videoId}`;

  return (
    <Card className="mt-8 overflow-hidden shadow-lg border-t-4 border-primary">
      <CardHeader className="bg-muted/30">
        <div className="flex items-center gap-4">
           <PlayCircle className="w-8 h-8 text-primary flex-shrink-0" />
           <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
           </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 bg-background">
        <div className="rounded-lg overflow-hidden border shadow-inner">
            <AspectRatio ratio={16 / 9}>
                <iframe
                    className="w-full h-full"
                    src={videoSrc}
                    title="Hamfounder Vision & Mission Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </AspectRatio>
        </div>
      </CardContent>
    </Card>
  );
};
