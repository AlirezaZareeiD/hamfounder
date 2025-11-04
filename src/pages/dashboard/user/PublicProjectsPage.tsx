import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, FolderKanban } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  stage: string;
  tags: string[];
}

const PublicProjectsPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (!userId) return;

    const fetchProjects = async () => {
      try {
        const userRef = doc(db, 'userProfiles', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(`${userData?.firstName || ''} ${userData?.lastName || ''}`.trim());
        }

        const projectsRef = collection(db, 'projects');
        const q = query(projectsRef, where('ownerId', '==', userId), where('isPrivate', '==', false));
        const querySnapshot = await getDocs(q);
        
        const userProjects = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];

        setProjects(userProjects);
      } catch (error) {
        console.error("Error fetching public projects: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  if (loading) {
    return <DashboardLayout><div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Public Projects by {userName || 'User'}</h1>
        
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Public Projects Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">This user has not shared any public projects yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <Link to={`/dashboard/projects/${project.id}`} key={project.id} className="block">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="truncate">{project.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{project.stage}</Badge>
                        {project.tags?.slice(0, 2).map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PublicProjectsPage;
