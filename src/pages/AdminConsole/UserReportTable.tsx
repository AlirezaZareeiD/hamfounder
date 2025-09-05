
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import UserProfileCard from '@/pages/AdminConsole/UserProfileCard'; // Import the new component
import { format } from 'date-fns';

// Define a more specific type for our user data
interface UserReportData {
  uid: string;
  email: string;
  isProfileComplete: boolean;
  profileCompletionPercentage: number;
  projectCount: number;
  lastSignInTime: string;
  profileData: any; // This will hold the full profile for the card
}

interface UserReportTableProps {
  data: UserReportData[];
}

const UserReportTable: React.FC<UserReportTableProps> = ({ data }) => {
  const [selectedUser, setSelectedUser] = useState<UserReportData | null>(null);

  const handleViewProfileClick = (user: UserReportData) => {
    setSelectedUser(user);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead className="text-center">Profile Complete</TableHead>
            <TableHead className="text-center">Completion %</TableHead> 
            <TableHead className="text-center">Project Count</TableHead>
            <TableHead>Last Sign-In</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => (
            <TableRow key={user.uid}>
              <TableCell className="font-medium">{user.email}</TableCell>
              <TableCell className="text-center">
                <Badge variant={user.isProfileComplete ? "success" : "destructive"}>
                  {user.isProfileComplete ? "Yes" : "No"}
                </Badge>
              </TableCell>
              <TableCell className="text-center font-semibold">{user.profileCompletionPercentage}%</TableCell> 
              <TableCell className="text-center">{user.projectCount}</TableCell>
              <TableCell>{format(new Date(user.lastSignInTime), 'PPP p')}</TableCell>
              <TableCell className="text-right">
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => handleViewProfileClick(user)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </DialogTrigger>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DialogContent className="max-w-3xl h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Founder Profile Preview</DialogTitle>
        </DialogHeader>
        {selectedUser && (
            <UserProfileCard profile={selectedUser.profileData} />
        )}
      </DialogContent>
    </>
  );
};

export default UserReportTable;
