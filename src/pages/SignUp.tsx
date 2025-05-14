
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { SignupLayout } from "@/components/signup/SignupLayout";
import { SignupContent } from "@/components/signup/SignupContent";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to dashboard
        navigate('/dashboard');
      }
    });

    // Clean up subscription
    return () => unsubscribe();
  }, [navigate]);

  return (
    <SignupLayout>
      <SignupContent
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
      />
    </SignupLayout>
  );
};

export default SignUp;
