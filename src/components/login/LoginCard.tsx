
import React from 'react';
import { LoginHeader } from './LoginHeader';
import { SignUpSocialButtons } from '@/components/SignUpSocialButtons';
import { LoginDivider } from './LoginDivider';
import { LoginForm } from './LoginForm';
import { LoginFooter } from './LoginFooter';

export const LoginCard: React.FC = () => {
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 border border-slate-100">
      <LoginHeader 
        title="Log in to your Account" 
        subtitle="Welcome back to Hamfounder" 
      />
      
      {/* Social Login Buttons */}
      <SignUpSocialButtons />
      
      {/* Divider */}
      <LoginDivider />
      
      {/* Email/Password Form */}
      <LoginForm />
      
      {/* Footer Section */}
      <LoginFooter />
    </div>
  );
};
