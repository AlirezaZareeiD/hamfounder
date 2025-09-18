import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import { Rocket, UserCheck } from 'lucide-react';

interface CompleteProfileDialogProps {
  isOpen: boolean;
}

const CompleteProfileDialog: React.FC<CompleteProfileDialogProps> = ({ isOpen }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/dashboard/edit-profile');
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
              <Rocket className="h-12 w-12 text-primary" />
          </div>
          <AlertDialogTitle className="text-center text-2xl font-bold">
            Complete Your Profile to Unlock this Feature
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground pt-2">
            To ensure a high-quality network of co-founders, we require all members to have a 100% complete profile. This helps create better matches and fosters trust within the community.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction onClick={handleNavigate} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                <UserCheck className="mr-2 h-4 w-4" />
                Complete Your Profile Now
            </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CompleteProfileDialog;
