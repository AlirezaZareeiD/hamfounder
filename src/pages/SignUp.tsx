
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ValueProposition } from "@/components/signup/ValueProposition";
import { SignupForm } from "@/components/signup/SignupForm";
import { SimpleFooter } from "@/components/signup/SimpleFooter";

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
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50/50 flex flex-col">
      {/* Header with Logo */}
      <header className="py-6 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto">
          <Logo />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-8 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Value Proposition */}
            <div className="order-2 lg:order-1">
              <ValueProposition />
            </div>

            {/* Right Column - Sign-up Form */}
            <div className="order-1 lg:order-2">
              <SignupForm
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <SimpleFooter />
    </div>
  );
};

export default SignUp;
