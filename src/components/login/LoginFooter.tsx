
import React from 'react';
import { Link } from 'react-router-dom';

export const LoginFooter: React.FC = () => {
  return (
    <>
      <div className="mt-6 text-center">
        <span className="text-slate-600">Don't have an account?</span>{" "}
        <Link to="/signup" className="text-purple-600 hover:text-purple-800 font-medium">
          Create an Account
        </Link>
      </div>

      <div className="flex items-center justify-center mt-8 text-sm text-slate-500">
        <svg
          className="h-4 w-4 mr-1"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        Secure, encrypted connection
      </div>
    </>
  );
};
