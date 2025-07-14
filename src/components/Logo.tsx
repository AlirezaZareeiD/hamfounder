
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="inline-flex items-center">
      <div className="flex items-center">
      <img src="/apple-touch-icon.png" alt="Hamfounder Logo" className="h-8 w-auto" />
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
          Hamfounder
        </span>
      </div>
    </Link>
  );
};