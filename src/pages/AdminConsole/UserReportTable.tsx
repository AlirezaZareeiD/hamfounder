
import React, { useState, useMemo, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import UserProfileCard from '@/pages/AdminConsole/UserProfileCard';
import { format } from 'date-fns';

interface UserReportData {
  uid: string;
  email: string;
  isProfileComplete: boolean;
  profileCompletionPercentage: number;
  projectCount: number;
  lastSignInTime: string;
  profileData: any;
}

interface UserReportTableProps {
  data: UserReportData[];
}

const UserReportTable: React.FC<UserReportTableProps> = ({ data }) => {
  const [selectedUser, setSelectedUser] = useState<UserReportData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const ITEMS_PER_PAGE = 10;

  const handleViewProfileClick = (user: UserReportData) => {
    setSelectedUser(user);
  };

  const processedData = useMemo(() => {
    let filteredData = data;

    if (searchQuery) {
      filteredData = data.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredData.sort((a, b) => {
      if (b.profileCompletionPercentage !== a.profileCompletionPercentage) {
        return b.profileCompletionPercentage - a.profileCompletionPercentage;
      }
      return new Date(b.lastSignInTime).getTime() - new Date(a.lastSignInTime).getTime();
    });
  }, [data, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const paginatedData = processedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <>
      <div className="py-4">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                  placeholder="Search by email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 max-w-sm"
              />
          </div>
      </div>

      <div className="border rounded-md">
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
            {paginatedData.length > 0 ? (
              paginatedData.map((user) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <strong>
            {processedData.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} -{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, processedData.length)}
          </strong>{" "}
          of <strong>{processedData.length}</strong> users
        </div>
        <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages || 1}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
            >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
        </div>
      </div>

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
