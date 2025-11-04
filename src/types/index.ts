export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: string;
  skills: string[];
  location: string;
  bio: string;
  experience: string;
  industry: string;
  lookingFor: string;
  projectsCompleted: number;
  isOnline?: boolean;
  rating?: number;
  joinedDate?: string;
  achievements?: string[];
  [key: string]: any;
}
