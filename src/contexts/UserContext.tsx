import { createContext, useContext } from 'react';
import { User } from 'firebase/auth'; // Import User type from Firebase

// Define the shape of the context value
export interface UserContextType {
  user: User | null; // The Firebase User object, or null if not authenticated
  loading: boolean; // True while checking auth state, false otherwise
  userProfileImage: string | undefined; // URL of the user's profile image
  // Add other profile information here if needed globally
}

// Create the context with a default null value
// We use 'as any' here because the default value is null,
// but the context will eventually hold a value of type UserContextType.
// In a real application with strict typing, a more robust approach for default value might be considered,
// but for this case, null and checking in useUser is common.
export const UserContext = createContext<UserContextType | null>(null);

// Custom hook to easily access the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Note: The UserProvider component is now in a separate file: UserProvider.tsx
