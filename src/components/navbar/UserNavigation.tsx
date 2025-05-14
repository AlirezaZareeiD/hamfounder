
import { Link } from 'react-router-dom';

const UserNavigation = () => {
  return (
    <div className="hidden md:block">
      <div className="ml-4 flex items-center space-x-3">
        <Link 
          to="/login" 
          className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-[#0ea5e9] hover:bg-[#0891d2] text-white px-4 py-2 rounded-md text-sm font-medium transition"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default UserNavigation;
