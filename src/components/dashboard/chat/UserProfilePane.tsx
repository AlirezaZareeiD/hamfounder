import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Archive, UserX, AlertTriangle } from 'lucide-react';

interface UserProfilePaneProps {
  otherUser: {
    id: string;
    name: string;
    avatar: string;
  } | null;
  onViewProfile: (user: any) => void;
}

const UserProfilePane: React.FC<UserProfilePaneProps> = ({ otherUser, onViewProfile }) => {
  if (!otherUser) {
    return (
      <div className="h-full flex flex-col justify-center items-center text-muted-foreground p-4">
        <p className="text-center">Select a chat to see user details and options.</p>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-none h-full flex flex-col">
      <CardHeader className="text-center items-center pt-8">
        <Avatar className="h-24 w-24 mb-2">
          <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
          <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl">{otherUser.name}</CardTitle>
        <Button variant="link" className="text-sm" onClick={() => onViewProfile(otherUser)}>
          View profile
        </Button>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-300">About</h3>
          <p className="text-sm text-muted-foreground mb-4">Product Designer at Hamfounder</p>
          <h3 className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-300">Member since</h3>
          <p className="text-sm text-muted-foreground">04/13/2025</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm mb-3 text-gray-800 dark:text-gray-300">Chat actions</h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Archive className="mr-2 h-4 w-4" /> Archive Chat
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700">
              <UserX className="mr-2 h-4 w-4" /> Block User
            </Button>
            <Button variant="outline" className="w-full justify-start text-amber-500 hover:text-amber-600 border-amber-200 hover:border-amber-300 dark:border-amber-800 dark:hover:border-amber-700">
              <AlertTriangle className="mr-2 h-4 w-4" /> Report User
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfilePane;
