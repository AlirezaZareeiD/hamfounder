
import React from "react";
import { ValueProposition } from "@/components/signup/ValueProposition";
import { FirebaseConfigAlert } from "@/components/firebase/FirebaseConfigAlert";
import { SignUpForm } from "@/components/signup/SignUpForm";

interface SignupContentProps {
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

export const SignupContent: React.FC<SignupContentProps> = ({ 
  isSubmitting, 
  setIsSubmitting 
}) => {
  return (
    <>
      {/* Firebase Configuration Alert */}
      <FirebaseConfigAlert />
      
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Value Proposition */}
        <div className="order-2 lg:order-1">
          <ValueProposition />
        </div>

        {/* Right Column - Sign-up Form */}
        <div className="order-1 lg:order-2">
          <SignUpForm
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        </div>
      </div>
    </>
  );
};
