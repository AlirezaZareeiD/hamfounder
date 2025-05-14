
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FirebaseSetupGuide } from "./FirebaseSetupGuide";

interface FirebaseSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FirebaseSetupDialog = ({ open, onOpenChange }: FirebaseSetupDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <FirebaseSetupGuide onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
