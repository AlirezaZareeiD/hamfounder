export interface Member {
    id: string;
    name: string;
    avatar: string;
    role: string;
    skills: string[];
    location: string;
    isOnline: boolean;
    bio: string;
    experience: string;
    industry: string;
    rating: number;
    projectsCompleted: number;
    joinedDate: string;
    website?: string;
    linkedIn?: string;
    github?: string;
    achievements: string[];
    lookingFor: string;
}
