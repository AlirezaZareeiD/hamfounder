
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="inline-flex items-center">
      <div className="flex items-center">
        {/* Logo SVG - Replace with actual Hamfounder logo */}
        <svg 
          className="h-8 w-8 text-purple-600" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 2L2 7L12 12L22 7L12 2Z" 
            fill="currentColor" 
          />
          <path 
            d="M2 17L12 22L22 17" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M2 12L12 17L22 12" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
        <span className="ml-2 text-xl font-bold text-slate-900">Hamfounder</span>
      </div>
    </Link>
  );
};
