
import React from 'react';

interface LoginHeaderProps {
  title: string;
  subtitle: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <p className="text-slate-600 mt-2">{subtitle}</p>
    </div>
  );
};
