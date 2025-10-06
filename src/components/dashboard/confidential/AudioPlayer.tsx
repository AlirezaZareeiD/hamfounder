
import React, { useState, useEffect, useRef } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Loader2, AlertTriangle } from 'lucide-react';

interface AudioPlayerProps {
  storagePath: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ storagePath }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 1. Create a ref to get direct access to the <audio> DOM element
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Reset component state when the storagePath changes
    setIsLoading(true);
    setError(null);
    setAudioUrl(null);

    if (!storagePath) {
      setError('No storage path provided.');
      setIsLoading(false);
      return;
    }

    const fetchAudioUrl = async () => {
      try {
        const storageRef = ref(storage, storagePath);
        const url = await getDownloadURL(storageRef);
        setAudioUrl(url);
      } catch (err: any) {
        console.error("Firebase Storage Error:", err);
        setError('Failed to fetch the audio file URL.');
      } finally {
        // Stop the initial loading indicator once the fetch is complete
        setIsLoading(false);
      }
    };

    fetchAudioUrl();
  }, [storagePath]);

  // 2. THE FINAL FIX: An effect that runs when the audioUrl is ready.
  // This imperatively commands the browser to load the media.
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      const audioElement = audioRef.current;
      
      // Check if the source is different to avoid unnecessary reloads
      if (audioElement.src !== audioUrl) {
        audioElement.src = audioUrl;
        // *** This is the crucial command that was missing. ***
        // It tells the browser to load the new source file.
        audioElement.load();
      }
    }
  }, [audioUrl]); // This effect depends only on the audioUrl

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin mr-3" /> <span>Loading Audio...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 p-4 bg-red-100 text-red-800 rounded-md">
        <AlertTriangle className="h-6 w-6 mr-3 inline-block" /> {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 rounded-b-lg">
      {/* We render the audio element with a ref, but WITHOUT a src attribute initially.
          The source is managed imperatively in the useEffect hook for maximum reliability. */}
      <audio ref={audioRef} controls className="w-full">
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};
