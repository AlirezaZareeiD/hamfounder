import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Rocket, UserCheck } from 'lucide-react';

interface CompleteProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const CompleteProfileDialog: React.FC<CompleteProfileDialogProps> = ({ isOpen, onOpenChange }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    onOpenChange(false);
    navigate('/dashboard/edit-profile');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {/* Added aria attributes to explicitly link title and description for accessibility */}
      <DialogContent 
        className="sm:max-w-[425px]"
        aria-labelledby="complete-profile-title"
        aria-describedby="complete-profile-description"
      >
        <DialogHeader>
            <div className="flex justify-center mb-4">
                <Rocket className="h-12 w-12 text-primary" />
            </div>
            <DialogTitle id="complete-profile-title" className="text-center text-2xl font-bold">
                Complete Your Profile to Discover Co-Founders
            </DialogTitle>
            <DialogDescription id="complete-profile-description" className="text-center text-muted-foreground pt-2">
                To ensure a high-quality network, we ask members to complete their profiles. This helps create better matches and fosters trust within the community.
            </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center pt-4">
            <Button onClick={handleNavigate} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                <UserCheck className="mr-2 h-4 w-4" />
                Complete Your Profile Now
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteProfileDialog;
