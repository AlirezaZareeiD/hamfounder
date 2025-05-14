
import React from 'react';

export const LoginDivider: React.FC = () => {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-4 text-sm text-slate-500">or continue with</span>
      </div>
    </div>
  );
};
