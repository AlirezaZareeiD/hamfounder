import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bell, Check, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'; // Import serverTimestamp

interface ConnectionRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  createdAt: any;
}

const NotificationsPage: React.FC = () => {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(auth);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const requestsQuery = query(
      collection(db, 'connection_requests'),
      where('receiverId', '==', user.uid),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(requestsQuery, async (snapshot) => {
      const newRequests = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const requestData = docSnapshot.data();
          const senderProfileDoc = await getDoc(doc(db, 'userProfiles', requestData.senderId));
          
          if (senderProfileDoc.exists()) {
            const senderProfile = senderProfileDoc.data();
            return {
              id: docSnapshot.id,
              senderId: requestData.senderId,
              senderName: `${senderProfile.firstName || ''} ${senderProfile.lastName || ''}`.trim(),
              senderAvatar: senderProfile.profileImageUrl || 'https://via.placeholder.com/150',
              senderRole: senderProfile.role || 'Role not specified',
              createdAt: requestData.createdAt?.toDate(),
            };
          } else {
            return null;
          }
        })
      );

      setRequests(newRequests.filter(Boolean) as ConnectionRequest[]);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching connection requests: ", error);
      toast({
        title: 'Error',
        description: 'Could not fetch notifications. Please try again later.',
        variant: 'destructive',
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, toast]);

  const handleRequest = async (requestId: string, action: 'accept' | 'decline') => {
    if (!user) return;

    const requestDocRef = doc(db, 'connection_requests', requestId);
    const newStatus = action === 'accept' ? 'accepted' : 'rejected'; // Changed 'decline' to 'rejected' for consistency

    try {
      // CORRECTED: Now we also send the updatedAt field with the server's timestamp
      await updateDoc(requestDocRef, { 
        status: newStatus,
        updatedAt: serverTimestamp() 
      });
      
      toast({
        title: action === 'accept' ? 'Connection Accepted' : 'Request Declined',
        description: action === 'accept' ? 'You are now connected!' : 'The request has been removed.',
      });
      // The onSnapshot listener will automatically handle the UI update.
    } catch (error) {
      console.error(`Error ${action}ing connection:`, error);
      toast({
        title: 'Something went wrong',
        description: `Could not ${action} the connection. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>

        <Card>
          <CardHeader>
            <CardTitle>Connection Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : requests.length > 0 ? (
              <div className="space-y-4">
                {requests.map((req) => (
                  <Card key={req.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={req.senderAvatar} alt={req.senderName} />
                          <AvatarFallback>{req.senderName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{req.senderName}</p>
                          <p className="text-sm text-muted-foreground">Wants to connect with you.</p>
                          <p className="text-xs text-muted-foreground mt-1">Role: {req.senderRole}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="icon" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                          onClick={() => handleRequest(req.id, 'accept')}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          onClick={() => handleRequest(req.id, 'decline')}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No new notifications</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  You're all caught up! New connection requests will appear here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
