
import React from "react";
import { Logo } from "@/components/Logo";
import { SimpleFooter } from "@/components/signup/SimpleFooter";

interface SignupLayoutProps {
  children: React.ReactNode;
}

export const SignupLayout: React.FC<SignupLayoutProps> = ({ children }) => {
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
          {children}
        </div>
      </main>

      {/* Footer */}
      <SimpleFooter />
    </div>
  );
};
